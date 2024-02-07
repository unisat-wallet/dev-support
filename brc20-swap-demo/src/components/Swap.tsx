import {Button, Col, InputNumber, Row, Spin, Statistic} from "antd";
import React, {useCallback, useEffect, useState} from "react";
import {AllAddressBalanceRes, ExactType, swapApi} from "../utils/swapApi";
import {ConfirmSwap} from "./ConfirmSwap";
import {useUnisat} from "../provider/UniSatProvider";
import {handleError} from "../utils/utils";
import {ReloadOutlined} from "@ant-design/icons";


const tickIn = 'sats';
const tickOut = 'ordi';
const slippage = '0.005'; // 0.5%


export function Swap() {

    const {address, connect} = useUnisat();
    const [swapBalanceMap, setSwapBalanceMap] = useState<AllAddressBalanceRes>({});

    const [amountIn, setAmountIn] = React.useState('');
    const [amountOut, setAmountOut] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const [showConfirm, setShowConfirm] = React.useState(false);

    useEffect(() => {

        if (!address) return;
        if (!amountIn) {
            setAmountOut('');
            return;
        }
        setIsLoading(true)
        // 500ms delay
        const timer = setTimeout(() => {
            // quote swap out
            swapApi.quoteSwap({
                address,
                tickIn,
                tickOut,
                amount: amountIn,
                exactType: ExactType.exactIn,
            }).then(({expect}) => {
                setAmountOut(expect);
            }).catch(e => {
                handleError(e)
            }).finally(() => {
                setIsLoading(false)
            })
        }, 500);

        return () => clearTimeout(timer);
    }, [address, amountIn]);

    const refreshBalance = useCallback(() => {
        if (address) {
            swapApi.getAllBalance({address}).then(setSwapBalanceMap).catch(handleError)
        } else {
            setSwapBalanceMap({})
        }
    }, [address]);

    useEffect(() => {
        refreshBalance()
    }, [refreshBalance]);


    return <>
        <Row align={'middle'} gutter={[16, 16]}>
            <Col span={6} style={{textAlign: 'right'}}>
                Address:
            </Col>
            <Col span={18}>
                {
                    address ? address : <Button onClick={() => {
                        connect();
                    }}>Connect Unisat Wallet</Button>
                }
            </Col>

            <Col span={6} style={{textAlign: 'right'}}>
                Balance:
            </Col>
            <Col span={6}>
                <Statistic
                    title={tickIn}
                    value={swapBalanceMap[tickIn]?.balance.swap || '0'}
                    precision={6}
                />
                {
                    // wait for confirm balance
                    (parseFloat(swapBalanceMap[tickIn]?.balance.pendingSwap) || 0) > 0 && <span style={{color: '#888'}}>
                        (+{swapBalanceMap[tickIn]?.balance.pendingSwap})
                    </span>
                }
            </Col>
            <Col span={6}>
                <Statistic
                    title={tickOut}
                    value={swapBalanceMap[tickOut]?.balance.swap || '0'}
                    precision={6}
                />
                {
                    // wait for confirm balance
                    (parseFloat(swapBalanceMap[tickOut]?.balance.pendingSwap) || 0) > 0 &&
                    <span style={{color: '#888'}}>
                        (+{swapBalanceMap[tickOut]?.balance.pendingSwap})
                    </span>
                }
            </Col>
            <Col span={6}>
                <Button icon={<ReloadOutlined/>} shape={'circle'} onClick={refreshBalance}/>
            </Col>
            <Col span={6} style={{textAlign: 'right'}}>
                You Pay:
            </Col>
            <Col span={12}>
                <InputNumber
                    style={{width: '100%'}}
                    addonAfter={'sats'}
                    value={amountIn}
                    stringMode={true}
                    onChange={(e) => {
                        setAmountIn(e || "");
                    }}
                />
            </Col>
            <Col span={6}/>
            <Col span={6} style={{textAlign: 'right'}}>
                You Receive:
            </Col>
            <Col span={12}>
                <InputNumber
                    style={{width: '100%', color: '#222'}}
                    value={amountOut}
                    stringMode={true}
                    disabled={true}
                    addonAfter={'ordi'}
                />
            </Col>
            <Col>
                {isLoading && <Spin/>}
            </Col>

            <Col span={6} offset={6}>
                <Button
                    loading={isLoading}
                    onClick={() => {
                        if (amountIn && amountOut)
                            setShowConfirm(true);
                    }}>Swap</Button>
            </Col>
        </Row>
        {
            showConfirm && <ConfirmSwap
                showConfirm={showConfirm}
                setShowConfirm={setShowConfirm}
                tickIn={tickIn}
                tickOut={tickOut}
                amountIn={amountIn}
                amountOut={amountOut}
                slippage={slippage}
                address={address}
                onSuccess={refreshBalance}
            />
        }
    </>
}