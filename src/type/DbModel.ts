import {DbField} from "./DbField.ts";
import {BaseModel} from "./model/base/BaseModel.ts";
import {EditModel} from "./model/edit/EditModel.ts";
import {SearchModel} from "./model/search/SearchModel.ts";
import {TableModel} from "./model/table/TableModel.ts";

export interface DbModel extends BaseModel, SearchModel, TableModel, EditModel {
    previous: string

    pageNode: string
    iconNode?: string

    fields: DbField[]

    index: number
}

let models: DbModel[] = []

export function setModels(newModels: DbModel[]) {
    models = newModels
}

export function getModels(): DbModel[] {
    return models
}