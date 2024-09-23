<template>
    <div class="TabButton" :class="{Selected: isSelected}">
        <el-space :size="0">
            <div>{{ name }}</div>

            <el-icon v-if="closeable" class="close" @click="e => onClose(e)">
                <Close/>
            </el-icon>
        </el-space>
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
    display: none;
    line-height: 18px;
    text-align: center;
    margin-left: 8px;
    height: 14px;
    width: 14px;
    color: #409EFF;
    font-size: 12px;
    border-radius: 50%;
}

.close:hover {
    background: #ccc;
}

.TabButton:hover .close {
    display: block;
    transition-duration: 0.5s;
}
</style>