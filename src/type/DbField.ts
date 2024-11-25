export default interface DbField {
    id: string
    name: string
    description: string

    columnWidth: string

    searchIgnore : boolean
    tableIgnore : boolean
    editIgnore : boolean

    required: boolean
    editable: boolean

    searchNode: string
    tableNode: string
    editNode: string

    searchEntry: string[]

    type: number
    subtype: number

    content: string
    enum: string[]
}