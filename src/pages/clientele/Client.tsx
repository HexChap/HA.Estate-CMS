import { ClientManage } from "./ClientManage.tsx";
import { useState } from "react";
import { useAppDispatch } from "../../stores";
import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { ClientSchemaCreate, ClientSchemaStored } from "../../api/clientele/schemas.ts";
import { Wrapper } from "./styles/ClientStyles.ts";

import { ClienteleTable } from "./ClienteleTable.tsx";

export const Client = () => {
    const { t } = useTranslation("clientele");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [payload, setPayload] =
        useState<ClientSchemaCreate & Pick<ClientSchemaStored, "id">|undefined>(undefined)

    const dispatch = useAppDispatch()

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

    return (
      <Wrapper>
          <ClienteleTable showModalUpdate={showModalUpdate} />
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
