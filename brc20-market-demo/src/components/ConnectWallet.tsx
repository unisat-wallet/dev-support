import {useUnisat} from "../provider/UniSatProvider";
import {Button, Card} from "antd";

export function ConnectWallet() {
    const {address, connect} = useUnisat();

    return <Card size={'small'}>
        {
            address
                ? <div>Address: {address}</div>
                : <Button type={'primary'} onClick={connect}>Connect Wallet to Continue</Button>
        }
    </Card>

}