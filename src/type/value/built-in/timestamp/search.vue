<template>
    <el-date-picker
        v-if="options.concat('YYYY-MM-DD')"
        :type="options.concat('HH:mm:ss') ? 'datetime' : 'date'"
        v-model="model"
        clearable
    />
    <el-time-picker v-else v-model="model" clearable/>
</template>

<script setup lang="ts">
const model = defineModel()
defineProps<{ options: string }>()
</script>