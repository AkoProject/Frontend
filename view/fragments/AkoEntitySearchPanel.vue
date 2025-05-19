<template>
    <div class="form">
        <el-form inline label-width="auto" label-position="left">
            <el-form-item v-for="field in fields" :label="field.name">
                <component :is="renderColumn(field)"/>
            </el-form-item>
        </el-form>
    </div>
    <div class="btn">
        <template v-for="button in model.modelButtons">
            <el-popconfirm v-if="button.reconfirm" :title="button.reconfirm" @confirm="callModelButton(button)">
                <template #reference>
                    <el-button :type="button.type">{{ button.name }}</el-button>
                </template>
            </el-popconfirm>
            <el-button v-else :type="button.type" @click="callModelButton(button)">{{ button.name }}</el-button>
        </template>
    </div>
</template>

<script setup lang="ts">
import DbModel from "../../src/type/DbModel.ts";
import DbField from "../../src/type/DbField.ts";
import {createVNode, inject, VNode, watch} from "vue";
import H10 from "../components/h10.vue";
import {AkoApiSymbol, AkoSymbol} from "../../src/ako.ts";
import ModelButton from "../../src/type/ModelButton.ts";

const api = inject(AkoApiSymbol)

const singleSelect = defineModel<any>('single', {required: true})
const multiSelect = defineModel<any[]>('multi', {required: true})

const ako = inject(AkoSymbol)

const props = defineProps<{
    model: DbModel,
    searchFun: () => Promise<void>,
    viewMode: 'manager' | 'search',
    editFun: (entity: {}) => void
}>()

const searchData = defineModel<{}>()

const model = props.model
const fields = model.fields.filter(it => !it.searchIgnore)

async function modelButton(button: ModelButton) {
    window.open(button.url.replace('$id', singleSelect.value.id))
}


function renderColumn(field: DbField): () => VNode[] {
    return () => field.searchEntry.map(it => {
        const [component, opt, placeholder, width] = it.split("|")
        const paramName = opt == "eq" ? field.id : field.id + "_" + opt
        return createVNode(
            ako.findComponent(component),
            {
                model: model,
                field: field,
                placeholder: placeholder,
                width: width,
                searchData: searchData.value,
                modelValue: searchData.value[paramName],
                'onUpdate:modelValue': (value) => searchData.value[paramName] = value
            }
        )
    })
}

async function callModelButton(button: ModelButton) {
    const fun =  eval("async(single,multi,props) => {" + button.eval + "}")
    await fun(singleSelect.value, multiSelect.value, {
        model: props.model,
        search: props.searchFun,
        edit: props.editFun
    })
}
</script>

<style scoped>
.form {
    max-height: 100px;
    overflow-y: auto;
    transition-duration: 0.8s;
}

.form:hover {
    max-height: 600px;
    transition-duration: 1.5s;
}
.btn{
    margin-top: -2px;
}
</style>