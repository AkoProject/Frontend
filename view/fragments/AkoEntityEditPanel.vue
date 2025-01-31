<template>
    <el-form label-width="120px" style="width: 580px">
        <el-form-item v-for="field in fields" :label="field.name">
            <component :is="renderColumn(field)"/>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="ElMessageBox.close()">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import {ElMessageBox} from "element-plus";
import DbModel from "../../src/type/DbModel.ts";
import {createVNode, inject, ref, VNode} from "vue";
import DbField from "../../src/type/DbField.ts";
import {AkoSymbol} from "../../src/ako.ts";

const props = defineProps<{
    model: DbModel,
    data: {}
    saveOne: (data: {}) => Promise<void>,
    entities: [],
    mappings: []
}>()

const ako = inject(AkoSymbol)

const model = props.model
const fields = model.fields.filter(it => !it.editIgnore)
const data = ref(props.data)

function renderColumn(field: DbField) {
    return () => createVNode(
        ako.findComponent(field.editNode),
        {
            model: model,
            field: field,
            data: data.value,
            modelValue: data.value[field.id],
            entities: props.entities,
            mappings: props.mappings,
            'onUpdate:modelValue': (value) => data.value[field.id] = value
        }
    )
}

function save() {
    props.saveOne(data.value)
    ElMessageBox.close()
}

</script>

<style scoped>

</style>