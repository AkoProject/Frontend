import MenuAble from "../type/MenuAble.ts";
import {DefaultAkoApi} from "./api.ts";
import {createVNode} from "vue";
import DbModel from "../type/DbModel.ts";
import {Ako} from "../ako.ts";

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
        const models = await this.api.get<DbModel[]>("menu/list")

        this.ako.models = models

        return models.map(it => {
            const iconNode = createVNode(this.ako.findComponent(it.iconNode))

            const pageNode = this.ako.createEntityView(it)
            return {
                id: it.id,
                name: it.name,
                closeable: true,
                icon: iconNode,
                page: pageNode
            }
        })
    }
}