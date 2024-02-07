import {handleError} from "./utils";
import {NetworkType} from "../types";

export const unisatUtils = {
    async getAccounts() {
        try {
            const accounts = await window.unisat.getAccounts();
            if (accounts && accounts.length > 0) {
                return accounts[0];
            }
        } catch (e: any) {
            handleError(e);
        }
        return '';
    },
    async requestAccounts() {
        try {
            const accounts = await window.unisat.requestAccounts();
            if (accounts && accounts.length > 0) {
                return accounts[0];
            }
        } catch (e: any) {
            handleError(e);
        }
        return '';
    },
    signMessage(message: string, type?: string) {
        return window.unisat.signMessage(message, type);
    },
    signPsbt(psbt: string) {
        return window.unisat.signPsbt(psbt, {autoFinalized: false});
    },
    getNetwork(): Promise<NetworkType> {
        return window.unisat.getNetwork();
    },
    switchNetwork(network: NetworkType): Promise<void> {
        return window.unisat.switchNetwork(network);
    },

    async checkNetwork(network: NetworkType): Promise<void> {
        if (network !== await this.getNetwork()) {
            await this.switchNetwork(network);
        }
    },
    inscribeTransfer(tick: string, amount?: number | string) {
        return window.unisat.inscribeTransfer(tick, amount)
    },
    getPublicKey() {
        return window.unisat.getPublicKey();
    },
    sendBitcoin(toAddress: string, amount: number, options: any) {
        return window.unisat.sendBitcoin(toAddress, amount, options);
    },

}