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
import {safeBigInt, safeStr} from "../../../../fun/num.ts";

defineProps<{ field: BaseField, entry?: SearchEntry }>()

const model = defineModel()
const value = ref<string>(safeStr(model.value, true))
const unit = ref<number>(0)

const calcValue = () => model.value = safeStr(value.value, true) != undefined ? (safeBigInt(value.value) * (binary ** BigInt(unit.value))).toString() : undefined
watch(value, calcValue)
watch(unit, calcValue)

</script>