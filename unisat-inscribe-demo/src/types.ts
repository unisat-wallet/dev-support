export enum NetworkType {
    livenet = 'livenet',
    testnet = 'testnet',
}


export type UnisatWalletInterface = {
    getAccounts(): Promise<string[]>;
    requestAccounts(): Promise<string[]>;
    getNetwork(): Promise<NetworkType>;
    switchNetwork(network: NetworkType): Promise<void>;
    sendBitcoin(address: string, amount: number, options: any): Promise<string>;
    on(event: string, listener: Function): void;
    removeListener(event: string, listener: Function): void;
    signMessage(message: string, type?: string): Promise<string>;
    signPsbt(psbt: string, opt: { autoFinalized: boolean }): Promise<string>;
    getPublicKey(): Promise<string>;
    getBalance(): Promise<{
        confirmed: number,
        unconfirmed: number,
        total: number
    }>;
    inscribeTransfer(tick: string, amount?: number | string): Promise<{
        amount: string,
        inscriptionId: string
        inscriptionNumber: number
        ticker: string
    }>;
    getInscriptions(num: number): Promise<void>;
}


declare global {
    interface Window {
        unisat: UnisatWalletInterface;
    }
}