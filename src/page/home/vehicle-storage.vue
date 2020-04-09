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
                                    :key="item.value"
                                    :label="item.label"
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
    </div>
</template>

<script>
    import { PageHeader } from "../../components/public";

    export default {
        name: "vehicle-storage",
        components: { PageHeader },
        data() {
            return {
                searchObj: {
                    carLocation: ''
                },
                options: [
                    {
                        value: '1',
                        label: 'D1'
                    },
                    {
                        value: '2',
                        label: 'G1'
                    },
                    {
                        value: '3',
                        label: 'F1'
                    },
                    {
                        value: '4',
                        label: 'E1'
                    }
                ]
            }
        },
        methods: {
            handleSearch() {

            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/style/variables.less";

    .vehicle-storage-container {
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
                    }
                }
            }
        }
    }
</style>