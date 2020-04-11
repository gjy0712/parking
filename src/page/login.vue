<template>
    <div class="login-container">
        <div class="login-box">
            <div class="login-title">停车场收费管理系统</div>
            <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="80px" class="login-content">
                <el-form-item prop="username" label="用户名：">
                    <el-input v-model="loginForm.username" placeholder="请输入用户名">
                    </el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码：">
                    <el-input
                            type="password"
                            placeholder="请输入密码"
                            v-model="loginForm.password"
                            @keyup.enter.native="submitForm('loginForm')"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item class="login-btn" label-width="0">
                    <el-button type="primary"
                               :disabled="!(loginForm.username && loginForm.password)"
                               @click="submitForm('loginForm')">
                        登录
                    </el-button>
                </el-form-item>
                <!--<el-button type="text" class="login-tips" @click="handleRegister()">没有账号，去注册>></el-button>-->
            </el-form>
        </div>
    </div>
</template>

<script>
    import apiDataFilter from "../utils/apiDataFilter";
    import {mapMutations} from "vuex";
    import { getLocalStore, setLocalStore } from '@/utils/webstore-utils.js'
    import { USER, TOKEN } from '@/config/webstore'
    import {InfoMixins} from '@/components/mixins/publicMethods'

    export default {
        name: "login",
        data() {
            return {
                loginForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
                },
            }
        },
        mixins: [InfoMixins],
        methods: {
            ...mapMutations(['changeLogin']),
            // 登录校验
            async submitForm() {
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        apiDataFilter.request({
                            apiPath: 'user.login',
                            method: 'post',
                            data: {
                                username: this.loginForm.username,
                                password: this.loginForm.password,
                            },
                            successCallback: (res) => {
                                let userInfo = {
                                    username: this.loginForm.username,
                                    password: this.loginForm.password,
                                    id: res.data.user.id,
                                    code: res.data.user.code,
                                    name: res.data.user.name,
                                    sex: res.data.user.sex,
                                    email: res.data.user.email,
                                    phone: res.data.user.phone,
                                    heading: res.data.user.heading,
                                    description: res.data.user.description,
                                    status: res.data.user.status,
                                    type: res.data.user.type
                                }
                                let token = res.data.token
                                setLocalStore(TOKEN, token)
                                setLocalStore(USER, userInfo)
                                this.$notify({
                                    title: '成功',
                                    message: '登录成功！',
                                    type: "success"
                                });
                                this.$router.push('/home');
                            },
                            errorCallback: (err) => {
                                // 失败
                                this.$notify.error({
                                    title: '失败',
                                    message: err.data.msg
                                });
                            },
                        })

                    } else {
                        this.$message.error('请输入账号和密码');
                        return false;
                    }
                });
            },
            /*// 跳转到注册页面
            handleRegister() {

            }*/
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/style/mixins/flex";
    @import "../assets/style/variables";

    .login-container {
        position: absolute;
        width: 100%;
        height: 100%;
        background: @main-color url(../assets/images/bg_logo2.jpg) no-repeat fixed 50% 50% ;
        background-size: 100% 100%;
        /*filter: blur(5px);*/
        .flex();
        .align-items(center);
        .justify-content(center);

        .login-box {
            width: 400px;
            border-radius: 5px;
            background: rgba(255, 255, 255, 0.3);
            box-shadow: 0 0 13px 0 rgba(0, 0, 0, 0.12);
            overflow: hidden;

            .login-title {
                width: 100%;
                line-height: 50px;
                text-align: center;
                font-size: 20px;
                color: #000;
                border-bottom: 1px solid #ddd;
            }

            .login-content {
                padding: 30px 30px;

                .el-form-item{
                    color: #000;
                }

                .el-form-item:nth-child(3) {
                    margin-bottom: 0;
                }
                .login-btn {
                    text-align: center;
                }

                .login-btn button {
                    width: 100%;
                    height: 36px;
                    margin-bottom: 3px;
                }

                .login-tips {
                    font-size: 10px;
                    color: #000;
                    float: right;
                    margin-bottom: 10px;
                }
                .login-tips:hover {
                    color: #409eff;
                }
            }
        }
    }
</style>