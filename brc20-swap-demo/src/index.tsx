import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import {ConfigProvider} from "antd";
import UnisatProvider from "./provider/UniSatProvider";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
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
                <App/>
            </UnisatProvider>
        </ConfigProvider>
    </React.StrictMode>
);
