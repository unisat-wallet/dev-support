import {Button, Card, Flex, Input, InputNumber, message, Radio} from "antd";
import {useEffect, useState} from "react";
import {InscribeTextInput} from "../components/InscribeTextInput";
import {SimpleRow} from "../components/SimpleRow";
import {InscribeFileInput} from "../components/InscribeFileInput";
import {FeeDetail} from "../components/FeeDetail";
import {getStringByteCount, handleError, stringToBase64} from "../utils/utils";
import {useUnisat} from "../provider/UniSatProvider";
import {api} from "../utils/api";
import {OrderDetail} from "../components/OrderDetail";
import {EventEmitter} from "ahooks/lib/useEventEmitter";
import {NetworkType} from "../types";

enum InscribeType {
    text,
    file,
}

export type InscribeFileData = {
    filename: string
    dataURL: string
    size: number
    type?: string

}

export function Inscribe({newOrder$}: {
    newOrder$: EventEmitter<void>
}) {
    const {address, isConnected, network} = useUnisat();
    const [inscribeType, setInscribeType] = useState(InscribeType.text)
    const [fileList, setFileList] = useState<InscribeFileData[]>([])
    const [receiveAddress, setReceiveAddress] = useState('')
    const [outputValue, setOutputValue] = useState(546)
    const [feeRate, setFeeRate] = useState<number>()
    const [devFee, setDevFee] = useState(0)
    const [devAddress, setDevAddress] = useState('')

    const [loading, setLoading] = useState(false)

    const [orderId, setOrderId] = useState('')

    useEffect(() => {
        setReceiveAddress('')
    }, [network]);

    function submitText(text: string) {
        setFileList([
            {
                filename: text.slice(0, 512),
                dataURL: `data:text/plain;charset=utf-8;base64,${stringToBase64(text)}`,
                size: getStringByteCount(text)
            }
        ])
    }


    async function createOrder() {
        try {
            if (!receiveAddress) {
                return message.error('Please enter receive address')
            }
            if (!outputValue) {
                return message.error('Please enter output value')
            }
            if (!feeRate) {
                return message.error('Please enter fee rate')
            }
            if (fileList.length === 0) {
                return message.error('Please enter content')
            }

            setLoading(true)

            const {orderId} = await api.createOrder({
                receiveAddress,
                feeRate,
                outputValue,
                files: fileList.map(item => ({dataURL: item.dataURL, filename: item.filename})),
                devAddress,
                devFee,
            })

            newOrder$.emit()

            setOrderId(orderId)
        } catch (e) {
            handleError(e)
        } finally {
            setLoading(false)
        }

    }

    return <Card size={"small"}>
        <Flex vertical justify={'stretch'} gap={16}>
            <SimpleRow
                label={'Inscribe Type'}
                value={
                    <Radio.Group
                        disabled={loading}
                        onChange={v => {
                            setFileList([])
                            setInscribeType(v.target.value)
                        }} value={inscribeType}>
                        <Radio.Button value={InscribeType.text}>Text</Radio.Button>
                        <Radio.Button value={InscribeType.file}>File</Radio.Button>
                    </Radio.Group>}
            />
            {
                inscribeType === InscribeType.text && <InscribeTextInput submit={submitText}/>
            }
            {
                inscribeType === InscribeType.file &&
                <InscribeFileInput fileList={fileList} setFileList={setFileList} isSubmitting={loading}/>
            }

            <SimpleRow
                label={'Receive Address'}
                value={<Input
                    disabled={loading}
                    value={receiveAddress}
                    placeholder={'Enter address to receive Inscription'}
                    onChange={e => setReceiveAddress(e.target.value)}/>
                }
                extra={
                    isConnected
                        ? <Button type={'link'} onClick={() => {
                            setReceiveAddress(address)
                        }}>Use Connected Address</Button>
                        : null
                }
            />
            <SimpleRow
                label={'Output Value'}
                value={<InputNumber
                    value={outputValue}
                    disabled={loading}
                    min={546}
                    onChange={v => setOutputValue(v || 0)}/>}
            />
            <SimpleRow
                label={'Fee rate'}
                value={<InputNumber
                    value={feeRate}
                    onChange={(value) => {
                        setFeeRate(value as number)
                    }}
                    min={1}
                    max={1000}
                />}
                valueSpan={6}
                extra={<Button
                    type={'link'}
                    href={network===NetworkType.testnet?'https://mempool.space/testnet':'https://mempool.space'}
                    target={"_blank"}>Get recommend fee rate here</Button>}
            />
            <SimpleRow
                label={'Dev Address'}
                value={<Input
                    disabled={loading}
                    value={devAddress}
                    placeholder={''}
                    onChange={e => setDevAddress(e.target.value)}/>
                }
            />
            <SimpleRow
                label={'Dev Fee'}
                value={<InputNumber
                    value={devFee}
                    disabled={loading}
                    placeholder={''}
                    onChange={v => setDevFee(v || 0)}/>}
            />
            <FeeDetail
                feeRate={feeRate}
                outputValue={outputValue}
                devFee={devFee}
                fileList={fileList}
                address={receiveAddress}
            />
            <SimpleRow value={
                <Button type={'primary'} loading={loading} onClick={createOrder}>Inscribe</Button>
            }/>

        </Flex>
        {orderId && <OrderDetail orderId={orderId} close={() => {
            setOrderId('')
        }}/>}
    </Card>
}