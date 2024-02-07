import {Buffer} from "buffer";
import {message} from "antd";
import {NETWORK, NetworkType} from "../constants";

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function stringToHex(stringToEncode: string) {
    return Buffer.from(stringToEncode).toString('hex')
}

export function handleError(e: any) {
    return message.error((e && e.message) || e)
}

// @ts-ignore
export const isTestnet = NETWORK === NetworkType.testnet;