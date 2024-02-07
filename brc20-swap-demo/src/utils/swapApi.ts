import {get, post} from "./httpUtils";


export const swapApi = {
    getAllBalance: (params: AllAddressBalanceReq): Promise<AllAddressBalanceRes> => get('/v1/brc20-swap/all_balance', params),

    quoteSwap: async (req: QuoteSwapReq): Promise<QuoteSwapRes> => {
        return get('/v1/brc20-swap/quote_swap', req);
    },
    preSwap: async (req: SwapReq): Promise<PreRes> => {
        return get('/v1/brc20-swap/pre_swap', req);
    },
    swap: async (req: SwapReq): Promise<SwapRes> => {
        return post('/v1/brc20-swap/swap', req);
    },

    createDeposit: async (req: CreateDepositReq): Promise<CreateDepositRes> => {
        return get('/v1/brc20-swap/create_deposit', req);
    },

    confirmDeposit: async (req: ConfirmDepositReq): Promise<ConfirmDepositRes> => {
        return post('/v1/brc20-swap/confirm_deposit', req);
    },
    preDeployPool(params: DeployPoolReq): Promise<PreRes> {
        return get('/v1/brc20-swap/pre_deploy_pool', params)
    },
    deployPool(params: DeployPoolReq): Promise<DeployPoolRes> {
        return post('/v1/brc20-swap/deploy_pool', params)
    },
    // 获取添加流动性的待签名信息
    preAddLiquidity: (params: AddLiqReq): Promise<PreRes> => get('/v1/brc20-swap/pre_add_liq', params),
    // 添加流动性
    addLiquidity: (params: AddLiqReq): Promise<AddLiqRes> => post('/v1/brc20-swap/add_liq', params),
}

export enum ExactType {
    exactIn = "exactIn",
    exactOut = "exactOut",
}

export type QuoteSwapReq = {
    address: string;
    tickIn: string;
    tickOut: string;
    amount: string;
    exactType: ExactType;
};

export type QuoteSwapRes = {
    expect: string;
    amountUSD: string;
    expectUSD: string;
};


export type SwapReq = {
    address: string;
    tickIn: string;
    tickOut: string;
    amountIn: string;
    amountOut: string;
    slippage: string;
    exactType: ExactType;
    ts: number;
    sig?: string;
};
export type SwapRes = {
    id: string;
    address: string;
    tickIn: string;
    tickOut: string;
    amountIn: string;
    amountOut: string;
    exactType: ExactType;
    ts: number;
}
export type PreRes = {
    // signedMsg: string;
    signMsg: string;
} & FeeRes;

export type FeeRes = {
    bytesL1: number;
    bytesL2: number;
    feeRate: string; // l1
    gasPrice: string; // l2
    serviceFeeL1: string;
    serviceFeeL2: string;
    unitUsdPriceL1: string;
    unitUsdPriceL2: string;

    serviceTickBalance: string;
};


interface CreateDepositReq {
    inscriptionId: string,
    address: string,
    pubkey: string
}

interface CreateDepositRes {
    psbt: string;
    type: "direct" | "matching";
    expiredTimestamp: number;
    recommendDeposit: string;
}


interface ConfirmDepositReq {
    psbt: string,
    inscriptionId: string
}

interface ConfirmDepositRes {
    txid: string;
    pendingNum: number;
}


export type DeployPoolReq = {
    address: string;
    tick0: string;
    tick1: string;
    ts: number;
    sig?: string;
};
export type DeployPoolRes = {
    //
};


export type AllAddressBalanceReq = {
    address: string;
};
export type AllAddressBalanceRes = {
    [key: string]: {
        balance: AddressBalance
        decimal: string
        withdrawLimit: string
    };
};

export type AddressBalance = {
    module: string;             // 提现队列中的
    swap: string;
    pendingSwap: string;        // 充值未确认的
    pendingAvailable: string;   // 提现未确认的
};


export type AddLiqReq = {
    address: string;
    tick0: string;
    tick1: string;
    amount0: string;
    amount1: string;
    slippage: string;
    ts: number;
    lp: string;
    sig?: string;
};

export type AddLiqRes = {
    id: string;
    address: string;
};