import { AddressType } from "@unisat/wallet-sdk";
import { NetworkType } from "@unisat/wallet-sdk/lib/network";
import { sendBTC } from "@unisat/wallet-sdk/lib/tx-helpers";
import { LocalWallet } from "@unisat/wallet-sdk/lib/wallet";
import { MempoolApi } from "./mempool-api";
import { OpenApi } from "./open-api";

const runSendBitcoin = async () => {
  const mempoolApi = new MempoolApi({
    baseUrl: "https://mempool.space/testnet/api",
  });

  const openapi = new OpenApi({
    baseUrl: "https://open-api-testnet.unisat.io",
    apiKey: "",
  });

  const wallet = new LocalWallet(
    "xxxxxxx",
    AddressType.P2PKH,
    NetworkType.TESTNET
  );

  const toAddress = "xxxxxx";
  const btcUtxos = await openapi.getAddressUtxoData(wallet.address);
  if (wallet.addressType === AddressType.P2PKH) {
    for (let i = 0; i < btcUtxos.utxo.length; i++) {
      btcUtxos.utxo[i].rawtx = await mempoolApi.getRawTx(btcUtxos.utxo[i].txid);
    }
  }

  const { psbt, toSignInputs } = await sendBTC({
    btcUtxos: btcUtxos.utxo.map((v) => ({
      txid: v.txid,
      vout: v.vout,
      satoshis: v.satoshi,
      scriptPk: v.scriptPk,
      pubkey: wallet.pubkey,
      addressType: wallet.addressType,
      inscriptions: v.inscriptions,
      atomicals: [],
      rawtx: v.rawtx, // only for p2pkh
    })),
    tos: [
      {
        address: toAddress,
        satoshis: 1000,
      },
    ],
    networkType: wallet.networkType,
    changeAddress: wallet.address,
    feeRate: 1,
  });

  let signWithLocalWallet = true;
  if (signWithLocalWallet) {
    // sign with local wallet
    await wallet.signPsbt(psbt, {
      autoFinalized: true,
      toSignInputs,
    });
    const rawtx = psbt.extractTransaction().toHex();

    const txid = await openapi.pushtx(rawtx);
    console.log("txid:", txid);
  } else {
    const psbtHex = psbt.toHex();
    console.log("psbtHex:", psbtHex);
    // copy this hex to a wallet that can sign it
    // unisat.signPsbt(psbtHex).then(result=>{
    //   unisat.pushPsbt(result).then(txid=>{ console.log('push success',txid) })
    //});
  }
};
runSendBitcoin();
