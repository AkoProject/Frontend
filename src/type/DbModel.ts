import DbField from "./DbField.ts";
import ButtonEntry from "./ButtonEntry.ts";

export default interface DbModel {
    id: string
    name: string

    previous: string

    pageNode: string
    searchNode: string
    tableNode?: string
    editNode?: string
    iconNode?: string

    mappings: string[]
    fields: DbField[]

    index: number

    modelButtons: ButtonEntry[]
    operateButtons: ButtonEntry[]
}

let models: DbModel[] = []

export function setModels(newModels: DbModel[]) {
    models = newModels
}

export function getModels(): DbModel[] {
    return models
}