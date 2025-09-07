<template>
    <el-input
        :disabled="disabled"
        clearable
        :model-value="inputValue"
        @clear="modelValue = inputValue = ''"
        :placeholder="field.name"
    >
        <template #append>
            <el-button icon="search" :disabled="disabled" @click="openDialog"/>
        </template>
    </el-input>
</template>

<script setup lang="ts">
import {inject, ref, VNode, watch} from "vue";
import {AkoSymbol} from "../../src/ako.ts";
import {enumMapOf} from "../../src/fun/enum.ts";
import {findEnumMappingEntity, findMappingEntity} from "../../src/fun/mappings.ts";
import {dialog} from "../../src/fun/dialog.ts";
import {EditModel} from "../../src/type/model/edit/EditModel.ts";
import {EditField} from "../../src/type/model/edit/EditField.ts";

const ako = inject(AkoSymbol)

const props = defineProps<{
    model: EditModel,
    field: EditField,
    data: {},
    mappings: []
}>()
const modelValue = defineModel<any>({required: true})

const field = props.field
const type = field.type
const subtype = field.subtype

const disabled = ref(!field.edit.editable || (subtype == 1 && (props.data[field.content] == null || props.data[field.content] == '')))

if (subtype == 1)
    watch(() => props.data[field.content], (value) => {
        disabled.value = !(value !== undefined && value !== null && value !== '');
        if (disabled.value) modelValue.value = inputValue.value = ''
    })


function makeInitInputValue() {
    if (modelValue.value == null || modelValue.value == "") return ""
    if (subtype == 1)
        if (props.data[field.content] == null || props.data[field.content] == "") return ""

    let initInputValue = modelValue.value.toString() + ":"

    if (subtype === 0) initInputValue += findMappingEntity(modelValue.value, field.content, props.mappings)
    if (subtype === 1) initInputValue += findEnumMappingEntity(modelValue.value, props.data[field.content], field.enum, props.mappings)

    return initInputValue
}

const inputValue = ref(makeInitInputValue())

function openDialog() {
    if (subtype == 0) ofDialog(field.content)

    if (subtype == 1) ofDialog(enumMapOf(field.enum, props.data[field.content]))
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