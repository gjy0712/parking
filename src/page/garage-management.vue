<template>
    <div class="garage-container">
        <page-header :borderBottom="true">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>您当前所在的位置</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/carStationList' }">车库信息管理</el-breadcrumb-item>
            </el-breadcrumb>
        </page-header>

        <!--账号列表-->
        <div class="content-box">
            <div class="button-box">
                <el-button class="add" size="small" type="primary" icon="el-icon-plus"
                           @click="handleClickAddGarage">
                    添加车库
                </el-button>
            </div>
            <div class="table-box">
                <el-table :data="tableData" stripe style="width: 100%" class="el-table-reset-lite-style">
                    <el-table-column type="index" width="50" label="#"></el-table-column>
                    <el-table-column prop="garageName" label="名称"></el-table-column>
                    <el-table-column prop="garageLocation" label="位置"></el-table-column>
                    <el-table-column prop="garageDescription" label="描述" width="230"></el-table-column>
                    <el-table-column prop="garageTotal" label="车位总数"></el-table-column>
                    <el-table-column prop="garagePrice,garagePricetime" label="车位价格" width="200">
                        <template slot-scope="scope">
                            {{scope.row.garagePrice}}元/{{scope.row.garagePricetime}}小时
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button size="mini"
                                       @click="detail(scope.row.id)">
                                详情
                            </el-button>
                            <el-button size="mini" type="danger"
                                       @click="deleteData(scope.row.id, scope.$index)">
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

        <!--添加车库-->
        <el-dialog
                title="添加车库"
                :visible.sync="dialogVisibleAddGarage"
                class="el-dialog-style-reset"
                :close-on-click-modal="false"
                width="600px"
                @click="handleCancel('info')">
            <div class="pop-box">
                <div class="dialog-header">*注意：车位的默认名称为"车库名+数字"，例如"A1--1"。车位"位置"默认为空。车位类型默认为"小车位"。(车库和车位信息可点击"详情"，跳转后查看和修改)</div>
                <el-form
                        :model="newCarData"
                        :rules="newCarRule"
                        size="small"
                        ref="info"
                        label-width="100px"
                        :validate-on-rule-change="false"
                        class="demo-ruleForm">
                    <el-form-item label="名称：" prop="garageName">
                        <el-input v-model.trim="newCarData.garageName" placeholder="请输入车库的名称"></el-input>
                    </el-form-item>
                    <el-form-item label="位置：" prop="garageLocation">
                        <el-input v-model.trim="newCarData.garageLocation" placeholder="请输入车库的位置"></el-input>
                    </el-form-item>
                    <el-form-item label="描述：" prop="garageDescription">
                        <el-input v-model.trim="newCarData.garageDescription" placeholder="请输入车库描述（可以不填）"></el-input>
                    </el-form-item>
                    <el-form-item label="车位总数：" prop="garageTotal">
                        <el-input v-model.trim="newCarData.garageTotal" placeholder="请输入车位数量"></el-input>
                    </el-form-item>
                    <el-form-item label="车位价格：" prop="garagePrice">
                        <el-input class="car-price" v-model.trim="newCarData.garagePrice" placeholder="价格"></el-input>
                        元/每
                        <el-input class="car-price car-time"
                                  style="width: 130px"
                                  v-model.trim="newCarData.garagePricetime"
                                  ref="garagePricetime"
                                  placeholder="时间">
                        </el-input>
                        小时
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
                    添加
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { PageHeader } from "../components/public";
    import apiDataFilter from "../utils/apiDataFilter";

    export default {
        name: "garage-management",
        components: { PageHeader },
        data() {
            return {
                loading :false,
                dialogVisibleAddGarage: false,
                tableData: [],
                price: '',
                currentPage: 1,
                pageSize: 100,
                pageTotal: 0,
                newCarData: {
                    garageName: '',
                    garageLocation: '',
                    garageDescription: '',
                    garageTotal: '',
                    garagePrice: '',
                    garagePricetime: ''
                }
            }
        },
        created() {
            this.getGarageList()
        },
        computed: {
            newCarRule() {
                // 工号验证
                const validateTotal = (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('车位总数不能为空'));
                    } else {
                        const reg = /^-?[1-9]\d*$/;
                        if (!reg.test(value)) {
                            callback(new Error('车位总数为整数！'));
                        } else {
                            callback();
                        }
                    }
                };
                // 价格验证
                const validatePrice = (rule, value, callback) => {
                    let time = this.$refs.garagePricetime.value;
                    if( value === '') {
                        callback(new Error('价格不能为空'));
                    }else if( time === '') {
                        callback(new Error('时间不能为空'));
                    }else {
                        const reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
                        if (!reg.test(value) || !reg.test(time)) {
                            callback(new Error('单位为整数或小数！'));
                        } else {
                            callback();
                        }
                    }
                };
                return {
                    garageName: [
                        { required: true, message: "车库名称不能为空", trigger: 'blur' },
                        { min: 2, max: 12, message: "车库名称长度为2-12位", trigger: 'blur' }
                    ],
                    garageLocation: [
                        { required: true, message: "位置描述不能为空", trigger: 'blur' }
                    ],
                    garageTotal: [
                        { required: true, message: "车位总数不能为空", trigger: 'blur' },
                        {validator: validateTotal, trigger: 'blur' }
                    ],
                    garagePrice: [
                        { required: true, message: "价格不能为空", trigger: 'blur' },
                        { min: 0.01, message: "最小价格为0.01", trigger: 'blur' },
                        {validator: validatePrice, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            // 添加车库
            handleClickAddGarage() {
                this.dialogVisibleAddGarage = true

            },
            detail(id) {
                this.$router.push({
                    path: '/carStationDetail',
                    query: {
                        id: id
                    }
                })
            },
            // 删除数据
            deleteData(scope, index) {
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
                // this.queryCpp()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                // this.queryCpp()
            },
            handleCancel(formName) {
                this.$refs[formName].clearValidate()
                this.dialogVisibleAddGarage = false
                this.loading = false
            },
            // 提交车库
            handleSubmit() {
                this.loading = true;
                apiDataFilter.request({
                        apiPath: 'garage.insertGarage',
                        method: 'post',
                        data: {
                            garageName: this.newCarData.garageName,
                            garageLocation: this.newCarData.garageLocation,
                            garageDescription: this.newCarData.garageDescription,
                            garageTotal: this.newCarData.garageTotal,
                            garagePrice: this.newCarData.garagePrice,
                            garagePricetime: this.newCarData.garagePricetime,
                        },
                        successCallback: (res) => {
                            this.loading = false;
                            this.$notify({
                                title: '成功',
                                message: '添加车库成功！',
                                type: "success"
                            });
                            this.getGarageList()

                        },
                    errorCallback: (err) => {
                        // 失败
                        this.$notify.error({
                            title: '失败',
                            message: "添加车库失败"
                        });
                        this.loading = false;
                        this.getGarageList()
                    },
                })
            },
            getGarageList() {
                this.loading = true;
                apiDataFilter.request({
                    apiPath: 'garage.getGarageList',
                    method: 'post',
                    data: '',
                    successCallback: (res) => {
                        this.loading = false;
                        this.tableData = res.data.garageInfoList;
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
    @import "../assets/less/base/base_pan.less";

    .garage-container {
        background-color: @default-color;
        padding-bottom: 20px;

        .content-box {
            padding: 20px;

            .button-box {
            }
        }
        .pop-box {
            .dialog-header {
                color: @theme-color;
                font-size: 9px;
                margin-bottom: 10px;
            }
            .car-price {
                width: 30%;
            }
            .car-time {
                width: 60%;
            }
        }
    }
</style>