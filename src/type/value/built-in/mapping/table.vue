<template>
    <span>{{information[cascade?.model]?.find(it => it[cascade.field] == data)?.[cascade.display] ?? `未找到 ${cascade.model}: ${data}`}}</span>
</template>

<script setup lang="ts">
import {MappingOptions} from "./options.ts";
import {computed} from "vue";

const {options, row} = defineProps<{
    options: MappingOptions,
    information: Record<string, any[]>,
    row: {},
    data: any
}>()
const cascade = computed(() => options.values[options.cascader ? row[options.cascader] : '__blank__'])
</script>