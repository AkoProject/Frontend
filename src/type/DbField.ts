import {SearchInfo} from "./SearchInfo.ts";

export default interface DbField {
    id: string
    name: string
    description: string

    search: SearchInfo
    columnWidth: string

    tableIgnore : boolean
    editIgnore : boolean

    required: boolean
    editable: boolean

    tableNode: string
    editNode: string


    type: number
    subtype: number

    content: string
    enum: string[]
}