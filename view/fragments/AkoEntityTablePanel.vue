<template>
    <el-table
        :data="prop.entities"
        stripe
        highlight-current-row
        style="width: 100%"
        @current-change="(e) => singleSelect = e"
        @selectionChange="(e) => multiSelect = e"
        @sort-change="handleSortChange"
    >
        <el-table-column type="selection" width="55"/>
        <el-table-column
            v-for="it in prop.model.fields"
            :prop="it.id"
            :label="it.name"
            show-overflow-tooltip
            sortable="custom"
            :min-width="it.columnWidth"
        >
            <template #default="scope">
                <component :is="renderColumn(it,scope.row)"/>
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
                    <el-popconfirm
                        v-if="button.reconfirm"
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
import DbModel from "../../src/type/DbModel.ts";
import DbField from "../../src/type/DbField.ts";
import {createVNode, inject, ref, watch} from "vue";
import {AkoApiSymbol, AkoSymbol} from "../../src/ako.ts";
import ButtonEntry from "../../src/type/ButtonEntry.ts";

const ako = inject(AkoSymbol)
const api = inject(AkoApiSymbol)

const singleSelect = defineModel<any>('single', {required: true})
const multiSelect = defineModel<any[]>('multi', {required: true})

const orderData = defineModel<any>({required: true})

function handleSortChange(data: { column: any, prop: any, order: 'ascending' | 'descending' | null }) {
    if (data.order == 'ascending') orderData.value[data.prop] = 'asc'
    else if (data.order == 'descending') orderData.value[data.prop] = 'desc'
    else delete orderData.value[data.prop]

    console.log(orderData.value)
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

function renderColumn(field: DbField, data: any) {
    return () => createVNode(
        ako.findComponent(field.tableNode),
        {
            model: prop.model,
            field: field,
            row: data,
            data: data[field.id],
            mappings: prop.mappings
        }
    )
}

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