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
import {DbModel} from "../../src/type/DbModel.ts";
import {inject, ref} from "vue";
import {AkoSymbol} from "../../src/ako.ts";
import {ButtonEntry} from "../../src/type/ButtonEntry.ts";
import {ProButton, toProButton} from "../../src/fun/ProButton.ts";

const ako = inject(AkoSymbol)

const singleSelect = defineModel<any>('single', {required: true})
const multiSelect = defineModel<any[]>('multi', {required: true})

const props = defineProps<{
    model: DbModel,
    searchFun: () => Promise<void>,
    viewMode: 'manager' | 'search',
    editFun: (entity: {}) => void
}>()


const searchData = defineModel<{}>()

const model = props.model
const fields = model.fields
const buttons = ref(props.model.modelButtons.map(it => toProButton(it, ako, model, props.searchFun, props.editFun)))

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


async function callButton(button: ProButton) {
    button.loading = true
    try {
        await button.execute(singleSelect.value, multiSelect.value)
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