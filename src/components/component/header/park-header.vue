<template>
    <div class="header-component">
        <el-header class="app-header header-bgcolor">
            <div class="header-box">
                <!-- 折叠按钮 -->
                <!--<div class="collapse-btn" @click="changeAsideStatus">
                    <i v-if="!collapse" class="el-icon-s-fold"></i>
                    <i v-else class="el-icon-s-unfold"></i>
                </div>-->
                <div class="logo">
                    <img src="../../../assets/images/logo-max.png" alt="" width="50" height="50">
                    停车收费管理系统
                </div>
                <div class="header-right">
                    <div class="header-user-con">
                        <!-- 用户名下拉菜单 -->
                        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                            <span class="el-dropdown-link">
                                <i class="el-icon-s-custom"></i>
                                <i class="el-icon-caret-bottom"></i>
                            </span>
                            <el-dropdown-menu size="medium" slot="dropdown">
                                <el-dropdown-item command="help">
                                    <i class="el-icon-question"/>
                                    帮助
                                </el-dropdown-item>
                                <el-dropdown-item command="updatePassword">
                                    <i class="el-icon-lock"/>
                                    修改密码
                                </el-dropdown-item>
                                <el-dropdown-item divided command="loginOut">
                                    <i class="el-icon-switch-button"/>
                                    退出登录
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>
        </el-header>

        <!--用户信息-->
        <!--<div class="user-info-box">
            <el-dialog
                    title="个人信息"
                    width="800px"
                    :visible.sync="dialogVisiable"
                    class="user-info"
            >
                <div class="info-content">
                    111111111111111111111111111111111111111111111jdncdjkncfdjk
                </div>
            </el-dialog>
        </div>-->

        <update-password-dialog ref="updatePassword_ref"></update-password-dialog>
    </div>
</template>

<script>
    import bus from '../bus';
    import UpdatePasswordDialog from "./update-password-dialog";
    import apiDataFilter from "../../../utils/apiDataFilter";
    import {getLocalStore, removeLocalStore } from "../../../utils/webstore-utils";
    import { TOKEN } from '@/config/webstore'

    export default {
        name: "park-header",
        components: {UpdatePasswordDialog},
        data() {
            return {
                collapse: false,
                dialogVisiable: false
            }
        },
        mounted() {
        },
        methods: {
            changeAsideStatus() {
                this.collapse = !this.collapse;
                bus.$emit('collapse', this.collapse);
            },

            // 三个按钮
            handleCommand(index) {
                switch(index) {
                    case 'help':
                        this.$router.push('/home')
                        break
                    case 'updatePassword':
                        this.$refs['updatePassword_ref'].showDialog();
                        break
                    case 'loginOut':
                        /*apiDataFilter.request({
                            apiPath: 'user.deleteUser',
                            data:{
                                username: this.userName
                            },
                            successCallback: res => {
                                store.dispatch('LogOut').then(() => {
                                    location.reload() // 为了重新实例化vue-router对象 避免bug
                                })
                            }
                        })*/
                        //退出登录，清空token
                        removeLocalStore(TOKEN);
                        this.$router.push('/login');
                        /*localStorage.removeItem('ms_username');
                        this.$router.push('/login');*/
                        break
                    default:
                        break
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../assets/style/variables";
    .header-component {
        .app-header {
            height: @headerHeight !important;
            padding: 0;
            position: fixed;
            width: 100%;
            z-index: 6;
            box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.12);
        }

        .header-bgcolor {
            background-color: #f8f8f8;
            color: #878787;;
            font-size: 22px;
        }

        .header-box {
            height: 65px;
            .collapse-btn {
                float: left;
                padding: 0 21px;
                cursor: pointer;
                line-height: 70px;
            }

            .logo {
                float: left;
                width: 250px;
                line-height: 70px;
                margin-left: 30px;
            }

            .header-right {
                float: right;
                padding-right: 50px;

                .header-user-con {
                    display: flex;
                    height: 70px;
                    align-items: center;
                }

                .el-dropdown-link {
                    color: #333;
                    cursor: pointer;
                }
                .el-dropdown-menu__item {
                    text-align: center;
                }
            }
        }
    }
</style>