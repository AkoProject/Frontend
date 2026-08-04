export function toFlexibleFixed(num: number, decimalPlaces: number) {
    return parseFloat(num.toFixed(decimalPlaces)).toString();
}

export function toFlexibleFixedNumber(num: number, decimalPlaces: number) {
    return parseFloat(num.toFixed(decimalPlaces))
}

export function unitStr(
    num: number | string | bigint,
    units: (string | { radix: number | bigint, unit: string })[],
    radix?: number | bigint,
    decimalPlaces: number = 2
) {
    let scale = 10n ** BigInt(decimalPlaces)
    let amount = BigInt(num) * scale

    const unitArray = units.map(it => {
        if (typeof it === "string") {
            if (radix == undefined) throw new Error("在仅提供单位的情况下，必须提供进制！")
            it = {radix: radix, unit: it}
        }
        const e = {radix: BigInt(it.radix), unit: it.unit}
        return {...e, scaleRadix: e.radix * scale}
    })

    while (amount >= unitArray[0].scaleRadix && units.length > 1) {
        amount /= unitArray[0].radix
        unitArray.shift()
    }

    return formatBigIntDecimal(amount, decimalPlaces) + " " + unitArray[0].unit
}

function formatBigIntDecimal(value: bigint, decimalPlaces: number) {
    if (decimalPlaces <= 0) return value.toString()

    const scale = 10n ** BigInt(decimalPlaces)

    const integerPart = value / scale
    const decimalPart = value % scale
    const dps = decimalPart.toString().padStart(decimalPlaces, "0").split('').reverse()
    while (dps.length > 0)
        if (dps[0] === '0') dps.shift()
        else break

    let r = integerPart.toString()
    if (dps.length > 0) r += "." + dps.reverse().join('')


    return r
}

export function safeStr(num: any, nullable: boolean = false) {
    if (num == undefined || num == '') return nullable ? undefined : "0"
    if (typeof num == "string") return num
    if (typeof num == "number") return num.toString()
    if (typeof num == "bigint") return num.toString()
    return nullable ? undefined : "0"
}

export function safeBigInt(num: any, nullable: boolean = false) {
    if (num == undefined || num == '') return nullable ? undefined : 0n
    if (typeof num == "string") return BigInt(num)
    if (typeof num == "number") return BigInt(num)
    if (typeof num == "bigint") return num
    return nullable ? undefined : 0n
}