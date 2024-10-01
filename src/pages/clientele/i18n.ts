import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: {
                openClientCreate: "New Client",
                openClientUpdate: "Update Client",
                table: {
                    name: "Name",
                    surname: "Surname",
                    patronymic: "Patronymic",
                    phoneNo: "Phone number",
                    clientType: "Client type",
                    btnDelete: "Delete",
                    btnUpdate: "Update",
                    action: "Action",
                    tag: {
                        seller: "Sell",
                        buyer: "Buy"
                    }
                },
                error: {
                    required: "This field is required.",
                },
            },
        },
        ru: {
            translation: {
                openClientCreate: "Новый клиент",
                openClientUpdate: "Изменить клиента",
                table: {
                    name: "Имя",
                    surname: "Фамилия",
                    patronymic: "Отчество",
                    phoneNo: "Телефон",
                    clientType: "Тип",
                    btnDelete: "Удалить",
                    btnUpdate: "Изменить",
                    action: "Действия",
                    tag: {
                        seller: "Продает",
                        buyer: "Покупает"
                    }
                },
                error: {
                    required: "Это поле обязательно.",
                },
            },
        },
    },
    lng: 'en', // default language
    fallbackLng: 'ru',
    interpolation: {
        escapeValue: false,
    },
}).then()

export default i18n;