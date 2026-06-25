

export function toFlexibleFixed(num: number, decimalPlaces: number) {
    return parseFloat(num.toFixed(decimalPlaces)).toString();
}

export function toFlexibleFixedNumber(num: number, decimalPlaces: number) {
    return parseFloat(num.toFixed(decimalPlaces))
}

export function unitStr(
    num: number | string,
    units: (string | { radix: number, unit: string })[],
    radix?: number,
    decimalPlaces: number = 2
) {
    for (let i = 0; i < units.length; i++) {
        if (typeof units[i] === "string") {
            const unit = units[i] as string;
            if (radix == undefined) throw new Error("在仅提供单位的情况下，必须提供进制！")
            units[i] = {radix: radix, unit: unit}
        }
    }
    const unitArray = units.map(it => {
        if (typeof it === "string") {
            if (radix == undefined) throw new Error("在仅提供单位的情况下，必须提供进制！")
            return {radix: radix, unit: it}
        }
        return it
    })
    let amount = Number(num)

    while (amount >= unitArray[0].radix && units.length > 1) {
        amount /= unitArray[0].radix
        unitArray.shift()
    }
    return toFlexibleFixed(amount, decimalPlaces) + ' ' + unitArray[0].unit
}