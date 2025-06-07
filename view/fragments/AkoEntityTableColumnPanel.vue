<template>
    <component :is="view"/>
</template>

<script setup lang="tsx">
import {createVNode, VNode} from "vue";
import {DbField} from "../../src/type/DbField.ts";
import {DbModel} from"../../src/type/DbModel.ts";
import dayjs from "dayjs";
import {ElLink, ElImage, ElTooltip, ElMessageBox} from "element-plus";
import {findEnumMappingEntity, findMappingEntity} from "../../src/fun/mappings.ts";
import {enumMapOf} from "../../src/fun/enum.ts";

const props = defineProps<{ model: DbModel, field: DbField, row: any, data: any, mappings: any }>()

const data = props.data
const field = props.field
const type = props.field.type
const subtype = props.field.subtype
const mappings = props.mappings

function span(text: string, props = {}): VNode {
    return createVNode("span", props, text)
}

function makeRender(): VNode {
    if (!data && data !== 0) return span("null", {style: "color: #ccc"})
    if (type === -1 || type === 0) return span(data)

    if (type === 40)
        switch (subtype) {
            case 0:
                return span(dayjs(data).format('YYYY-MM-DD'))
            case 1:
                return span(dayjs(data).format('HH:mm:ss'))
            case 2:
                return span(dayjs(data).format('YYYY-MM-DD HH:mm:ss'))
        }
    if (type === 50)
        switch (subtype) {
            case 0:
                return span(findMappingEntity(data, field.content, mappings))
            case 1:
                return span(findEnumMappingEntity(data, props.row[field.content], field.enum, mappings))
        }

    if (type === 100) return span(enumMapOf(field.enum, data))


    if (type === 120) {
        const [url, prefix] = field.content.split("|")

        if (subtype === 1)
            return <ElTooltip placement="top" effect="light">{{
                default: () => <ElLink type="primary" underline={false} onClick={() =>
                    ElMessageBox({
                        customStyle: {'max-width': '824px'},
                        title: '查看大图',
                        // @ts-ignore
                        message: h(ElImage, {
                            src: prefix + data,
                            style: "max-width: 800px; max-height: 800px",
                            previewSrcList: [prefix + data]
                        }),
                    })
                }>查看</ElLink>,
                content: () => <img src={prefix + data} style="max-width: 200px; max-height: 200px" alt=""/>
            }}</ElTooltip>

        if (subtype === 2)
            return <ElLink type="primary" underline={false}>查看</ElLink>

    }
}

const view = () => makeRender()

</script>

<style scoped>

</style>