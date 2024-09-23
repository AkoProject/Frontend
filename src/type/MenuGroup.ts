import {VNode} from "vue";
import MenuAble from "./MenuAble.ts";

export default interface MenuGroup extends MenuAble{

    children: MenuGroup[]

}