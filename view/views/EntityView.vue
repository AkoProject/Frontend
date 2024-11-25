<template>
    <div class="hFull">
        <panel class="h150">
            <component :is="searchNode"/>
        </panel>
        <h20/>
        <panel style="height: calc(100% - 170px)">
            <component :is="tableNode" style="height: calc(100% - 50px);"/>
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
import DbModel from "../../src/type/DbModel.ts";
import {createVNode, inject, onMounted, ref, watch} from "vue";
import Panel from "../components/Panel.vue";
import {AkoApiSymbol, AkoSymbol} from "../../src/ako.ts";
import {ElMessageBox} from "element-plus";

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

const subNodeProps = {
    model: props.model,
    editFun: openEditPanel,
    searchFun: search,
    selectFun: props.selectFun,
    saveOne: save,
    deleteOne: deleteOne,
    viewMode: viewMode
}

const pid = ref(1)
const size = ref(20)

const searchData = ref({})
const orderData = ref({})
const entityNum = ref(0)
const entityList = ref([])
const mappings = ref()

const searchNode = createVNode(ako.findComponent(props.searchNode), {
    modelValue: searchData.value,
    'onUpdate:modelValue': (value) => searchData.value = value,
    ...subNodeProps
})
const tableNode = () => createVNode(ako.findComponent(props.tableNode), {
    modelValue: orderData.value,
    entities: entityList.value,
    mappings: mappings.value,
    ...subNodeProps
})

function openEditPanel(data: {}) {
    console.log(data)
    ElMessageBox({
        title: '编辑',
        customStyle: {'min-width': '640px'},
        message: createVNode(ako.findComponent(props.editNode), {
            data: data,
            entities: entityList.value,
            mappings: mappings.value,
            ...subNodeProps
        }),
        showCancelButton: false,
        showConfirmButton: false
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
    await api.model.delete(props.model.id, id)
    await search()
}

watch([pid, size], async () => await search())
watch(orderData, async () => await search(), {deep: true})
onMounted(async () => await search())

</script>

<style scoped>

</style>