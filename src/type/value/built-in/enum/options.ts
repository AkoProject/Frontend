
export interface EnumElement {
    label: string
    value: string
}

export interface EnumOptions {
    cascader?: string
    values: Record<string,EnumElement[]>
}