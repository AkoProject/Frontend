import {EditModel} from "./model/edit/EditModel.ts";

export interface ButtonEntry {
    name: string
    index: number
    url: string
    method: string
    eval?: string
    reconfirm?: string
    type: "primary" | "success" | "warning" | "danger" | "info" | "text"
    component?: string
    dialog?: {
        width?: string,
        title?: string,
        component: string
    }
    edit?: {
        width?: string,
        title?: string,
        model?: EditModel,
        data?: string
    }
}