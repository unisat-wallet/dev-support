import {Card, Radio} from "antd";
import {NetworkType, networkUtils} from "../utils/networkUtils";
import {useNetwork} from "../provider/NetworkProvider";


export function NetworkSwitch() {
    const {network, setNetwork} = useNetwork()
    return <Card size={'small'}>
        <Radio.Group onChange={v => {
            networkUtils.setNetworkType(v.target.value)
            setNetwork(v.target.value)
        }} defaultValue={network}>
            <Radio.Button value={NetworkType.testnet}>Testnet</Radio.Button>
            <Radio.Button value={NetworkType.livenet}>Mainnet</Radio.Button>
        </Radio.Group>
    </Card>
}