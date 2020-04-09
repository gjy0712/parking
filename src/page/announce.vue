<template>
    <div class="announce-container">
        <page-header :borderBottom="true">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>您当前所在的位置</el-breadcrumb-item>
                <el-breadcrumb-item>发布公告</el-breadcrumb-item>
                <el-breadcrumb-item>编辑公告</el-breadcrumb-item>
            </el-breadcrumb>
        </page-header>
    </div>
</template>

<script>
    import { PageHeader } from "../components/public";

    export default {
        name: "announce",
        components: { PageHeader },

    }
</script>

<style lang="less" scoped>

</style>