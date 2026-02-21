import {ComponentAble} from "../component.ts";

export interface UnnamedTypeProvider {
    search: ComponentAble
    table: ComponentAble
    edit: ComponentAble
}

export interface TypeProvider extends UnnamedTypeProvider{
    name: string
}