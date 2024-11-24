<template>
    <el-dialog
        v-for="it in dialogList"
        v-model="it.showRef"
        @closed="dialogList = dialogList.filter(e => e!=it)"
        append-to-body
        :show-close="false"
        :style="it.style"
    >
        <component :is="it.content"/>
    </el-dialog>
</template>

<script setup lang="ts">

import {dialogList} from "../../src/fun/dialog.ts";
</script>

<style scoped>

</style>