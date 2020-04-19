<template>
    <div class="user-info-container">
        <page-header :borderBottom="true">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>您当前所在的位置</el-breadcrumb-item>
                <el-breadcrumb-item >个人信息</el-breadcrumb-item>
            </el-breadcrumb>
        </page-header>

        <div class="user-content">
            <el-button class="add" size="small" type="primary" plain icon="el-icon-edit"
                       @click="handleClickEditUserInfo">
                编辑信息
            </el-button>
            <div class="content-box">
                <div class="avatar-image">
                    <img src="../../assets/images/avatar.png" alt="" width="200px" height="200px">
                </div>
                <div class="info-box">
                    <p class="info-font">
                        工号：
                        <span class="specific-info">{{userInfo.code}}</span>
                    </p>
                    <div class="info-space"></div>
                    <p class="info-font">
                        昵称：
                        <span class="specific-info">{{userInfo.username}}</span>
                    </p>
                    <div class="info-space"></div>
                    <p class="info-font">
                        账号：
                        <span class="specific-info">{{userInfo.name}}</span>
                    </p>
                    <div class="info-space"></div>
                    <p class="info-font">
                        邮箱：
                        <span class="specific-info">{{userInfo.email}}</span>
                    </p>
                    <div class="info-space"></div>
                    <p class="info-font">
                        电话：
                        <span class="specific-info">{{userInfo.phone}}</span>
                    </p>
                    <div class="info-space"></div>
                    <p class="info-font">
                        权限：
                        <span class="specific-info">{{userInfo.type}}</span>
                    </p>
                    <div class="info-space"></div>
                    <p class="info-font">
                        签名：
                    </p>
                    <p class="specific-info">{{userInfo.description}}</p>
                </div>
            </div>
        </div>

        <edit-info-dialog ref="edit-info_ref" :userInfo="userInfo"></edit-info-dialog>
    </div>
</template>

<script>
    import PageHeader from "../../components/public/pageHeader/index";
    import {getLocalStore} from "../../utils/webstore-utils";
    import { USER } from '@/config/webstore'
    import EditInfoDialog from "./components/edit-info-dialog";

    export default {
        name: "user-info",
        components: {EditInfoDialog, PageHeader},
        data() {
            return {
                userInfo: {
                    code: '',
                    username: '',
                    name: '',
                    email: '',
                    phone: '',
                    type: '',
                    description: ''
                },

            }
        },
        mounted() {
            let userObj = JSON.parse(getLocalStore(USER))
            // console.log(userObj)
            if (userObj) {
                this.userInfo.code = userObj.code
                this.userInfo.username = userObj.username
                this.userInfo.name = userObj.name
                this.userInfo.email = userObj.email
                this.userInfo.phone = userObj.phone
                this.userInfo.description = userObj.description
                if(userObj.type === 'ADMIN'){
                    this.userInfo.type = '管理员'
                }else {
                    this.userInfo.type = '普通职员'
                }
            }
        },
        methods: {
            handleClickEditUserInfo() {
                this.$refs['edit-info_ref'].showDialog();
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/style/variables.less";
    @import "../../assets/less/base/base_pan.less";

    .user-info-container {
        background-color: @default-color;
        padding-bottom: 20px;
        .user-content {
            padding: 20px;
            .content-box {
                margin-top: 60px;
                .avatar-image {
                    display: inline-block;
                    margin: 0 100px;
                }
                .info-box {
                    display: inline-block;
                    vertical-align: top;

                    .info-font {
                        font-size: 22px;
                        font-weight: bolder;
                        color: #8a8a8a;
                    }

                    .info-space {
                        height: 15px;
                    }

                    .specific-info {
                        color: #515151;
                        font-weight: bold;
                    }
                }
            }
        }

    }
</style>