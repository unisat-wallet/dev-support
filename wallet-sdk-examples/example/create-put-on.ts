import { AddressType } from "@unisat/wallet-sdk";
import { bitcoin } from "@unisat/wallet-sdk/lib/bitcoin-core";
import { NetworkType } from "@unisat/wallet-sdk/lib/network";
import { LocalWallet } from "@unisat/wallet-sdk/lib/wallet";
import { OpenApi } from "./open-api";

const runCreatePutOnExample = async () => {
  const wallet = new LocalWallet(
    "xxxx",
    AddressType.P2WPKH,
    NetworkType.MAINNET
  );

  const openapi = new OpenApi({
    baseUrl: "https://open-api.unisat.io",
    apiKey: "xxxxx",
  });

  const type = "domain";

  const data = await openapi.createPutOnPrepare({
    type,
    inscriptionId:
      "789d2c6ec282d852b34b655fd8fe6a383747a7aee9fe8cd1f24208cb9bcecce9i0",
    initPrice: "100000",
    pubkey: wallet.pubkey,
    marketType: "fixedPrice",
    unitPrice: "0.001",
  });

  const psbt = bitcoin.Psbt.fromHex(data.psbt, {
    network: bitcoin.networks.bitcoin,
  });

  await wallet.signPsbt(psbt, {
    autoFinalized: false,
  });
  const res = await openapi.confirmPutOn({
    type,
    auctionId: data.auctionId,
    psbt: psbt.toHex(),
    fromBase64: false,
  });
  console.log("put on success", res);
};
runCreatePutOnExample();
