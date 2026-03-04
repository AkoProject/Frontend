import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import '../style/style.css'
import {App, createVNode, InjectionKey, VNode, ObjectPlugin, Component} from "vue";
import {AkoOptions, margeOptions} from "./type/AkoOptions.ts";
import EntityView from "../view/views/EntityView.vue";
import {Menu} from "@element-plus/icons-vue";
import AkoEntitySearchPanel from "../view/fragments/AkoEntitySearchPanel.vue";
import AkoEntityTablePanel from "../view/fragments/AkoEntityTablePanel.vue";
import AkoEntityTableColumnPanel from "../view/fragments/AkoEntityTableColumnPanel.vue";
import AkoEntitySearchColumnPanel from "../view/fragments/AkoEntitySearchColumnPanel.vue";
import {zhCn} from "element-plus/es/locale/index";
import {DbModel} from "./type/DbModel.ts";
import {AkoApi} from "./api/api.ts";
import AkoEntityEditPanel from "../view/fragments/AkoEntityEditPanel.vue";
import AkoEntityEditColumnPanel from "../view/fragments/AkoEntityEditColumnPanel.vue";
import AkoEntityTableHideColumn from "../view/fragments/AkoEntityTableHideColumn.vue";
import AkoEntitySearchProperty from "../view/fragments/AkoEntitySearchProperty.vue";
import {EditModel} from "./type/model/edit/EditModel.ts";
import {type TypeProvider} from "./type/value/TypeProvider.ts";
import AkoEntityEditPropertyPanel from "../view/fragments/AkoEntityEditPropertyPanel.vue";
import {ModelPage} from "./type/resp/ModelPage.ts";

export const AkoSymbol = Symbol("AkoApp") as InjectionKey<Ako>
export const AkoOptionsSymbol = Symbol("AkoOptions") as InjectionKey<AkoOptions>
export const AkoApiSymbol = Symbol("AkoApi") as InjectionKey<AkoApi>

// const builtInValueProvider =
//     Object.entries(import.meta.glob<{ default: TypeProvider }>('.type/value/built-in/**/**.ts', {eager: true}))
//         .map(([k, v]) => ({
//             name: k.replace('./built-in/', '').replace('.ts', '').replace("-", ":"),
//             ...v.default
//         }))

function builtInValueProvider() {
    const providers = Object.entries(import.meta.glob<{
        default: TypeProvider
    }>('./type/value/built-in/*.ts', {eager: true}))
        .map(([k, v]) => ({
            name: k.replace('./type/value/built-in/', '').replace('.ts', '').replace("-", ":"),
            ...v.default
        }))
    const onlyComponentProviders: Record<string, Record<string, Component>> = {}
    Object.entries(import.meta.glob<{ default: TypeProvider }>('./type/value/built-in/**/*.vue', {eager: true}))
        .forEach(([k, v]) => {
            const [name, type] = k.replace('./type/value/built-in/', '')
                .replace('.vue', '')
                .replace("-", ":")
                .split('/')

            if (providers.find(it => it.name == name)) return
            const ocp = onlyComponentProviders[name] ?? {}
            ocp[type.toLowerCase()] = v.default
            onlyComponentProviders[name] = ocp
        })

    function opc2tp(name: string, ocp: typeof onlyComponentProviders[string]): TypeProvider {
        if (ocp.edit == null) ocp.edit = ocp.search ?? (() => createVNode('span', null, `无法定位到 ${name} 的 edit 组件`))
        if (ocp.search == null) ocp.search = () => createVNode('span', null, `无法定位到 ${name} 的 search 组件`)
        if (ocp.table == null) ocp.table = () => createVNode('span', null, `无法定位到 ${name} 的 table 组件`)
        return {
            name: name,
            search: ocp.search,
            table: ocp.table,
            edit: ocp.edit
        }
    }

    return [...providers, ...Object.entries(onlyComponentProviders).map(([k, v]) => opc2tp(k, v))]
        .map(it => ({...it, name: `ako:${it.name}`}))
}

export class Ako implements ObjectPlugin<AkoOptions> {
    get api(): AkoApi {
        return this._api;
    }

    private _api: AkoApi
    private _options: AkoOptions
    private _app: App

    private _models: DbModel[] = []
    private _typeProviders: TypeProvider[] = [...builtInValueProvider()]

    get app(): App {
        return this._app;
    }

    set app(value: App) {
        this._app = value
    }

    get options(): AkoOptions {
        return this._options;
    }

    set options(value: AkoOptions) {
        if (this._app == null) throw new Error("请先正确提供 Vue App 实例！")
        this._options = margeOptions(value)
        this._api = this._options.api(this)
        if (this._options.registerElementIcon) registerElementIcon(this._app)
        if (this._options.types) this._typeProviders.push(...this._options.types)
    }

    get models(): DbModel[] {
        return this._models;
    }

    set models(value: DbModel[]) {
        this._models = value;
    }

    install(app: App, options?: AkoOptions) {
        this.app = app
        this.options = options

        app.provide(AkoSymbol, this)
        app.provide(AkoOptionsSymbol, this._options)
        app.provide(AkoApiSymbol, this._api)

        app.use(ElementPlus, {locale: zhCn})
    }

    findComponent(name: string) {
        return defaultMap[name] ?? this._app.component(name)
    }

    findTypeProvider(name: string): TypeProvider | undefined {
        return this._typeProviders.find(it => it.name == name)
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

    createEditView(model: EditModel, data: any, save: (data: any) => Promise<void>, page: ModelPage): VNode {
        return createVNode(this.findComponent(model.editNode), {
            save: save,
            data: data,
            page: page,
            model: model
        })
    }

    createSaveFun(model: EditModel): (data: any) => Promise<void> {
        return async (data: any) => {
            Object.keys(data).forEach(key => {
                const field = model.fields.find(it => it.id == key)
                if (field == undefined) return
                if (data[key] == undefined && field.edit.require && field.edit.allowEmpty) data[key] = ''
                else if (data[key] === '' && !field.edit.require) data[key] = null
            })
            await this.api.model.save(model.id, data)
        }
    }
}

const defaultMap = {
    "default-entity-page-node": EntityView,
    "default-entity-icon-node": Menu,

    "default-entity-search-node": AkoEntitySearchPanel,
    "default-entity-table-node": AkoEntityTablePanel,
    "default-entity-edit-node": AkoEntityEditPanel,

    "default-entity-search-property-node": AkoEntitySearchProperty,
    "default-entity-search-input-node": AkoEntitySearchColumnPanel,
    "default-entity-table-column-node": AkoEntityTableColumnPanel,
    "default-entity-edit-property-node": AkoEntityEditPropertyPanel,
    "default-entity-edit-input-node": AkoEntityEditColumnPanel,
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