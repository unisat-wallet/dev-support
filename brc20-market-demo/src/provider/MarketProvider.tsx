import {createContext, useContext, useState} from "react";

interface MarketContentType {
    tick: string;
    setTick: (tick: string) => void;
}

const MarketContext = createContext<MarketContentType>({
    tick: '',
    setTick: () => {
    }
})

export function useMarket() {
    const context = useContext(MarketContext);
    if (!context) {
        throw Error('Feature flag hooks can only be used by children of MarketProvider.');
    } else {
        return context;
    }
}

export default function MarketProvider({children}: {
    children: React.ReactNode
}) {
    const [tick, setTick] = useState('sats')

    return <MarketContext.Provider value={{
        tick,
        setTick
    }}>
        {children}
    </MarketContext.Provider>
}