import {get} from "./httpUtils";
import {stringToHex} from "./utils";

export const brc20Api = {
    summary({
                address, limit = 20, start = 0,
            }: { address: string, limit?: number, start?: number }): Promise<{
        total: number,
        start: number,
        height: number,
        detail: AddressBrc20Balance[]
    }> {
        return get(`/v1/indexer/address/${address}/brc20/summary`, {limit, start})
    },

    getAddressTransferable({
                               address, tick, start = 0, limit = 512,
                           }: {
        address: string,
        tick: string,
        start?: number,
        limit?: number
    }): Promise<Brc20AddressTransferable> {
        return get(`/v1/indexer/address/${address}/brc20/${stringToHex(tick)}/transferable-inscriptions`, {
            limit,
            start,
        })
    },
}


export type AddressBrc20Balance = {
    ticker: string
    overallBalance: string   // transferableBalance + availableBalance
    transferableBalance: string
    availableBalance: string
}


export type Brc20Data = {
    amt: string,
    decimal: string,
    lim: string,
    max: string,
    minted: string,
    op: string,
    tick: string,
    to: string
}
export type Brc20InscriptionsItem = {
    data: Brc20Data,
    inscriptionId: string,
    inscriptionNumber: number,
    confirmations: number,
    isPutOn?: boolean,
};

export type Brc20AddressTransferable = {
    start: number,
    total: number,
    detail: Brc20InscriptionsItem[]
};