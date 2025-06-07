import axios, {AxiosResponse} from "axios";
import {DefaultAkoMenu, MenuApi} from "./menu.ts";
import {Ako} from "../ako.ts";
import {DefaultModelApi, ModelApi} from "./model.ts";
import {AuthApi, DefaultAuthApi} from "./auth.ts";


export interface AkoApi {
    menu: MenuApi,
    model: ModelApi
    auth: AuthApi
}

export class DefaultAkoApi implements AkoApi {
    private readonly ako: Ako
    private readonly baseUrl: string
    readonly menu: MenuApi
    readonly model: ModelApi
    readonly auth: AuthApi

    constructor(ako: Ako) {
        this.ako = ako
        this.baseUrl = ako.options.baseUrl
        this.menu = new DefaultAkoMenu(this.ako, this)
        this.model = new DefaultModelApi(this)
        this.auth = new DefaultAuthApi(this)
    }

    async post<T>(url: string, data: {} = {}): Promise<T> {
        return this.resultOf(await axios.post(this.baseUrl + url, data, {validateStatus: () => true}))
    }

    async get<T>(url: string, data: {} = {}): Promise<T> {
        if (Object.keys(data).length > 0) {
            if (!url.includes('?')) url += '?'
            Object.keys(data).forEach(key => {
                url += `&${key}=${data[key]}`
            })
        }
        return this.resultOf(await axios.get(this.baseUrl + url, {validateStatus: () => true}))
    }

    resultOf<T>(resp: AxiosResponse): T {
        if (resp.status >= 200 && resp.status < 300) {
            return resp.data
        }
        if (resp.status == 401) location.reload()
        throw new Error(`Request failed with status code ${resp.status}`)
    }
}