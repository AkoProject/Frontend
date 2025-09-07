import {BaseModel} from "../base/BaseModel.ts";
import {EditField} from "./EditField.ts";

export interface EditModel extends BaseModel{

    editNode?: string

    fields: EditField[]
}