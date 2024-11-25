<template>
    <el-button type="primary" @click="props.searchFun()">查询</el-button>
    <el-button v-if="props.viewMode != 'search'" @click="editFun({})">新增</el-button>
    <h10/>
    <div class="h100" style="overflow-y: auto">
        <el-form inline label-width="auto" label-position="left">
            <el-form-item v-for="field in fields" :label="field.name">
                <component :is="renderColumn(field)"/>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import DbModel from "../../src/type/DbModel.ts";
import DbField from "../../src/type/DbField.ts";
import {createVNode, inject, VNode} from "vue";
import H10 from "../components/h10.vue";
import {AkoSymbol} from "../../src/ako.ts";

const ako = inject(AkoSymbol)

const props = defineProps<{
    model: DbModel,
    searchFun: () => void,
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
</script>

<style scoped>

</style>