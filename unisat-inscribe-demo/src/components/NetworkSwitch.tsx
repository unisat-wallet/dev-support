import {Card, Radio} from "antd";
import {useUnisat} from "../provider/UniSatProvider";
import {NetworkType} from "../types";


export function NetworkSwitch() {
    const {network, switchNetwork} = useUnisat()
    return <Card size={'small'}>
        <Radio.Group onChange={v => {
            switchNetwork(v.target.value)
        }} value={network}>
            <Radio.Button value={NetworkType.testnet}>Testnet</Radio.Button>
            <Radio.Button value={NetworkType.livenet}>Mainnet</Radio.Button>
        </Radio.Group>
    </Card>
}