<template>
    <el-form label-width="120px" style="width: 580px" ref="form" :model="data">
        <template v-for="field in fields">
            <component
                v-if="field.edit"
                :is="ako.findComponent(field.edit.propertyComponent)"
                :model="model"
                :field="field"
                :edit="field.edit"
                :page="page"
                :data="data"
                v-model="data[field.id]"
            />
        </template>

        <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="emits('close')">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import {ElMessageBox, ElForm} from "element-plus";
import {inject, ref, useTemplateRef} from "vue";
import {AkoSymbol} from "../../src/ako.ts";
import {EditModel} from "../../src/type/model/edit/EditModel.ts";
import {ModelPage} from "../../src/type/resp/ModelPage.ts";

const emits = defineEmits(['close'])

const props = defineProps<{
    model: EditModel,
    data: {}
    save: (data: {}) => Promise<void>,
    page: ModelPage,
}>()

const ako = inject(AkoSymbol)

const model = props.model
const fields = model.fields
const data = ref(props.data)

const form = useTemplateRef<InstanceType<typeof ElForm>>('form')

async function save() {
    await form.value.validate()
    await props.save(data.value)
    emits('close')
}

</script>

<style scoped>

</style>