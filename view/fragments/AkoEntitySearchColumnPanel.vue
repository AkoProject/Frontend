<template>
    <component
        :is="view"
        :model="model"
        :field="field"
        :entry="entry"
        :options="options"
        :placeholder="entry?.placeholder ?? field.name"
        :data="searchData"
        :style="{width: entry?.width}"
        v-model="modelValue"
    />
</template>

<script setup lang="ts">
import {createVNode, inject} from "vue";
import {AkoSymbol} from "../../src/ako.ts";
import {SearchModel} from "../../src/type/model/search/SearchModel.ts";
import {SearchField} from "../../src/type/model/search/SearchField.ts";
import {SearchEntry} from "../../src/type/model/search/SearchEntry.ts";

const ako = inject(AkoSymbol)
const props = defineProps<{
    model: SearchModel,
    field: SearchField,
    entry: SearchEntry,
    width: string,
    searchData: {}
}>()
const modelValue = defineModel()

const field = props.field
const type = props.field.type
const options = props.field.options

const view = ako.findTypeProvider(type)?.search ?? (() => createVNode('span', null, `无法定位 TypeProvider: ${type}。`))
</script>