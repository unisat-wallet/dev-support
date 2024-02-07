import {InscribeOrderData} from "../utils/api-types";
import {OrderPay} from "./OrderPay";
import {Spin, Typography} from "antd";
import {OrderInscribing} from "./OrderInscribing";

const {Text, Title} = Typography;

export function OrderStatus({order}: { order: InscribeOrderData, }) {

    if (order.status === 'closed')
        return <Text mark style={{textAlign: 'center'}}>
            The order has been closed as payment was not made within 1 hour.
        </Text>


    if (order.status === 'pending') {
        return <OrderPay order={order}/>
    }

    if(order.status === 'minted' || order.status === 'inscribing'){
        return <OrderInscribing order={order}/>
    }

    // unknown status, loading
    return <Spin/>


}