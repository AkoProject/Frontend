<template>
    <el-date-picker
        v-if="options.concat('YYYY-MM-DD')"
        :type="options.concat('HH:mm:ss') ? 'datetime' : 'date'"
        v-model="model"
        value-format="x"
        clearable
    />
    <el-time-picker v-else v-model="model" value-format="x" clearable/>
</template>

<script setup lang="ts">
const model = defineModel()
defineProps<{ options: string }>()
</script>