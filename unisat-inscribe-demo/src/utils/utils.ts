import {Buffer} from "buffer";
import {message} from "antd";
import {Base64} from "js-base64";

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function stringToHex(stringToEncode: string) {
    return Buffer.from(stringToEncode).toString('hex')
}

export function stringToBase64(stringToEncode: string) {
    // btoa only support ascii, use js-base64 instead
    return Base64.encode(stringToEncode)
}

export function isTicketValid(ticket: string) {
    return Buffer.from(ticket).length === 4
}

export function handleError(e: any) {
    return  message.error((e && e.message) || e)
}

export function showLongString(str: string, length = 10) {
    if (!str) return '';
    if (str.length <= length) return str;
    return `${str.substring(0, length / 2)}...${str.substring(
        str.length - length / 2,
        str.length
    )}`;
}

export function getSizeShow(size: number, fixed = 3): string {
    if (size < 1024) return size + " B";

    return (size / 1024).toFixed(fixed) + " KB";
}


export const isUtf8 = async (file: File) => {
    return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);

        reader.onloadend = (e: any): void => {
            const content = e.target.result;
            const encodingRight = content.indexOf("�") === -1;

            if (encodingRight) {
                resolve(encodingRight);
            } else {
                reject("Only UTF-8 format file supported. ");
            }
        };

        reader.onerror = () => {
            reject(
                "Failed to read the file content. Please check whether the file is damaged"
            );
        };
    });
};




export function getStringByteCount(str: string) {
    let totalLength = 0;
    let charCode;
    for (let i = 0; i < str.length; i++) {
        charCode = str.charCodeAt(i);
        if (charCode < 0x007f) {
            totalLength++;
        } else if (0x0080 <= charCode && charCode <= 0x07ff) {
            totalLength += 2;
        } else if (0x0800 <= charCode && charCode <= 0xffff) {
            totalLength += 3;
        } else {
            totalLength += 4;
        }
    }
    return totalLength;
}
