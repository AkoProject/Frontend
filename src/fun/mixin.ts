import {MenuResp} from "../type/resp/MenuResp.ts";
import {DbModel} from "../type/DbModel.ts";
import {RespMenuItem} from "../type/resp/RespMenuItem.ts";


export function menuRespMixin() {
    const models: Record<string, (model: DbModel) => DbModel> = {}
    const menus: Record<string, (menu: RespMenuItem) => RespMenuItem> = {}
    const mixinFun = (resp: MenuResp) => ({
        menus: resp.menus.map(it => menus[it.identifier]?.(it) ?? it),
        models: resp.models.map(it => models[it.id]?.(it) ?? it)
    })

    function voidSelf<T>(fun: (t: T) => T | void): (t: T) => T {
        return (it: T) => (fun(it) ?? it)
    }

    mixinFun.model = (id: string, mixin: (model: DbModel) => DbModel | void) => {
        models[id] = voidSelf(mixin)
        return mixinFun
    }
    mixinFun.menu = (id: string, mixin: (menu: RespMenuItem) => RespMenuItem | void) => {
        menus[id] = voidSelf(mixin)
        return mixinFun
    }
    return mixinFun
}