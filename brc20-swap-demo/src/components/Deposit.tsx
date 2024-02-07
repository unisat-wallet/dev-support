import React, {useCallback, useEffect, useState} from "react";
import {useUnisat} from "../provider/UniSatProvider";
import {Button, Empty, message, Segmented, Skeleton, Statistic} from "antd";
import {AddressBrc20Balance, brc20Api, Brc20InscriptionsItem} from "../utils/brc20Api";
import {handleError, sleep} from "../utils/utils";
import {PlusOutlined, ReloadOutlined} from "@ant-design/icons";
import {unisatUtils} from "../utils/unisatUtils";
import {swapApi} from "../utils/swapApi";

export function Deposit() {

    const {address, connect, signPsbt} = useUnisat();
    const [addressSummary, setAddressSummary] = useState<AddressBrc20Balance[] | null>(null);
    const [currentTicker, setCurrentTicker] = useState<string>('');
    const [transferInscriptions, setTransferInscriptions] = useState<Brc20InscriptionsItem[] | null>(null);
    const [selectedInscription, setSelectedInscription] = useState<Brc20InscriptionsItem | null>(null);
    const [isDepositing, setIsDepositing] = useState(false);

    useEffect(() => {
        if (address) {
            // get address brc20 summary
            brc20Api.summary({address}).then(res => {
                setAddressSummary(res.detail)
                if (res.detail.length > 0) {
                    setCurrentTicker(res.detail[0].ticker)
                }
            }).catch(handleError)
        } else {
            setAddressSummary(null)
        }
    }, [address]);

    const refreshTransferable = useCallback(() => {
        if (currentTicker) {
            // get transfer-inscription
            setTransferInscriptions(null)
            brc20Api.getAddressTransferable({address, tick: currentTicker}).then(res => {
                setTransferInscriptions(res.detail);
            }).catch(handleError)
        } else {
            setTransferInscriptions(null)
            setSelectedInscription(null)
        }
    }, [address, currentTicker]);

    useEffect(() => {
        refreshTransferable()
    }, [refreshTransferable]);

    async function inscribeTransfer() {
        try {
            await unisatUtils.inscribeTransfer(currentTicker)
            setTransferInscriptions(null)
            await sleep(5000)
            refreshTransferable()
        } catch (e) {
            handleError(e)
        }
    }

    async function deposit() {
        if (!selectedInscription) return;
        try {
            setIsDepositing(true)
            const {inscriptionId} = selectedInscription;

            const pubkey = await unisatUtils.getPublicKey();
            const {psbt} = await swapApi.createDeposit({
                inscriptionId,
                address,
                pubkey,
            })

            const signed = await signPsbt(psbt);

            await swapApi.confirmDeposit({
                inscriptionId,
                psbt: signed
            })

            await sleep(3000)
            message.success('Deposit Success');
            await sleep(2000)

            refreshTransferable();
        } catch (e) {
            handleError(e)
        } finally {
            setIsDepositing(false);
        }
    }

    if (!address) {
        return <Button onClick={connect}>Connect</Button>
    }

    if (!addressSummary) {
        return <Skeleton active/>
    }

    return <>
        {
            <div style={{marginBottom: 16}}>
                <a href={'https://testnet.unisat.io/brc20/sats'} target={"_blank"} rel="noreferrer">Mint sats</a>
            </div>
        }
        {
            addressSummary.length <= 0 ? <Empty/> : <Segmented
                style={{maxWidth: 592, overflow: 'auto'}}
                value={currentTicker}
                onChange={v => {
                    setCurrentTicker(v.toString())
                }}
                options={addressSummary.map(item => {
                    return {
                        label: <div className={'p-8'} key={item.ticker}>
                            <div className={'bold font-16'}>{item.ticker}</div>
                            <Statistic title={'balance'} valueStyle={{fontSize: 14}} value={item.overallBalance}/>
                        </div>,
                        value: item.ticker
                    }
                })}/>
        }
        {
            currentTicker && <>
                <div className={'mt-16'}>
                    Choose a transfer-inscription to Deposit
                    <Button icon={<ReloadOutlined/>} shape={'circle'} onClick={refreshTransferable} className={'ml-8'}/>
                </div>
                {
                    <div className="flex-row-v-center gap-16 mt-8">
                        {
                            !transferInscriptions ? <Skeleton active/> : <>
                                <div className={'nft-item inscribe-transfer'} onClick={inscribeTransfer}>
                                    <PlusOutlined className={'plus-icon'}/>
                                    <span>Inscribe</span>
                                    <span>TRANSFER</span>
                                </div>
                                {

                                    transferInscriptions.map(item => {
                                        return <div
                                            key={item.inscriptionId}
                                            className={`nft-item ${selectedInscription?.inscriptionId === item.inscriptionId ? 'selected' : ''}`}
                                            onClick={() => {
                                                if (!isDepositing)
                                                    setSelectedInscription(item);
                                            }}>
                                            <div className={'tick'}>{item.data.tick}</div>
                                            <Statistic value={item.data.amt}
                                                       valueStyle={{fontSize: 16, textAlign: 'center'}}/>
                                            <div className={'inscription-num'}>#{item.inscriptionNumber}</div>
                                        </div>
                                    })
                                }
                            </>
                        }
                    </div>
                }
                <Button type={'primary'} className={'mt-16'} disabled={!selectedInscription} onClick={deposit}
                        loading={isDepositing}>
                    Deposit
                </Button>
            </>
        }


    </>
}