import {ButtonDialogInfo} from "./ButtonDialogInfo.ts";
import {ButtonEditInfo} from "./ButtonEditInfo.ts";
import {ButtonPanelInfo} from "./ButtonPanelInfo.ts";

export interface ButtonEntry {
    name: string
    index: number
    url: string
    method: string
    eval?: string
    reconfirm?: string
    type: "primary" | "success" | "warning" | "danger" | "info" | "text"
    component?: string
    dialog?: ButtonDialogInfo
    edit?: ButtonEditInfo
    panel?: ButtonPanelInfo
}