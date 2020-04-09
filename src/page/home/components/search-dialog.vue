<template>
    <el-dialog
            title="搜索"
            :visible.sync="dialogSearch"
            class="search-component el-dialog-style-reset"
            :close-on-click-modal="false"
            width="600px"
            @click="handleCancel('info')">
        <div class="pop-box">
            <el-form
                    :model="searchData"
                    :rules="searchRule"
                    size="small"
                    ref="info"
                    label-width="100px"
                    :validate-on-rule-change="false"
                    class="demo-ruleForm">
                <el-form-item label="车牌号：" prop="carNumber">
                    <el-input v-model.trim="searchData.carNumber" placeholder="请输入车牌号码"></el-input>
                </el-form-item>
                <el-form-item label="车位名：" prop="carName">
                    <el-input v-model.trim="searchData.carName" placeholder="请输入车位名"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="small"
                       class="custom-button_long"
                       @click="handleCancel('info')">关闭</el-button>
            <!--<el-button
                    size="small"
                    type="primary"
                    :loading="loading"
                    class="custom-button_long"
                    @click="handleSubmit()">
                确定
            </el-button>-->
        </span>
    </el-dialog>
</template>

<script>
    export default {
        name: "search-dialog",
        data() {
            return {
                dialogSearch: false,
                searchData: {
                    carNumber: '',
                    carName: ''
                }
            }
        },
        computed: {
            searchRule() {
                return {
                    carNumber: [],
                    carName: []
                }
            }
        },
        methods: {
            showDialog(){
                this.dialogSearch = true
            },
            handleCancel(formName) {
                this.$refs[formName].clearValidate()
                this.dialogSearch = false
            }
        }
    }
</script>

<style lang="less" scoped>
    .search-component {
        .pop-box {
            padding: 0 40px;
        }
    }
</style>