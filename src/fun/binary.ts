import {unitStr} from "./num.ts";


export const binary = localStorage.getItem("__ako_default_binary") === "true" ? 1024n : 1000n
const baseUnit = binary == 1024n ? 'iB' : 'B'
export const units = [undefined, 'K', 'M', 'G', 'T', 'P', 'E']
    .map(it => it == undefined ? 'B' : it + baseUnit)


export function toByteStr(num: number | string | bigint, decimalPlaces: number = 2) {
    return unitStr(num, [...units], binary, decimalPlaces)
}