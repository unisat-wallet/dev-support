import {Button, Card, Flex, Table} from "antd";
import {useCallback, useEffect, useState} from "react";
import {api} from "../utils/api";
import {InscribeOrderData} from "../utils/api-types";
import {OrderDetail} from "../components/OrderDetail";
import {handleError} from "../utils/utils";
import {ReloadOutlined} from "@ant-design/icons";
import {useUnisat} from "../provider/UniSatProvider";
import {EventEmitter} from "ahooks/lib/useEventEmitter";
import {useRequest} from "ahooks";

const pageSize = 10

interface OrderListProps {
    newOrder$: EventEmitter<void>
}

export function OrderList({newOrder$}: OrderListProps) {
    const {network} = useUnisat();
    const [list, setList] = useState<InscribeOrderData[] | undefined>()
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

    const [orderId, setOrderId] = useState<string>('')

    const { loading,run} = useRequest(() => api.listOrder({
        size: pageSize,
        cursor: (page - 1) * pageSize,
        sort: 'desc',
    }), {
        refreshDeps: [page, network],
        onSuccess: (res) => {
            setList(res.list)
            setTotal(res.total)
        },
        onError:handleError
    })

    newOrder$.useSubscription(run)

    return <Card title={<Flex justify={'space-between'}>
        <span>Order List</span>
        <Button shape={"circle"} onClick={run} icon={<ReloadOutlined/>} loading={!list}/>
    </Flex>}>
        <Table
            loading={loading}
            dataSource={list}
            pagination={{
                total,
                pageSize,
                current: page,
            }}
            onChange={({current}) => {
                setPage(current || 1)
            }}
            rowKey={record => record.orderId}
            columns={[
                {
                    title: 'OrderId',
                    dataIndex: 'orderId',
                },
                {
                    title: 'Status',
                    dataIndex: 'status',
                }, {
                    title: 'Crate Time',
                    dataIndex: 'createTime',
                    render: (time: number) => new Date(time).toLocaleString()
                },
            ]}
            onRow={record => {
                return {
                    onClick: () => {
                        console.log(record.orderId)
                        setOrderId(record.orderId)
                    }
                }
            }}

        />
        {orderId && <OrderDetail orderId={orderId} close={() => {
            setOrderId('')
        }}/>}
    </Card>
}