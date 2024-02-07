import {useUnisat} from "../provider/UniSatProvider";
import {useCallback, useEffect, useMemo, useState} from "react";
import {brc20Api, Brc20InscriptionsItem} from "../utils/brc20Api";
import {handleError, isTicketValid, sleep} from "../utils/utils";
import {useMarket} from "../provider/MarketProvider";
import {Button, Col, Flex, InputNumber, message, Modal, Row, Skeleton, Space} from "antd";
import {Brc20Item} from "../components/Brc20Item";
import {InscribeTransfer} from "../components/InscribeTransfer";
import {InscriptionType, ListItem, marketApi} from "../utils/marketApi";
import {unisatUtils} from "../utils/unisatUtils";

export function Assets() {

    const {address, signPsbt} = useUnisat();
    const {tick} = useMarket();

    const [list, setList] = useState<Brc20InscriptionsItem[] | undefined>();
    const [isLoading, setIsLoading] = useState(false);

    const [putOnItem, setPutOnItem] = useState<Brc20InscriptionsItem | undefined>();
    const [unitPrice, setUnitPrice] = useState<string>('');

    const [listedMap, setListedMap] = useState<{ [inscriptionId: string]: ListItem }>({});

    const refreshTransfer = useCallback(() => {
        if (address && tick && isTicketValid(tick)) {
            //got transfer-inscription from the user
            setList(undefined);
            brc20Api.getAddressTransferable({
                address,
                tick,
                start: 0,
                limit: 200,
            }).then(res => {
                setList(res.detail)
            }).catch(handleError)
        } else {
            setList([])
        }
    }, [address, tick]);

    useEffect(() => {
        refreshTransfer()
    }, [refreshTransfer]);

    const refreshListed = useCallback(() => {
        setListedMap({})
        if (tick && isTicketValid(tick) && list) {
            //  get listed to show unlist button
            marketApi.listBrc20({
                filter: {tick, nftType: InscriptionType.brc20, address, isEnd: false},
                sort: {unitPrice: 1},
                start: 0,
                limit: 99,
            }).then(res => {
                setListedMap(res.list.reduce((acc: any, cur) => {
                    acc[cur.inscriptionId] = cur;
                    return acc;
                }, {}))
            }).catch(handleError)
        }
    }, [address, list, tick]);

    useEffect(() => {
        refreshListed()
    }, [refreshListed]);


    const totalPrice = useMemo(() => {
        if (!unitPrice) return '';
        if (!putOnItem) return '0';
        return (Number(putOnItem.data.amt) * Number(unitPrice)).toFixed(0);
    }, [putOnItem, unitPrice]);


    async function putOn() {
        try {
            if (!putOnItem) return;
            setIsLoading(true)

            const pubkey = await unisatUtils.getPublicKey();

            const {auctionId, psbt} = await marketApi.createPutOn({
                inscriptionId: putOnItem.inscriptionId,
                nftType: InscriptionType.brc20,
                initPrice: totalPrice,
                marketType: 'fixedPrice',
                pubkey,
                unitPrice,
            })

            const signedPsbt = await signPsbt(psbt)

            await marketApi.confirmPutOn({
                auctionId,
                psbt: signedPsbt,
            })

            message.success('Put on success');

            setPutOnItem(undefined);
            setUnitPrice('');

            await sleep(1000);
            refreshListed();

        } catch (e) {
            handleError(e)
        } finally {
            setIsLoading(false)
        }
    }

    async function putOff(item: ListItem) {
        try {
            setIsLoading(true)

            const {psbt} = await marketApi.createPutOff({
                auctionId: item.auctionId,
            })

            const signedPsbt = await signPsbt(psbt)

            await marketApi.confirmPutOff({
                auctionId: item.auctionId,
                psbt: signedPsbt,
            })

            message.success('Put off success');

            await sleep(3000)

            refreshTransfer()
        } catch (e) {
            handleError(e)
        } finally {
            setIsLoading(false)
        }
    }

    if (!address) {
        return <div>Wait for Connect</div>
    }

    if (!list) {
        return <Skeleton active/>
    }

    return <Space direction={'vertical'}>
        <InscribeTransfer tick={tick} onInscribed={refreshTransfer}/>
        <div/>
        <div>
            Transferable inscriptions:
        </div>
        <Space wrap>
            {
                list.map((item, index) => {
                    const listed = listedMap[item.inscriptionId];

                    return <Flex vertical gap={8} key={item.inscriptionId}>
                        <Brc20Item key={index} tick={item.data.tick} amount={item.data.amt}/>
                        {
                            listed
                                ? <Button loading={isLoading} type={'dashed'}
                                          onClick={() => putOff(listed)}>Unlist</Button>
                                : <Button loading={isLoading} onClick={() => setPutOnItem(item)}>List</Button>
                        }
                    </Flex>
                })
            }
        </Space>
        <Modal
            title={'confirm put on'}
            onOk={putOn}
            okButtonProps={{disabled: !unitPrice || !totalPrice}}
            confirmLoading={isLoading}
            open={!!putOnItem}
            onCancel={() => {
                if (!isLoading)
                    setPutOnItem(undefined)
            }}
        >
            {
                putOnItem && <>
                    <Row align={'middle'} gutter={[24, 16]}>
                        <Col span={24}>
                            <Flex justify={'center'}>
                                <Brc20Item tick={putOnItem.data.tick} amount={putOnItem.data.amt}/>
                            </Flex>
                        </Col>
                        <Col span={6} style={{textAlign: 'right'}}>
                            Unit Price:
                        </Col>
                        <Col span={15}>
                            <InputNumber
                                disabled={isLoading}
                                style={{width: '100%'}}
                                value={unitPrice}
                                stringMode={true}
                                onChange={v => {
                                    setUnitPrice(v || '')
                                }}
                                addonAfter={`sats(BTC)/${putOnItem?.data.tick}`}
                            />
                        </Col>
                        <Col/>
                        <Col span={6} style={{textAlign: 'right'}}>
                            Total Price
                        </Col>
                        <Col span={15}>
                            <InputNumber
                                style={{width: '100%'}}
                                value={totalPrice}
                                stringMode={true}
                                disabled={true}
                                addonAfter={'sats(BTC)'}
                            />
                        </Col>
                    </Row>
                </>
            }
        </Modal>
    </Space>
}