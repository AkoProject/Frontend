import {VNode} from "vue";

export interface MenuAble {
    id: string
    name: string
    previous?: string

    icon: VNode

    index: number
}