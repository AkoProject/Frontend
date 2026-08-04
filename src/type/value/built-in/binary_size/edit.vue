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
const rangeList = units.map((_, i) => i == 0 ? 1n : binary ** BigInt(i))

function findRange(num: bigint) {
    let e = 0
    let a = 1n
    for (let i = 0; i < rangeList.length; i++) {
        const it = rangeList[i]
        if (num % it === 0n) {
            e = i
            a = it
        }
    }
    return {index: e, unit: a}
}

const value = ref<string>(safeStr(model.value, true))
const unit = ref<number>(0)

function changeUnit(value: bigint, newUnit: number, oldUnit: number): bigint {
    let now = value * (binary ** BigInt(oldUnit))
    now = now / (binary ** BigInt(newUnit))
    if (now < 1) now = 1n
    return now
}

unit.value = findRange(safeBigInt(value.value)).index
value.value = value.value ? changeUnit(safeBigInt(value.value), unit.value, 0).toString() : undefined

watch(value, () => model.value = (safeBigInt(value.value) * (binary ** BigInt(unit.value))).toString())
watch(unit, (n, o) => value.value = String(changeUnit(safeBigInt(value.value), n, o)))

</script>