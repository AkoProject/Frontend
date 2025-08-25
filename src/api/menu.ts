import {MenuAble} from "../type/MenuAble.ts";
import {DefaultAkoApi} from "./api.ts";
import {createVNode} from "vue";
import {DbModel} from "../type/DbModel.ts";
import {Ako} from "../ako.ts";
import {MenuItem} from "../type/MenuItem.ts";
import {RespMenuItem} from "../type/resp/RespMenuItem.ts";
import {MenuGroup} from "../type/MenuGroup.ts";

export interface MenuApi {
    all(): Promise<MenuAble[]>
}

export class DefaultAkoMenu implements MenuApi {

    private readonly ako: Ako
    private readonly api: DefaultAkoApi

    constructor(ako: Ako, api: DefaultAkoApi) {
        this.ako = ako
        this.api = api
    }

    async all(): Promise<MenuAble[]> {
        const menu = await this.api.get<{
            menus: RespMenuItem[],
            models: DbModel[]
        }>("menu/list/" + this.ako.options.channel)


        this.ako.models = menu.models


        const parentMenus = new Set<string>()

        menu.menus.filter(it => it.previous)
            .forEach(it => parentMenus.add(it.previous))

        menu.models.filter(it => it.previous)
            .forEach(it => parentMenus.add(it.previous))

        const parentMenuMap = {}
        const menus: MenuAble[] = []

        menu.menus.filter(it => parentMenus.has(it.identifier))
            .forEach(it => {
                const iconNode = createVNode(this.ako.findComponent(it.iconNode))
                const item: MenuGroup = {
                    id: it.identifier,
                    name: it.name,
                    icon: iconNode,
                    index: it.index,
                    children: []
                }
                parentMenuMap[it.identifier] = item
                if (it.previous == null) menus.push(item)
                else parentMenuMap[it.previous].children.push(item)
            })


        menu.menus.filter(it => !parentMenus.has(it.identifier))
            .forEach(it => {
                const iconNode = createVNode(this.ako.findComponent(it.iconNode))
                const pageNode = createVNode(this.ako.findComponent(it.pageNode))
                const item: MenuItem = {
                    id: it.identifier,
                    name: it.name,
                    closeable: it.displayAble,
                    index: it.index,
                    icon: iconNode,
                    page: pageNode
                }
                it.previous ? parentMenuMap[it.previous].children.push(item) : menus.push(item)
            })

        menu.models.forEach(it => {
            const iconNode = createVNode(this.ako.findComponent(it.iconNode))
            const pageNode = this.ako.createEntityView(it)
            const item: MenuItem = {
                id: it.id,
                name: it.name,
                closeable: true,
                index: it.index,
                icon: iconNode,
                page: pageNode
            }
            it.previous ? parentMenuMap[it.previous].children.push(item) : menus.push(item)
        })

        return menus
    }

    // async all(): Promise<MenuAble[]> {
    //     const models = await this.api.get<DbModel[]>("menu/list/" + this.ako.options.channel)
    //
    //     this.ako.models = models
    //
    //     return models.map(it => {
    //         const iconNode = createVNode(this.ako.findComponent(it.iconNode))
    //
    //         const pageNode = this.ako.createEntityView(it)
    //         return {
    //             id: it.id,
    //             name: it.name,
    //             closeable: true,
    //             icon: iconNode,
    //             page: pageNode
    //         }
    //     })
    // }
}