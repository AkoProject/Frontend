<template>
    <div class="TabButton" :class="{Selected: isSelected}">
        <span>{{ name }}</span>
        <el-icon v-if="closeable" class="close" @click="e => onClose(e)">
            <Close/>
        </el-icon>
    </div>
</template>

<script setup>
import {Close} from "@element-plus/icons-vue";

const {name, isSelected, closeable} = defineProps(['name', 'isSelected', 'closeable'])
const emits = defineEmits(['close'])

function onClose(e) {
    e.stopPropagation()
    emits('close')
}

</script>

<style scoped>


.TabButton {
    padding: 10px 24px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.TabButton {
    color: #000;
    /*transition: 0.35s;*/
}


.Selected {
    padding: 8px 22px;
    border: 2px solid #409EFF;
    color: #409EFF;
}

.TabButton:hover {
    color: #409EFF;
}

.close {
    line-height: 18px;
    text-align: center;
    margin-left: 8px;
    height: 14px;
    width: 0;
    color: #409EFF;
    font-size: 12px;
    border-radius: 50%;
    transition-duration: 0.3s;
}

.close:hover {
    background: #ccc;
}

.TabButton:hover .close {
    width: 14px;
    transition-duration: 0.3s;
}
</style>