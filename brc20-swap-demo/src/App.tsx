import React from 'react';
import './styles/App.css';
import {Card, Tabs} from "antd";
import {Swap} from "./components/Swap";
import {ApiKeyInput} from "./components/ApiKeyInput";
import {Deposit} from "./components/Deposit";

function App() {
    return (
        <div className="app">
            <div className="main-container">
                <ApiKeyInput/>
                <Card size={'small'} className={'mt-16'}>
                    <ol>
                        <li>Input your Api Key and refresh page</li>
                        <li>Connect UniSat wallet.</li>
                        <li>Click 'Deposit' tab, click 'Mint sats' to mint some sats.(<a
                            href="https://coinfaucet.eu/btc-testnet/">get tBTC</a>)
                        </li>
                        <li>Choose 'sats' and click 'inscribe transfer' to create transfer-inscription</li>
                        <li>Choose one transfer-inscription to deposit(it may need some confirmations).</li>
                        <li>Click 'swap' tab, input your pay sats then click swap</li>
                    </ol>
                </Card>
                <Card bordered={false} size={"small"} style={{marginTop: 16, paddingTop: 0}}>

                    <Tabs
                        defaultActiveKey="1"
                        tabPosition="top"
                        items={[
                            {key: "1", label: "Swap", children: <Swap/>},
                            {key: "2", label: "Deposit", children: <Deposit/>},
                            // {key: "3", label: "Pools", children: <CreatePools/>},
                        ]}
                    />
                </Card>
            </div>
        </div>
    );
}

export default App;
