import {BaseField} from "../base/BaseField.ts";
import {SearchInfo} from "./SearchInfo.ts";

export interface SearchField extends BaseField {
    search?: SearchInfo
}