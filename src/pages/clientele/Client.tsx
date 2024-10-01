import "./styles/Client.css"
import { ClientManage } from "./ClientManage.tsx";
import { useEffect, useState } from "react";
// import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../stores";
import { Button, Space, Table, Tag } from "antd";
import { useTranslation } from "react-i18next";
import { deleteClient, getClientele } from "../../stores/clientele.ts";
import { ClientSchemaCreate, ClientSchemaStored } from "../../api/clientele/schemas.ts";
import { Wrapper } from "./styles/ClientStyles.ts";

export const Client = () => {
    const { t } = useTranslation();
    const pageSize = 20
    const [page, setPage] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [payload, setPayload] =
        useState<ClientSchemaCreate & Pick<ClientSchemaStored, "id">|undefined>(undefined)
    const {status, items, total} = useAppSelector(
        (state) => state.clientele
    )
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getClientele({
            limit: pageSize,
            offset: pageSize * page
        }))
    }, [page, pageSize, dispatch])

    const showModalCreate = () => {
        setPayload(undefined)
        setIsModalOpen(true);
    }

    const showModalUpdate = (record: ClientSchemaStored) => {

        setPayload(
            Object.fromEntries(Object.entries(record).filter(
                ([key, ]) => !["created_at", "key"].includes(key)
            )) as ClientSchemaCreate & Pick<ClientSchemaStored, "id">
        )
        setIsModalOpen(true)
    }

    const columns = [
        {
            title: t("table.name"),
            dataIndex: "name",
        },
        {
            title: t("table.patronymic"),
            dataIndex: "patronymic",
        },
        {
            title: t("table.surname"),
            dataIndex: 'surname',
            key: 'surname',
        },
        {
            title: t("table.phoneNo"),
            dataIndex: 'phone_no',
            key: 'phone_no',
        },
        {
            title: t("table.clientType"),
            key: 'type',
            dataIndex: 'is_selling',
            render: (_: unknown, { is_selling }: ClientSchemaStored) => (
                <>
                    {
                        is_selling ?
                            <Tag color="geekblue">{t("table.tag.seller")}</Tag> :
                            <Tag color="green">{t("table.tag.buyer")}</Tag>
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

    return (
      <Wrapper>
          <Table
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
          <Button type="primary" onClick={showModalCreate}>
              {t("openClientCreate")}
          </Button>
          <ClientManage
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              dispatch={dispatch}
              payload={payload}
          />
      </Wrapper>
    )
}

export default Client
