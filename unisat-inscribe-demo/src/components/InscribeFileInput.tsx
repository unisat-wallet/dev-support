import {Button, Card, Flex, Upload} from "antd";
import {RcFile} from "antd/es/upload";

import {InscribeFileData} from "../pages/Inscribe";
import {getSizeShow, handleError, isUtf8, showLongString} from "../utils/utils";

type InscribeFileInputProps = {
    fileList: InscribeFileData[]
    setFileList: (list: InscribeFileData[]) => void
    isSubmitting: boolean
}


const fileSizeLimit = 1024 * 365;   //  单个文件大小限制
const multiFileSizeLimit = 1024 * 100;  // 批量铸造时，中文件大小显示。
const fileCountLimit = 1000;


const getFileBase64 = (file: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(file);
};

export function InscribeFileInput({
                                      fileList,
                                      setFileList,
                                      isSubmitting
                                  }: InscribeFileInputProps) {
    const beforeUpload = async (file: RcFile) => {
        if (isSubmitting)
            return false;

        // console.log(file,file.name, file.type);

        if (fileList.length >= fileCountLimit) {
            handleError(`the file quantity limit is ${fileCountLimit}`);
            return false;
        }

        const isLtSize = file.size < fileSizeLimit;
        if (!isLtSize) {
            handleError(`File size must be smaller than ${getSizeShow(fileSizeLimit, 0)}!`);
            return false;
        }

        if (fileList.length > 0) {
            const total = fileList.reduce((pre, current) => pre + current.size, 0);
            if (total + file.size > multiFileSizeLimit) {
                handleError(`The total file size limit for inscribing inscriptions in bulk is ${getSizeShow(multiFileSizeLimit, 0)}!`);
                return false;
            }
        }

        return new Promise<boolean>(async (resolve, reject) => {

            if (file.type.startsWith('text')) {
                try {
                    await isUtf8(file)
                } catch (e: any) {
                    handleError(e);
                    resolve(false);
                    return
                }
            }

            getFileBase64(file, (dataURL) => {
                console.log(file)
                // handle text file encoding
                if (dataURL.startsWith('data:text/plain;base64')) {
                    dataURL = dataURL.replace('data:text/plain;base64', 'data:text/plain;charset=utf-8;base64')
                }
                if (dataURL.startsWith('data:text/html;base64')) {
                    dataURL = dataURL.replace('data:text/html;base64', 'data:text/html;charset=utf-8;base64')
                }


                const temp: InscribeFileData[] = [...fileList, {
                    filename: file.name,
                    size: file.size,
                    type: file.type,
                    dataURL,
                }];

                setFileList(temp);


                resolve(true);
            });
        })
    };

    return <>
        <Upload.Dragger
            showUploadList={false}
            beforeUpload={beforeUpload}
            disabled={isSubmitting}
            customRequest={() => {
            }}
            multiple={true}
        >
            <p className="ant-upload-text">
                Drag and drop your files here, or click to select files
            </p>
            <p className="ant-upload-hint">
                .jpg, .webp, .png, .gif, .txt, .mp3, .mp4(h264) + more!
            </p>
        </Upload.Dragger>
        {
            fileList.length > 0 && <Card size={'small'} title={<Flex align={'center'} justify={'space-between'}>
                File list
                <Button size={'small'} onClick={() => {
                    setFileList([])
                }}>Remove All</Button>
            </Flex>}>
                {
                    fileList.map((item, index) => (
                        <div key={index}>
                            {showLongString(item.filename)} - {item.type} - {getSizeShow(item.size)}
                        </div>
                    ))
                }
            </Card>
        }

    </>
}