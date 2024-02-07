
export enum NetworkType {
    livenet = 'livenet',
    testnet = 'testnet',
}

class NetworkUtils {
    private network: NetworkType = NetworkType.testnet;
    setNetworkType(type: NetworkType) {
        this.network = type;
    }
    isTestnet() {
        return this.network === NetworkType.testnet;
    }
}

export const networkUtils  = new NetworkUtils();

