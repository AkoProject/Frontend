import {BaseField} from "./model/base/BaseField.ts";
import {EditField} from "./model/edit/EditField.ts";
import {SearchField} from "./model/search/SearchField.ts";
import {TableField} from "./model/table/TableField.ts";

export interface DbField extends BaseField, SearchField, TableField, EditField {
}