<template>
    <div class="vehicle-storage-container">
        <page-header :borderBottom="true">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>您当前所在的位置</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>车辆入库</el-breadcrumb-item>
            </el-breadcrumb>
        </page-header>

        <!--条件搜索-->
        <div class="search-box">
            <el-row>
                <el-col :span="6">
                    <div class="grid-content">
                        <el-select v-model="searchObj.carLocation" class="search-input" clearable @change="handleSearch()" size="small">
                            <el-option
                                    v-for="item in options"
                                    :key="item.id"
                                    :label="item.value"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                        <el-button type="primary" size="small" @click="handleSearch" class="custom-button_long" icon="el-icon-search">搜索</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!--车库列表展示-->
        <div class="car-content">
            <div>
                名称：{{name}}
                <div class="space"></div>
                车位总数：{{carTotal}}
            </div>
            <p>位置：{{location}}</p>
            <p>描述：{{description}}</p>
        </div>

        <div class="content-box">
            <div class="title">{{name}}车库</div>
            <div class="style-box">
                <img src="../../assets/images/minCar.png" alt="小车位">
                <span>：小车位</span>
                <div class="car-space"></div>
                <img src="../../assets/images/maxCar.png" alt="小车位">
                <span>：大车位</span>
                <div class="car-space"></div>
                <img src="../../assets/images/green.png" alt="">
                <span>：有车</span>
                <div class="car-space"></div>
                <img src="../../assets/images/orange.png" alt="">
                <span>：无车</span>
            </div>
            <div style="padding: 10px" class="parking-list" v-for="(item) in carList" :key="item.name" @click="openDialog">
                <img src="../../assets/images/minCar.png" alt="" class="parking-image">
                <p style="color: #fff;width: 100%;margin: 0 auto">{{item.name}}</p>
                <p style="font-size: 13px;color: #fff">{{item.parkingTime}}</p>
            </div>
        </div>

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
                        车位名称：E1--1
                        <div class="space"></div>
                        车位位置：
                    </div>
                    <div>
                        车位类型：小车位
                        <div class="space"></div>
                        车位价格：10元/2小时
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
    </div>
</template>

<script>
    import { PageHeader } from "../../components/public";
    import apiDataFilter from "../../utils/apiDataFilter";

    export default {
        name: "vehicle-storage",
        components: { PageHeader },
        data() {
            return {
                loading: false,
                searchObj: {
                    carLocation: ''
                },
                name: 'E1',
                carTotal: '31',
                location: '9号楼一层',
                description: '',
                options: {},
                carList: [
                    {
                        name: 'E1--1',
                        parkingTime: '10.0元/2.0小时'
                    },
                    {
                        name: 'E1--2',
                        parkingTime: '10.0元/2.0小时'
                    },
                    {
                        name: 'E1--3',
                        parkingTime: '10.0元/2.0小时'
                    }
                ],
                dialogVisiable: false,
                searchData: {
                    carNumber: '',
                    carName: '',
                    parkName: '',
                    parkPhone: ''
                },
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

            }
        },
        computed: {
            searchRule() {
                const validateProvince = (rule, value, callback) => {
                    let carNumber = this.$refs.carNumber.value;
                    console.log(value + carNumber)
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
        created() {
            this.getGarageNameList()
        },
        methods: {
            handleSearch() {

            },
            openDialog() {
                this.dialogVisiable = true
            },
            handleCancel(forName) {
                this.$refs[forName].clearValidate()
                this.dialogVisiable = false
            },
            handleSubmit() {

            },
            getGarageNameList() {
                apiDataFilter.request({
                    apiPath: 'garage.getGarageNameList',
                    method: 'POST',
                    data: '',
                    successCallback: (res) => {
                        this.options = res.data;
                        console.log(this.options)
                    },
                    errorCallback: (res) => {

                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/style/variables.less";

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
                .car-space {
                    display: inline-block;
                    width: 30px;
                }
            }

            .parking-list {
                background-color: #00B51D;
                border-radius: 5px;
                width: 100px;
                height: 100px;
                float: left;
                margin: 10px 20px;

                .parking-image {


                }
            }
        }

        .pop-box {
            padding: 0 40px;

            .pop-title {
                color: #aa1520;
                margin-bottom: 20px;

                .space {
                    display: inline-block;
                    width: 50px;
                }
            }
        }
    }
</style>