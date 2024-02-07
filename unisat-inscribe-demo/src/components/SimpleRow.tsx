import {ReactNode} from "react";
import {Col, Radio, Row} from "antd";

export function SimpleRow({label,value,valueSpan=12,extra}:{
    label?:string,
    value:ReactNode,
    valueSpan?:number,
    extra?:ReactNode
}) {
    return <Row gutter={16} align={'middle'}>
        <Col span={6} style={{textAlign: 'right'}}>
            {label}
        </Col>
        <Col span={valueSpan}>
            {value}
        </Col>
        <Col span={18-valueSpan}>
            {extra}
        </Col>
    </Row>
}