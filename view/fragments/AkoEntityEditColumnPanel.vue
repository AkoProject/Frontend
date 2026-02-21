<template>
    <component
        :is="view"
        :model="model"
        :field="field"
        :page="page"
        :data="data"
        :options="options"
        v-model="modelValue"
    />
</template>

<script setup lang="ts">
import {createVNode, inject} from "vue";
import {AkoSymbol} from "../../src/ako.ts";
import {ModelPage} from "../../src/type/resp/ModelPage.ts";
import {EditModel} from "../../src/type/model/edit/EditModel.ts";
import {EditField} from "../../src/type/model/edit/EditField.ts";
import {EditInfo} from "../../src/type/model/edit/EditInfo.ts";
import axios from "axios";

const ako = inject(AkoSymbol)
const props = defineProps<{
    model: EditModel,
    field: EditField,
    edit: EditInfo,
    page: ModelPage,
    data: {},
}>()

const modelValue = defineModel()

const field = props.field
const type = props.field.type
const options = props.field.options

const view = ako.findTypeProvider(type)?.edit ?? (() => createVNode('span', null, `无法定位 TypeProvider: ${type}。`))
</script>