import {ButtonEntry} from "../type/ButtonEntry.ts";
import {ElMessage} from "element-plus";
import axios from "axios";
import {dialog} from "./dialog.ts";
import {AkoOptions} from "../type/AkoOptions.ts";
import {Ako} from "../ako.ts";
import {BaseModel} from "../type/model/base/BaseModel.ts";

export interface ProButton extends ButtonEntry {
    loading: boolean
    execute: (single: any | undefined, multi: any[]) => Promise<void>
}

interface UrlParam {
    name: string
    type: string
    location: 'path' | 'body'
    data?: any
}

function buttonUrl(url: string) {
    const paramMap: UrlParam[] = []
    let paramBuilder = ''
    let ks = false
    let i = 0

    let body = false

    function error(message: string) {
        ElMessage.error(message)
        throw new Error(message)
    }

    function buildParam() {
        if (paramBuilder.length < 2 || paramBuilder[0] != '{')
            error('URL 解析失败！在' + url + '位置' + (i - paramBuilder.length) + ' - ' + i + '处，参数必须以 "{" 开头，以 "}" 结尾')
        const name = paramBuilder.substring(1)
        let type = 'single'
        if (name.startsWith('__')) type = 'env'
        if (name == 'ids' || name == 'multi' || name.startsWith('multi.')) type = 'multi'

        paramMap.push({
            name: name,
            type: type,
            location: body ? 'body' : 'path'
        })
        paramBuilder = ''
    }

    for (; i < url.length; i++) {
        let char = url.charAt(i)
        let zy = false
        if (char == '\\') {
            i++
            zy = true
            char = url.charAt(i)
        }
        if (!ks) {
            if (!zy && char == '$') ks = true
            if (!zy && char == '#') body = true
        } else {
            if (char == '}') buildParam()
            else paramBuilder += char
        }
    }
    if (paramBuilder != '') error('URL 解析失败！URL 尾存在无法解析的参数！')

    return paramMap
}

function object2path(data: any) {

}

function toPathParam(data: any | undefined) {
    if (data == undefined) return 'null'
    if (typeof data == 'string') return data
    if (Array.isArray(data)) return data.map(it => toPathParam(it)).join(',')
    if (typeof data == 'object') return JSON.stringify(data)
    return String(data)
}

function buttonUrl2(url: string, params: UrlParam[], single: any | undefined, multi: any[] | undefined, options: AkoOptions) {
    // const paramMap: Record<string, string> = {}

    if (!multi) multi = []

    params.forEach(item => {
        const it = item.name
        let data: any
        if (it == 'id') data = single?.id
        else if (it == 'ids') data = multi.map(it => it.id)
        else if (it.startsWith('multi.')) {
            const field = it.substring(6)
            data = multi.map(it => it[field])
        } else if (it.startsWith('__BASE_URL')) data = options.baseUrl
        else if (it == 'multi') data = multi
        else if (it == 'single') data = single
        else data = single ? single[it] : undefined

        if (item.location == 'path') item.data = toPathParam(data)
        else item.data = JSON.stringify(data)
    })
}

export function toProButton(button: ButtonEntry, ako: Ako, model: BaseModel, search: () => void, edit: (e: any) => void): ProButton {
    let execute
    if (button.url) {
        const params = buttonUrl(button.url)
        const mustSingle = params.some(it => it.type == 'single')
        const mustMulti = params.some(it => it.type == 'multi')

        execute = async (single: any | undefined, multi: any[] | undefined) => {
            if (mustMulti && !multi?.length) {
                ElMessage.error('请至少勾选一条记录！')
                return
            }
            if (mustSingle && !single) {
                ElMessage.error('请单选选中一条记录！')
                return
            }

            buttonUrl2(button.url!, params, single, multi, ako.options)
            let url = button.url
            let body = undefined
            params.forEach(it => {
                if (it.location == 'path')
                    url = url.replace('${' + it.name + '}', it.data)
            })
            if (url.includes('#')) {
                const data = url.split('#', 2)
                url = data[0]
                body = data[1]
            }


            if (button.method == "popup") {
                window.open(url)
                return
            }
            const result = axios.request({url: url, method: button.method, data: body})

            const data = (await result).data
            const code = data?.code ?? 0
            const message = data?.message ?? code == 0 ? '操作成功！' : '操作失败！'
            if (code == 0) ElMessage.success(message)
            else ElMessage.error(message)
        }
    }
    if (button.eval) {
        const fun = eval("async(single,multi,props) => {" + button.eval + "}")
        execute = async (single: any | undefined, multi: any[] | undefined) => await fun(single, multi, {
            model: model,
            search: search,
            edit: edit,
            api: ako.api,
            dialog: dialog,
        })
    }
    return {
        ...button,
        loading: false,
        execute: execute
    }
}