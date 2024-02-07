export type CreateOrderFile = {
    filename: string,
    dataURL: string,
}

export type CreateOrderReq = {
    receiveAddress: string,
    feeRate: number,
    outputValue: number,
    files: CreateOrderFile[]
    devAddress: string
    devFee: number
}

export type ListOrderReq = {
    cursor: number,
    size: number,
    sort?: 'asc' | 'desc',
    status?: InscribeOrderStatus,
    receiveAddress?: string,
    clientId?: string,
}

export type ListOrderRes = {
    list: InscribeOrderData[],
    total: number,
}

export enum InscribeOrderStatus {
    // when create order
    pending = 'pending',
    // pay not enough, need pay more
    payment_notenough = 'payment_notenough',
    // pay over, need choose continue or refund
    payment_overpay = 'payment_overpay',
    // there is an inscription in payment transaction, need refund
    payment_withinscription = 'payment_withinscription',
    // in some case, payment transaction need be confirmed
    payment_waitconfirmed = 'payment_waitconfirmed',
    // payment success
    payment_success = 'payment_success',
    // ready to inscribe
    ready = 'ready',
    inscribing = 'inscribing',
    minted = 'minted',
    closed = 'closed',
    refunded = 'refunded',
    cancel = 'cancel',
}

export enum FileStatus {
    pending = 'pending',
    unconfirmed = 'unconfirmed',
    confirmed = 'confirmed',
}

export type InscribeOrderData = {
    orderId: string,
    status: InscribeOrderStatus,
    payAddress: string,
    receiveAddress: string,
    amount: number, // need to pay amount
    paidAmount: number, // paid amount
    outputValue: number,
    feeRate: number,
    minerFee: number,
    serviceFee: number,
    files: {
        filename: string,
        status: FileStatus,
        inscriptionId: string,
    }[],
    count: number,
    pendingCount: number,
    unconfirmedCount: number,
    confirmedCount: number,
    createTime: number,
    devFee: number,
    refundAmount?: number,
    refundTxid?: string,
    refundFeeRate?: number;
}
