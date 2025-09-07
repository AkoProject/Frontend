import {BaseField} from "../base/BaseField.ts";
import {EditInfo} from "./EditInfo.ts";

export interface EditField extends BaseField {
    edit?: EditInfo
}