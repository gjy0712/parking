<template>
    <el-dialog
            title="计算停车费用"
            :visible.sync="dialogCalculateFee"
            class="calculate-fee-component el-dialog-style-reset"
            :close-on-click-modal="false"
            width="600px"
            @click="handleCancel('info')">
        <div class="pop-box">
            <el-form
                    :model="calculateData"
                    :rules="calculateRule"
                    size="small"
                    ref="info"
                    label-width="100px"
                    :validate-on-rule-change="false"
                    class="demo-ruleForm">
                <el-form-item label="车牌号：" prop="carNumber">
                    <el-input class="input-car-number"
                              v-model.trim="calculateData.carNumber"
                              placeholder="请输入车牌号码">
                    </el-input>
                    <el-button size="small"
                               type="danger"
                               @click="handleCalculate()">
                        计算费用
                    </el-button>
                </el-form-item>
            </el-form>

            <div class="count-box">
                <div class="count-content">
                    车牌号：<span class="count-color">{{}}</span>
                </div>
                <div class="count-content">
                    车库：<span class="count-color">{{}}</span>
                    <div class="count-space"></div>
                    车位：<span class="count-green-color">{{}}</span>
                </div>
                <div class="count-content">
                    车位类型：<span class="count-color">{{}}</span>
                </div>
                <div class="count-content">
                    入库时间：<span>{{}}</span>
                    <div class="count-space"></div>
                    出库时间：<span>{{}}</span>
                </div>
                <div class="count-content">
                    价格：<span>{{}}</span>
                    <div class="count-space"></div>
                    停车时间：<span>{{}}</span>
                </div>
                <div class="count-content">
                    操作人：<span>{{}}</span>
                    <div class="count-space"></div>
                    工号：<span>{{code}}</span>
                </div>
                <div class="count-content count-total">
                    总计：<span class="count-color">{{}}</span>
                </div>
            </div>
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
                    @click="handleCalculateTotal()">
                结算
            </el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        name: "calculate-fee-dialog",
        data() {
            return {
                dialogCalculateFee: false,
                loading: false,
                calculateData: {

                },
                code: ''
            }
        },
        computed: {
            calculateRule() {
                return {

                }
            }
        },
        methods: {
            showDialog(){
                this.dialogCalculateFee = true
            },
            handleCancel(formName) {
                this.$refs[formName].clearValidate()
                this.dialogCalculateFee = false
            },
            // 计算费用
            handleCalculate(){

            },
            // 结算
            handleCalculateTotal() {

            }
        }
    }
</script>

<style lang="less" scoped>
    .calculate-fee-component {
        .pop-box {
            padding: 0 40px;

            .input-car-number {
                width: 200px;
                margin-right: 30px;
            }

            .count-box {
                margin: 15px 0;
                color: #3c763d;
                background-color: #dff0d8;
                padding: 30px;
                border-radius: 10px;

                .count-content {

                    .count-color {
                        /*color: #ff4400;*/
                    }

                    .count-green-color {
                        /*color: #00B51D;*/
                    }
                    .count-space {
                        display: inline-block;
                        width: 65px;
                    }
                }

                .count-total {
                    margin-top: 20px;
                }
            }
        }
    }
</style>