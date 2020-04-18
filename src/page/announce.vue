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
                <el-form-item prop="title" label="标题：">
                    <el-input v-model="annForm.title" style="width: 30%"
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
            <div class="message-title">公告列表</div>
            <div class="message-box" v-for="item in messageInfoList" :key="item.id">
                <div class="title">
                    {{item.title}}
                    <p class="name">
                        {{item.name}}
                    </p>
                </div>
                <div class="content">{{item.content}}</div>
                <div class="create-time">
                    {{item.creattime}}
                    <div style="width: 30px;display: inline-block"></div>
                    <el-button type="text" style="color: red;" size="mini" @click="handleDelete(item.id)">删除</el-button>
                </div>
            </div>

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
                    title: '',
                    content: ''
                },
                userId: '',
                messageInfoList: []
            }
        },
        computed: {
            rules() {
                return {
                    title: [

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
                                title: this.annForm.title,
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
            // 删除公告
            handleDelete(id) {
                apiDataFilter.request({
                    apiPath: 'message.deleteMessage',
                    method: 'POST',
                    data: {
                        messageId: id
                    },
                    successCallback: (res)=> {
                        this.$message.success('删除成功')
                        this.getList()

                    },
                    errorCallback: (res) => {
                        this.$message.success('删除失败')
                        this.getList()


                    }
                })
            },
            // 获取公告
            getList() {
                this.loading = true;
                apiDataFilter.request({
                    apiPath: 'message.getMessageList',
                    method: 'POST',
                    data: '',
                    successCallback: (res)=> {
                        this.loading = false
                        this.messageInfoList = res.data.messageInfoList
                    },
                    errorCallback: (res) => {
                        this.loading = false
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

        .message-content {
            margin-top: 30px;
            padding: 30px;
            .message-title {
                font-size: 25px;
                color: #409eff;
                width: 110px;
                margin-left: 40px;
                margin-bottom: 20px;
            }
            .message-box {
                background-color: #e9e9e9;
                border-bottom: 1.5px solid #E7F6FB;
                border-radius: 3px;
                padding: 5px 0 0 10px;
                width: 900px;
                margin: 0 auto;
                .name {
                    color: #305e67;
                    font-size: 14px;
                    display: inline-block;
                    padding-left: 80px;
                    height: 50px;
                    line-height: 50px;
                }
                .title {
                    font-size: 17px;
                    color: #757575;
                }
                .content {
                    height: 100px;
                    padding: 10px 0 0 40px;
                    color: #a7a7a7;
                }
            }

        }
    }
</style>