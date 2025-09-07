<template>
    <el-form-item :label="field.name" :rules="rules" :prop="field.id">
        <component :is="view"/>
    </el-form-item>
</template>

<script setup lang="tsx">
import {createVNode, VNode} from "vue";
import {ElDatePicker, ElInput, ElMessage, ElOption, ElSelect, ElTimePicker} from "element-plus";
import AkoEntityEditMappingColumnPanel from "./AkoEntityEditMappingColumnPanel.vue";
import {enumMap} from "../../src/fun/enum.ts";
import {EditInfo} from "../../src/type/model/edit/EditInfo.ts";
import axios from "axios";
import {EditModel} from "../../src/type/model/edit/EditModel.ts";
import {EditField} from "../../src/type/model/edit/EditField.ts";

const props = defineProps<{
    model: EditModel,
    field: EditField,
    edit: EditInfo,
    data: {},
    mappings: []
}>()

const modelValue = defineModel()

const field = props.field
const edit = props.edit
const type = props.field.type
const subtype = props.field.subtype

const rules = edit.validate.length ? edit.validate.map(v => {
    if (v.require) return {required: true, message: v.message, trigger: 'blur'}
    if (v.regexp) return {pattern: v.regexp, message: v.message, trigger: 'blur'}
    if (v.min || v.max) return {min: v.min, max: v.max, message: v.message, trigger: 'blur'}
    if (v.fetch) return {
        validator: (rule: any, value: any, callback: (error?: any) => void) => {
            axios.post(v.fetch, {
                model: props.model.id,
                field: props.field.id,
                data: props.data,
                value: value
            }).then(resp => callback(resp.data.success ? undefined : new Error(v.message)))
                .catch(err => callback(new Error(`参数远程验证失败: ${err.message}`)))
        },
        trigger: 'blur'
    }
    if (v.eval) return {
        validator: (rule: any, value: any, callback: (error?: any) => void) => {
            const fun = eval("async (value, data, model, field) => {" + v.eval + "}")
            fun(value, props.data, props.model, props.field)
                .then(callback)
                .catch(() => callback(new Error(v.message)))
        },
        trigger: 'blur'
    }
    return undefined
}).filter(it => it) : undefined


function render(): VNode {
    if (type === -1) return <span>不受支持的格式: {field.content}</span>

    const defaultProps = {
        placeholder: field.name,
        modelValue: modelValue.value,
        disabled: !edit.editable,
        'onUpdate:modelValue': (value) => modelValue.value = value
    }

    function node(component: any, props: {} = {}, children: VNode[] = []): VNode {
        return createVNode(component, {...props, ...defaultProps}, children)
    }

    if (type === 0) return node(ElInput, {clearable: true})
    if (type === 1) return node(ElInput, {type: 'textarea', rows: 3, clearable: true})

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