import { ClientSchemaStored, ClientSchemaCreate, ClientSchemaFetched } from "./schemas"
import { makeRequest } from "../../index.ts";

const baseUrl = "http://127.0.0.1:8000/preferences"

export const getPreferencesPrefetchAPI = async (
    limit: number = 50, offset: number = 0
) => {
    return await makeRequest<{items: ClientSchemaFetched[], total: number}>({
        url: baseUrl,
        params: {prefetch: true, limit, offset},
        method: "get"
    })
}

export const getPreferencesAPI = async (
    limit: number = 50, offset: number = 0
) => {
    return await makeRequest<{items: ClientSchemaStored[], total: number}>({
        url: baseUrl,
        params: {prefetch: false, limit, offset},
        method: "get"
    })
}

export const createPreferenceAPI = async (payload: ClientSchemaCreate) => {
    return await makeRequest<ClientSchemaStored>({
        url: baseUrl,
        data: payload,
        method: "post"
    })  
}

export const updatePreferenceAPI = async (payload: ClientSchemaCreate & {id?: number}) => {
    const {id, ...stripped} = payload

    return await makeRequest<ClientSchemaStored>({
        url: baseUrl + `/${id}`,
        data: stripped,
        method: "put"
    })
}

export const deletePreferenceAPI = async (id: number) => {
    return await makeRequest<boolean>({
        url: baseUrl + `${id}`,
        method: "delete"
    })
}
