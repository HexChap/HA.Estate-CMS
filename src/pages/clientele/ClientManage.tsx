import { Modal } from "antd";
import { UiSchema } from "@rjsf/utils";
import { ClientSchema, ClientSchemaCreate } from "../../api/clientele/schemas.ts";
import { IChangeEvent } from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import Form from "@rjsf/antd";
import { RJSFValidationError } from "@rjsf/utils/src/types.ts";
import { useTranslation } from "react-i18next";

import "./styles/ClientManage.css"
import "./i18n.ts"
import { AppDispatch } from "../../stores";
import { createClient, updateClient } from "../../stores/clientele.ts";
import { useState } from "react";

const schema = {
    additionalProperties: false,
    properties: {
        is_selling: {
            title: "Продает?",
            type: "boolean"
        },
        name: {
            maxLength: 64,
            type: "string",
            nullable: true,
            title: "Имя"
        },
        surname: {
            maxLength: 64,
            title: "Фамилия",
            type: "string"
        },
        patronymic: {
            maxLength: 64,
            type: "string",
            nullable: true,
            title: "Отчество"
        },
        birth_date: {
            format: "date",
            title: "Дата рождения",
            nullable: true,
            type: "string"
        },
        birth_location: {
            title: "Место рождения",
            nullable: true,
            type: "string"
        },
        current_registration_address: {
            title: "Адрес текущей регистрации",
            nullable: true,
            type: "string"
        },
        telegram_username: {
            maxLength: 32,
            type: "string",
            nullable: true,
            title: "Юзернейм телеграм"
        },
        phone_no: {
            maxLength: 16,
            type: "string",
            nullable: true,
            title: "Номер телефона"
        },
        email: {
            maxLength: 64,
            type: "string",
            nullable: true,
            title: "Почта"
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
        "submitText": "Подтвердить",
        props: {
            disabled: false,
            className: "ant-btn-primary"
        }
    }
}

const defaultClientPayload: Partial<ClientSchema> = {
    is_selling: false,
    birth_location: null,
    current_registration_address: null,
    preferences_id: null,
    rus_passport_id: null
}

interface ModalProps {
    isModalOpen: boolean,
    setIsModalOpen: (value: boolean) => unknown,
    dispatch: AppDispatch,
    payload?: ClientSchemaCreate & {id: number}
}

const getDifference = (a: {[key: string]: unknown}, b: object) =>
    Object.fromEntries(Object.entries(b).filter(([key, val]) => key in a && a[key] !== val));


export const ClientManage = ({isModalOpen, setIsModalOpen, dispatch, payload}: ModalProps) => {
    const { t } = useTranslation();
    const isUpdate: boolean = !!payload
    const [formData, setFormData] = useState(undefined)

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
        console.log(3)
        setFormData(undefined)
        setIsModalOpen(false)
    }

    // const handleOk = () => {
    //     setIsModalOpen(false);
    //
    // };

    const handleCancel = () => {
        console.log(2)
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