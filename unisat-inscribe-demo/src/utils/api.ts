import {CreateOrderReq, InscribeOrderData, ListOrderReq, ListOrderRes} from "./api-types";
import {get, post} from "./httpUtils";

export const api = {
    createOrder(req: CreateOrderReq): Promise<InscribeOrderData> {
        return post('/v2/inscribe/order/create', req)
    },
    listOrder(req:ListOrderReq):Promise<ListOrderRes>{
        return get('/v2/inscribe/order/list', req)
    },
    orderInfo(orderId: string): Promise<InscribeOrderData> {
        return get(`/v2/inscribe/order/${orderId}`)
    },
}