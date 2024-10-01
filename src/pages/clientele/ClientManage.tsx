import { Modal } from "antd";
import { RJSFSchema, UiSchema } from "@rjsf/utils";
import { ClientSchema, ClientSchemaCreate } from "../../api/clientele/schemas.ts";
import { IChangeEvent } from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/antd";
import { RJSFValidationError } from "@rjsf/utils/src/types.ts";
import { useTranslation } from "react-i18next";

import "./styles/ClientManage.css"
import { AppDispatch } from "../../stores";
import { createClient, updateClient } from "../../stores/clientele.ts";
import { useState } from "react";

const defaultClientPayload: Partial<ClientSchema> = {
    is_selling: false,
    birth_location: null,
    current_registration_address: null,
    preferences_id: null,
}

const getDifference = (a: {[key: string]: unknown}, b: object) =>
    Object.fromEntries(Object.entries(b).filter(([key, val]) => key in a && a[key] !== val));

interface ModalProps {
    isModalOpen: boolean,
    setIsModalOpen: (value: boolean) => unknown,
    dispatch: AppDispatch,
    payload?: ClientSchemaCreate & {id: number}
}

export const ClientManage = ({isModalOpen, setIsModalOpen, dispatch, payload}: ModalProps) => {
    const { t } = useTranslation("clientele");
    const isUpdate: boolean = !!payload
    const [formData, setFormData] = useState(undefined)

    const schema: RJSFSchema = {
        additionalProperties: false,
        properties: {
            is_selling: {
                type: "string",
                enum: [t("client.type.seller"), t("client.type.buyer")],
                title: t("client.typeLabel"),
            },
            name: {
                maxLength: 64,
                type: "string",
                nullable: true,
                title: t("client.name")
            },
            surname: {
                maxLength: 64,
                type: "string",
                title: t("client.surname")
            },
            patronymic: {
                maxLength: 64,
                type: "string",
                nullable: true,
                title: t("client.patronymic")
            },
            birth_date: {
                format: "date",
                nullable: true,
                type: "string",
                title: t("client.birthDate")
            },
            birth_location: {
                nullable: true,
                type: "string",
                title: t("client.birthLocation")
            },
            current_registration_address: {
                nullable: true,
                type: "string",
                title: t("client.currRegAddress")
            },
            telegram_username: {
                maxLength: 32,
                type: "string",
                nullable: true,
                title: t("client.tgUsername")
            },
            phone_no: {
                maxLength: 16,
                type: "string",
                nullable: true,
                title: t("client.phoneNo")
            },
            email: {
                maxLength: 64,
                type: "string",
                nullable: true,
                title: t("client.email")
            }
        },
        required: [
            "surname"
        ],
        title: "ClientManage",
        type: "object"
    }
    const uiSchema: UiSchema  = {
        "ui:title": "",
        "ui:submitButtonOptions": {
            "submitText": t("common:button.submit"),
            props: {
                disabled: false,
                className: "ant-btn-primary"
            }
        }
    }

    const handleSubmit = ({ formData }: IChangeEvent)=> {
        if(isUpdate){
            const diff = getDifference(payload!, formData)
            const surname = diff["surname"] || payload!.surname

            if(Object.keys(diff).length !== 0)
                dispatch(updateClient({...defaultClientPayload, ...diff, id: payload!.id, surname}))
        } else {
            const payload: ClientSchemaCreate & {id: number} = { ...defaultClientPayload, ...formData }

            dispatch(createClient(payload))
        }

        setFormData(undefined)
        setIsModalOpen(false)
    }

    // const handleOk = () => {
    //     setIsModalOpen(false);
    //
    // };

    const handleCancel = () => {
        setFormData(undefined)
        setIsModalOpen(false);
    };

    const transformErrors = (errors: RJSFValidationError[]) => {
        return errors.map((error) => {
            if (error.name === 'required') {
                console.log(t.name)
                error.message = t('error.required')
            }
            return error;
        });
    }

    return (
        <Modal
            title={isUpdate ? t("openClientUpdate") : t("openClientCreate")}
            open={isModalOpen}
            onCancel={handleCancel}
            okButtonProps={{ style: { display: 'none' } }}
            cancelText={t("common:button.cancel")}
        >
            <Form
                schema={schema}
                uiSchema={uiSchema}
                validator={validator}
                transformErrors={transformErrors}
                onSubmit={handleSubmit}
                formData={
                    payload ?
                        Object.fromEntries(Object.entries(payload).filter(
                            ([key, ]) => key !== "id"
                        )) :
                        formData
                }
                onChange={(e) => {console.log(e.formData); setFormData(e.formData)}}
                templates={{ErrorListTemplate: () => (<></>)}}
            />
        </Modal>
    )
}