<template>
    <el-dialog
        v-for="it in dialogList"
        v-model="it.showRef"
        @closed="closed"
        append-to-body
        :show-close="it.showClose"
        :style="it.style"
        :title="it.title"
    >
        <component :is="it.content" @close="it.showRef = false"/>
    </el-dialog>
</template>

<script setup lang="ts">

import {dialogList} from "../../src/fun/dialog.ts";

const closed = (it: any) => dialogList.value = dialogList.value.filter(e => e != it)
</script>

<style scoped>

</style>