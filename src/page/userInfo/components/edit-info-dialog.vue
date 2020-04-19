<template>
    <el-dialog
            title="编辑个人信息"
            :visible.sync="dialogEditInfo"
            class="edit-info-component el-dialog-style-reset"
            :close-on-click-modal="false"
            width="600px"
            @click="handleCancel('info')">
        <div class="pop-box">
            <el-form
                    :model="userInfo"
                    :rules="editInfoRule"
                    size="small"
                    ref="info"
                    label-width="100px"
                    :validate-on-rule-change="false"
                    class="demo-ruleForm">
                <el-form-item label="昵称：" prop="name">
                    <el-input v-model.trim="userInfo.name" placeholder="请输入昵称"></el-input>
                </el-form-item>
                <el-form-item label="邮箱：" prop="email">
                    <el-input v-model.trim="userInfo.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="电话：" prop="phone">
                    <el-input v-model.trim="userInfo.phone" placeholder="请输入电话"></el-input>
                </el-form-item>
                <el-form-item label="签名：" prop="description">
                    <el-input type="textarea" v-model.trim="userInfo.description" placeholder="请输入签名"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="small"
                       class="custom-button_long"
                       @click="handleCancel('info')">关闭</el-button>
            <el-button
                    size="small"
                    type="primary"
                    :loading="loading"
                    class="custom-button_long"
                    @click="handleSubmit()">
                确定
            </el-button>
        </span>
    </el-dialog>
</template>

<script>
    import apiDataFilter from "../../../utils/apiDataFilter";
    import {getLocalStore, setLocalStore} from "../../../utils/webstore-utils";
    import { USER } from '@/config/webstore'

    export default {
        name: "edit-info-dialog",
        props: {
            userInfo: {}
        },
        data() {
            return {
                dialogEditInfo: false,
                loading: false,
                id: '',
            }
        },
        computed: {
            editInfoRule() {
                // 邮箱验证
                const validateMail = (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请输入邮箱'));
                    } else {
                        const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
                        if (!reg.test(value)) {
                            callback(new Error('输入的联系邮箱必须包含@'));
                        } else {
                            callback();
                        }
                    }
                };
                // 手机号验证
                const validatePhone = (rule, value, callback) => {
                    if (!value) {
                        return callback(new Error('请输入电话号码'));
                    } else {
                        if(!(value)||(value.length!==11)){
                            return callback(new Error('手机号码为11位数字！请正确填写！'));
                        }
                        const reg1 = /^[1][3-8]\d{9}$|^([6|9])\d{7}$|^[6]([8|6])\d{5}$/;
                        if (!reg1.test(value)) {
                            callback(new Error('您的手机号码不正确，请重新输入'));
                        } else {
                            callback();
                        }
                    }
                };
                return {
                    name: [
                        { required: true, message: "昵称不能为空", trigger: 'blur' },
                        { min: 2, max: 12, message: "姓名长度为2-12位", trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: "邮箱不能为空", trigger: 'blur' },
                        {validator: validateMail, trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: "手机号不能为空", trigger: 'blur' },
                        {validator: validatePhone, trigger: 'blur' }
                    ],
                    description: [

                    ]
                }
            }
        },
        mounted() {
            let userObj = JSON.parse(getLocalStore(USER))
            if (userObj) {
                this.id = userObj.id
            }
        },
        created() {

        },
        methods: {
            showDialog(){
                this.dialogEditInfo = true
            },
            handleCancel(formName) {
                this.$refs[formName].clearValidate()
                this.dialogEditInfo = false
                this.loading = false
            },
            handleSubmit() {
                this.$refs['info'].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        apiDataFilter.request({
                            apiPath: 'user.updateUser',
                            method: 'post',
                            data: {
                                id: this.id,
                                name: this.userInfo.name,
                                email: this.userInfo.email,
                                phone: this.userInfo.phone,
                                description: this.userInfo.description
                            },
                            successCallback: (res) => {
                                this.loading = false;
                                // 成功
                                this.$notify({
                                    title: '成功',
                                    message: '编辑成功',
                                    type: "success"
                                });
                                // 再次存储已经更新的信息
                                let deleteUserInfo = {
                                    code: JSON.parse(getLocalStore(USER)).code,
                                    username: JSON.parse(getLocalStore(USER)).username,
                                    name: this.userInfo.name,
                                    email: this.userInfo.email,
                                    phone: this.userInfo.phone,
                                    description: this.userInfo.description,
                                    id: JSON.parse(getLocalStore(USER)).id,
                                    sex: JSON.parse(getLocalStore(USER)).sex,
                                    heading: JSON.parse(getLocalStore(USER)).heading,
                                    status: JSON.parse(getLocalStore(USER)).status,
                                    type: JSON.parse(getLocalStore(USER)).type
                                }
                                console.log(deleteUserInfo)
                                setLocalStore(USER, deleteUserInfo)
                                this.dialogEditInfo = false
                            },
                            errorCallback: (err) => {
                                this.loading = false
                                // 失败
                                this.$notify.error({
                                    title: '失败',
                                    message: '编辑失败'
                                });
                                this.dialogEditInfo = false
                            },
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .edit-info-component {
        .pop-box {
            padding: 0 30px;
        }
    }
</style>