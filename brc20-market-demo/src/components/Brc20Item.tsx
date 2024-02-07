import {Space, Statistic} from "antd";

export function Brc20Item({tick, amount}: {
    tick: string,
    amount: string | number,
}) {
    return <Space direction={'vertical'} style={{
        border: '1px solid #eee',
        borderRadius: 4,
        padding: 8,
        minWidth:88,

    }}>
        <Statistic
            valueStyle={{fontSize: 14,textAlign:'center'}}
            title={tick}
            value={amount}/>
    </Space>
}