import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {handleError, sleep} from "../utils/utils";
import {unisatUtils} from "../utils/unisatUtils";
import {useNetwork} from "./NetworkProvider";

interface UnisatContextType {
    isInstalled: boolean;
    isConnected: boolean;
    address: string;
    pubkey: string;
    connect: () => void;
    signMessage: (msg: string) => Promise<string>;
    signPsbt: (psbt: string) => Promise<string>;
}

const UnisatContext = createContext<UnisatContextType>({
    isInstalled: false,
    isConnected: false,
    address: '',
    pubkey: '',
    connect: () => {
    },
    signMessage: (msg: string) => Promise.resolve(''),
    signPsbt: (psbt: string) => Promise.resolve('')
})


export function useUnisat() {
    const context = useContext(UnisatContext);
    if (!context) {
        throw Error('Feature flag hooks can only be used by children of UnisatProvider.');
    } else {
        return context;
    }
}

export default function UnisatProvider({children}: {
    children: ReactNode
}) {
    const {network} = useNetwork();
    const [isInstalled, setIsInstalled] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [address, setAddress] = useState('')
    const [pubkey, setPubkey] = useState('')

    useEffect(() => {

        async function init() {
            let install = !!window.unisat;
            setIsInstalled(install);

            // 额外检查
            for (let i = 0; i < 10 && !install; i += 1) {
                await sleep(100 + i * 100);
                install = !!window.unisat;
                if (install) {
                    setIsInstalled(install);
                    break;
                }
            }

            if (install) {
                const address = await unisatUtils.getAccounts()
                if (address) {
                    setPubkey(await unisatUtils.getPublicKey())
                    //     connected
                    setIsConnected(true)
                    setAddress(address)
                }
            }
        }

        init().then().catch(handleError);

    }, []);

    const connect = useCallback(async () => {
        try {
            await unisatUtils.checkNetwork(network);
            const address = await unisatUtils.requestAccounts();
            if (address) {
                setPubkey(await unisatUtils.getPublicKey())
                setIsConnected(true)
                setAddress(address)
            }
        } catch (e) {
            handleError(e)
        }

    }, [network])

    useEffect(() => {
        async function onAppNetworkChange() {
            try {
                await unisatUtils.checkNetwork(network);
                const address = await unisatUtils.getAccounts()
                if (address) {
                    setAddress(address)
                }
            } catch (e) {
                handleError(e)
            }
        }

        if (isConnected) {
            onAppNetworkChange().then()
        }
    }, [isConnected, network]);

    const signMessage = useCallback((msg: string) => {
        return unisatUtils.signMessage(msg, 'bip322-simple')
    }, [])

    const signPsbt = useCallback((psbt: string) => {
        return unisatUtils.signPsbt(psbt)
    }, []);

    const value = {
        isInstalled,
        isConnected,
        address,
        pubkey,
        connect,
        signMessage,
        signPsbt,
    }

    return <UnisatContext.Provider value={value}>
        {children}
    </UnisatContext.Provider>

}