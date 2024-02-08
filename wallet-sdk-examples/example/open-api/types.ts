export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export interface UTXO {
  address: string;
  codeType: number;
  height: number;
  idx: number;
  inscriptions: [
    {
      inscriptionId: string;
      inscriptionNumber: number;
      isBRC20: boolean;
      moved: boolean;
      offset: number;
    }
  ];
  atomicals: {
    atomicalId: string;
    atomicalNumber: number;
    isARC20: boolean;
    ticker: string;
  }[];
  isOpInRBF: boolean;
  satoshi: number;
  scriptPk: string;
  scriptType: string;
  txid: string;
  vout: number;
}

export interface TickerDetail {
  completeBlocktime: number;
  completeHeight: number;
  confirmedMinted: string;
  confirmedMinted1h: string;
  confirmedMinted24h: string;
  creator: string;
  decimal: number;
  deployBlocktime: number;
  deployHeight: number;
  historyCount: number;
  holdersCount: number;
  inscriptionId: string;
  inscriptionNumber: number;
  inscriptionNumberEnd: number;
  inscriptionNumberStart: number;
  limit: string;
  max: string;
  mintTimes: number;
  minted: string;
  ticker: string;
  totalMinted: string;
  txid: string;
}

export interface InscribeSummary {
  inscribeCount: number;
  ogPassConfirmations: number;
  ogPassCount: number;
  satsCount: number;
  unisatCount: number;
}
