import {RespMenuItem} from "./RespMenuItem.ts";
import {DbModel} from "../DbModel.ts";

export interface MenuResp{
    menus: RespMenuItem[]
    models: DbModel[]
}