import {VNode} from "vue";
import {MenuAble} from "./MenuAble.ts";

export interface MenuItem extends MenuAble {

    closeable: boolean

    page: VNode

}