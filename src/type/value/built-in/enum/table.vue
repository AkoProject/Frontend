<template>
    <span>{{ label }}</span>
</template>

<script setup lang="ts">
import {EnumOptions} from "./options.ts";
import {computed} from "vue";

const {options, data, row} = defineProps<{ options: EnumOptions, data: any, row: {} }>()
const cascadeValue = computed(() => options.cascader ? row?.[options.cascader] : '__blank__')
const cascadeElements = computed(() => options.values?.[cascadeValue.value] ?? [])
const flag = computed(() => (typeof data == "boolean" ? Number(data) : data).toString())
const label = computed(() => cascadeElements.value.find(it => it.value === flag.value)?.label ?? data)
</script>