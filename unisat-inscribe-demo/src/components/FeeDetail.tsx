import {InscribeFileData} from "../pages/Inscribe";
import {SimpleRow} from "./SimpleRow";

type FeeDetailProps = {
    feeRate: number|undefined,
    outputValue: number
    devFee: number,
    address: string,
    fileList: InscribeFileData[]
}

export function FeeDetail({
                              feeRate=0, outputValue, fileList, devFee,address
                          }: FeeDetailProps) {

    const inscriptionBalance = outputValue; // the balance in each inscription
    const fileCount = fileList.length; // the fileCount
    const fileSize = fileList.reduce((pre,item)=>pre+item.size,0); // the total size of all files
    const contentTypeSize = fileList.reduce((pre, item) => pre + item.dataURL.split('data:')[1].split('base64')[0].length, 0); // the size of contentType
    const feeFileSize = fileList.slice(0,25).reduce((pre,item)=>pre+item.size,0); // the total size of first 25 files
    const feeFileCount = 25 // do not change this

    const balance = inscriptionBalance * fileCount;

    let addrSize = 25+1; // p2pkh
    if(address.indexOf('bc1q')==0 || address.indexOf('tb1q')==0){
        addrSize = 22+1;
    }else if(address.indexOf('bc1p')==0 || address.indexOf('tb1p')==0){
        addrSize = 34+1;
    }else if(address.indexOf('2')==0 || address.indexOf('3')==0){
        addrSize = 23+1;
    }

    const baseSize = 88;
    let networkFee = Math.ceil(((fileSize+contentTypeSize) / 4 + ( baseSize+8+addrSize+8+23)) * feeRate);
    if(fileCount>1){
        networkFee = Math.ceil(((fileSize+contentTypeSize) / 4 + (baseSize+8+addrSize+(35+8)*(fileCount-1)+ 8+23 +(baseSize+8+addrSize+0.5)*(fileCount-1) )) * feeRate);
    }
    let networkSatsByFeeCount = Math.ceil(((feeFileSize+contentTypeSize) / 4 + ( baseSize+8+addrSize+8+23)) * feeRate);
    if(fileCount>1){
        networkSatsByFeeCount = Math.ceil(((( feeFileSize)+contentTypeSize*(feeFileCount/fileCount)) / 4 + (baseSize+8+addrSize+(35+8)*(fileCount-1)+ 8+23 +(baseSize+8+addrSize+0.5)*Math.min(fileCount-1,feeFileCount-1) )) * feeRate);
    }

    const baseFee = 1999 * Math.min(fileCount, feeFileCount); // 1999 base fee for top 25 files
    const floatFee = Math.ceil(networkSatsByFeeCount * 0.0499); // 4.99% extra miner fee for top 25 transations
    const serviceFee = Math.floor(baseFee + floatFee);

    const total = balance + networkFee + serviceFee;
    const truncatedTotal = Math.floor((total) / 1000) * 1000; // truncate
    const amount = truncatedTotal + devFee; // add devFee at the end

    console.log("The final amount need to pay: ",amount)

    return <>
        <SimpleRow
            label={'Network Fee:'}
            value={networkFee}/>
        <SimpleRow
            label={'Service Base Fee:'}
            value={baseFee}/>
        <SimpleRow
            label={'Service Fee By Size:'}
            value={floatFee}/>
        <SimpleRow
            label={'Total:'}
            value={<><del>{total}</del> {amount}</>}/>

    </>
}