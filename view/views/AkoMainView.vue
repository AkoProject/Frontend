<template>
    <el-container class="hFull">
        <el-aside width="240px" class="hFull menu">
            <div class="logo">
                <component :is="ako.options.mainLogo"/>
            </div>
            <div class="menu-wrapper">
                <component :is="elMenu"/>
            </div>
        </el-aside>
        <el-main style="padding: 0">
            <div class="header">
                <el-scrollbar class="tab">
                    <div class="scrollbar-flex-content">
                        <ako-tab-button
                            v-for="item in openMenus"
                            :name="item.name"
                            :is-selected="currentSelect === item"
                            :closeable="item.closeable"
                            @click="clickTab(item)"
                            @close="closeTab(item)"
                        />
                    </div>
                </el-scrollbar>
            </div>
            <div class="body">

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

const ako = inject(AkoSymbol)
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

const elMenu = () =>
    <ElMenu background-color="rgba(0,0,0,0)" style="border-right: none;" onSelect={clickMenu}
            default-active={options.dashboard.id}>
        {
            menuTree.value.sort((a, b) => a.index - b.index).map(item => renderMenuAble(item))
        }
    </ElMenu>


function renderMenuAble(item: MenuAble) {
    if (item['children'] == undefined)
        return (
            <ElMenuItem index={item.id}>
                <ElIcon>
                    {item.icon}
                </ElIcon>
                <span class="menu-item-name">{item.name}</span>
            </ElMenuItem>
        )

    const group = item as MenuGroup
    return (
        <ElSubMenu index={item.id}>
            {{
                default: () => group.children.sort((a, b) => a.index - b.index).map(c => renderMenuAble(c)),
                title: () => [<ElIcon>{item.icon}</ElIcon>, <span class="menu-item-name">{item.name}</span>]
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
    background: #171717;
    overflow-y: auto;
}

.menu :deep(.el-sub-menu__title), .menu :deep(.el-menu-item){
    color: hsla(0, 0%, 100%, .7);
}
.menu :deep(.menu-item-name){
    margin-left: 5px;
}

.menu-wrapper{
    padding: 0 12px;
}
.menu :deep(.el-sub-menu__title),.menu :deep(.el-menu-item){
    border-radius: 4px;
    padding-left: 12px;
    padding-right: 12px;
    height: 40px;
}

.menu :deep(.el-menu-item.is-active){
    background-color: #2e95ff !important;
    color: #fff !important;
}

.logo {
    height: 56px;
    border-bottom: 1px solid rgba(174,187,204,.2);
    -ms-flex-direction: row;
    flex-direction: row;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: center;
    justify-content: center
}
.header{
    height: 56px;
    box-shadow: 0 2px 7px 0 rgba(5, 34, 97, .1);
    position: relative;
    z-index: 2;
}

.body {
    height: calc(100% - 96px);
    width: calc(100% - 40px);
    background: #f4f7f9;
    padding: 20px;
}

.tab {
    border-radius: 4px;
    background-color: #fff;
    height: 40px;
    padding: 8px 24px;
    width: calc(100% - 48px);
}
.scrollbar-flex-content {
    display: flex;
}

.page {
    height: 100%;
}
</style>