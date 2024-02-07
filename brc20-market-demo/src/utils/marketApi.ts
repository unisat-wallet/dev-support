import {post} from "./httpUtils";

export const marketApi = {
    listBrc20(req: ListReq): Promise<BRC20ListRes> {
        return post('/v3/market/brc20/auction/list', req,)
    },

    createPutOn(req: CreatePutOnReq): Promise<CreatePutOnRes> {
        return post('/v3/market/brc20/auction/create_put_on', req);
    },
    confirmPutOn(req: ConfirmPutOnReq): Promise<ConfirmPutOnRes> {
        return post('/v3/market/brc20/auction/confirm_put_on', req);
    },

    createBidPrepare(req: CreateBidPrepareReq): Promise<CreateBidPrepareRes> {
        return post('/v3/market/brc20/auction/create_bid_prepare', req);
    },
    createBid(req: CreateBidReq): Promise<CreateBidRes> {
        return post('/v3/market/brc20/auction/create_bid', req);
    },
    confirmBid(req: ConfirmBidReq): Promise<ConfirmBidRes> {
        return post('/v3/market/brc20/auction/confirm_bid', req);
    },
    createPutOff(req: CreatePutOffReq): Promise<CreatePutOffRes> {
        return post('/v3/market/brc20/auction/create_put_off', req);
    },
    confirmPutOff(req: ConfirmPutOffReq): Promise<ConfirmPutOffRes> {
        return post('/v3/market/brc20/auction/confirm_put_off', req);
    },
}


export enum InscriptionType {
    brc20 = "brc20",
    domain = "domain",
    collection = "collection",
    arc20 = "arc20",
}


export type ListReqFilter = {
    address?: string;
    nftConfirm?: boolean;
    minPrice?: number;
    maxPrice?: number;
    isEnd?: boolean;

    nftType?: InscriptionType;

    // brc20
    tick?: string;
}

export type ListReq = {
    filter: ListReqFilter;
    sort: {
        unitPrice?: -1 | 1;
        onSaleTime?: -1 | 1;
    };
    start: number;
    limit: number;
};


export type ListItem = {
    auctionId: string;
    inscriptionId: string;
    inscriptionName: string;
    inscriptionNumber: number;
    marketType: 'fixedPrice';
    nftType: InscriptionType;
    initPrice: number;
    curPrice: number;
    minBidPrice: number;
    endTime: number;
    address: string;
    onSaleTime: number;
    price: number;

};

export type BRC20ListItem = ListItem & {
    tick: string;
    limit: number;
    amount: number;
    unitPrice: number;
};

export type BRC20ListRes = {
    list: BRC20ListItem[];
    total: number;
};


export type CreatePutOnReq = {
    inscriptionId: string;
    initPrice: string;
    pubkey: string;
    marketType: 'fixedPrice';
    auctionTime?: number;
    maxPrice?: number;
    unitPrice?: string;
    btcAddress?: string;
    nftType: InscriptionType;
};

export type CreatePutOnRes = {
    auctionId: string;
    psbt: string;
    signIndexes: number[];
};

export type ConfirmPutOnReq = {
    auctionId: string;
    psbt: string;
    fromBase64?: boolean;
};

export type ConfirmPutOnRes = {};


export type CreateBidPrepareReq = {
    auctionId: string;
    bidPrice: number;
    address: string;
    pubkey: string;
};

export type CreateBidPrepareRes = {
    serverFee: number;
    serverReal: number;
    serverFeeRate: number;
    txSize: number;
    nftValue: number;
    feeRate: number;
    discounts: {
        name: string;
        percent: number;
    }[];
    inscriptionCount: number;
    availableBalance: number;
};


export type CreateBidReq = {
    auctionId: string;
    bidPrice: number;
    address: string;
    pubkey: string;
    feeRate?: number;
    nftAddress?: string;
    sign?: string;
};


export type CreateBidRes = {
    bidId: string;
    psbtBid: string;
    psbtBid2: string;
    psbtSettle: string;

    networkFee: number;
    feeRate: number;
    serverFee: number;
    nftValue: number;

    bidSignIndexes: number[];

};

export type ConfirmBidReq = {
    auctionId: string;
    bidId: string;
    psbtBid: string;
    psbtBid2: string;
    psbtSettle: string;
    fromBase64?: boolean;

};

export type ConfirmBidRes = {
    txid: string;
};


export type CreatePutOffReq = {
    auctionId: string;
    btcPubkey?: string;
    nftAddress?: string;
};

export type CreatePutOffRes = {
    psbt: string;
    btcSignIndexes: number[];
    nftSignIndexes: number[];
};

export type ConfirmPutOffReq = {
    auctionId: string;
    psbt: string;
    fromBase64?: boolean;
};

export type ConfirmPutOffRes = {
    txid: string;
};

