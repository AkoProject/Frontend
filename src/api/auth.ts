import {DefaultAkoApi} from "./api.ts";

export interface AuthApi{
    isAuth(): Promise<boolean>
    login(username: string, password: string): Promise<boolean>
}

export class DefaultAuthApi implements AuthApi{
    private readonly api: DefaultAkoApi

    constructor(api: DefaultAkoApi) {
        this.api = api
    }

    isAuth(): Promise<boolean> {
        return this.api.get("auth/isAuth")
    }

    async login(username: string, password: string): Promise<boolean> {
        await this.api.post("auth/login", {username: username, password: password})
        return true
    }
}