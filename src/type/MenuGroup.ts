import {MenuAble} from "./MenuAble.ts";

export interface MenuGroup extends MenuAble{

    children: MenuGroup[]

}