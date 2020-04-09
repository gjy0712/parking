<template>
    <div class="people-container">
        <page-header :borderBottom="true">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>您当前所在的位置</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/employee' }">人员管理</el-breadcrumb-item>
            </el-breadcrumb>
        </page-header>
        <!--条件搜索-->
        <div class="search-box">
            <el-row>
                <el-col :span="6">
                    <div class="grid-content">
                        工号：
                        <el-input size="small" v-model="searchObj.code"
                                  @keyup.enter.native="handleSearch"
                                  placeholder="请输入工号"></el-input>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                        账号：
                        <el-input size="small" v-model="searchObj.username"
                                  @blur="handleSearch"
                                  @keyup.enter.native="handleSearch"
                                  placeholder="请输入账号">
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                        姓名：
                        <el-input size="small" v-model="searchObj.name"
                                  @blur="handleSearch"
                                  @keyup.enter.native="handleSearch"
                                  placeholder="请输入姓名">
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                        <el-button size="small" @click="handleReset" class="custom-button_long">重置</el-button>
                        <el-button type="primary" size="small" @click="handleSearch" class="custom-button_long">查询</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!--账号列表-->
        <div class="content-box">
            <div class="button-box">
                <el-button class="add" size="small" type="primary" icon="el-icon-plus"
                           @click="handleClickAddUser">
                    添加员工
                </el-button>
            </div>
            <div class="table-box">
                <el-table :data="tableData" stripe style="width: 100%" class="el-table-reset-lite-style">
                    <el-table-column type="index" label="#" width="30"></el-table-column>
                    <el-table-column prop="code" label="工号"></el-table-column>
                    <el-table-column prop="username" label="账号"></el-table-column>
                    <el-table-column prop="name" label="姓名"></el-table-column>
                    <el-table-column prop="sex" label="性别"></el-table-column>
                    <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
                    <el-table-column prop="phone" label="电话" width="130"></el-table-column>
                    <el-table-column prop="type" label="权限">
                        <template slot-scope="props">
                            <el-tooltip class="item" effect="dark"
                                        :content="props.row.authority? '职员' : '管理员'" placement="top">
                                <el-switch
                                        v-model="props.row.type"
                                        :active-value='1'
                                        :inactive-value='0'
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        @change="(val)=>changeAuthority(val,props.row.id)">
                                </el-switch>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="props">
                            <el-tooltip class="item" effect="dark"
                                        :content="props.row.status? '禁用' : '可用'" placement="top">
                                <el-switch
                                        v-model="props.row.status"
                                        :active-value='1'
                                        :inactive-value='0'
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        @change="(val)=>changeStatus(val,props.row.id)">
                                </el-switch>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="account_cloud_id" label="操作">
                        <template slot-scope="scope">
                            <el-button @click="handleDelete(scope.row, scope.$index)" type="text">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="pagination-box">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="[10, 15, 20]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="pageTotal"
                            class="custom-pagination">
                    </el-pagination>
                </div>
            </div>
        </div>

        <el-dialog
                title="添加员工"
                :visible.sync="dialogVisibleAddEmployee"
                class="el-dialog-style-reset"
                :close-on-click-modal="false"
                width="500px"
                @click="handleCancel('info')">
            <div class="pop-box">
                <el-form
                        :model="employeeData"
                        :rules="employeeRule"
                        size="small"
                        ref="info"
                        label-width="80px"
                        :validate-on-rule-change="false"
                        class="demo-ruleForm">
                    <el-form-item label="账号：" prop="username">
                        <el-input v-model.trim="employeeData.username" placeholder="请输入6~12位字符"></el-input>
                    </el-form-item>
                    <el-form-item label="密码：" prop="password">
                        <el-input v-model.trim="employeeData.password" :disabled="isEdited" placeholder="默认为账号"></el-input>
                    </el-form-item>
                    <el-form-item label="工号：" prop="code">
                        <el-input v-model.trim="employeeData.code" placeholder="请输入5为数字"></el-input>
                    </el-form-item>
                    <el-form-item label="昵称：" prop="name">
                        <el-input v-model.trim="employeeData.name" placeholder="请输入2~12位的字符"></el-input>
                    </el-form-item>
                    <el-form-item label="性别：" prop="sex">
                        <el-select v-model="employeeData.sex">
                            <el-option
                                    v-for="item in sexList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="邮箱：" prop="email">
                        <el-input v-model.trim="employeeData.email" placeholder="请输入正确的邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="电话：" prop="phone">
                        <el-input v-model.trim="employeeData.phone" placeholder="请输入正确的手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="签名：" prop="description">
                        <el-input
                            type="textarea"
                            v-model.trim="employeeData.description"
                            placeholder="美好的一天!">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small"
                           class="custom-button_long"
                           @click="handleCancel('info')">取消</el-button>
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
    </div>
</template>

<script>
    import { PageHeader } from "../components/public";
    import apiDataFilter from "../utils/apiDataFilter";

    export default {
        name: "people-management",
        components: { PageHeader },
        data() {
            return {
                loading :false,
                isEdited: true,
                searchObj: {
                    code: '',
                    username: '',
                    name: ''
                },
                tableData: [],
                currentPage: 1,
                pageSize: 100,
                pageTotal: 0,
                dialogVisibleAddEmployee: false,
                employeeData: {
                    username: '',
                    password: '',
                    code: '',
                    name: '',
                    sex: '',
                    email: '',
                    phone: '',
                    description: ''
                },
                sexList: [
                    {
                        value: '1',
                        label: '男'
                    }, {
                        value: '0',
                        label: '女'
                    }
                ],

            }
        },
        computed: {
            employeeRule() {
                // 工号验证
                const validateCode = (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('工号不能为空'));
                    } else {
                        const reg = /[0-9]{5}/;
                        if (!reg.test(value)) {
                            callback(new Error('工号为5为数字'));
                        } else {
                            callback();
                        }
                    }
                };
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
                    username: [
                        { required: true, message: "账号不能为空", trigger: 'blur' },
                        { min: 6, max: 12, message: "请输入6~12位的字符", trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: "工号不能为空", trigger: 'blur' },
                        {validator: validateCode, trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: "姓名不能为空", trigger: 'blur' },
                        { min: 2, max: 12, message: "请输入2~12位的字符", trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: "邮箱不能为空", trigger: 'blur' },
                        {validator: validateMail, trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: "手机号不能为空", trigger: 'blur' },
                        {validator: validatePhone, trigger: 'blur' }
                    ],

                }
            }
        },
        created() {
            this.getUserList()
        },
        methods: {
            // 搜索查询
            handleSearch() {

            },
            // 重置按钮
            handleReset() {

            },
            // 添加员工按钮
            handleClickAddUser() {
                this.dialogVisibleAddEmployee = true
            },
            // 管理员与职员修改
            changeAuthority(){

            },
            // 状态开关 可用禁用
            changeStatus(value, id) {
                // console.log(id);
            },
            // 删除
            handleDelete(scope, index) {
                this.$confirm(
                    "您确认要删除此条数据吗？",
                    "提示",
                    {
                        confirmButtonText: "确认",
                        cancelButtonText: "取消",
                        type: 'warning'
                    }
                ).then(() => {
                    this.tableData.splice(index, 1)
                })
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.getUserList()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getUserList()
            },
            // 关闭dialog
            handleCancel(formName) {
                this.$refs[formName].clearValidate()
                this.dialogVisibleAddEmployee = false
            },
            // 提交新员工信息
            handleSubmit() {
                this.$refs['info'].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        apiDataFilter.request({
                            apiPath: 'user.insertUser',
                            method: 'post',
                            data: {
                                code: this.employeeData.code,
                                username: this.employeeData.code,
                                name: this.employeeData.name,
                                sex: this.employeeData.sex,
                                email: this.employeeData.email,
                                phone: this.employeeData.phone,
                                description: this.employeeData.description
                            },
                            successCallback: (res) => {
                                this.loading = false;
                                // 成功
                                this.$notify({
                                    title: '成功',
                                    message: '添加成功',
                                    type: "success"
                                });
                                this.dialogVisibleAddEmployee = false
                                this.getUserList()
                            },
                            errorCallback: (err) => {
                                this.loading = false
                                // 失败
                                this.$notify.error({
                                    title: '失败',
                                    message: '添加失败'
                                });
                                this.getUserList()
                            },
                        })
                    }
                })
            },
            getUserList() {
                this.loading = true;
                apiDataFilter.request({
                    apiPath: 'user.getUserList',
                    method: 'post',
                    data: {
                        pageNum: this.currentPage,
                        pageSize: this.pageSize
                    },
                    successCallback: (res) => {
                        this.loading = false;
                        this.tableData = res.data.list;
                        this.pageTotal = res.data.total;
                    },
                    errorCallback: (err) => {
                        // 失败
                        /*this.$notify.error({
                            title: '失败',
                            message: err.data.msg
                        });*/
                    },
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/style/variables.less";

    .people-container {
        background-color: @default-color;
        padding-bottom: 20px;

        .search-box {
            background-color: @gray-color;
            padding: 20px 0;
            margin-top: 20px;

            .el-row {
                padding-left: 20px;

                .grid-content {
                    color: @dark-font-color;

                    .el-input,
                    .el-select {
                        display: inline-block;
                        width: 60%;
                    }
                }
            }
        }

        .content-box {
            padding: 20px;

            .button-box {
            }
        }
    }
</style>