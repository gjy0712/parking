<template>
    <div class="announce-container">
        <page-header :borderBottom="true">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>您当前所在的位置</el-breadcrumb-item>
                <el-breadcrumb-item>发布公告</el-breadcrumb-item>
                <el-breadcrumb-item>公告栏</el-breadcrumb-item>
            </el-breadcrumb>
        </page-header>

        <div class="pop-box">
            <el-form :model="annForm"
                     :rules="rules"
                     ref="annForm"
                     label-position="left"
                     label-width="80px"
                     class="login-content">
                <el-form-item prop="topic" label="标题：">
                    <el-input v-model="annForm.topic" style="width: 30%"
                              placeholder="请输入标题"
                              @keyup.enter.native="submitForm('annForm')">
                    </el-input>
                </el-form-item>
                <el-form-item prop="content" label="内容：">
                    <el-input style="width: 50%"
                              type="textarea"
                              maxlength="30"
                              :rows="3"
                              placeholder="请输入内容"
                              v-model="annForm.content"
                              @keyup.enter.native="submitForm('annForm')"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item class="login-btn" label-width="0">
                    <el-button type="primary"
                               icon="el-icon-plus"
                               class="custom-button_long"
                               size="medium"
                               :loading="loading"
                               @click="submitForm('annForm')">
                        添加
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="message-content">
            <div class="title">公告</div>
        </div>
    </div>
</template>

<script>
    import { PageHeader } from "../components/public";
    import apiDataFilter from "../utils/apiDataFilter";
    import {getLocalStore} from "../utils/webstore-utils";
    import { USER } from '@/config/webstore'

    export default {
        name: "announce",
        components: { PageHeader },
        data() {
            return {
                loading: false,
                annForm: {
                    topic: '',
                    content: ''
                },
                userId: ''
            }
        },
        computed: {
            rules() {
                return {
                    topic: [

                    ],
                    content: [

                    ]
                }
            }
        },
        mounted() {
            let userObj = JSON.parse(getLocalStore(USER))
            this.userId = userObj.id

        },
        created() {
            this.getList()
        },
        methods: {
            // 添加公告
            submitForm() {
                this.$refs['annForm'].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        apiDataFilter.request({
                            apiPath: 'message.insertMessage',
                            method: 'post',
                            data: {
                                userID: parseInt(this.userId),
                                title: this.annForm.topic,
                                content: this.annForm.content
                            },
                            successCallback: (res) => {
                                this.loading = false;
                                // 成功
                                this.$notify({
                                    title: '成功',
                                    message: '添加成功',
                                    type: "success"
                                });
                                this.annForm = {
                                    topic: '',
                                    content: ''
                                }
                                this.getList()
                            },
                            errorCallback: (err) => {
                                this.loading = false
                                // 失败
                                this.$notify.error({
                                    title: '失败',
                                    message: '添加失败'
                                });
                                this.annForm = {
                                    topic: '',
                                    content: ''
                                }
                                this.getList()
                            },
                        })
                    }
                })
            },
            // 获取公告
            getList() {
                apiDataFilter.request({
                    apiPath: 'message.getMessageList',
                    method: 'POST',
                    data: '',
                    successCallback: (res)=> {

                    },
                    errorCallback: (res) => {

                    }
                })
            }
        }

    }
</script>

<style lang="less" scoped>
    @import "../assets/style/variables.less";

    .announce-container {
        background-color: @default-color;
        padding-bottom: 20px;

        .pop-box {
            padding: 30px;
        }
    }
</style>