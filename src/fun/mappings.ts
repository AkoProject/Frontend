import {enumMapOf} from "./enum.ts";

export function findMappingEntity(id: number, content: string, mappings: {}): string {
    const [mapping, matchField, display] = content.split("|")
    const mappingEntities = mappings[mapping]
    const mappingEntity = mappingEntities?.find(it => it[matchField] === id)
    return mappingEntity ? mappingEntity[display] : `找不到 ${mapping}: ${matchField} = ${id}`
}

export function findEnumMappingEntity(id: number, enumField: any, contents: string[], mappings: {}) {
    return findMappingEntity(id, enumMapOf(contents, enumField), mappings)
}