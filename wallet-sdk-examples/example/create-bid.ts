import { AddressType } from "@unisat/wallet-sdk";
import { bitcoin } from "@unisat/wallet-sdk/lib/bitcoin-core";
import { NetworkType } from "@unisat/wallet-sdk/lib/network";
import { LocalWallet } from "@unisat/wallet-sdk/lib/wallet";
import { OpenApi } from "./open-api";

const runCreateBidExample = async () => {
  const wallet = new LocalWallet(
    "xxxxxx",
    AddressType.P2TR,
    NetworkType.MAINNET
  );

  const openapi = new OpenApi({
    baseUrl: "https://open-api.unisat.io",
    apiKey: "xxxxx",
  });
  const type = "domain";

  const auctionId = "42hw91h3lc273c8ebdcw7wi4s4jrivuy";
  const data = await openapi.createBid({
    type: "domain",
    auctionId,
    bidPrice: 10000,
    address: wallet.address,
    pubkey: wallet.pubkey,
    feeRate: 66,
  });

  const psbt = bitcoin.Psbt.fromHex(data.psbtBid, {
    network: bitcoin.networks.bitcoin,
  });

  await wallet.signPsbt(psbt, {
    autoFinalized: false,
  });

  const res = await openapi.confirmBid({
    type,
    auctionId: auctionId,
    fromBase64: false,
    bidId: data.bidId,
    psbtBid: psbt.toHex(),
    psbtBid2: "",
    psbtSettle: "",
  });
  console.log("success", res);
};
runCreateBidExample();
