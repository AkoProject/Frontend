import {SearchInfo} from "./SearchInfo.ts";
import {EditInfo} from "./EditInfo.ts";
import {ColumnInfo} from "./ColumnInfo.ts";

export interface DbField {
    id: string
    name: string
    description: string

    search: SearchInfo
    edit: EditInfo
    column: ColumnInfo

    tableIgnore : boolean

    tableNode: string


    type: number
    subtype: number

    content: string
    enum: string[]
}