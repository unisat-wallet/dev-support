import {SimpleRow} from "./SimpleRow";
import {Input} from "antd";
import {useEffect, useState} from "react";

export type InscribeTextInputProps = {
    submit: (text: string) => void,
}

export function InscribeTextInput({submit}: InscribeTextInputProps) {

    const [inputText, setInputText] = useState('');

    useEffect(() => {
        submit(inputText);
    }, [inputText]);

    return <>
        <SimpleRow
            label={'text to inscribe'}
            value={<Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={'Enter text to inscribe'}
                allowClear
            />}
        />
    </>
}