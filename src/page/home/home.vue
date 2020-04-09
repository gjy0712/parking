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
            <div class="message-box">
                <div class="box-title">{{name}},欢迎您使用停车场收费系统!</div>
                <div class="box-description">{{description}}</div>
                <div class="box-button">
                    <el-button type="primary" icon="el-icon-refresh" size="small" @click="getList">刷新</el-button>
                </div>
                <div class="count-box">
                    <div class="count-content">
                        当前停车：<span class="count-color">{{number}}个</span>
                        <div class="count-space"></div>
                        空余车位：<span class="count-green-color">{{freeSpace}}个</span>
                    </div>
                    <div class="count-content">
                        拥有车库：<span>{{garage}}辆</span>
                        <div class="count-space"></div>
                        拥有车位：<span>{{ownSpace}}个</span>
                    </div>
                </div>
            </div>
<!--            车-->
            <el-row>
                <el-col :span="6">
                    <div class="grid-content bg-red" @click="handleCarInfo">
                        <img src="../../assets/images/logo-one.png" alt="">
                        <div class="vehicle-storage car-title">车辆入库</div>
                        <div class="sub-title">录入车辆信息，分配停车位置</div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-green" @click="handleCalculateFee">
                        <img src="../../assets/images/logo-two.png" alt="">
                        <div class="vehicle-out-storage car-title">车辆出库</div>
                        <div class="sub-title">车辆出库，计算停车费用</div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content bg-green-dark" @click="handleSearch">
                        <img src="../../assets/images/logo-three.png" alt="">
                        <div class="search car-title">搜索一下</div>
                        <div class="sub-title">搜索停车位和车辆信息</div>
                    </div>
                </el-col>
            </el-row>
        </div>

        <search-dialog ref="search_ref"></search-dialog>

        <calculate-fee-dialog ref="calculate-fee_ref"></calculate-fee-dialog>
    </div>
</template>

<script>
    import { PageHeader } from "../../components/public";
    import {getLocalStore} from "../../utils/webstore-utils";
    import { USER } from '@/config/webstore'
    import SearchDialog from "./components/search-dialog";
    import CalculateFeeDialog from "./components/calculate-fee-dialog";

    export default {
        name: "home",
        components: {CalculateFeeDialog, SearchDialog, PageHeader },
        data() {
            return {
                name: '',
                description: '',
                number: '4',
                garage: '4',
                freeSpace: '111',
                ownSpace: '115'
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

        },
        methods: {
            handleCarInfo() {
                this.$router.push('/carInfo')
            },
            handleCalculateFee(){
                this.$refs['calculate-fee_ref'].showDialog();
            },
            handleSearch() {
                this.$refs['search_ref'].showDialog();
            },
            getList() {

            }
        }

    }
</script>

<style lang="less" scoped>
    .home-container {
        .content-box {
            margin-top: 15px;
            .message-box {
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
                background: #f40;
            }
            .bg-green {
                background: #00B51D;
            }
            .bg-green-dark {
                background: #30A080;
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
    }
</style>