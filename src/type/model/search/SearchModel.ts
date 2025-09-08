import {BaseModel} from "../base/BaseModel.ts";
import {SearchField} from "./SearchField.ts";
import {ButtonEntry} from "../button/ButtonEntry.ts";

export interface SearchModel extends BaseModel{
    searchNode: string
    fields: SearchField[]
    modelButtons: ButtonEntry[]
}