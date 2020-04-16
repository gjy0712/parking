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
                <el-form-item label="车牌号：" prop="province">
                    <el-select v-model="calculateData.province" style="width: 95px; margin-right: 20px">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input class="input-car-number"
                              style="width: 200px"
                              v-model.trim="calculateData.carNumber"
                              ref="carNumber"
                              placeholder="请输入车牌号码">
                    </el-input>
                </el-form-item>
            </el-form>

            <div class="count-box">
                <div class="count-content">
                    车牌号：<span class="count-color"></span>
                </div>
                <div class="count-content">
                    车库：<span class="count-color"></span>
                    <div class="count-space"></div>
                    车位：<span class="count-green-color"></span>
                </div>
                <div class="count-content">
                    车位类型：<span class="count-color"></span>
                </div>
                <div class="count-content">
                    入库时间：<span></span>
                    <div class="count-space"></div>
                    出库时间：<span></span>
                </div>
                <div class="count-content">
                    价格：<span></span>
                    <div class="count-space"></div>
                    停车时间：<span></span>
                </div>
                <div class="count-content">
                    操作人：<span></span>
                    <div class="count-space"></div>
                    工号：<span></span>
                </div>
                <div class="count-content count-total">
                    总计：<span class="count-color"></span>
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
                    @click="handleSubmit()">
                结算
            </el-button>
        </span>
    </el-dialog>
</template>

<script>
    import apiDataFilter from "../../../utils/apiDataFilter";

    export default {
        name: "calculate-fee-dialog",
        data() {
            return {
                dialogCalculateFee: false,
                loading: false,
                calculateData: {
                    province: '',
                    carNumber: ''
                },
                options: [
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
                code: ''
            }
        },
        computed: {
            calculateRule() {
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
                    ]
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
                this.calculateData = {
                    province: '',
                    carNumber: ''
                }
            },

            // 结算
            handleSubmit() {
                this.$refs['info'].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        let param = {
                            province: this.calculateData.province,
                            carnumber: this.calculateData.carNumber
                        }
                        apiDataFilter.request({
                            apiPath: 'order.getCarOrder',
                            method: 'post',
                            data: param,
                            successCallback: (res) => {
                                this.loading = false;
                                this.calculateData = {
                                    province: '',
                                    carNumber: ''
                                }
                            },
                            errorCallback: (err) => {
                                this.loading = false;
                                // this.getGarageList()
                                this.calculateData = {
                                    province: '',
                                    carNumber: ''
                                }
                            },
                        })
                    }
                })
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