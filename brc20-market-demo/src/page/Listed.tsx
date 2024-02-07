import {useMarket} from "../provider/MarketProvider";
import {useCallback, useEffect, useState} from "react";
import {BRC20ListItem, InscriptionType, marketApi} from "../utils/marketApi";
import {handleError, isTicketValid} from "../utils/utils";
import {Button, Flex, Pagination, Skeleton, Space, Statistic} from "antd";
import {BuyConfirmAlert} from "../components/BuyConfirmAlert";
import {useNetwork} from "../provider/NetworkProvider";

const pageSize = 10;

export function Listed() {

    const {network} = useNetwork();
    const {tick,} = useMarket();

    const [total, setTotal] = useState(0); // total listed
    const [page, setPage] = useState(1);
    const [list, setList] = useState<BRC20ListItem[] | undefined>();

    const [buyItem, setBuyItem] = useState<BRC20ListItem | undefined>();

    const refreshData = useCallback(() => {
        if (tick && isTicketValid(tick)) {
            // get listed
            setList(undefined)
            marketApi.listBrc20({
                filter: {
                    tick,
                    nftType: InscriptionType.brc20,
                    isEnd: false    // only show listed
                },
                sort: {unitPrice: 1},
                start: (page - 1) * pageSize,
                limit: pageSize
            }).then(res => {
                setTotal(res.total)
                setList(res.list)
            }).catch(handleError)
        } else {
            setList([])
        }
    }, [page, tick]);

    useEffect(() => {
        refreshData()
    }, [refreshData, network]);


    if (!list) return <Skeleton active/>

    return <>
        <Space wrap={true}>
            {list.map(item => {
                return <Flex
                    vertical
                    gap={8}
                    key={item.auctionId} style={{
                    border: '1px solid #eee',
                    padding: 8,
                    borderRadius: 8,
                }}>
                    <Statistic
                        value={item.amount}
                        title={item.tick}
                        valueStyle={{fontSize: 14}}
                    />
                    <Statistic
                        title={'unit price'}
                        value={item.unitPrice}
                        valueStyle={{fontSize: 14}}
                        suffix={`sats/${item.tick}`}
                    />
                    <Statistic
                        value={item.price}
                        valueStyle={{fontSize: 18}}
                        suffix={'sats'}
                    />
                    <Button onClick={() => setBuyItem(item)}>Buy</Button>
                </Flex>
            })}
        </Space>
        <Pagination
            style={{textAlign: 'center', marginTop: 16}}
            pageSize={pageSize}
            current={page}
            total={total}
            onChange={page => {
                setPage(page)
            }}
        />
        {
            buyItem && <BuyConfirmAlert
                item={buyItem}
                close={() => {
                    setBuyItem(undefined)
                }}
                onComplete={refreshData}
            />
        }
    </>
}