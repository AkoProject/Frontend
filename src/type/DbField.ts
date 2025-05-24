import {SearchInfo} from "./SearchInfo.ts";
import {EditInfo} from "./EditInfo.ts";

export default interface DbField {
    id: string
    name: string
    description: string

    search: SearchInfo
    edit: EditInfo
    columnWidth: string

    tableIgnore : boolean

    tableNode: string


    type: number
    subtype: number

    content: string
    enum: string[]
}