<template>
    <el-form-item :label="field.name">
        <component
            v-for="entry in field.search.entries"
            :is="ako.findComponent(entry.component)"
            :model="model"
            :field="field"
            :placeholder="entry.placeholder"
            :width="entry.width"
            :searchData="data"
            v-model="data[`${field.id}_${entry.opt}`]"
        />
    </el-form-item>
</template>

<script setup lang="ts">
import {DbModel} from"../../src/type/DbModel.ts";
import {DbField} from "../../src/type/DbField.ts";
import {inject} from "vue";
import {AkoSymbol} from "../../src/ako.ts";

const ako = inject(AkoSymbol)

defineProps<{ model: DbModel, field: DbField }>()
const data = defineModel({required: true})
</script>