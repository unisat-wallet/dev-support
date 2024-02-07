import React, {useState} from 'react';
import './style/App.css';
import UnisatProvider from "./provider/UniSatProvider";
import {ConfigProvider, Layout, Typography} from 'antd';
import {useEventEmitter, useLocalStorageState} from "ahooks";
import {Inscribe} from "./pages/Inscribe";
import {ApiKeyInput} from "./components/ApiKeyInput";
import {NetworkSwitch} from "./components/NetworkSwitch";
import {OrderList} from "./pages/OrderList";

function App() {

    const newOrder$ = useEventEmitter<void>();


    const [apiKey, setApiKey] = useLocalStorageState<string>('apiKey',
        {defaultValue: '', deserializer: (val) => val, serializer: (val) => val})

    return (
        <ConfigProvider theme={{
            token: {
                colorPrimary: "#ebb94c",
            },
            components: {
                InputNumber: {
                    colorTextDisabled: "#222"
                }
            }
        }}>
            <UnisatProvider>
                <Layout style={{minHeight: "100vh"}}>
                    <Layout.Content style={{padding: 16}}>
                        <div style={{
                            maxWidth: 720,
                            margin: '0 auto',
                            display: "flex",
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            gap: 16,
                        }}>
                            <ApiKeyInput apiKey={apiKey} setKey={setApiKey}/>
                            <NetworkSwitch/>
                            {
                                apiKey
                                    ? <>
                                        <Inscribe newOrder$={newOrder$}/>
                                        <OrderList newOrder$={newOrder$}/>
                                    </>
                                    : <>
                                        <Typography.Title>
                                            Please set API key to continue
                                        </Typography.Title>
                                    </>
                            }
                        </div>
                    </Layout.Content>
                </Layout>
            </UnisatProvider>
        </ConfigProvider>
    );
}

export default App;
