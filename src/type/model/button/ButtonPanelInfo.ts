import {EditField} from "../edit/EditField.ts";
import {EditModel} from "../edit/EditModel.ts";

export interface ButtonPanelInfo extends EditModel{
    url?: string
    method?: string
    data?: string
    fields: EditField[]
}