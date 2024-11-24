<template>
    <el-container class="hFull">
        <el-aside width="180px" class="hFull menu">
            <div class="logo">
                <el-image src="/assets/logo.png" style="height: 40px"></el-image>
            </div>
            <component :is="elMenu"/>
        </el-aside>
        <el-main style="padding: 0">

            <div class="body">
                <div class="tab">
                    <el-space>
                        <ako-tab-button
                            v-for="item in openMenus"
                            :name="item.name"
                            :is-selected="currentSelect === item"
                            :closeable="item.closeable"
                            @click="clickTab(item)"
                            @close="closeTab(item)"
                        />
                    </el-space>

                </div>
                <h20/>
                <div class="page">
                    <component v-for="item in openMenus" :is="item.page" v-show="currentSelect === item"/>
                </div>
            </div>
        </el-main>
    </el-container>
    <dialog-manager/>
</template>

<script setup lang="tsx">
import {inject, onMounted, ref} from "vue";
import H20 from "../components/h20.vue";
import AkoTabButton from "../components/AkoTabButton.vue";
import MenuItem from "../../src/type/MenuItem.ts";
import {ElIcon, ElMenu, ElSubMenu, ElMenuItem} from "element-plus";
import MenuAble from "../../src/type/MenuAble.ts";
import MenuGroup from "../../src/type/MenuGroup.ts";
import {AkoApiSymbol, AkoOptionsSymbol, AkoSymbol} from "../../src/ako.ts";
import DialogManager from "./DialogManager.vue";

const api = inject(AkoApiSymbol)

const options = inject(AkoOptionsSymbol)
const menuTree = ref<MenuAble[]>([options.dashboard, ...options.menuItems])
const menus = ref<MenuItem[]>([])
const openMenus = ref<MenuItem[]>([options.dashboard])
const currentSelect = ref<MenuItem>(options.dashboard)

function flattenMenuTree(items: MenuAble[]) {
    items.forEach(item => {
        if (item['children'] == undefined) menus.value.push(item as MenuItem)
        else flattenMenuTree((item as MenuGroup).children)
    })
}

const elMenu = () => <ElMenu style="background-color:rgba(0,0,0,0);border-right: none;" onSelect={clickMenu}
                             default-active={options.dashboard.id}>
    {
        menus.value.map(item => renderMenuAble(item))
    }
</ElMenu>


function renderMenuAble(item: MenuAble) {
    if (item['children'] == undefined)
        return (
            <ElMenuItem index={item.id}>
                <ElIcon>
                    {item.icon}
                </ElIcon>
                <span>{item.name}</span>
            </ElMenuItem>
        )

    const group = item as MenuGroup
    return (
        <ElSubMenu title={group.name} index={item.id}>
            {{
                default: () => group.children.map(c => renderMenuAble(c)),
                title: () => [<ElIcon>{item.icon}</ElIcon>, <span>{item.name}</span>]
            }}
        </ElSubMenu>
    )
}

onMounted(async () => {
    menuTree.value.push(...(await api.menu.all()))
    flattenMenuTree(menuTree.value)
})

function changePage(item: MenuItem) {
    currentSelect.value = item
}

function clickMenu(id: string) {
    const item = menus.value.find(value => value.id == id)
    if (item == undefined) return;
    if (currentSelect.value == item) return
    if (!openMenus.value.some(value => value == item))
        openMenus.value.push(item)
    changePage(item)
}

function clickTab(item: MenuItem) {
    changePage(item)
}

function closeTab(item: MenuItem) {
    openMenus.value = openMenus.value.filter(value => value != item)
    changePage(options.dashboard)
}


</script>

<style scoped>

.menu {
    background: url("/img/menu-bg.png") rgba(0, 94, 235, .1) no-repeat top;
    overflow-y: auto;
}

.logo {
    padding: 5px 15px 0;
    margin: 5px 0;
}

.body {
    height: calc(100% - 40px);
    width: calc(100% - 40px);
    background: #f4f4f4;
    padding: 20px;
}

.tab {
    border-radius: 4px;
    background-color: #fff;
    overflow-x: auto;
}

.page {
    height: calc(100% - 60px);
}
</style>