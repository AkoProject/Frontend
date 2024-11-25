
export default interface RespMenuItem {
    identifier: string
    name: string
    displayAble: boolean

    previous: string

    pageNode: string
    searchNode?: string
    tableNode?: string
    editNode?: string
    iconNode?: string
}

