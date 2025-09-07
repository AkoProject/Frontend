import {BaseField} from "../base/BaseField.ts";
import {ColumnInfo} from "./ColumnInfo.ts";

export interface TableField extends BaseField{
    column?: ColumnInfo
    tableIgnore : boolean
    tableNode: string
}