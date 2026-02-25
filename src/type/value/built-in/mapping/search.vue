<template>
    <el-input clearable :disabled="!disabled" :model-value="input" @clear="model = input = ''">
        <template #append>
            <el-button icon="search" :disabled="!disabled" @click="openDialog"/>
        </template>
    </el-input>
</template>

<script setup lang="ts">
import {computed, inject, ref} from "vue";
import {MappingOptions} from "./options.ts";
import {dialog} from "../../../../fun/dialog.ts";
import {AkoSymbol} from "../../../../ako.ts";

const {options, information, data} = defineProps<{
    options: MappingOptions,
    information?: Record<string, any[]>,
    data: {}
}>()
const mapping = computed(() => options.values[options.cascader ? data[options.cascader] : '__blank__'])
const disabled = computed(() => options.cascader != null && !!data[options.cascader])

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