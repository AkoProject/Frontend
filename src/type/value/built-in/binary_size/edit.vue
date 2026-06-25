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
const rangeList = units.map((_, i) => i == 0 ? 1 : binary ** i)
console.log(rangeList)

function findRange(num: number) {
    let e = 0
    let a = 1
    for (let i = 0; i < rangeList.length - 1; i++) {
        const it = rangeList[i]
        if (num % it === 0) {
            e = i
            a = it
        }
    }
    return {index: e, unit: a}
}

const value = ref<number>(Number(model.value) ?? 0)
const unit = ref<number>(0)

function changeUnit(value: number, newUnit: number, oldUnit: number) {
    let now = value * Math.pow(binary, oldUnit)
    now = now / Math.pow(binary, newUnit)
    if (now < 1) now = 1
    return now
}

unit.value = findRange(value.value).index
value.value = changeUnit(value.value, unit.value, 0)

watch(value, () => model.value = (value.value * Math.pow(binary, unit.value)).toString())
watch(unit, (n, o) => value.value = changeUnit(value.value, n, o))

</script>