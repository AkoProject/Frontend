<template>
    <div class="form">
        <el-form inline label-width="auto" label-position="left">
            <el-form-item v-for="field in fields" :label="field.name">
                <component :is="renderColumn(field)"/>
            </el-form-item>
        </el-form>
    </div>
    <div class="btn">
        <el-button type="primary" @click="props.searchFun()">查询</el-button>
        <el-button v-if="props.viewMode != 'search'" @click="editFun({})">新增</el-button>
        <el-button type="danger" @click="multiDelete">批量删除</el-button>
    </div>
</template>

<script setup lang="ts">
import DbModel from "../../src/type/DbModel.ts";
import DbField from "../../src/type/DbField.ts";
import {createVNode, inject, VNode, watch} from "vue";
import H10 from "../components/h10.vue";
import {AkoApiSymbol, AkoSymbol} from "../../src/ako.ts";

const api = inject(AkoApiSymbol)

const singleSelect = defineModel<any>('single', {required: true})
const multiSelect = defineModel<any[]>('multi', {required: true})

const ako = inject(AkoSymbol)

const props = defineProps<{
    model: DbModel,
    searchFun: () => Promise<void>,
    viewMode: 'manager' | 'search',
    editFun: (entity: {}) => void
}>()

const searchData = defineModel<{}>()

const model = props.model
const fields = model.fields.filter(it => !it.searchIgnore)


function renderColumn(field: DbField): () => VNode[] {
    return () => field.searchEntry.map(it => {
        const [component, opt, placeholder, width] = it.split("|")
        const paramName = opt == "eq" ? field.id : field.id + "_" + opt
        return createVNode(
            ako.findComponent(component),
            {
                model: model,
                field: field,
                placeholder: placeholder,
                width: width,
                searchData: searchData.value,
                modelValue: searchData.value[paramName],
                'onUpdate:modelValue': (value) => searchData.value[paramName] = value
            }
        )
    })
}

async function multiDelete() {
    await api.model.delete(props.model.id, multiSelect.value.map(it => it.id))
    await props.searchFun()
}
</script>

<style scoped>
.form {
    max-height: 100px;
    overflow-y: auto;
    transition-duration: 0.8s;
}

.form:hover {
    max-height: 600px;
    transition-duration: 1.5s;
}
.btn{
    margin-top: -2px;
}
</style>