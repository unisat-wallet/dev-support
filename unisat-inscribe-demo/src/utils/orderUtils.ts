import {InscribeOrderData} from "./api-types";

export function isOrderProcessing(data?: InscribeOrderData | null) {
    if (!data)
        return false;
    const {status} = data;
    return status !== 'minted' && status !== 'closed' && status !== 'refunded' && status !== 'cancel';
}