import {Card, Input} from "antd";
import React from "react";
import {setApiKey} from "../utils/httpUtils";

export function ApiKeyInput({apiKey,setKey}:{
    apiKey: string |undefined,
    setKey: (apiKey: string) => void
}) {

    return <Card size={'small'}>
        <div className={'flex-row-v-center gap-16 bold'}>
            Set API key:
            <div className="flex-1">
                <div className="api-key-input">
                    <Input type="text"
                           placeholder="Enter API key"
                           value={apiKey}
                           onChange={(e) => {
                               const key = e.target.value;
                               setKey(key);
                               setApiKey(key);
                           }}
                    />
                </div>
            </div>
        </div>
    </Card>
}
