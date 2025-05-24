<template>
    <div class="form">
        <el-form inline label-width="auto" label-position="left">
            <template v-for="field in fields">
                <component
                    v-if="field.search"
                    :is="ako.findComponent(field.search.component)"
                    :model="model"
                    :field="field"
                    v-model="searchData"
                />
            </template>
        </el-form>
    </div>
    <div class="btn">
        <template v-if="viewMode == 'search'">
            <el-button type="primary" @click="searchFun">查询</el-button>
        </template>
        <template v-else v-for="button in model.modelButtons">
            <el-popconfirm v-if="button.reconfirm" :title="button.reconfirm" @confirm="callButton(button)">
                <template #reference>
                    <el-button :type="button.type">{{ button.name }}</el-button>
                </template>
            </el-popconfirm>
            <el-button v-else :type="button.type" @click="callButton(button)">{{ button.name }}</el-button>
        </template>
    </div>
</template>

<script setup lang="ts">
import DbModel from "../../src/type/DbModel.ts";
import DbField from "../../src/type/DbField.ts";
import {createVNode, inject, VNode, watch} from "vue";
import H10 from "../components/h10.vue";
import {AkoApiSymbol, AkoSymbol} from "../../src/ako.ts";
import ButtonEntry from "../../src/type/ButtonEntry.ts";
import {dialog} from "../../src/fun/dialog.ts";

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
const fields = model.fields

async function modelButton(button: ButtonEntry) {
    window.open(button.url.replace('$id', singleSelect.value.id))
}


// function renderColumn(field: DbField): () => VNode[] {
//     return () => field.searchEntry.map(it => {
//         const [component, opt, placeholder, width] = it.split("|")
//         const paramName = opt == "eq" ? field.id : field.id + "_" + opt
//         return createVNode(
//             ako.findComponent(component),
//             {
//                 model: model,
//                 field: field,
//                 placeholder: placeholder,
//                 width: width,
//                 searchData: searchData.value,
//                 modelValue: searchData.value[paramName],
//                 'onUpdate:modelValue': (value) => searchData.value[paramName] = value
//             }
//         )
//     })
// }

async function callButton(button: ButtonEntry) {
    const fun = eval("async(single,multi,props) => {" + button.eval + "}")
    await fun(singleSelect.value, multiSelect.value, {
        model: props.model,
        search: props.searchFun,
        edit: props.editFun,
        api: api,
        dialog: dialog,
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

.btn {
    margin-top: -2px;
}
</style>