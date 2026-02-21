<template>
    <el-form-item
        :label="field.name"
        :rules="rules"
        :prop="field.id"
        :style="field.description ? 'margin-bottom: 8px' : ''"
    >
        <div class="wFull">
            <div>
                <component
                    :is="ako.findComponent(edit.inputComponent)"
                    :model="model"
                    :field="field"
                    :page="page"
                    :data="data"
                    v-model="modelValue"
                />
            </div>
            <div class="fs-12 col-999 mg-t2 lh-14" v-if="field.description">{{ field.description }}</div>
        </div>
    </el-form-item>
</template>

<script setup lang="ts">
import {inject} from "vue";
import {AkoSymbol} from "../../src/ako.ts";
import {SearchModel} from "../../src/type/model/search/SearchModel.ts";
import {SearchField} from "../../src/type/model/search/SearchField.ts";
import {EditModel} from "../../src/type/model/edit/EditModel.ts";
import {EditField} from "../../src/type/model/edit/EditField.ts";
import {EditInfo} from "../../src/type/model/edit/EditInfo.ts";
import {ModelPage} from "../../src/type/resp/ModelPage.ts";
import axios from "axios";

const ako = inject(AkoSymbol)
const modelValue = defineModel()

const props = defineProps<{
    model: EditModel,
    field: EditField,
    edit: EditInfo,
    page: ModelPage,
    data: {},
}>()
const edit = props.field.edit

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
</script>