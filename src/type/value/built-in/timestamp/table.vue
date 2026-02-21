<template>
    <span>{{ dayjs(data).format(options) }}</span>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

defineProps(['data', 'options'])
</script>