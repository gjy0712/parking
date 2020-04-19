<template>
    <div class="garage-detail-container">
        <page-header :borderBottom="true">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>您当前所在的位置</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/carStationList' }">车库信息管理</el-breadcrumb-item>
                <el-breadcrumb-item>车库详情</el-breadcrumb-item>
            </el-breadcrumb>
        </page-header>

        <div class="detail-content">
            <div class="garage-title">"{{garageObj.garageName}}"车库车位管理</div>
            <div class="garage-box">
                <div class="message-box">
                    <h4>{{garageObj.garageName}}</h4>
                    <p>位置：{{garageObj.garageLocation}}</p>
                    <p>描述：{{garageObj.garageDescription}}</p>
                    <span>车位总数：{{garageObj.garageTotal}}</span>
                    <div class="box-space"></div>
                    <span>车位价格：{{garageObj.garagePrice}}元/{{garageObj.garagePricetime}}小时</span>
                </div>
                <!--                button-->
                <div class="button-box">
                    <el-button class="add" size="small" type="success" plain icon="el-icon-edit"
                               @click="handleClickEditInfo">
                        修改车库信息
                    </el-button>
                    <el-button class="add" size="small" type="danger" icon="el-icon-plus"
                               @click="handleClickAddSpace">
                        添加车库车位
                    </el-button>
                </div>
                <!--列表展示-->
                <div class="table-box">
                    <el-table :data="tableData" v-loading="loading" stripe style="width: 100%" class="el-table-reset-lite-style">
                        <el-table-column type="index" label="#" width="50"></el-table-column>
                        <el-table-column prop="carName" label="名称"></el-table-column>
                        <el-table-column prop="carLocation" label="位置"></el-table-column>
                        <el-table-column prop="carPrice,carPriceTime" label="车位价格" width="200">
                            <template slot-scope="scope">
                                {{scope.row.carPrice}}元/{{scope.row.carPriceTime}}小时
                            </template>
                        </el-table-column>
                        <el-table-column prop="carType" label="类型" width="180">
                            <!--<template  slot-scope="scope">
                                    {{carType(scope.row.carType)}}
                            </template>-->
                        </el-table-column>
                        <el-table-column prop="carStatus" label="状态">
                            <template  slot-scope="scope">
                                <span v-if="scope.row.carStatus=== 0" style="color: red;font-size: 10px">有车</span>
                                <span v-else-if="scope.row.carStatus=== 1" style="color: green;font-size: 10px">空闲</span>
<!--                                {{carStatus(scope.row.carStatus)}}-->
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="200">
                            <template slot-scope="scope">
                                <el-button type="text"
                                           icon="el-icon-edit"
                                           @click="handleEdit(scope.$index)">
                                </el-button>
                                <el-button type="text"
                                           icon="el-icon-delete"
                                           @click="deleteData(scope.row.id,scope.row.garageId)">
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
        </div>

        <!--添加 / 编辑车位-->
        <el-dialog
                :title="isEdited ? '修改车位信息': '添加车位' "
                :visible.sync="dialogVisibleGarage"
                class="el-dialog-style-reset"
                :close-on-click-modal="false"
                width="600px"
                @click="handleCancel('info')">
            <div class="pop-box">
                <el-form
                        :model="infoData"
                        :rules="infoRule"
                        size="small"
                        ref="info"
                        label-width="100px"
                        :validate-on-rule-change="false"
                        class="demo-ruleForm">
                    <el-form-item label="名称：" prop="carName">
                        <el-input v-model.trim="infoData.carName" placeholder="请输入车位的名称"></el-input>
                    </el-form-item>
                    <el-form-item label="位置：" prop="carLocation">
                        <el-input v-model.trim="infoData.carLocation" placeholder="请输入车位位置（可以不填）"></el-input>
                    </el-form-item>
                    <el-form-item label="车位价格：" prop="carPrice">
                        <el-input class="car-price" v-model.trim="infoData.carPrice" placeholder="价格"></el-input>
                        元/每
                        <el-input class="car-price car-time"
                                  style="width: 130px"
                                  v-model.trim="infoData.carPriceTime"
                                  ref="carPricetime"
                                  placeholder="时间">
                        </el-input>
                        小时
                    </el-form-item>
                    <el-form-item label="车位类型：" prop="carType">
                        <el-select v-model="infoData.carType">
                            <el-option
                                    v-for="item in typeList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
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

        <!--    修改车库    -->
        <el-dialog
                title="修改车库信息"
                :visible.sync="dialogVisibleEdit"
                class="el-dialog-style-reset"
                :close-on-click-modal="false"
                width="600px"
                @click="handleCancel('edit_info')">
            <div class="edit-box">
                <div class="dialog-header">*注意：车位价格修改后，所有车位价格都将修改</div>
                <el-form
                        :model="editCarData"
                        :rules="editCarRule"
                        size="small"
                        ref="edit_info"
                        label-width="100px"
                        :validate-on-rule-change="false"
                        class="demo-ruleForm">
                    <el-form-item label="名称：" prop="name">
                        <el-input v-model.trim="editCarData.name" placeholder="请输入车库的名称"></el-input>
                    </el-form-item>
                    <el-form-item label="位置：" prop="location">
                        <el-input v-model.trim="editCarData.location" placeholder="请输入车库的位置"></el-input>
                    </el-form-item>
                    <el-form-item label="描述：" prop="description">
                        <el-input v-model.trim="editCarData.description" placeholder="请输入车库描述（可以不填）"></el-input>
                    </el-form-item>
                    <el-form-item label="车位总数：" prop="total">
                        <el-input v-model.trim="editCarData.total" placeholder="请输入车位数量"></el-input>
                    </el-form-item>
                    <el-form-item label="车位价格：" prop="price">
                        <el-input class="car-price" v-model.trim="editCarData.price" placeholder="价格"></el-input>
                        元/每
                        <el-input class="car-price car-time"
                                  style="width: 130px"
                                  v-model.trim="editCarData.priceTime"
                                  ref="priceTime"
                                  placeholder="时间">
                        </el-input>
                        小时
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small"
                           class="custom-button_long"
                           @click="handleCancelEdit('edit_info')">关闭</el-button>
                <el-button
                        size="small"
                        type="primary"
                        :loading="loading"
                        class="custom-button_long"
                        @click="handleSubmitEdit()">
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
        name: "garage-management-detail",
        components: { PageHeader },
        data() {
            return {
                loading :false,
                isEdited: false,

                garageObj: {
                    garageName: '',
                    garageLocation: '',
                    garageDescription: '',
                    garageTotal: '',
                    garagePrice: '',
                    garagePricetime: ''
                },
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                pageTotal: 0,
                // 修改车库信息的dialog
                dialogVisibleEdit: false,
                // 车库的
                editCarData: {
                    name: '',
                    location: '',
                    description: '',
                    total: '',
                    price: '',
                    priceTime: ''
                },
                dialogVisibleGarage: false, // 修改/添加车位
                // 车位
                infoData: {
                    carName: '',
                    carType: '小车位',
                    carPrice: '',
                    carPriceTime: '',
                    carLocation: ''
                },
                typeList: [
                    {
                        value: '小车位',
                        label: '小车位'
                    }, {
                        value: '大车位',
                        label: '大车位'
                    }
                ],
                garageId: '',
            }
        },
        created() {
            this.garageId = this.$route.query.id || '';
            /*this.garageObj.garageName = this.$route.query.garageName || '';
            this.garageObj.garageLocation = this.$route.query.garageLocation || '';
            this.garageObj.garageDescription = this.$route.query.garageDescription || '';
            this.garageObj.garageTotal = this.$route.query.garageTotal || '';
            this.garageObj.garagePrice = this.$route.query.garagePrice || '';
            this.garageObj.garagePricetime = this.$route.query.garagePricetime || '';*/

            this.getCarList()
            this.getGarageList()
        },
        computed: {
            infoRule() {
                // 价格验证
                const validatePrice = (rule, value, callback) => {
                    let time = this.$refs.carPricetime.value;
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
                    carName: [
                        { required: true, message: "车位名称不能为空", trigger: 'blur' },
                        { min: 2, max: 12, message: "车位名称长度为2-12位", trigger: 'blur' }
                    ],
                    carPrice: [
                        { required: true, message: "价格不能为空", trigger: 'blur' },
                        {validator: validatePrice, trigger: 'blur' }
                    ],
                    carType: [
                        { required: true, message: '请选择车位类型', trigger: 'change' }
                    ]
                }
            },
            editCarRule() {
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
                    let time = this.$refs.priceTime.value;
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
                    name: [
                        { required: true, message: "车库名称不能为空", trigger: 'blur' },
                        { min: 2, max: 12, message: "车库名称长度为2-12位", trigger: 'blur' }
                    ],
                    location: [
                        { required: true, message: "位置不能为空", trigger: 'blur' }
                    ],
                    total: [
                        { required: true, message: "车位总数不能为空", trigger: 'blur' },
                        {validator: validateTotal, trigger: 'blur' }
                    ],
                    price: [
                        { required: true, message: "价格不能为空", trigger: 'blur' },
                        {validator: validatePrice, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            carStatus(type){
                let text = "";
                switch(type){
                    case 0:
                        text = '有车';
                        break;
                    case 1:
                        text = '空闲';
                        break;
                }
                return text;
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.getCarList()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getCarList()
            },
            // 修改车库
            handleClickEditInfo() {
                this.dialogVisibleEdit = true;
                this.getGarageList()
            },

            // 关闭修改车库dialog
            handleCancelEdit(formName) {
                this.$refs[formName].clearValidate()
                this.dialogVisibleEdit = false
                this.editCarData =  {
                    name: '',
                    location: '',
                    description: '',
                    total: '',
                    price: '',
                    priceTime: ''
                }
            },

            // 提交修改的车库
            handleSubmitEdit() {
                this.$refs['edit_info'].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        apiDataFilter.request({
                            apiPath: 'garage.updateGarage',
                            method: 'post',
                            data: {
                                id: parseInt(this.garageId),
                                garageName: this.editCarData.name,
                                garageLocation: this.editCarData.location,
                                garageDescription: this.editCarData.description,
                                garageTotal: this.editCarData.total,
                                garagePrice: this.editCarData.price,
                                garagePricetime: this.editCarData.priceTime,
                            },
                            successCallback: (res) => {
                                this.loading = false;
                                this.$notify({
                                    title: '成功',
                                    message: '修改车库成功',
                                    type: "success"
                                });
                                this.dialogVisibleEdit = false;
                                this.getCarList();  // 刷新车位列表
                                this.getGarageList(); // 刷新车库信息
                            },
                            errorCallback: (err) => {
                                this.$notify.error({
                                    title: '失败',
                                    message: '修改车库失败'
                                });
                                this.loading = false;
                                this.dialogVisibleEdit = false;
                                this.getCarList();  // 刷新车位列表
                                this.getGarageList(); // 刷新车库信息
                            },
                            completeCallback: () => {
                                this.loading = false
                            }
                        })
                    }
                })
            },

            // 获取某个车库信息
            getGarageList() {
                apiDataFilter.request({
                    apiPath: 'garage.getGarage',
                    method: 'post',
                    data: {
                        garageId: parseInt(this.garageId)
                    },
                    successCallback: (res) => {
                        this.garageObj = res.data;
                        // this.editCarData = res.data;
                        this.editCarData.name = res.data.garageName;
                        this.editCarData.location = res.data.garageLocation;
                        this.editCarData.description = res.data.garageDescription;
                        this.editCarData.total = res.data.garageTotal;
                        this.editCarData.price = res.data.garagePrice;
                        this.editCarData.priceTime = res.data.garagePricetime;
                    },
                    errorCallback: (err) => {

                    },
                })
            },


            // 添加车位
            handleClickAddSpace() {
                this.dialogVisibleGarage = true
                this.isEdited = false;
            },

            // 修改车位
            handleEdit(index) {
                this.isEdited = true
                this.dialogVisibleGarage = true;
                // console.log(this.tableData[index])
                this.infoData = {
                    carName: this.tableData[index].carName,
                    carType: this.tableData[index].carType,
                    carPrice: this.tableData[index].carPrice,
                    carPriceTime: this.tableData[index].carPriceTime,
                    carLocation: this.tableData[index].carLocation
                }
            },

            /* 关闭添加/修改车位dialog */
            handleCancel(formName) {
                this.$refs[formName].clearValidate()
                this.infoData =  {
                    carName: '',
                    carType: '小车位',
                    carPrice: '',
                    carPriceTime: '',
                    carLocation: ''
                }
                this.dialogVisibleGarage = false  // 关闭添加/修改车位dialog
            },

            // 删除车位
            deleteData(id, garageId) {
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
                        apiPath: 'car.deleteCar',
                        method: 'post',
                        data: {
                            carId: id,
                            garageId: garageId
                        },
                        successCallback: (res) => {
                            // 成功
                            this.$notify({
                                title: '成功',
                                message: '删除车位成功',
                                type: "success"
                            });
                            this.getCarList()  // 刷新车位列表
                            this.getGarageList();   // 刷新车库信息
                        },
                        errorCallback: (err) => {
                            // 失败
                            this.$notify.error({
                                title: '删除失败',
                                message: err.data.msg
                            });
                            this.getCarList()  // 刷新车位列表
                            this.getGarageList();   // 刷新车库信息
                        },
                    })
                })
            },

            // 确认提交 新增/编辑车位
            handleSubmit() {
                this.$refs['info'].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        let api = this.isEdited ? 'car.updateCar' : 'car.insertCar'
                        apiDataFilter.request({
                            apiPath: api,
                            method:'post',
                            data: {
                                carName: this.infoData.carName,
                                carType: this.infoData.carType,
                                carPrice: this.infoData.carPrice,
                                carPriceTime: this.infoData.carPriceTime,
                                carLocation: this.infoData.carLocation,
                                garageId: parseInt(this.garageId)
                            },
                            successCallback: (res) => {
                                this.loading = false;
                                this.$notify({
                                    title: '成功',
                                    message: this.isEdited ? '修改成功' : '添加成功',
                                    type: "success"
                                });
                                this.getGarageList();  // 刷新车库信息
                                this.getCarList();   // 刷新车位列表
                                this.dialogVisibleGarage = false;
                                this.infoData = {
                                    carName: '',
                                    carType: '小车位',
                                    carPrice: '',
                                    carPriceTime: ''
                                }
                            },
                            errorCallback: (err) => {
                                this.$notify.error({
                                    title: this.isEdited ? '编辑失败' : '添加失败',
                                    message: err.data.msg
                                });
                                this.loading = false;
                                this.getGarageList();   // 刷新车库信息
                                this.getCarList();   // 刷新车位列表
                                this.dialogVisibleGarage = false;
                                this.infoData = {
                                    carName: '',
                                    carType: '小车位',
                                    carPrice: '',
                                    carPriceTime: ''
                                }
                            },
                            completeCallback: () => {
                                this.loading = false
                            }
                        })
                    }
                })
            },

            // 获取车位列表
            getCarList() {
                this.loading = true;
                apiDataFilter.request({
                    apiPath: 'car.getCarList',
                    method: 'post',
                    data: {
                        garageId: parseInt(this.garageId),
                        pageNum: this.currentPage,
                        pageSize: this.pageSize
                    },
                    successCallback: (res) => {
                        this.loading = false;
                        this.tableData = res.data.list;
                        this.pageTotal = res.data.total;
                    },
                    errorCallback: (err) => {
                        this.loading = false;
                    },
                })
            },

        }
    }
</script>

<style lang="less" scoped>
    @import "../assets/style/variables.less";
    @import "../assets/less/base/base_pan.less";

    .garage-detail-container {
        background-color: @default-color;
        padding-bottom: 20px;

        .detail-content {
            margin-top: 15px;
            .garage-title {
                background-color: #d3d3d3;
                border-radius: 10px;
                color: #3877aa;
                font-size: 30px;
                height: 100px;
                padding: 30px;
                width: 100%;
            }

            .garage-box {
                padding: 20px;
                .message-box {
                    background-color: #dff0d8;
                    margin-bottom: 15px;
                    padding: 20px;

                    .box-space {
                        width: 50px;
                        display: inline-block;
                    }
                }

                .button-box {

                }
            }
        }

        .pop-box {
            .car-price {
                width: 30%;
            }
            .car-time {
                width: 60%;
            }
        }

        .edit-box {
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