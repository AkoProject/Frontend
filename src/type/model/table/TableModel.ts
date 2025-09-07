import {BaseModel} from "../base/BaseModel.ts";
import {ButtonEntry} from "../../ButtonEntry.ts";
import {TableField} from "./TableField.ts";

export interface TableModel extends BaseModel {
    tableNode?: string
    operateButtons: ButtonEntry[]

    fields: TableField[]
}