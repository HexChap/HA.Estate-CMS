import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createClientAPI, deleteClientAPI, getClienteleAPI, updateClientAPI } from "../api/clientele/create.ts";
import { ClientSchemaCreate, ClientSchemaStored } from "../api/clientele/schemas.ts";

type GenericAsyncThunk = AsyncThunk<unknown, unknown, never>
type PendingAction = ReturnType<GenericAsyncThunk["pending"]>

type ClienteleState = {
    status: string,
    items: {[index: number]: ClientSchemaStored},
    total: number
}

const initialState: ClienteleState = {
    status: "idle",
    items: {},
    total: 0
}

export const getClientele = createAsyncThunk(
    "clientele/get", async (payload: {limit: number, offset: number}) => {
        return await getClienteleAPI(payload.limit, payload.offset)
    }
)

export const createClient = createAsyncThunk(
    "clientele/create", async (payload: ClientSchemaCreate) => {
        return await createClientAPI(payload)
    }
)

export const updateClient = createAsyncThunk(
    "clientele/update", async (payload: ClientSchemaCreate & {id: number}) => {
        return await updateClientAPI(payload)
    }
)

export const deleteClient = createAsyncThunk(
    "clientele/delete", async (id: number) => {
        return {response: await deleteClientAPI(id), id}
    }
)

export const clienteleSlice = createSlice({
    name: 'clientele',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(createClient.fulfilled, (state, action) => {
                const client = action.payload.data

                if(client) state.items[client.id] = client
                state.status = 'idle'
            })
            .addCase(getClientele.fulfilled, (state, action) => {
                const data = action.payload.data
                if (!data) return

                const newItems: {[index: number]: ClientSchemaStored} = {}

                data.items.forEach(todo => {
                    newItems[todo.id] = todo
                })
                state.items = newItems
                state.total = data.total
                state.status = 'idle'
            })
            .addCase(updateClient.fulfilled, (state, action) => {
                const data = action.payload.data
                if(!data) return

                state.items[data.id] = data
                state.status = 'idle'
            })
            .addCase(deleteClient.fulfilled, (state, action) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                action.payload.response.data && delete state.items[action.payload.id]
                state.status = 'idle'
            })
            .addMatcher<PendingAction>(
            (action) => action.type.endsWith("/pending"),
            (state) => {
                state.status = 'loading'
            }
        )
    }
})

// export const {
//     // createClient,
//     // decremented
// } = clienteleSlice.actions
