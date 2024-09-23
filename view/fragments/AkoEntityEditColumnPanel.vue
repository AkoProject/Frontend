<template>
    <component :is="view"/>
</template>

<script setup lang="tsx">
import {createVNode, VNode} from "vue";
import DbModel from "../../src/type/DbModel.ts";
import DbField from "../../src/type/DbField.ts";
import {ElDatePicker, ElInput, ElOption, ElSelect, ElTimePicker} from "element-plus";
import AkoEntityEditMappingColumnPanel from "./AkoEntityEditMappingColumnPanel.vue";
import {enumMap} from "../../src/fun/enum.ts";

const props = defineProps<{
    model: DbModel,
    field: DbField,
    data: {},
    entities: [],
    mappings: []
}>()

const modelValue = defineModel()

const field = props.field
const type = props.field.type
const subtype = props.field.subtype


function render(): VNode {
    if (type === -1) return <span>不受支持的格式: {field.content}</span>

    const defaultProps = {
        placeholder: field.name,
        modelValue: modelValue.value,
        disabled: !field.editable,
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

    if (type === 50) return node(AkoEntityEditMappingColumnPanel, {...props})

    if (type === 100) {
        const map = enumMap(field.enum)
        return node(
            ElSelect,
            {
                clearable: true,
                model: props.model,
                field: field,
            },
            Object.entries(map).map(([k, v]) => createVNode(ElOption, {key: k, label: v, value: Number(k)}))
        )
    }

    return <span>111</span>
}

const view = () => render()
</script>

<style scoped>
</style>