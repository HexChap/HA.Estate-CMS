import { ClientSchemaStored, ClientSchemaCreate, ClientSchemaFetched } from "./schemas"
import { makeRequest } from "../index.ts";

const baseUrl = "http://127.0.0.1:8000"

export const getClientelePrefetchAPI = async (
    limit: number = 50, offset: number = 0
) => {
    return await makeRequest<{items: ClientSchemaFetched[], total: number}>({
        url: baseUrl + `/clientele`,
        params: {prefetch: true, limit, offset},
        method: "get"
    })
}

export const getClienteleAPI = async (
    limit: number = 50, offset: number = 0
) => {
    return await makeRequest<{items: ClientSchemaStored[], total: number}>({
        url: baseUrl + `/clientele`,
        params: {prefetch: false, limit, offset},
        method: "get"
    })
}

export const createClientAPI = async (payload: ClientSchemaCreate) => {
    return await makeRequest<ClientSchemaStored>({
        url: baseUrl + `/clientele`,
        data: payload,
        method: "post"
    })
}

export const updateClientAPI = async (payload: ClientSchemaCreate & {id?: number}) => {
    const {id, ...stripped} = payload

    return await makeRequest<ClientSchemaStored>({
        url: baseUrl + `/clientele/${id}`,
        data: stripped,
        method: "put"
    })
}

export const deleteClientAPI = async (id: number) => {
    return await makeRequest<boolean>({
        url: baseUrl + `/clientele/${id}`,
        method: "delete"
    })
}
