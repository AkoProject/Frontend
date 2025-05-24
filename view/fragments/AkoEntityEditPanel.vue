<template>
    <el-form label-width="120px" style="width: 580px" ref="form" :model="data">
        <template v-for="field in fields">
            <component
                v-if="field.edit"
                :is="ako.findComponent(field.edit.component)"
                :model="model"
                :field="field"
                :edit="field.edit"
                :mappings="mappings"
                :entities="entities"
                :data="data"
                v-model="data[field.id]"
            />
        </template>

        <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="ElMessageBox.close()">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import {ElMessageBox, ElForm} from "element-plus";
import DbModel from "../../src/type/DbModel.ts";
import {inject, ref, useTemplateRef} from "vue";
import {AkoSymbol} from "../../src/ako.ts";

const props = defineProps<{
    model: DbModel,
    data: {}
    saveOne: (data: {}) => Promise<void>,
    entities: [],
    mappings: []
}>()

const ako = inject(AkoSymbol)

const model = props.model
const fields = model.fields
const data = ref(props.data)

const form = useTemplateRef<InstanceType<typeof ElForm>>('form')

async function save() {
    await form.value.validate()
    await props.saveOne(data.value)
    ElMessageBox.close()
}

</script>

<style scoped>

</style>