

export interface EditValidateEntry {
    require?: boolean
    min?: number
    max?: number
    regexp?: string
    eval?: string
    fetch?: string
    message: string
}