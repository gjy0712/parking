<template>
    <div class="work-container">
        <page-header :borderBottom="true">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>您当前所在的位置</el-breadcrumb-item>
                <el-breadcrumb-item>今日工作</el-breadcrumb-item>
            </el-breadcrumb>
        </page-header>

        <div class="content-box">
            <div class="work-title">今日工作很棒！继续加油哦！</div>

            <div class="table-box">
                <el-table :data="tableData" stripe style="width: 100%" class="el-table-reset-lite-style">
                    <el-table-column prop="id" label="#"></el-table-column>
                    <el-table-column prop="numberPlate" label="车牌号"></el-table-column>
                    <el-table-column prop="startTime" label="开始时间"></el-table-column>
                    <el-table-column prop="endTime" label="结束时间"></el-table-column>
                    <el-table-column prop="total" label="停车时长"></el-table-column>
                    <el-table-column prop="total" label="总价"></el-table-column>
                </el-table>

                <div class="count-box">
                    <div class="count-content">
                        总数量：<span class="count-color">{{number}}辆</span>
                        <div class="count-space"></div>
                        总数额：<span class="count-color">￥{{total}}元</span>
                    </div>
                </div>
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
</template>

<script>
    import { PageHeader } from "../components/public";
    import apiDataFilter from "../utils/apiDataFilter";

    export default {
        name: "work-today",
        components: { PageHeader },
        data() {
            return {
                tableData: [],
                currentPage: 1,
                pageSize: 100,
                pageTotal: 0,
                number: '0',
                total: '0.0'
            }
        },
        created() {
            this.getTodayOrderList()
        },
        methods: {
            handleSizeChange(val) {
                this.pageSize = val
                // this.queryCpp()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                // this.queryCpp()
            },
            getTodayOrderList() {
                apiDataFilter.request({
                    apiPath: 'order.getTodayOrderList',
                    method: 'post',
                    data: '',
                    successCallback: (res) => {
                        // this.tableData = res.data.garageInfoList;
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
    .work-container {
        .content-box {
            margin-top: 15px;

            .work-title {
                background-color: #d3d3d3;
                border-radius: 10px;
                color: #3877aa;
                font-size: 30px;
                height: 100px;
                padding: 30px;
                width: 100%;
            }

            .table-box {
                .count-box {
                    background-color: #dff0d8;
                    height: 60px;
                    margin: 15px 0;
                    padding: 20px;

                    .count-content {
                        float: right;
                        margin-right: 75px;

                        .count-color {
                            color: #ff4400;
                        }
                        .count-space {
                            display: inline-block;
                            width: 65px;
                        }
                    }
                }
            }
        }

    }
</style>