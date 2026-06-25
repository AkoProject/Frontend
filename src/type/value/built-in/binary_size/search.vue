<template>
    <el-input v-model="value" clearable :placeholder="entry?.placeholder ?? field.name">
        <template #append>
            <el-select v-model="unit" style="width: 80px">
                <el-option v-for="(it, i) in units" :value="i" :label="it"/>
            </el-select>
        </template>
    </el-input>
</template>

<script setup lang="ts">
import {SearchEntry} from "../../../model/search/SearchEntry.ts";
import {BaseField} from "../../../model/base/BaseField.ts";
import {binary, units} from "../../../../fun/binary.ts";
import {ref, watch} from "vue";

defineProps<{ field: BaseField, entry?: SearchEntry }>()

const model = defineModel()
const value = ref<number>(model.value != undefined ? Number(model.value) : undefined)
const unit = ref<number>(0)

watch(value, () => model.value = value.value != undefined ? (value.value * Math.pow(binary, unit.value)).toString() : undefined)

</script>