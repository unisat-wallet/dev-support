import {Flex, Modal, Skeleton, Typography} from "antd";
import {useCallback, useEffect, useState} from "react";
import {InscribeOrderData} from "../utils/api-types";
import {handleError} from "../utils/utils";
import {api} from "../utils/api";
import {isOrderProcessing} from "../utils/orderUtils";
import {SimpleRow} from "./SimpleRow";
import {OrderPay} from "./OrderPay";
import {OrderStatus} from "./OrderStatus";
import {OrderFiles} from "./OrderFiles";

const {Text, Title} = Typography;

export function OrderDetail({orderId, close}: { orderId: string, close: () => void }) {

    const [order, setOrder] = useState<InscribeOrderData>()
    const [isRequesting, setIsRequesting] = useState<boolean>(false)

    const refresh = useCallback(async () => {
        if (!orderId) return undefined;

        let orderInfo;
        try {
            setIsRequesting(true);
            orderInfo = await api.orderInfo(orderId);
            setOrder(orderInfo);
        } catch (e) {
            handleError(e)
        } finally {
            setIsRequesting(false)
        }
        return orderInfo;

    }, [orderId]);

    useEffect(() => {
        let timer: any;

        refresh().then(data => {
            if (!data) {
                handleError('Order does not exist');
                return close();
            }
            if (isOrderProcessing(data)) {
                timer = setInterval(() => {
                    refresh().then(data => {
                        if (!data || !isOrderProcessing(data)) {
                            clearInterval(timer);
                            timer = null;
                        }
                    })
                }, 5000);
            }
        });

        return () => {
            if (timer)
                clearInterval(timer);
        }
    }, [refresh]);

    return <Modal
        width={640}
        open={!!orderId} onCancel={close} title={'Order'} footer={order && <OrderFiles order={order}/>}>
        <Flex vertical justify={'stretch'} gap={16}>
            <SimpleRow value={orderId} label={'OrderId'} valueSpan={18}/>
            {
                !order ? <Skeleton active/> : <>
                    <SimpleRow value={new Date(order.createTime).toLocaleString()} label={'Create At'} valueSpan={18}/>
                    <SimpleRow value={order.status} label={'Status'} valueSpan={18}/>
                    <OrderStatus order={order}/>
                </>
            }
        </Flex>
    </Modal>
}

