import axios from "axios";
import {isTestnet} from "./utils";

let apiKey = localStorage.getItem('apiKey') || '';

export function setApiKey(key: string) {
    apiKey = key;
}

const api = axios.create({
    baseURL: isTestnet ? "https://open-api-testnet.unisat.io" : "https://open-api.unisat.io/",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${apiKey}`;
    return config;
})

export const get = async (url: string, params?: any) => {
    const res = await api.get(url, {params});
    if (res.status !== 200) {
        throw new Error(res.statusText);
    }

    const responseData = res.data;

    if (responseData.code !== 0) {
        throw new Error(responseData.msg);
    }
    return responseData.data;
};

export const post = async (url: string, data?: any) => {
    const res = await api.post(url, data,);
    if (res.status !== 200) {
        throw new Error(res.statusText);
    }

    const responseData = res.data;

    if (responseData.code !== 0) {
        throw new Error(responseData.msg);
    }

    return responseData.data;
}