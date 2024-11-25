import {VNode} from "vue";

export default interface MenuAble {
    id: string
    name: string
    previous?: string

    icon: VNode
}