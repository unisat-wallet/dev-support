import {NetworkType} from "../utils/networkUtils";
import {createContext, ReactNode, useContext, useState} from "react";

interface NetworkContextType {
    network: NetworkType;
    setNetwork: (network: NetworkType) => void;
}

const NetworkContext = createContext<NetworkContextType>({
    network: NetworkType.testnet,
    setNetwork: () => {}
})

export function useNetwork() {
    const context = useContext(NetworkContext);
    if (!context) {
        throw Error('Feature flag hooks can only be used by children of NetworkProvider.');
    } else {
        return context;
    }
}

export default function NetworkProvider({children}: {
    children: ReactNode
}) {
    const [network, setNetwork] = useState(NetworkType.testnet)

    return <NetworkContext.Provider value={{
        network,
        setNetwork
    }}>
        {children}
    </NetworkContext.Provider>
}