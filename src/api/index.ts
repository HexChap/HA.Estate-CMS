import axios, { AxiosError, AxiosRequestConfig } from "axios";

const API_BASE = "http://localhost:8000/";

// interface SerializableResponse<Data> extends AxiosResponse<Data> {
//     headers: { [key: string]: AxiosHeaderValue }
// }

interface APIResponse<Data, Error> {
    data?: Data
    error?: AxiosError<Error>
}

export const makeRequest = async <Data = unknown, Error = unknown>(
    request: AxiosRequestConfig,
    // { fallbackData, ...config }: Config<Data, Error> = {}
): Promise<APIResponse<Data, Error>> => {
    request.baseURL = request.url !== "" ? API_BASE : ""

    try {
        const response = await axios.request<Data>(request!)

        return {data: response.data, error: undefined}
    } catch (error) {
        const castedError = error as AxiosError<Error>

        return {data: undefined, error: castedError}
    }
}