<template>
    <el-select clearable v-model="model" :disabled="!cascadeValue">
        <el-option v-for="option in cascadeElements" :key="option.value" :label="option.label" :value="option.value"/>
    </el-select>
</template>

<script setup lang="ts">
import {EnumOptions} from "./options.ts";
import {computed} from "vue";

const {options, data} = defineProps<{ options: EnumOptions, data?: {} }>()
const cascadeValue = computed(() => options.cascader ? data?.[options.cascader] : '__blank__')
const cascadeElements = computed(() => options.values?.[cascadeValue.value] ?? [])
const model = defineModel()
</script>