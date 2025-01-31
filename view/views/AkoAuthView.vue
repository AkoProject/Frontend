<template>
    <div class="hFull">
        <div class="h200"/>
        <div style="width: 500px;margin: auto">
            <el-form label-width="120px">
                <el-form-item label="用户名">
                    <el-input v-model="username"/>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="password"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">

import {inject, ref} from "vue";
import {AkoApiSymbol} from "../../src/ako.ts";

const username = ref()
const password = ref()

const api = inject(AkoApiSymbol)

async function login() {
    await api.auth.login(username.value, password.value)
    location.reload()
}

</script>

<style scoped>

</style>