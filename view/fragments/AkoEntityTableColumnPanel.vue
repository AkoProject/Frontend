<template>
    <component
        v-if="data != undefined"
        :is="view"
        :model="model"
        :field="field"
        :row="row"
        :data="data"
        :page="page"
        :options="options"
        :information="page.information[field.type]"
    />
    <span v-else class="col-999">null</span>
</template>

<script setup lang="ts">
import {createVNode, inject} from "vue";
import {TableModel} from "../../src/type/model/table/TableModel.ts";
import {TableField} from "../../src/type/model/table/TableField.ts";
import {AkoSymbol} from "../../src/ako.ts";
import {ModelPage} from "../../src/type/resp/ModelPage.ts";

const ako = inject(AkoSymbol)
const props = defineProps<{ model: TableModel, field: TableField, row: any, data: any, page: ModelPage}>()

const data = props.data
const field = props.field
const type = props.field.type
const options = props.field.options

const view = ako.findTypeProvider(type)?.table ?? (() => createVNode('span', null, `无法定位 TypeProvider: ${type}。`))
</script>