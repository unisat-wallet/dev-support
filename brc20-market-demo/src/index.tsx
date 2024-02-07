import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css';
import App from './App';
import {ConfigProvider} from "antd";
import NetworkProvider from "./provider/NetworkProvider";
import UnisatProvider from "./provider/UniSatProvider";
import MarketProvider from "./provider/MarketProvider";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
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
        <NetworkProvider>
            <UnisatProvider>
                <MarketProvider>
                    <App/>
                </MarketProvider>
            </UnisatProvider>
        </NetworkProvider>
    </ConfigProvider>
);
