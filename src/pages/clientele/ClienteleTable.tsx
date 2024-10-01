import { deleteClient, getClientele } from "../../stores/clientele.ts";
import { ClientSchemaStored } from "../../api/clientele/schemas.ts";
import { Button, Space, Table, Tag } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../stores";


export const ClienteleTable = (
    { showModalUpdate }: { showModalUpdate: (record: ClientSchemaStored) => void }
) => {
    const { t } = useTranslation("clientele");

    const pageSize = 20
    const [page, setPage] = useState(0)

    const { status, items, total } = useAppSelector(
        (state) => state.clientele
    )
    const dispatch = useAppDispatch()

    const columns = [
        {
            title: t("client.name"),
            dataIndex: "name",
        },
        {
            title: t("client.patronymic"),
            dataIndex: "patronymic",
        },
        {
            title: t("client.surname"),
            dataIndex: 'surname',
            key: 'surname',
        },
        {
            title: t("client.phoneNo"),
            dataIndex: 'phone_no',
            key: 'phone_no',
        },
        {
            title: t("client.typeLabel"),
            key: 'type',
            dataIndex: 'is_selling',
            render: (_: unknown, { is_selling }: ClientSchemaStored) => (
                <>
                    {
                        is_selling ?
                            <Tag color="geekblue">{t("client.type.seller")}</Tag> :
                            <Tag color="green">{t("client.type.buyer")}</Tag>
                    }
                </>
            ),
        },
        {
            title: t("table.action"),
            key: 'action',
            render: (_: unknown, record: ClientSchemaStored) => (
                <Space size="middle">
                    <Button type="link" onClick={()=>dispatch(deleteClient(record.id))}>
                        {t("table.btnDelete")}
                    </Button>
                    <Button type="link" onClick={() => showModalUpdate(record)}>
                        {t("table.btnUpdate")}
                    </Button>
                </Space>
            ),
        },
    ]

    useEffect(() => {
        dispatch(getClientele({
            limit: pageSize,
            offset: pageSize * page
        }))
    }, [page, pageSize, dispatch])

    return <Table
        loading={status === "loading"}
        dataSource={Object.values(items).map(item => ({key: item.id, ...item}))}
        columns={columns}
        pagination={{
            position: ["bottomCenter"],
            pageSize,
            total,
            onChange: (page) => setPage(page-1),
        }}
        style={{width: "80vw"}}
    />
}
