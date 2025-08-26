<template>
    <div v-if="!view" class="hFull" v-loading="true"/>
    <component v-else :is="view" @loginSuccess="view = AkoMainView"/>
</template>

<script setup lang="ts">
import {inject, onMounted, ref} from "vue";
import {AkoApiSymbol, AkoSymbol} from "../../src/ako.ts";
import AkoMainView from "./AkoMainView.vue";
import AkoAuthView from "./AkoAuthView.vue";

const view = ref()
const api = inject(AkoApiSymbol)
const ako = inject(AkoSymbol)
onMounted(async () =>{
    const isAuth = await api.auth.isAuth()
    if (isAuth) await ako.options.loginCallback()
    view.value =  isAuth? AkoMainView : AkoAuthView
})
</script>

<style scoped>

</style>