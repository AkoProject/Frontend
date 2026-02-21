<template>
    <el-input v-model="model" clearable :placeholder="entry?.placeholder ?? field.name"/>
</template>

<script setup lang="ts">
import {SearchEntry} from "../../../model/search/SearchEntry.ts";
import {BaseField} from "../../../model/base/BaseField.ts";

defineProps<{field: BaseField, entry?: SearchEntry}>()
const model = defineModel()
</script>