export interface MappingTarget {
    model: string
    field: string
    display: string
}

export interface MappingOptions {
    cascader?: string
    values: Record<string, MappingTarget>
}