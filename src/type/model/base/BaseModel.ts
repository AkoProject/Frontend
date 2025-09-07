import {BaseField} from "./BaseField.ts";

export interface BaseModel {
    id: string
    name: string

    fields: BaseField[]
}