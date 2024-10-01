export type ClientSchema = {
  is_selling: boolean
  name: string
  surname: string
  patronymic: string
  birth_date: string
  birth_location: string | null
  current_registration_address: string | null
  telegram_username: string
  phone_no: string
  email: string
  preferences_id?: number | null
}

export type ClientSchemaStored = Partial<ClientSchema> & {
  surname: string
  id: number
  created_at: string
}

export type ClientSchemaFetched = Omit<ClientSchemaStored, "preferences_id"> & {
  preferences: {[key: string]: unknown} | null
}

export type ClientSchemaCreate = Partial<ClientSchema> & Pick<ClientSchema, 'surname'>
