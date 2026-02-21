<template>
    <el-form-item :label="field.name">
        <component
            v-for="entry in field.search.entries"
            :is="ako.findComponent(entry.component)"
            :model="model"
            :field="field"
            :width="entry.width"
            :searchData="data"
            :entry="entry"
            v-model="data[searchKey(entry.opt)]"
        />
    </el-form-item>
</template>

<script setup lang="ts">
import {inject} from "vue";
import {AkoSymbol} from "../../src/ako.ts";
import {SearchModel} from "../../src/type/model/search/SearchModel.ts";
import {SearchField} from "../../src/type/model/search/SearchField.ts";

const ako = inject(AkoSymbol)

const props = defineProps<{ model: SearchModel, field: SearchField }>()
const data = defineModel({required: true})

function searchKey(opt: string) {
    if (opt == 'eq') return props.field.id
    return `${props.field.id}_${opt}`
}
</script>