import {VNode} from "vue";
import MenuAble from "./MenuAble.ts";

export default interface MenuItem extends MenuAble {

    closeable: boolean

    page: VNode

}