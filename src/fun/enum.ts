export function enumMap(contents: string[]): {} {
    const enumMap = {}
    contents.forEach((it, i) => {
        if (it.includes(':')) {
            const [k, v] = it.split(':')
            enumMap[k] = v
        } else enumMap[i] = it
    })
    return enumMap
}

export function enumMapOf(contents: string[], key: any): string {
    return enumMap(contents)[key] ?? `枚举错误: ${key}`
}