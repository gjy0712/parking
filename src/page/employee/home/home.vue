<template>
    <div class="home-container">
        <page-header :borderBottom="true">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>您当前所在的位置</el-breadcrumb-item>
                <el-breadcrumb-item>首页</el-breadcrumb-item>
            </el-breadcrumb>
        </page-header>

        <div class="content-box">
            <!--            个人信息和车库信息部分内容展示-->
            <div class="car-box">
                <div class="box-title">{{name}},欢迎您使用停车场收费系统!</div>
                <div class="box-description">{{description}}</div>
                <div class="box-button">
                    <el-button type="primary" icon="el-icon-refresh" size="small" @click="getRefresh">刷新</el-button>
                </div>
                <div class="count-box">
                    <div class="count-content">
                        当前停车：<span class="count-color">{{totalCarInfo.usingCarNum}}辆</span>
                        <div class="count-space"></div>
                        空余车位：<span class="count-green-color">{{totalCarInfo.unUsedCarNum}}个</span>
                    </div>
                    <div class="count-content">
                        拥有车库：<span>{{totalCarInfo.garageTotalNum}}个</span>
                        <div class="count-space"></div>
                        拥有车位：<span>{{totalCarInfo.carTotalNum}}个</span>
                    </div>
                </div>
            </div>
<!--            车-->
            <el-row>
                <el-col :span="6">
                    <div class="grid-content bg-red" @click="handleCarInfo">
                        <img src="../../../assets/images/logo-one.png" alt="">
                        <div class="vehicle-storage car-title">车辆入库</div>
                        <div class="sub-title">录入车辆信息，分配停车位置</div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-green" @click="handleCalculateFee">
                        <img src="../../../assets/images/logo-two.png" alt="">
                        <div class="vehicle-out-storage car-title">车辆出库</div>
                        <div class="sub-title">车辆出库，计算停车费用</div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-green-dark" @click="handleSearch">
                        <img src="../../../assets/images/logo-three.png" alt="">
                        <div class="search car-title">搜索一下</div>
                        <div class="sub-title">搜索停车位和车辆信息</div>
                    </div>
                </el-col>
            </el-row>


        </div>

        <div class="message-content">
            <div class="message-title">公告列表</div>
            <div class="message-box" v-for="item in messageInfoList" :key="item.id" :loading="loading">
                <span class="title">{{item.title}}</span>
                <div class="content">{{item.content}}</div>
                <div class="name">{{item.name}}</div>
                <span class="create-time">{{item.creattime}}</span>
                <!--<el-button class="delete" type="text" size="mini" @click="handleDetail(item.id)">详情</el-button>-->

            </div>

        </div>

        <search-dialog ref="search_ref"></search-dialog>

        <calculate-fee-dialog ref="calculate-fee_ref"></calculate-fee-dialog>
    </div>
</template>

<script>
    import { PageHeader } from "../../../components/public";
    import {getLocalStore} from "../../../utils/webstore-utils";
    import { USER } from '@/config/webstore'
    import SearchDialog from "./components/search-dialog";
    import CalculateFeeDialog from "./components/calculate-fee-dialog";
    import apiDataFilter from "../../../utils/apiDataFilter";

    export default {
        name: "home",
        components: {CalculateFeeDialog, SearchDialog, PageHeader },
        data() {
            return {
                loading: false,
                totalCarInfo: {
                    usingCarNum: '',   // 使用车位
                    unUsedCarNum: '',   //空闲车位
                    garageTotalNum: '',  // 总车库
                    carTotalNum: ''  //总车位
                },
                name: '',
                description: '',
                messageInfoList: []


            }
        },
        mounted() {
            let userObj = JSON.parse(getLocalStore(USER))
            if (userObj) {
                this.name = userObj.name
                this.description = userObj.description
            }
        },
        created() {
            this.getTotalCarInfo()
            this.getMessageList()
        },
        methods: {
            getRefresh() {
                this.getTotalCarInfo()
                this.getMessageList()
            },
            handleCarInfo() {
                this.$router.push('/employee/carInfo')
            },
            handleCalculateFee(){
                this.$refs['calculate-fee_ref'].showDialog();
            },
            handleSearch() {
                this.$refs['search_ref'].showDialog();
            },
            getTotalCarInfo() {
                apiDataFilter.request({
                    apiPath: 'garage.getTotalCarInfo',
                    method: 'post',
                    data: {},
                    successCallback: (res) => {
                        this.totalCarInfo = res.data;
                        // this.infoDa
                    },
                    errorCallback: (err) => {
                    },
                })
            },
            // 获取公告列表
            getMessageList() {
                this.loading = true;
                apiDataFilter.request({
                    apiPath: 'message.getMessageList',
                    method: 'POST',
                    data: '',
                    successCallback: (res)=> {
                        this.loading = false;
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
    .home-container {
        .content-box {
            margin-top: 15px;
            .car-box {
                color: #3877aa;
                background-color: #d3d3d3;
                border-radius: 10px;
                width: 100%;
                padding: 10px 50px;
                .box-title {
                    font-size: 30px;
                }
                .box-description {
                    margin: 10px 0;
                }
                .count-box {
                    margin: 15px 0;

                    .count-content {

                        .count-color {
                            color: #ff4400;
                        }

                        .count-green-color {
                            color: #00B51D;
                        }
                        .count-space {
                            display: inline-block;
                            width: 65px;
                        }
                    }
                }
            }

            .el-row {
                margin-top: 60px;
            }
            .el-col {
                border-radius: 4px;
                margin: 0 43px;
            }
            .bg-red {
                background: #ffcec6;
            }
            .bg-green {
                background: #8cb5a9;
            }
            .bg-green-dark {
                background: #7d9da0;
            }
            .grid-content {
                border-radius: 10px;
                cursor: pointer;
                min-height: 36px;
                padding: 30px 30px 60px 30px;
                text-align: center;

                .car-title {
                    font-size: 30px;
                    color: #fff;
                    margin: 15px 0;
                }

                .sub-title {
                    font-size: 15px;
                    color: #fff;
                }
            }
        }

        .message-content {
            padding: 60px 0 0 30px;
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
            }

        }

    }
</style>