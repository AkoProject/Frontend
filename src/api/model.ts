import {DefaultAkoApi} from "./api.ts";

export interface ModelApi {
    page: (model: string, searchData: {}, sortData: {}, pid: number, pSize: number) => Promise<any>,
    delete: (model: string, id: number[]) => Promise<any>,
    save: (model: string, data: {}) => Promise<any>
}

export class DefaultModelApi implements ModelApi {

    private readonly api: DefaultAkoApi

    constructor(api: DefaultAkoApi) {
        this.api = api
    }

    page(model: string, searchData: {}, sortData: {}, pid: number, pSize: number): Promise<any> {
        return this.api.post("model/page", {model: model, page: pid, size: pSize, params: searchData, sort: sortData})
    }

    delete(model: string, id: number[]): Promise<any> {
        return this.api.post(`model/delete/${model}`, id)
    }

    save(model: string, data: {}): Promise<any> {
        return this.api.post(`model/save/${model}`, data)
    }
}