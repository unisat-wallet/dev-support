import {InscribeOrderData} from "../utils/api-types";
import {SimpleRow} from "./SimpleRow";
import {Button, Typography} from "antd";
import {useUnisat} from "../provider/UniSatProvider";
import {unisatUtils} from "../utils/unisatUtils";
import {useState} from "react";
import {handleError} from "../utils/utils";

const {Text} = Typography;

export function OrderPay({order}: { order: InscribeOrderData, }) {
    const [paying, setPaying] = useState(false)

    async function pay() {
        // send the amount BTC to payAddress, then order will continue to process
        try {
            setPaying(true)
            await unisatUtils.sendBitcoin(order.payAddress, order.amount,  order.feeRate)
        }catch (e){
            handleError(e)
            setPaying(false)
        }

    }

    return <>
        <SimpleRow
            label={'Pay to Address'}
            value={<Text mark>{order.payAddress}</Text>} valueSpan={18}/>
        <SimpleRow
            label={'Amount'}
            value={<Text mark>{order.amount}</Text>}/>
        <SimpleRow
            value={<Button loading={paying} type={'primary'} onClick={pay}>Pay</Button>}/>
    </>
}