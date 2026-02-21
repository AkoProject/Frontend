import {EditValidateEntry} from "./EditValidateEntry.ts";


export interface EditInfo {
    propertyComponent: string
    inputComponent: string
    require: boolean
    allowEmpty: boolean
    editable: boolean
    placeholder: string
    validate: EditValidateEntry[]
}