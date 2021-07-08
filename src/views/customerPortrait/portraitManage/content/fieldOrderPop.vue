<template>
    <div class="container">
        <div class="dialog-content">
            <el-form class="tableForm" :model="ruleForm" :rules="rules" ref="ruleForm" size="mini" label-width="100px">
                <el-col :span="22">
                    <el-form-item label="字段" prop="field">
                        <el-select style="width: 100%" v-model="ruleForm.field" placeholder="字段" :clearable="true"
                            value-key="id" :popper-class="'sf-remote-dropdown'">
                            <el-option v-for="(item, index) in fieldList" :key="index" :label="item.name" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="22">
                    <el-form-item label="排序" prop="orderType">
                        <el-radio-group v-model="ruleForm.orderType">
                            <el-radio label="asc">升序</el-radio>
                            <el-radio label="desc">降序</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-form>
        </div>
        <div class="dialog-footer">
            <el-button type="primary" @click="conform">保 存</el-button>
            <el-button type="info" @click="cancel">取 消</el-button>
        </div>
    </div>
</template>

<script>
    import {
        getRequiredRule,
    } from "@/libs/validate";
    import * as _ from "lodash";
    import {
        getToken
    } from "@/libs/util";
    import {
        isNullOrEmpty
    } from "@/libs/tools";


    export default {
        name: "fieldOrderPop",
        props: {
            father: null,
            orderList: null,
        },
        data() {
            return {
                ruleForm: {
                    field: null,
                    orderType: "asc",
                },
                rules: {
                    field: [getRequiredRule("字段")],
                },
                fieldList: []
            };
        },
        methods: {
            conform() {
                this.$refs["ruleForm"].validate((valid) => {
                    if (valid) {
                        let obj = _.cloneDeep(this.ruleForm.field);
                        obj.orderType = this.ruleForm.orderType;
                        this.father.list.push(obj);
                        this.father.visible = false;
                    }
                })
            },
            cancel() {
                this.father.visible = false;
            },
        },
        created() {},
        mounted() {
            this.fieldList = _.cloneDeep(this.orderList);
            this.fieldList = this.fieldList.filter((item) => {
                for (let i = 0; i < this.father.list.length; i++) {
                    if (item.id == this.father.list[i].id) {
                        return false;
                    }
                }
                return true;
            })
        },
    };
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .dialog-content {
        width: 100%;
        height: auto;
        overflow: hidden;
        padding: 20px 20px 10px 20px;
    }
</style>