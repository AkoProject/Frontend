<template>
    <el-tooltip :content="data">
        <span>{{ toByteStr(data) }}</span>
    </el-tooltip>
</template>

<script setup lang="ts">
import {toByteStr} from "../../../../fun/binary.ts";

defineProps(['data'])
</script>