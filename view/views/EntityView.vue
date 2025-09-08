<template>
    <div class="hFull" style="overflow:hidden;">
        <panel class="searchPanel">
            <component
                :is="ako.findComponent(props.searchNode)"
                v-bind="subNodeProps"
                v-model="searchData"
                v-model:single="singleSelect"
                v-model:multi="multiSelect"
            />
        </panel>
        <h20/>
        <panel style="height: calc(100% - 170px)">
            <component
                :is="ako.findComponent(props.tableNode)"
                v-bind="subNodeProps"
                v-model="orderData"
                :entities="entityList"
                :mappings="mappings"
                v-model:single="singleSelect"
                v-model:multi="multiSelect"
                style="height: calc(100% - 50px);"
            />
            <el-pagination
                class="pd-t5"
                style="float: right"
                v-model:current-page="pid"
                v-model:page-size="size"
                layout="total, sizes, prev, pager, next"
                :total="entityNum"
                :page-sizes="[10, 20, 50, 100]"
            />
        </panel>
    </div>
</template>

<script setup lang="ts">
import H20 from "../components/h20.vue";
import {DbModel} from "../../src/type/DbModel.ts";
import {createVNode, inject, onMounted, ref, watch} from "vue";
import Panel from "../components/Panel.vue";
import {AkoApiSymbol, AkoSymbol} from "../../src/ako.ts";
import {dialog} from "../../src/fun/dialog.ts";
import {EditModel} from "../../src/type/model/edit/EditModel.ts";

const ako = inject(AkoSymbol)
const api = inject(AkoApiSymbol)

const props = defineProps<{
    model: DbModel,
    tableNode: any,
    searchNode: any,
    editNode: any,
    selectFun?: (data: {}) => any,
}>()

const viewMode = !props.selectFun ? 'manager' : 'search'


const pid = ref(1)
const size = ref(20)

const searchData = ref({})
const orderData = ref({})
const singleSelect = ref()
const multiSelect = ref([])

const entityNum = ref(0)
const entityList = ref([])
const mappings = ref()

const subNodeProps = {
    model: props.model,
    editFun: openEditPanel,
    searchFun: search,
    selectFun: props.selectFun,
    saveOne: save,
    deleteOne: deleteOne,
    viewMode: viewMode
}

function openEditPanel(data: {}, options: { width?: string, title?: string, model?: EditModel } = {}) {
    console.log(data)
    const model = options.model ?? props.model
    dialog({
        title: options.title ?? data['id'] ? '编辑' : '新增',
        style: {'width': options.width ?? '640px'},
        content: ako.createEditView(model, data, save, mappings.value)
    })
}

async function search() {
    const data = {}
    Object.keys(searchData.value)
        .filter(key => searchData.value[key] !== '' && searchData.value[key] != null && searchData.value[key] != undefined)
        .forEach(key => data[key] = searchData.value[key])

    const resp = await api.model.page(props.model.id, data, orderData.value, pid.value, size.value)
    entityNum.value = resp.total
    entityList.value = resp.entities
    mappings.value = resp.mappings
}

async function save(data: {}) {
    Object.keys(data).forEach(key => {
        if (data[key] === '') data[key] = null
    })
    await api.model.save(props.model.id, data)
    await search()
}

async function deleteOne(id: number) {
    await api.model.delete(props.model.id, [id])
    await search()
}

watch([pid, size], async () => await search())
watch(orderData, async () => await search(), {deep: true})
onMounted(async () => await search())

</script>

<style scoped>
.searchPanel {
    min-height: 150px;
}

</style>