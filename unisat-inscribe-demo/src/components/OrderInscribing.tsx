import {InscribeOrderData} from "../utils/api-types";
import {SimpleRow} from "./SimpleRow";
import {Typography} from "antd";

const {Text, Title} = Typography;

export function OrderInscribing({order}: { order: InscribeOrderData, }) {
    return <>
        <SimpleRow
            label={'Paid Amount'}
            value={order.paidAmount}/>
        <SimpleRow
            label={'Inscribe Process'}
            value={
                <>
                    <Text>
                        {order.unconfirmedCount + order.confirmedCount}/{order.count}
                    </Text>
                    <Text type={'secondary'}> ({order.unconfirmedCount} Unconfirmed, {order.confirmedCount} Confirmed)</Text>
                </>
            }/>

    </>
}