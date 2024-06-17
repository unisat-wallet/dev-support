import axios, { AxiosInstance, AxiosResponse } from "axios";

interface CreatePutOnPrepareResponse {
  auctionId: string;
  psbt: string;
  signIndexes: number[];
}

export interface CreateBidPrepareResponse {
  serverFee: number;
  serverReal: number;
  serverFeeRate: number;
  txSize: number;
  feeRate: number;
  nftValue: number;
  discounts: any[];
  inscriptionCount: number;
  availableBalance: number;
  allBalance: number;
}

export interface UTXO {
  address: string;
  codeType: number;
  height: number;
  idx: number;
  inscriptions: {
    inscriptionId: string;
    inscriptionNumber: number;
    isBRC20: boolean;
    moved: boolean;
    offset: number;
  }[];
  isOpInRBF: boolean;
  satoshi: number;
  scriptPk: string;
  scriptType: string;
  txid: string;
  vout: number;
  rawtx?: string;
}

interface InscriptionInfo {
  address: string;
  inscriptionNumber: number;
  contentType: string;
  utxo: UTXO;
}

class RequestError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public response?: AxiosResponse
  ) {
    super((response && response.config ? response.config.url : "") + message);
  }

  isApiException = true;
}

export class OpenApi {
  private axios: AxiosInstance;

  constructor(params: { baseUrl: string; apiKey: string }) {
    this.axios = axios.create({
      baseURL: params.baseUrl,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.apiKey}`,
      },
    });

    this.axios.interceptors.response.use(
      (async (
        response: AxiosResponse<{
          code: number;
          msg: string;
          data: any;
        }>
      ) => {
        const res = response.data;
        if (res.code != 0) {
          throw new RequestError(res.msg);
        }
        return res.data;
      }) as any,
      (error) => {
        if (error.response) {
          return Promise.reject(
            new RequestError(
              error.response.data,
              error.response.status,
              error.response
            )
          );
        }

        if (error.isAxiosError) {
          return Promise.reject(new RequestError("noInternetConnection"));
        }
        return Promise.reject(error);
      }
    );
  }

  async createPutOnPrepare({
    type,
    inscriptionId,
    initPrice,
    unitPrice,
    pubkey,
    marketType,
  }: {
    type: "brc20" | "collection" | "domain";
    inscriptionId: string;
    initPrice: string;
    unitPrice: string;
    pubkey: string;
    marketType: "fixedPrice";
  }) {
    const response = await this.axios.post<null, CreatePutOnPrepareResponse>(
      `/v3/market/${type}/auction/create_put_on`,
      {
        inscriptionId,
        initPrice,
        unitPrice,
        pubkey,
        marketType,
      }
    );
    return response;
  }

  async confirmPutOn({
    type,
    auctionId,
    psbt,
    fromBase64,
  }: {
    type: "brc20" | "collection" | "domain";
    auctionId: string;
    psbt: string;
    fromBase64: boolean;
  }) {
    const response = await this.axios.post<null, {}>(
      `/v3/market/${type}/auction/confirm_put_on`,
      {
        auctionId,
        psbt,
        fromBase64,
      }
    );
    return response;
  }

  async createBidPrepare({
    type,
    auctionId,
    bidPrice,
    address,
    pubkey,
  }: {
    type: "brc20" | "collection" | "domain";
    auctionId: string;
    bidPrice: number;
    address: string;
    pubkey: string;
  }) {
    const response = await this.axios.post<null, CreateBidPrepareResponse>(
      `/v3/market/${type}/auction/create_bid_prepare`,
      {
        auctionId,
        bidPrice,
        address,
        pubkey,
      }
    );
    return response;
  }

  async createBid({
    type,
    address,
    auctionId,
    bidPrice,
    feeRate,
    pubkey,
  }: {
    type: "brc20" | "collection" | "domain";
    address: string;
    auctionId: string;
    bidPrice: number;
    feeRate: number;
    pubkey: string;
  }) {
    const response = await this.axios.post<
      null,
      {
        bidId: string;
        psbtBid: string;
        serverFee: number;
        networkFee: number;
        feeRate: number;
        nftValue: number;
        bidSignIndexes: number[];
      }
    >(`/v3/market/${type}/auction/create_bid`, {
      auctionId,
      feeRate,
      address,
      pubkey,
      bidPrice,
    });
    return response;
  }

  async confirmBid({
    type,
    bidId,
    psbtBid,
    psbtBid2,
    auctionId,
    psbtSettle,
    fromBase64,
  }: {
    type: "brc20" | "collection" | "domain";
    auctionId: string;
    fromBase64: boolean;
    bidId: string;
    psbtBid: string;
    psbtBid2: string;
    psbtSettle: string;
  }) {
    const response = await this.axios.post<null, {}>(
      `/v3/market/${type}/auction/confirm_bid`,
      {
        auctionId,
        bidId,
        psbtBid,
        psbtBid2,
        psbtSettle,
        fromBase64,
      }
    );
    return response;
  }

  async getInscriptionInfo(inscriptionId: string) {
    const response = await this.axios.get<null, InscriptionInfo>(
      `/v1/indexer/inscription/info/${inscriptionId}`
    );
    return response;
  }

  async getAddressUtxoData(address: string, cursor = 0, size = 16) {
    const response = await this.axios.get<
      null,
      {
        cursor: number;
        total: number;
        totalConfirmed: number;
        totalUnconfirmed: number;
        totalUnconfirmedSpend: number;
        utxo: UTXO[];
      }
    >(`/v1/indexer/address/${address}/utxo-data?cursor=${cursor}&size=${size}`);
    return response;
  }

  async pushtx(txHex: string) {
    const response = await this.axios.post<null, string>(
      `/v1/indexer/local_pushtx`,
      { txHex }
    );
    return response;
  }

  async createBrc205ByteMint({
    deployerAddress,
    deployerPubkey,
    receiveAddress,
    feeRate,
    outputValue,
    brc20Ticker,
    brc20Amount,
    devAddress,
    devFee,
  }: {
    deployerAddress: string;
    deployerPubkey: string;
    receiveAddress: string;
    feeRate: number;
    outputValue: number;
    brc20Ticker: string;
    brc20Amount: string;
    devAddress: string;
    devFee: number;
  }) {
    const response = await this.axios.post<
      null,
      {
        orderId: string;
      }
    >(`/v2/inscribe/order/create/brc20-5byte-mint`, {
      deployerAddress,
      deployerPubkey,
      receiveAddress,
      feeRate,
      outputValue,
      brc20Ticker,
      brc20Amount,
      devAddress,
      devFee,
    });
    return response;
  }

  async requestCommitBrc205ByteMint({ orderId }: { orderId: string }) {
    const response = await this.axios.post<
      null,
      {
        psbtHex: string;
        inputsToSign: {
          address: string;
          signingIndexes: number[];
        }[];
      }
    >(`/v2/inscribe/order/request-commit/brc20-5byte-mint`, {
      orderId,
    });
    return response;
  }

  async signCommitBrc205ByteMint({
    orderId,
    psbt,
  }: {
    orderId: string;
    psbt: string;
  }) {
    const response = await this.axios.post<
      null,
      {
        psbtHex: string;
        inputsToSign: {
          address: string;
          signingIndexes: number[];
        }[];
      }
    >(`/v2/inscribe/order/sign-commit/brc20-5byte-mint`, {
      orderId,
      psbt,
    });
    return response;
  }

  async signRevealBrc205ByteMint({
    orderId,
    psbt,
  }: {
    orderId: string;
    psbt: string;
  }) {
    const response = await this.axios.post<
      null,
      {
        inscriptionId: string;
      }
    >(`/v2/inscribe/order/sign-reveal/brc20-5byte-mint`, {
      orderId,
      psbt,
    });
    return response;
  }
}
