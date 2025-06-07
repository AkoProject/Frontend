
export interface ButtonEntry {
    name: string
    index: number
    url: string
    method: string
    eval?: string
    reconfirm?: string
    type: "primary" | "success" | "warning" | "danger" | "info" | "text"
    component?: string
}