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
        <template v-else v-for="button in buttons">
            <component
                v-if="button.component"
                v-loading="button.loading"
                :is="ako.findComponent(button.component)"
                :model="model"
                :searchData="searchData"
                :single="singleSelect"
                :multi="multiSelect"
                @search="searchFun"
                @edit="editFun"
            />
            <el-popconfirm
                v-else-if="button.reconfirm"
                :title="button.reconfirm"
                @confirm="callButton(button)"
            >
                <template #reference>
                    <el-button :type="button.type" :loading="button.loading">{{ button.name }}</el-button>
                </template>
            </el-popconfirm>
            <el-button v-else :type="button.type" @click="callButton(button)" :loading="button.loading">
                {{ button.name }}
            </el-button>
        </template>
    </div>
</template>

<script setup lang="ts">
import DbModel from "../../src/type/DbModel.ts";
import DbField from "../../src/type/DbField.ts";
import {createVNode, inject, ref, VNode, watch} from "vue";
import H10 from "../components/h10.vue";
import {AkoApiSymbol, AkoSymbol} from "../../src/ako.ts";
import ButtonEntry from "../../src/type/ButtonEntry.ts";
import {dialog} from "../../src/fun/dialog.ts";
import axios from "axios";
import {ElMessage} from "element-plus";

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

const buttons = ref(props.model.modelButtons.map(it => toProButton(it)))

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

interface ProButton extends ButtonEntry {
    loading: boolean
    execute: () => Promise<void>
}

function toProButton(button: ButtonEntry): ProButton {
    let execute
    if (button.url) {
        const mustSingle = button.url.indexOf('${id}') > 0
        const mustMulti = button.url.indexOf('${ids}') > 0
        execute = async () => {
            if (mustMulti && !multiSelect.value.length) {
                ElMessage.error('请至少勾选一条记录！')
                return
            }
            if (mustSingle && !singleSelect.value) {
                ElMessage.error('请单选选中一条记录！')
                return
            }

            let eu = button.url.replace('${ids}', multiSelect.value.map(it => it.id).join(','))
            if (singleSelect.value) eu = eu.replace('${id}', singleSelect.value.id)

            if (button.method == "popup") {
                window.open(eu)
                return
            }
            const result = axios.request({url: eu, method: button.method})

            const data = (await result).data
            const code = data?.code ?? 0
            const message = data?.message ?? code == 0 ? '操作成功！' : '操作失败！'
            if (code == 0) ElMessage.success(message)
            else ElMessage.error(message)
        }
    }
    if (button.eval) {
        const fun = eval("async(single,multi,props) => {" + button.eval + "}")
        execute = async () => await fun(singleSelect.value, multiSelect.value, {
            model: props.model,
            search: props.searchFun,
            edit: props.editFun,
            api: api,
            dialog: dialog,
        })
    }
    return {
        ...button,
        loading: false,
        execute: execute
    }
}

async function callButton(button: ProButton) {
    button.loading = true
    try {
        await button.execute()
    } finally {
        button.loading = false
    }
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