import {Button, message} from "antd";
import {AddLiqReq, DeployPoolReq, swapApi} from "../utils/swapApi";
import {useUnisat} from "../provider/UniSatProvider";
import {handleError} from "../utils/utils";

export function CreatePools() {

    const {address, signMessage} = useUnisat();

    async function create() {
        try {

            const ts = Math.floor(Date.now() / 1000);
            const params: DeployPoolReq = {
                address,
                tick0: "sats",
                tick1: "ordi",
                ts,
            }

            const {signMsg} = await swapApi.preDeployPool(params)

            params.sig = await signMessage(signMsg)

            await swapApi.deployPool(params)

            message.success("Create pool success")
        } catch (e) {
            handleError(e)
        }
    }

    async function addLiq() {
        try {
            const ts = Math.floor(Date.now() / 1000);
            const params: AddLiqReq = {
                address,
                tick0: "sats",
                tick1: "ordi",
                amount0: "10",
                amount1: "100",
                slippage: "0.005",
                lp: "31.622776601683793",
                ts,
            }

            const {signMsg} = await swapApi.preAddLiquidity(params)

            params.sig = await signMessage(signMsg)

            await swapApi.addLiquidity(params)

            message.success("Add liquidity success")
        } catch (e) {
            handleError(e)
        }
    }

    return <>
        <Button onClick={create}>
            Create Pools (sats/ordi)
        </Button>
        <Button onClick={addLiq}>
            Add Liquidity (sats/ordi)
        </Button>
    </>
}