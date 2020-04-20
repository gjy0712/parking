<template>
    <div class="vehicle-storage-container">
        <page-header :borderBottom="true">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>您当前所在的位置</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/employee/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>车辆入库</el-breadcrumb-item>
            </el-breadcrumb>
        </page-header>

        <!--条件搜索-->
        <div class="search-box">
            <el-row>
                <el-col :span="6">
                    <div class="grid-content">
                        <el-select v-model="searchObj.selectName" class="search-input" @change="handleSearch()" clearable size="small">
                            <el-option
                                    v-for="item in options"
                                    :key="item.garageId"
                                    :label="item.garageName"
                                    :value="item.garageId">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                        <el-button type="primary" size="small" @click="handleSearch()" class="custom-button_long" icon="el-icon-search">搜索</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!--车库列表展示-->
        <div class="car-content">
            <div>
                名称：{{garageName}}
                <div class="space"></div>
                车位总数：{{garageTotal}}
            </div>
            <p>位置：{{garageLocation}}</p>
            <p>描述：{{garageDescription}}</p>
        </div>

        <div class="content-box">
            <div class="title">{{garageName}}车库</div>
            <div class="style-box">
                <img src="../../../assets/images/minCar.png" alt="小车位">
                <span>：小车位</span>
                <div class="car-space"></div>
                <img src="../../../assets/images/maxCar.png" alt="小车位">
                <span>：大车位</span>
                <div class="car-space"></div>
                <img src="../../../assets/images/green.png" alt="">
                <span>：无车</span>
                <div class="car-space"></div>
                <img src="../../../assets/images/orange.png" alt="">
                <span>：有车</span>
            </div>
            <div class="parking-list" v-for="(item, index) in carList" :key="item.id" @click="openDialog(index, item)">
                <div :class="item.carStatus === 1 ? 'parking-success' : 'parking-danger' ">
                    <img :src="item.carType === '小车位' ? minImage : maxImage " alt="" class="parking-image">
                    <p style="color: #fff;width: 100%;margin: 0 auto">{{item.carName}}</p>
                    <p style="font-size: 13px;color: #fff">{{item.carPrice}}元/{{item.carPriceTime}}小时</p>
                </div>

            </div>
        </div>

        <!--可以停车的dialog-->
        <el-dialog
                title="停车"
                :visible.sync="dialogVisiable"
                class="el-dialog-style-reset"
                :close-on-click-modal="false"
                width="600px"
                @click="handleCancel('info')">
            <div class="pop-box">
                <div class="pop-title">
                    <div>
                        车位名称：{{carObj.carName}}
                        <div class="space"></div>
                        车位位置：{{carObj.carLocation}}
                    </div>
                    <div>
                        车位类型：{{carObj.carType}}
                        <div class="space"></div>
                        车位价格：{{carObj.carPrice}}元/{{carObj.carPriceTime}}小时
                    </div>
                </div>
                <el-form
                        :model="searchData"
                        :rules="searchRule"
                        size="small"
                        ref="info"
                        label-width="100px"
                        :validate-on-rule-change="false"
                        class="demo-ruleForm">
                    <el-form-item label="车牌号：" prop="province">
                        <el-select v-model="searchData.province" style="width: 95px; margin-right: 20px">
                            <el-option
                                    v-for="item in optionList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <el-input class="input-car-number"
                                  style="width: 200px"
                                  v-model.trim="searchData.carNumber"
                                  ref="carNumber"
                                  placeholder="请输入车牌号码">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="停车人姓名：" prop="parkName">
                        <el-input v-model.trim="searchData.parkName" placeholder="请输入停车人姓名（可以不填）" style="width: 315px"></el-input>
                    </el-form-item>
                    <el-form-item label="停车人电话：" prop="parkPhone">
                        <el-input v-model.trim="searchData.parkPhone" placeholder="请输入停车人电话（可以不填）" style="width: 315px"></el-input>
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
                停车
            </el-button>
        </span>
        </el-dialog>

        <!--查看已经停了车的车辆信息-->
        <el-dialog
                title="车辆信息"
                :visible.sync="dialogCarInfo"
                class="el-dialog-style-reset"
                :close-on-click-modal="false"
                width="600px"
                @click="handleCancelInfo()">
            <div class="car-box">
                <div class="car-message">
                    <div class="car-number">
                        车牌：
                        <span class="color">{{carInfo.province}}{{carInfo.carnumber}}
                        </span>
                    </div>
                    <div class="car-number">
                        停车人姓名：
                        <span class="color">{{carInfo.customername}}
                        </span>
                        <div style="display: inline-block;width: 40px"></div>
                        停车人电话：
                        <span class="color">{{carInfo.customerphone}}</span>
                    </div>
                    <div class="car-number">
                        停车时间：
                        <span class="color">{{carInfo.starttime}}
                        </span>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small"
                           class="custom-button_long"
                           @click="handleCancelInfo()">关闭
                    </el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { PageHeader } from "../../../components/public";
    import apiDataFilter from "../../../utils/apiDataFilter";
    import {getLocalStore} from "../../../utils/webstore-utils";
    import { USER } from '@/config/webstore'

    export default {
        name: "vehicle-storage",
        components: { PageHeader },
        data() {
            return {
                loading: false,
                searchObj: {
                    selectName: ''
                },
                garageName: '',
                garageTotal: '',
                garageLocation: '',
                garageDescription: '',
                options: [],  // 车库名字
                carList: [],
                dialogVisiable: false,
                // 停车传入的字段
                searchData: {
                    carNumber: '',
                    province: '京',
                    parkName: '',
                    parkPhone: ''
                },
                // 车牌号
                optionList: [
                    {
                        value: '京',
                        label: '京'
                    },
                    {
                        value: '津',
                        label: '津'
                    },
                    {
                        value: '冀',
                        label: '冀'
                    },
                    {
                        value: '晋',
                        label: '晋'
                    },
                    {
                        value: '蒙',
                        label: '蒙'
                    },
                    {
                        value: '辽',
                        label: '辽'
                    },
                    {
                        value: '吉',
                        label: '吉'
                    },
                    {
                        value: '黑',
                        label: '黑'
                    },
                    {
                        value: '沪',
                        label: '沪'
                    },
                    {
                        value: '苏',
                        label: '苏'
                    },
                    {
                        value: '浙',
                        label: '浙'
                    },
                    {
                        value: '皖',
                        label: '皖'
                    },
                    {
                        value: '闽',
                        label: '闽'
                    },
                    {
                        value: '赣',
                        label: '赣'
                    },
                    {
                        value: '鲁',
                        label: '鲁'
                    },
                    {
                        value: '豫',
                        label: '豫'
                    },
                    {
                        value: '鄂',
                        label: '鄂'
                    },
                    {
                        value: '湘',
                        label: '湘'
                    },
                    {
                        value: '粤',
                        label: '粤'
                    },
                    {
                        value: '桂',
                        label: '桂'
                    },
                    {
                        value: '琼',
                        label: '琼'
                    },
                    {
                        value: '渝',
                        label: '渝'
                    },
                    {
                        value: '川',
                        label: '川'
                    },
                    {
                        value: '贵',
                        label: '贵'
                    },
                    {
                        value: '云',
                        label: '云'
                    },
                    {
                        value: '藏',
                        label: '藏'
                    },
                    {
                        value: '陕',
                        label: '陕'
                    },
                    {
                        value: '甘',
                        label: '甘'
                    },
                    {
                        value: '青',
                        label: '青'
                    },
                    {
                        value: '宁',
                        label: '宁'
                    },
                    {
                        value: '新',
                        label: '新'
                    }
                ],
                garageId: '',
                // 停车获取的信息
                carObj: {
                    carName: '',
                    carLocation: '',
                    carType: '',
                    carPrice: '',
                    carPriceTime: '',
                    id: '',
                    garageId: ''
                },
                userId: '',
                dialogCarInfo: false,
                // 获取车辆信息
                carInfo: {
                    province: '',
                    carnumber: '',
                    customername: '',
                    customerphone: '',
                    createTime: ''
                },
                maxImage: require("../../../assets/images/maxCar.png"),
                minImage: require('../../../assets/images/minCar.png')

            }
        },
        computed: {
            searchRule() {
                const validateProvince = (rule, value, callback) => {
                    let carNumber = this.$refs.carNumber.value;
                    if( value === '') {
                        callback(new Error('车牌省市不能为空'));
                    }else if( carNumber === '') {
                        callback(new Error('车牌号不能为空'));
                    }else {
                        const reg = /^[冀豫云辽黑湘皖鲁苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼渝京津沪新京军空海北沈兰济南广成使领A-Z]{1}[a-zA-Z0-9]{5}[a-zA-Z0-9挂学警港澳]{1}$/;
                        if (!reg.test(value + carNumber)) {
                            callback(new Error('请输入正确的车牌号！'));
                        } else {
                            callback();
                        }
                    }

                }
                return {
                    province: [
                        { required: true, message: "车牌省市不能为空", trigger: 'blur' },
                        {validator: validateProvince, trigger: 'blur' }
                    ],
                    carName: [
                        { required: true, message: "请输入车位名", trigger: 'blur' }
                    ]
                }
            }
        },
        mounted() {
            let userObj = JSON.parse(getLocalStore(USER))
            this.userId = userObj.id;
        },
        created() {
            this.getGarageNameList()
            // this.getGarage()
        },
        methods: {
            // 搜索
            handleSearch() {
                this.getGarage()
                this.getCarList()
            },

            // 打开dialog
            openDialog(index, item) {
                if( item.carStatus === 1){
                    this.dialogVisiable = true
                }else {
                    this.getCarOrder(item.id)
                    this.dialogCarInfo = true
                }
                this.carObj = this.carList[index]
            },
            // 关闭停车的dialog
            handleCancel(forName) {
                this.searchData = {
                    carNumber: '',
                    province: '京',
                    parkName: '',
                    parkPhone: ''
                }
                this.$refs[forName].clearValidate()
                this.dialogVisiable = false

            },
            // 停车
            handleSubmit() {
                this.$refs['info'].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        apiDataFilter.request({
                            apiPath: 'order.addCarOrder',
                            method:'post',
                            data: {
                                province: this.searchData.province,
                                carnumber: this.searchData.carNumber,
                                customername: this.searchData.parkName,
                                customerphone: this.searchData.parkPhone,
                                garageId: this.carObj.garageId,
                                carId: this.carObj.id,
                                userId: this.userId
                            },
                            successCallback: (res) => {
                                this.loading = false;
                                this.$notify({
                                    title: '成功',
                                    message: '停车成功',
                                    type: "success"
                                });
                                this.dialogVisiable = false;
                                this.searchData = {
                                    carNumber: '',
                                    province: '京',
                                    parkName: '',
                                    parkPhone: ''
                                }
                                this.getCarList();
                            },
                            errorCallback: (err) => {
                                this.$notify.error({
                                    title: '失败',
                                    message: '停车失败'
                                });
                                this.loading = false;
                                this.dialogVisiable = false;
                                this.searchData = {
                                    carNumber: '',
                                    province: '京',
                                    parkName: '',
                                    parkPhone: ''
                                }
                                this.getCarList();
                            },
                            completeCallback: () => {
                                this.loading = false
                            }
                        })
                    }
                })
            },

            handleCancelInfo() {
                this.dialogCarInfo = false

            },

            // 获取车库名称
            getGarageNameList() {
                apiDataFilter.request({
                    apiPath: 'garage.getGarageNameList',
                    method: 'POST',
                    data: '',
                    successCallback: (res) => {
                        this.options = res.data.garageNameAndIdInfos;
                        this.getCarList()
                        // this.searchObj.garageName = res.data.garageNameAndIdInfos[0].garageName;
                    },
                    errorCallback: (res) => {

                    }
                })
            },

            // 获取车库信息
            getGarage() {
                apiDataFilter.request({
                    apiPath: 'garage.getGarage',
                    method: 'POST',
                    data: {
                        garageId: this.searchObj.selectName,
                    },
                    successCallback: (res) => {
                        this.garageName = res.data.garageName;
                        this.garageLocation = res.data.garageLocation;
                        this.garageDescription = res.data.garageDescription;
                        this.garageTotal = res.data.garageTotal;
                    },
                    errorCallback: (res) => {

                    }
                })
            },

            // 获取停车信息
            getCarList() {
                apiDataFilter.request({
                    apiPath: 'car.getCarList',
                    method:'POST',
                    data: {
                        garageId: this.searchObj.selectName,
                        pageNum: 1,
                        pageSize: 100
                    },
                    successCallback: (res) => {
                        if(res.data) {
                            this.carList = res.data.list;
                        }else {
                            this.$message.warning('此车库中没有车位信息！')
                            this.carList = ''
                        }
                    },
                    errorCallback: (res) => {

                    }
                })
            },

            // 获取当前车位车辆信息
            getCarOrder(id) {
                apiDataFilter.request({
                    apiPath: 'order.getCarOrder',
                    method: 'POST',
                    data: {
                        carId: id
                    },
                    successCallback: (res) => {
                        this.carInfo = res.data
                    },
                    errorCallback: (res) => {

                    }
                })
            }

        }
    }
</script>

<style lang="less" scoped>
    @import "../../../assets/style/variables.less";

    .vehicle-storage-container {
        .search-box {
            // background-color: @gray-color;
            padding: 20px 0;

            .el-row {
                padding-left: 20px;

                .grid-content {
                    color: @dark-font-color;

                    .el-input,
                    .el-select {
                        display: inline-block;
                    }
                }
            }
        }

        .car-content {
            background-color: @gray-color;
            padding: 20px;
            .space {
                display: inline-block;
                width: 50px;
            }
        }

        .content-box {
            padding: 20px;
            .title {
                font-size: 25px;
                color: #20a0ff;
            }
            .style-box {
                border-bottom: solid 1px #7d9da0;
                padding-bottom: 5px;
                .car-space {
                    display: inline-block;
                    width: 30px;
                }
            }

            .parking-list {
                width: 100px;
                height: 100px;
                line-height: 33px;
                text-align: center;
                float: left;
                margin: 15px 12px;
                .parking-success {
                    background-color: #00B51D;
                    border-radius: 10px;
                    padding-top: 5px;
                }

                .parking-danger {
                    background-color: #ff5000;
                    border-radius: 10px;
                    padding-top: 5px;
                }
            }

        }

        .pop-box {
            padding: 0 40px;

            .pop-title {
                color: #ff5000;
                margin-bottom: 20px;

                .space {
                    display: inline-block;
                    width: 50px;
                }
            }
        }

        .car-box {
            padding: 20px;
            .car-message {
                background-color: #dff0d8;
                padding: 20px;
                margin-bottom: 20px;
                .car-number {
                    .color {
                        color: #ff5000;
                    }
                }
            }
            .dialog-footer {
                text-align: center;
            }
        }
    }
</style>