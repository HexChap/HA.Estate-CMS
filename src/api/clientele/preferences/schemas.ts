import { ClientSchemaStored } from "../schemas.ts";

export type PreferenceSchema = {
  price_min: number
  price_max: number
  prop_type: string
  area_min: number
  area_max: number
  floor: number
  build_material: string
  build_year: number
  client_id?: number | null
}

export type PreferenceStored = Partial<PreferenceSchema> & {
  id: number
  created_at: string
}

export type PreferenceFetched = Omit<PreferenceStored, "client_id"|"location_id"> & {
  client: ClientSchemaStored
}

export type ClientSchemaCreate = Partial<PreferenceSchema>
