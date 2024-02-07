import {Card, Input} from "antd";
import React, {useEffect, useState} from "react";
import {setApiKey} from "../utils/httpUtils";

export function ApiKeyInput() {
    const [key, setKey] = useState<string>("")

    useEffect(() => {
        const temp = localStorage.getItem("apiKey") || "";
        if (temp) {
            setKey(temp)
            setApiKey(temp)
        }
    }, []);

    return <Card size={'small'}>
        <div className={'flex-row-v-center gap-16 bold'}>
            Set API key:
            <div className="flex-1">
                <div className="api-key-input">
                    <Input type="text"
                           placeholder="Enter API key"
                           value={key}
                           onChange={(e) => {
                               const key = e.target.value;
                               setKey(key);
                               setApiKey(key);
                               localStorage.setItem("apiKey", key);
                           }}
                    />
                </div>
            </div>
        </div>
    </Card>
}
