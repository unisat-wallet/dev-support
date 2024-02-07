import {Buffer} from "buffer";
import {message} from "antd";

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function stringToHex(stringToEncode: string) {
    return Buffer.from(stringToEncode).toString('hex')
}

export function isTicketValid(ticket: string) {
    return Buffer.from(ticket).length === 4
}

export function handleError(e: any) {
    message.error((e && e.message) || e)
}