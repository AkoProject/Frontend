<template>
    <div v-if="!view" class="hFull" v-loading="true"/>
    <component v-else :is="view"/>
</template>

<script setup lang="ts">
import {inject, onMounted, ref} from "vue";
import {AkoApiSymbol} from "../../src/ako.ts";
import AkoMainView from "./AkoMainView.vue";
import AkoAuthView from "./AkoAuthView.vue";

const view = ref()
const api = inject(AkoApiSymbol)
onMounted(async () =>{
    view.value = await api.auth.isAuth() ? AkoMainView : AkoAuthView
})
</script>

<style scoped>

</style>