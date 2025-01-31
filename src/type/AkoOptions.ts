import MenuItem from "./MenuItem.ts";
import {createVNode} from "vue";
import {Menu} from "@element-plus/icons-vue";
import MenuGroup from "./MenuGroup.ts";
import {AkoApi, DefaultAkoApi} from "../api/api.ts";
import {Ako} from "../ako.ts";


export interface AkoOptions {
    api?: (ako: Ako) => AkoApi
    registerElementIcon?: boolean
    baseUrl?: string
    channel?: string
    dashboard?: MenuItem
    menuItems?: (MenuItem | MenuGroup)[]
}

export const defaultOptions: AkoOptions = {
    baseUrl: "/api/ako/",
    channel: "manager",
    registerElementIcon: true,
    api: (ako) => new DefaultAkoApi(ako),
    dashboard: {
        id: "dashboard",
        name: "仪表盘",
        closeable: false,
        icon: createVNode(Menu),
        page: createVNode("div", {class: "hFull bg-white br4"}),
        index: 0
    },
    menuItems: []
}

export function margeOptions(options?: AkoOptions): AkoOptions {
    if (!options) return defaultOptions
    Object.keys(defaultOptions).forEach(key => {
        if (!options[key]) options[key] = defaultOptions[key]
    })
    return options
}