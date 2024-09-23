import axios from "axios";
import {DefaultAkoMenu, MenuApi} from "./menu.ts";
import {Ako} from "../ako.ts";
import {DefaultModelApi, ModelApi} from "./model.ts";


export interface AkoApi {
    menu: MenuApi,
    model: ModelApi
}

export class DefaultAkoApi implements AkoApi {
    private readonly ako: Ako
    private readonly baseUrl: string
    readonly menu: MenuApi
    readonly model: ModelApi

    constructor(ako: Ako) {
        this.ako = ako
        this.baseUrl = ako.options.baseUrl
        this.menu = new DefaultAkoMenu(this.ako, this)
        this.model = new DefaultModelApi(this)
    }

    async post(url: string, data: {} = {}): Promise<T> {
        return (await axios.post(this.ako.options.baseUrl + url, data))?.data
    }

    async get<T>(url: string, data: {} = {}): Promise<T> {
        if (Object.keys(data).length > 0) {
            if (!url.includes('?')) url += '?'
            Object.keys(data).forEach(key => {
                url += `&${key}=${data[key]}`
            })
        }
        return (await axios.get(this.ako.options.baseUrl + url))?.data
    }
}