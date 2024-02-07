import {handleError, sleep} from "../utils/utils";
import {unisatUtils} from "../utils/unisatUtils";
import {Button} from "antd";

export function InscribeTransfer({tick, onInscribed}: { tick: string, onInscribed: () => void }) {


    async function inscribeTransfer() {
        try {
            await unisatUtils.inscribeTransfer(tick)
            await sleep(5000)
            onInscribed()
        } catch (e) {
            handleError(e)
        }
    }

    return <Button size={'large'} type={'primary'} ghost onClick={inscribeTransfer}>
        Inscribe TRANSFER
    </Button>
}