import {BRC20ListItem, CreateBidPrepareRes, marketApi} from "../utils/marketApi";
import {Col, Flex, message, Modal, Row, Skeleton, Statistic} from "antd";
import {Brc20Item} from "./Brc20Item";
import {useEffect, useState} from "react";
import {useUnisat} from "../provider/UniSatProvider";
import {handleError} from "../utils/utils";


export function BuyConfirmAlert({item, close, onComplete}: {
    item: BRC20ListItem,
    close: () => void,
    onComplete?: () => void
}) {
    const {address, pubkey, signPsbt} = useUnisat();
    const [messageApi] = message.useMessage();

    const [isLoading, setIsLoading] = useState(false);
    const [bidPrepare, setBidPrepare] = useState<CreateBidPrepareRes | undefined>();

    useEffect(() => {
        if (!address || !pubkey || !item)
            return;
        // create bid prepare
        marketApi.createBidPrepare({
            auctionId: item.auctionId,
            bidPrice: item.price,
            address,
            pubkey
        }).then(setBidPrepare).catch(handleError)

    }, [address, item, pubkey]);

    async function buy() {
        try {
            setIsLoading(true)

            // create bid to get bidId/psbtBid
            const {bidId, psbtBid} = await marketApi.createBid({
                auctionId: item.auctionId,
                bidPrice: item.price,
                address,
                pubkey,
            })

            // sign psbt
            const signedPsbt = await signPsbt(psbtBid)

            // confirm
            await marketApi.confirmBid({
                auctionId: item.auctionId,
                bidId,
                psbtBid: signedPsbt,
                psbtBid2: '',
                psbtSettle: '',
            })

            messageApi.success('Buy Success');

            onComplete && onComplete()
        } catch (e) {
            handleError(e)
        } finally {
            setIsLoading(false)
        }
    }

    return <Modal
        open={!!item}
        onCancel={close}
        title={"Confirm"}
        confirmLoading={isLoading}
        onOk={buy}
    >
        {
            item && <>
                <Row align={'middle'} gutter={[16, 24]}>
                    <Col span={24}>
                        <Flex justify={'center'}>
                            <Brc20Item tick={item.tick} amount={item.amount}/>
                        </Flex>
                    </Col>

                    <KeyValue label={'Unit Price:'} value={item.unitPrice} suffix={`sats/${item.tick}`}/>
                    <KeyValue label={'Total Price:'} value={item.price} suffix={`sats`}/>
                    {
                        !bidPrepare ? <Skeleton active/> : <>
                            <KeyValue label={'Network fee'} value={bidPrepare.feeRate * bidPrepare.txSize} suffix={'sats'}/>
                            <KeyValue label={'Total'} value={bidPrepare.feeRate * bidPrepare.txSize + item.price}
                                      suffix={'sats'} valueColor={"var(--main-color)"}
                                      fontSize={22}/>

                        </>
                    }
                </Row>

            </>

        }

    </Modal>
}

function KeyValue({label, value, suffix, fontSize = 14, valueColor}: {
    label: string,
    value: string | number,
    suffix?: string,
    fontSize?: number,
    valueColor?: string
}) {
    return <>
        <Col span={6} style={{textAlign: 'right'}}>
            {label}
        </Col>
        <Col span={18}>
            <Statistic
                valueStyle={{fontSize, color: valueColor}}
                value={value}
                suffix={suffix}/>
        </Col>
    </>
}