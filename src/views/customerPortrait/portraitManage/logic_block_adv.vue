<template>
    <div class="container">
        <div class="dialog-content">
            <el-radio-group v-model="selection" class="radio_box" :disabled="noModification">
                <div class="box">
                    <div class="item item_first">
                        <el-radio :label="'0'" class="item_label">最新时间</el-radio>
                    </div>
                    <div class="item">
                        <el-radio :label="'1'" class="item_label">固定周期</el-radio>
                        <div class="item_content">
                            <el-date-picker v-if="dataCycle==1" v-model="fixedDate" type="date" placeholder="选择日期"
                                :key="'a'" value-format="yyyyMMdd" style="width: 100%"
                                :disabled="selection==0||selection==2||noModification">
                            </el-date-picker>
                            <el-date-picker v-else v-model="fixedDate" type="month" placeholder="选择月份" :key="'b'"
                                value-format="yyyyMM" style="width: 100%"
                                :disabled="selection==0||selection==2||noModification">
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="item">
                        <el-radio :label="'2'" class="item_label">偏移量(向前偏移)</el-radio>
                        <div class="item_content">
                            <el-input style="width: 100%" v-model.number="offset" placeholder="请输入偏移量" :max="0"
                                :step="1" :disabled="selection==0||selection==1||noModification" @input="offsetDay">
                                <template slot="append">
                                    <span class="unit">统计周期</span>
                                </template>
                            </el-input>
                        </div>
                    </div>
                </div>
            </el-radio-group>
        </div>
        <div class="dialog-footer" v-if="!noModification">
            <el-button type="primary" @click="conform">保 存</el-button>
            <el-button type="info" @click="cancel">取 消</el-button>
        </div>
    </div>
</template>

<script>
    import {
        getRequiredRule,
        getCheckLimitMinMax,
        checkCN6,
    } from "@/libs/validate";
    import * as _ from "lodash";
    import {
        isNullOrEmpty
    } from "@/libs/tools";

    export default {
        name: "logic_block_adv",
        props: {
            dismiss: {
                type: Object,
                default: null,
            },
            context: {
                type: Object,
                default: null,
            },
        },
        data() {
            return {
                father: null,
                dataCycle: 1,
                selection: "0",
                fixedDate: null,
                offset: null,
                useLatest: false,
                noModification: false,
            };
        },
        methods: {
            conform() {
                if (this.selection == "0") {
                    this.$set(this.father, "advancedVal", {
                        useLatest: true,
                        selection: "0",
                        fixedDate: null,
                        offset: null
                    })
                } else if (this.selection == "1") {
                    if (isNullOrEmpty(this.fixedDate)) {
                        this.warningMes("请填写固定周期");
                        return;
                    }
                    this.$set(this.father, "advancedVal", {
                        useLatest: false,
                        selection: "1",
                        fixedDate: this.fixedDate,
                        offset: null
                    })
                } else {
                    if (isNullOrEmpty(this.offset)) {
                        this.warningMes("请填写偏移量");
                        return;
                    }
                    var regPos = /^((-\d+)|(0+))$/;
                    if (!regPos.test(this.offset)) {
                        this.warningMes("偏移量必须为0或负数");
                        return;
                    }
                    this.$set(this.father, "advancedVal", {
                        useLatest: false,
                        selection: "2",
                        fixedDate: null,
                        offset: this.offset
                    })
                }
                this.dismiss.next();
            },
            cancel() {
                this.dismiss.error();
            },
            offsetDay($event) {
                if (isNullOrEmpty(this.offset)) {
                    return
                }
                if (this.offset > 0) {
                    this.offset = -this.offset;
                };
            },
        },
        created() {},
        mounted() {
            this.father = this.context.data;
            this.noModification = this.context.noModification;
            this.dataCycle = this.context.data.operand.dataCycle;
            if (this.father.advancedVal != null) {
                this.useLatest = this.father.advancedVal.useLatest;
                this.selection = this.father.advancedVal.selection;
                this.fixedDate = this.father.advancedVal.fixedDate;
                this.offset = this.father.advancedVal.offset;
            }
        },
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .dialog-content {
        width: 100%;
        height: 250px;
        overflow: hidden;
        padding: 30px 30px;

        .radio_box {
            width: 100%;

            .box {
                display: flex;
                flex-direction: column;

                .item {
                    width: 100%;
                    padding: 15px 0;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;

                    .item_label {
                        width: 130px;
                        text-align: left;
                    }

                    .item_content {
                        width: 300px;
                    }
                }

                .item_first {
                    padding: 20px 0;
                }
            }
        }
    }
    .unit{
        width:70px;
        display: inline-flex;
        justify-content: center;
    }
</style>