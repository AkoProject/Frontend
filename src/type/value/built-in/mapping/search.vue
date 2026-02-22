<template>
    <el-input clearable :disabled="!cascader" :model-value="input" @clear="model = input = ''">
        <template #append>
            <el-button icon="search" :disabled="!cascader" @click="openDialog"/>
        </template>
    </el-input>
</template>

<script setup lang="ts">
import {computed, inject, ref} from "vue";
import {MappingOptions} from "./options.ts";
import {dialog} from "../../../../fun/dialog.ts";
import {AkoSymbol} from "../../../../ako.ts";

const {options, information} = defineProps<{ options: MappingOptions, information?: Record<string, any[]>, data: {} }>()
const cascader = computed(() => options.cascader ?? '__blank__')
const mapping = computed(() => options.values[options.cascader ?? '__blank__'])

const model = defineModel()
const input = ref(information?.[mapping.value.model]?.find(it => it[mapping.value.field] == model.value)?.[mapping.value.display])

const ako = inject(AkoSymbol)

function openDialog() {
    const d = dialog({
        style: {'min-width': '1400px', height: 'calc(100% - 200px)'},
        content: () => ako.createEntityView(ako.models.find(it => it.id == mapping.value.model), data => {
            input.value = data[mapping.value.field] + ':' + data[mapping.value.display]
            model.value = data[mapping.value.field]
            d.close()
        })
    })
}
</script>