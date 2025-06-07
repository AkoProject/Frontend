<template>
    <el-table
        :data="tableData"
        stripe
        highlight-current-row
        style="width: 100%"
        @current-change="(e) => singleSelect = e"
        @selectionChange="(e) => multiSelect = e"
        @sort-change="handleSortChange"
    >
        <el-table-column type="selection" width="55"/>
        <el-table-column
            v-for="field in fields"
            :key="field.id"
            :prop="field.id"
            :label="field.name"
            show-overflow-tooltip
            sortable="custom"
            :min-width="field.column.width"
        >
            <template #default="scope">
                <component
                    :is="ako.findComponent(field.column.component)"
                    :model="model"
                    :field="field"
                    :mappings="mappings"
                    :entities="entities"
                    :row="scope.row"
                    :data="scope.row[field.id]"
                />
            </template>
        </el-table-column>

        <el-table-column v-if="prop.viewMode === 'search'" fixed="right" label="操作" min-width="50">
            <template #default="scope">
                <el-button link type="primary" size="small" @click="prop.selectFun(scope.row)">选择</el-button>
            </template>
        </el-table-column>
        <el-table-column v-else-if="model.operateButtons.length" fixed="right" label="操作" min-width="100">
            <template #default="scope">
                <template v-for="button in model.operateButtons">
                    <component
                        v-if="button.component"
                        :is="ako.findComponent(button.component)"
                        :model="model"
                        :mappings="mappings"
                        :entities="entities"
                        :row="scope.row"
                        @search="searchFun"
                        @edit="editFun"
                    />
                    <el-popconfirm
                        v-else-if="button.reconfirm"
                        :title="button.reconfirm"
                        @confirm="callButton(button, scope.row)"
                    >
                        <template #reference>
                            <el-button link :type="button.type" size="small">{{ button.name }}</el-button>
                        </template>
                    </el-popconfirm>
                    <el-button v-else link :type="button.type" size="small" @click="callButton(button, scope.row)">
                        {{ button.name }}
                    </el-button>
                </template>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="tsx">
import {DbModel} from"../../src/type/DbModel.ts";
import {DbField} from "../../src/type/DbField.ts";
import {createVNode, inject, nextTick, ref, watch} from "vue";
import {AkoApiSymbol, AkoSymbol} from "../../src/ako.ts";
import {ButtonEntry} from "../../src/type/ButtonEntry.ts";

const ako = inject(AkoSymbol)
const api = inject(AkoApiSymbol)

const singleSelect = defineModel<any>('single', {required: true})
const multiSelect = defineModel<any[]>('multi', {required: true})

const orderData = defineModel<any>({required: true})

function handleSortChange(data: { column: any, prop: any, order: 'ascending' | 'descending' | null }) {
    if (data.order == 'ascending') orderData.value[data.prop] = 'asc'
    else if (data.order == 'descending') orderData.value[data.prop] = 'desc'
    else delete orderData.value[data.prop]
}

const prop = defineProps<{
    model: DbModel,
    entities: [],
    mappings: any,
    searchFun: () => Promise<any>,
    selectFun?: (data: {}) => any,
    editFun: (data: {}) => any,
    viewMode: "manager" | "search"
}>()

const tableData = ref<any[]>(prop.entities)
watch(() => prop.entities, value => {
    tableData.value = []
    nextTick(() => tableData.value = value)
})


const fields = prop.model.fields.filter(it => it.column)
fields.forEach((it, index) => {
    if (it.column.index == undefined) it.column.index = index
})

fields.sort((a, b) => a.column.index - b.column.index)

async function deleteEntry(id: number) {
    await api.model.delete(prop.model.id, [id])
    await prop.searchFun()
}

async function callButton(button: ButtonEntry, entity: {}) {
    const fun = eval("async(entity,props) => {" + button.eval + "}")
    await fun(entity, {
        model: prop.model,
        search: prop.searchFun,
        edit: prop.editFun
    })
}

</script>

<style scoped>

</style>