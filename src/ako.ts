import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import '../style/style.css'
import {App, createVNode, InjectionKey, VNode, ObjectPlugin} from "vue";
import {AkoOptions, margeOptions} from "./type/AkoOptions.ts";
import EntityView from "../view/views/EntityView.vue";
import {Menu} from "@element-plus/icons-vue";
import AkoEntitySearchPanel from "../view/fragments/AkoEntitySearchPanel.vue";
import AkoEntityTablePanel from "../view/fragments/AkoEntityTablePanel.vue";
import AkoEntityTableColumnPanel from "../view/fragments/AkoEntityTableColumnPanel.vue";
import AkoEntitySearchColumnPanel from "../view/fragments/AkoEntitySearchColumnPanel.vue";
import {zhCn} from "element-plus/es/locale/index";
import DbModel from "./type/DbModel.ts";
import {AkoApi} from "./api/api.ts";
import AkoEntityEditPanel from "../view/fragments/AkoEntityEditPanel.vue";
import AkoEntityEditColumnPanel from "../view/fragments/AkoEntityEditColumnPanel.vue";
import AkoMainView from "../view/views/AkoMainView.vue";
import AkoBootView from "../view/views/AkoBootView.vue";
import AkoEntityTableHideColumn from "../view/fragments/AkoEntityTableHideColumn.vue";
import AkoEntitySearchProperty from "../view/fragments/AkoEntitySearchProperty.vue";

export const AkoSymbol = Symbol("AkoApp") as InjectionKey<Ako>
export const AkoOptionsSymbol = Symbol("AkoOptions") as InjectionKey<AkoOptions>
export const AkoApiSymbol = Symbol("AkoApi") as InjectionKey<AkoApi>

export {AkoMainView}
export {AkoBootView}

export class Ako implements ObjectPlugin<AkoOptions>{
    get api(): AkoApi {
        return this._api;
    }

    private _api: AkoApi
    private _options: AkoOptions
    private _app: App

    private _models: DbModel[] = []

    get options(): AkoOptions {
        return this._options;
    }

    get app(): App {
        return this._app;
    }

    get models(): DbModel[] {
        return this._models;
    }

    set models(value: DbModel[]) {
        this._models = value;
    }

    install(app: App, options?: AkoOptions) {
        this._app = app
        this._options = margeOptions(options)
        this._api = this._options.api(this)

        if (this._options.registerElementIcon) registerElementIcon(app)

        app.provide(AkoSymbol, this)
        app.provide(AkoOptionsSymbol, this._options)
        app.provide(AkoApiSymbol, this._api)

        app.use(ElementPlus, {locale: zhCn})
    }

    findComponent(name: string) {
        return defaultMap[name] ?? this._app.component(name)
    }

    createEntityView(model: DbModel, selectFun: (data: {}) => void = undefined): VNode {
        return createVNode(
            this.findComponent(model.pageNode),
            {
                model: model,
                tableNode: model.tableNode,
                searchNode: model.searchNode,
                editNode: model.editNode,
                selectFun: selectFun
            }
        )
    }
}

const defaultMap = {
    "default-entity-page-node": EntityView,
    "default-entity-icon-node": Menu,

    "default-entity-search-node": AkoEntitySearchPanel,
    "default-entity-table-node": AkoEntityTablePanel,
    "default-entity-edit-node": AkoEntityEditPanel,

    "default-entity-search-property-node": AkoEntitySearchProperty,
    "default-entity-search-column-node": AkoEntitySearchColumnPanel,
    "default-entity-table-column-node": AkoEntityTableColumnPanel,
    "default-entity-edit-column-node": AkoEntityEditColumnPanel,
    "default-entity-table-hide-column-node": AkoEntityTableHideColumn,
}

function registerElementIcon(app: App) {
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        let name
        switch (key) {
            case "menu":
                name = "icon-menu"
                break;
            default:
                name = key
        }
        app.component(name, component)
    }
}