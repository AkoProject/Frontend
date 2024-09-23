import DbField from "./DbField.ts";
import {createVNode, VNode} from "vue";
import {findComponent} from "../ako.ts";

export default interface DbModel {
    id: string
    name: string

    pageNode: string
    searchNode: string
    tableNode?: string
    editNode?: string
    iconNode?: string

    mappings: string[]
    fields: DbField[]
}

let models: DbModel[] = []

export function setModels(newModels: DbModel[]) {
    models = newModels
}

export function getModels(): DbModel[] {
    return models
}