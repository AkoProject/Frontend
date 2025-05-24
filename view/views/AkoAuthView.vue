<template>
    <div class="login-container">
        <div class="dynamic-bg">
            <div class="flow-line line-1"></div>
            <div class="flow-line line-2"></div>
            <div class="flow-line line-3"></div>
        </div>

        <div class="login-box">
            <component :is="ako.options.authLogo"/>

            <el-form
                :model="form"
                :rules="rules"
                ref="loginForm"
                class="login-form"
                @keyup.enter="handleLogin"
            >
                <el-form-item prop="username">
                    <el-input
                        v-model="form.username"
                        placeholder="请输入账号"
                        size="large"
                    >
                        <template #prefix>
                            <el-icon class="input-icon">
                                <User/>
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input
                        v-model="form.password"
                        type="password"
                        placeholder="请输入密码"
                        size="large"
                        show-password
                    >
                        <template #prefix>
                            <el-icon class="input-icon">
                                <Lock/>
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <el-button
                    type="primary"
                    size="large"
                    class="login-btn"
                    :loading="loading"
                    @click="handleLogin"
                >
                    {{ loading ? '登录中...' : '立即登录' }}
                </el-button>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import {ref, reactive, inject} from 'vue'
import {User, Lock} from '@element-plus/icons-vue'
import {AkoApiSymbol, AkoSymbol} from "../../src/ako.ts";

const ako = inject(AkoSymbol)

const form = reactive({
    username: '',
    password: ''
})

const rules = reactive({
    username: [
        {required: true, message: '请输入用户名', trigger: 'blur'}
    ],
    password: [
        {required: true, message: '请输入密码', trigger: 'blur'}
    ]
})

const loading = ref(false)
const loginForm = ref(null)

const api = inject(AkoApiSymbol)

const handleLogin = () => {
    loginForm.value.validate(valid => {
        if (valid) {
            loading.value = true
            login().catch(() => loading.value = false)
        }
    })
}


async function login() {
    if (await api.auth.login(form.username, form.password)) location.reload()
}
</script>

<style scoped>
.login-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    background: linear-gradient(45deg, #0a1639, #1a237e);

    .dynamic-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: 0;

        .flow-line {
            position: absolute;
            background: linear-gradient(90deg, transparent, rgba(64, 158, 255, 0.6));
            animation: flow 8s linear infinite;
            filter: blur(20px);

            &.line-1 {
                width: 80%;
                height: 2px;
                top: 20%;
                animation-delay: 0s;
            }

            &.line-2 {
                width: 60%;
                height: 2px;
                top: 50%;
                animation-delay: 2s;
            }

            &.line-3 {
                width: 40%;
                height: 2px;
                top: 80%;
                animation-delay: 4s;
            }
        }
    }

    .login-box {
        position: relative;
        width: 420px;
        padding: 40px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 16px;
        box-shadow: 0 0 30px rgba(64, 158, 255, 0.1);
        backdrop-filter: blur(10px);
        z-index: 1;

        .login-form {
            :deep(.el-input__wrapper) {
                background: rgba(255, 255, 255, 0.1);
                box-shadow: none;
            }

            :deep(.el-input__inner) {
                color: #fff;
            }

            .input-icon {
                color: rgba(255, 255, 255, 0.6);
                font-size: 18px;
                margin-right: 8px;
            }

            .login-btn {
                width: 100%;
                margin-top: 20px;
                background: linear-gradient(45deg, #409eff, #6c8cff);
                border: none;
                letter-spacing: 2px;
                font-weight: bold;
                transition: all 0.3s;

                &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(64, 158, 255, 0.4);
                }
            }
        }
    }
}

@keyframes flow {
    0% {
        left: -100%;
    }
    100% {
        left: 100%;
    }
}
</style>