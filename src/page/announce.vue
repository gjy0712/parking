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
                     label-width="70px"
                     class="login-content">
                <el-form-item prop="title" label="标题：">
                    <el-input v-model="annForm.title"
                              size="small"
                              placeholder="请输入标题"
                              @keyup.enter.native="submitForm('annForm')">
                    </el-input>
                </el-form-item>
                <el-form-item prop="content" label="内容：">
                    <el-input type="textarea"
                              size="small"
                              :rows="10"
                              placeholder="请输入内容"
                              v-model="annForm.content"
                              @keyup.enter.native="submitForm('annForm')"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item style="text-align: center" class="login-btn" label-width="0">
                    <el-button type="primary"
                               class="custom-button_long"
                               size="small"
                               :loading="loading"
                               @click="submitForm('annForm')">
                        发布公告
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="message-content">
            <div class="message-title">公告列表</div>
            <div class="message-box" v-for="item in messageInfoList" :key="item.id">
                <span class="title">{{item.title}}</span>
                <div class="content">{{item.content}}</div>
                <div class="name">{{item.name}}</div>
                <span class="create-time">{{item.creattime}}</span>
                <!--<el-button class="delete" type="text" size="mini" @click="handleDetail(item.id)">详情</el-button>-->
                <el-button class="delete" type="text" size="mini" @click="handleDelete(item.id)">删除</el-button>

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
                        { required: true, message: "标题不能为空", trigger: 'blur' },

                    ],
                    content: [
                        { required: true, message: "内容不能为空", trigger: 'blur' },

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
                this.$confirm(
                    "您确认要删除此条数据吗？",
                    "提示",
                    {
                        confirmButtonText: "确认",
                        cancelButtonText: "取消",
                        type: 'warning'
                    }
                ).then(() => {
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
                            this.$message.error('删除失败')
                            this.getList()


                        }
                    })
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
            padding: 10px 0 0 30px;
            .message-title {
                border-left: 2px solid #20a0ff;
                margin-bottom: 20px;
                color: #000;
                padding-left: 5px;
            }
            .message-box {
                padding: 0 0 0 10px;
                position: relative;
                height: 60px;
                line-height: 60px;
                background-color: #CAE1FB;
                border-radius: 20px;
                margin-bottom: 10px;
                .title {
                    font-size: 14px;
                    padding-right: 10px;
                }
                .content {
                    color: #8CB5A9;
                    padding-right: 10px;
                    width: 500px;
                    display: inline-block;
                }
                .name {
                    color: #8CB5A9;
                    padding-right: 5px;
                    width: 60px;
                    display: inline-block;
                    position: absolute;
                    left: 550px;
                }
                .create-time {
                    color: #8CB5A9;
                    display: inline-block;
                    position: absolute;
                    left: 610px;
                }
                .delete {
                    position: absolute;
                    right: 100px;
                    top: 15px;
                }
            }

        }
    }
</style>