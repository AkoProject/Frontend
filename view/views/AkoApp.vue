<template>
    <slot v-if="$slots.default"/>
    <ako-boot-view v-else/>
</template>

<script setup lang="ts">
import {Ako, AkoApiSymbol, AkoOptionsSymbol, AkoSymbol} from "../../src/ako.ts";
import {provide} from "vue";
import AkoBootView from "./AkoBootView.vue";

const {ako} = defineProps<{ ako: Ako }>()
provide(AkoSymbol, ako)
provide(AkoOptionsSymbol, ako.options)
provide(AkoApiSymbol, ako.api)
</script>