<template>
    <component :is="view"/>
</template>

<script setup lang="tsx">
import {createVNode, VNode} from "vue";
import {ElDatePicker, ElInput, ElOption, ElSelect, ElTimePicker} from "element-plus";
import AkoEntitySearchMappingColumnPanel from "./AkoEntitySearchMappingColumnPanel.vue";
import {enumMap} from "../../src/fun/enum.ts";
import {SearchModel} from "../../src/type/model/search/SearchModel.ts";
import {SearchField} from "../../src/type/model/search/SearchField.ts";


const props = defineProps<{
    model: SearchModel,
    field: SearchField,
    placeholder: string,
    width: string,
    searchData: {}
}>()

const modelValue = defineModel()

const field = props.field
const type = props.field.type
const subtype = props.field.subtype


function render(): VNode {
    if (type === -1) return <span>不受支持的格式: {field.content}</span>

    const defaultProps = {
        style: `width: ${props.width}`,
        placeholder: props.placeholder,
        modelValue: modelValue.value,
        'onUpdate:modelValue': (value) => modelValue.value = value
    }

    function node(component: any, props: {} = {}, children: VNode[] = []): VNode {
        return createVNode(component, {...props, ...defaultProps}, children)
    }

    if (type === 0) return node(ElInput, {clearable: true})

    if (type === 40)
        switch (subtype) {
            case 0:
                return node(ElDatePicker, {'value-format': "x"})
            case 1:
                return node(ElTimePicker, {'value-format': "x"})
            case 2:
                return node(ElDatePicker, {type: 'datetime', 'value-format': "x"})
        }

    if (type === 50) return node(AkoEntitySearchMappingColumnPanel, {...props})

    if (type === 100) {
        const map = enumMap(field.enum)
        return node(
            ElSelect,
            {
                clearable: true,
                model: props.model,
                field: field,
            },
            Object.entries(map).map(([k, v]) => createVNode(ElOption, {key: k, label: v, value: k}))
        )
    }

    return <span>111</span>
}

const view = () => render()
</script>

<style scoped>
</style>