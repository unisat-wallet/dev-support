import React from 'react';
import './style/App.css';
import {ApiKeyInput} from "./components/ApiKeyInput";
import {NetworkSwitch} from "./components/NetworkSwitch";
import {Card, Input, Layout, Space, Tabs} from "antd";
import {ConnectWallet} from "./components/ConnectWallet";
import {Assets} from "./page/Assets";
import {useMarket} from "./provider/MarketProvider";
import {isTicketValid} from "./utils/utils";
import {Listed} from "./page/Listed";

function App() {
    const {tick, setTick} = useMarket();

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Layout.Content style={{padding: 16}}>
                <div style={{
                    maxWidth: 640,
                    margin: '0 auto',
                    display: "flex",
                    flexDirection: 'column',
                    gap: 16,
                }}>
                    <ApiKeyInput/>
                    <NetworkSwitch/>
                    <ConnectWallet/>
                    <Card size={'small'}>
                        <Tabs
                            destroyInactiveTabPane
                            items={[
                                {key: "1", label: "Listed", children: <Listed/>},
                                {key: "2", label: "Assets", children: <Assets/>},
                            ]}
                            tabBarExtraContent={{
                                right: <Space align={'center'}>
                                    Tick
                                    <Input
                                        style={{width: 100}}
                                        value={tick}
                                        onChange={(e) => setTick(e.target.value)}
                                        status={isTicketValid(tick) ? '' : 'error'}
                                    />
                                </Space>
                            }}
                        />
                    </Card>
                </div>
            </Layout.Content>
        </Layout>
    );
}

export default App;
