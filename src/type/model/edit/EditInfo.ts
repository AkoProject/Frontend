import {EditValidateEntry} from "./EditValidateEntry.ts";


export interface EditInfo {
    component:  string
    require: boolean
    allowEmpty: boolean
    editable: boolean
    placeholder: string
    validate: EditValidateEntry[]
}