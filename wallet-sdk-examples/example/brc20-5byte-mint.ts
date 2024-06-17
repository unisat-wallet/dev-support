import { AddressType } from "@unisat/wallet-sdk";
import { bitcoin } from "@unisat/wallet-sdk/lib/bitcoin-core";
import { NetworkType } from "@unisat/wallet-sdk/lib/network";
import { LocalWallet } from "@unisat/wallet-sdk/lib/wallet";
import { OpenApi } from "./open-api";

const mintBrc205Byte = async () => {
  const openapi = new OpenApi({
    baseUrl: "https://open-api-fractal.unisat.io",
    apiKey: "YOUR-API-KEY",
  });

  const wallet = new LocalWallet(
    "YOUR-PRIVATE-KEY",
    AddressType.P2WPKH,
    NetworkType.MAINNET
  );

  const toAddress = wallet.address;
  const { orderId } = await openapi.createBrc205ByteMint({
    deployerAddress: wallet.address,
    deployerPubkey: wallet.pubkey,
    receiveAddress: toAddress,
    feeRate: 1,
    outputValue: 546,
    brc20Ticker: "WORLD",
    brc20Amount: "1000",
    devAddress: wallet.address,
    devFee: 0,
  });

  console.log("orderId:", orderId);

  const toSignData1 = await openapi.requestCommitBrc205ByteMint({
    orderId: orderId,
  });

  const psbt1 = bitcoin.Psbt.fromHex(toSignData1.psbtHex);

  await wallet.signPsbt(psbt1, {
    autoFinalized: false,
    toSignInputs: toSignData1.inputsToSign.map((v) => ({
      address: v.address,
      index: v.signingIndexes[0],
    })),
  });
  const signedPsbtHex1 = psbt1.toHex();

  const toSignData2 = await openapi.signCommitBrc205ByteMint({
    orderId,
    psbt: signedPsbtHex1,
  });

  const psbt2 = bitcoin.Psbt.fromHex(toSignData2.psbtHex);
  await wallet.signPsbt(psbt2, {
    autoFinalized: false,
    toSignInputs: toSignData2.inputsToSign.map((v) => ({
      address: v.address,
      index: v.signingIndexes[0],
    })),
  });

  const signedPsbtHex2 = psbt2.toHex();

  const { inscriptionId } = await openapi.signRevealBrc205ByteMint({
    orderId,
    psbt: signedPsbtHex2,
  });

  console.log("minted:", inscriptionId);
};
mintBrc205Byte();
