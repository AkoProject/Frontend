<template>
    <el-input
        :disabled="disabled"
        :style="{width: props.width}"
        clearable
        :model-value="inputValue"
        @clear="modelValue = inputValue = ''"
        :placeholder="props.placeholder"
    >
        <template #append>
            <el-button icon="search" :disabled="disabled" @click="openDialog"/>
        </template>
    </el-input>
</template>

<script setup lang="ts">
import {DbField} from "../../src/type/DbField.ts";
import {DbModel} from "../../src/type/DbModel.ts";
import {inject, ref, VNode, watch} from "vue";
import {AkoSymbol} from "../../src/ako.ts";
import {enumMapOf} from "../../src/fun/enum.ts";
import {dialog} from "../../src/fun/dialog.ts";

const ako = inject(AkoSymbol)

const props = defineProps<{ model: DbModel, field: DbField, placeholder: string, width: string, searchData: {} }>()
const modelValue = defineModel()

const field = props.field
const type = field.type
const subtype = field.subtype

const disabled = ref(subtype == 1)

if (subtype == 1)
    watch(() => props.searchData[field.content], (value) => {
        disabled.value = !(value !== undefined && value !== null && value !== '');
        if (disabled.value) modelValue.value = inputValue.value = ''
    })

const inputValue = ref('')

function openDialog() {
    if (subtype == 0) ofDialog(field.content)

    if (subtype == 1) ofDialog(enumMapOf(field.enum, props.searchData[field.content]))
}

function ofDialog(content: string) {
    const [mappingModelId, mappingFieldId, mappingDisplayId] = content.split('|')
    const mappingModel = ako.models.find(model => model.id === mappingModelId)
    const d = dialog({
        style: {'min-width': '1400px', height: 'calc(100% - 200px)'},
        content: () => ako.createEntityView(mappingModel, data => {
            inputValue.value = data[mappingFieldId] + ':' + data[mappingDisplayId]
            modelValue.value = data[mappingFieldId]
            d.close()
        })
    })
}

</script>

<style scoped>

</style>