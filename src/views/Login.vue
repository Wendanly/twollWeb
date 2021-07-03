<template>
  <div class="login-wrap">
    <div class="login-bg">
      <div class="login">
        <div class="box">
          <el-form class="form-box" ref="form">
            <!-- <div class="mb20 title">两级互动</div> -->
            <el-input class="mb20" placeholder="请输入账号" maxlength="20" v-model.trim="form.userId">
              <template slot="prepend">
                <i class="el-icon-user"></i>
              </template>
            </el-input>
            <el-input
              type="password"
              maxlength="20"
              class="mb20"
              placeholder="请输入密码"
              v-model.trim="form.passwd"
            >
              <template slot="prepend">
                <i class="el-icon-lock"></i>
              </template>
            </el-input>
            <div class="mb20 validatecode-wrap">
              <el-input
                maxlength="4"
                class="input"
                placeholder="请输入验证码"
                @keyup.enter.native="login"
                v-model.trim="validateCode"
              ></el-input>
              <div class="img-wrap">
                <img class="img" :src="url" alt />
                <i class="el-icon-loading" v-if="validateCodeLoading"></i>
                <i class="el-icon-refresh" @click="getValidateCode"></i>
              </div>
            </div>
            <el-button class="login-btn" type="primary" @click="login" :loading="loginLoading">登录</el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Login, GetRsaPub, ValidateCode } from "@/api/login.js";
import { mapState, mapMutations, mapActions } from "vuex";

import JSEncrypt from "jsencrypt";
export default {
  name: "Login",
  components: {},
  data() {
    return {
      validateCodeLoading: false, //验证码加载效果
      loginLoading: false, //登录加载效果
      form: {
        userId: "admin",
        passwd: "admin"
      },
      url: "",
      validateCode: "",
      publicKey: ""
    };
  },
  
  created() {
    this.getValidateCode();
    this.getRsaPub();
  },
  computed: {},
  methods: {
    ...mapMutations(["setUserInfo"]),
    getValidateCode() {
      this.validateCodeLoading = true;
      ValidateCode({})
        .then(res => {
          this.validateCodeLoading = false;
          this.url = window.URL.createObjectURL(res); //创建本地url
        })
        .catch(err => {
          this.url = "";
          this.validateCodeLoading = false;
        });
    },
    //获取公钥
    getRsaPub() {
      GetRsaPub({})
        .then(res => {
          if (res.SUCCESS == "true") {
            this.publicKey = res.PUB;
          }
        })
        .catch(err => {});
    },
    login() {
      if (this.validateCode == "")
        return this.$message.warning("请输入验证码!");
      if (this.form.userId == "") return this.$message.warning("请输入账号!");
      if (this.form.passwd == "") return this.$message.warning("请输入密码!");
      let encryptor = new JSEncrypt();
      encryptor.setPublicKey(this.publicKey); // 设置公钥
      let params = {
        userid: encryptor.encrypt(this.form.userId).replace(/\+/g, "%2B"),
        passwd: encryptor.encrypt(this.form.passwd).replace(/\+/g, "%2B"),
        imageCode: this.validateCode,
        pub: this.publicKey
      };
      this.loginLoading = true;
      Login(params)
        .then(res => {
          this.loginLoading = false;
          if (res.SUCCESS == "false") {
            this.$message.warning(res.MESSAGE);
            this.getValidateCode();
            this.setUserInfo({}); //清空
          } else {
            // console.log(res);
            let userInfo = {
              userName: res.USERNAME,
              Token: res.TOKEN,
              isLogin: res.IS_LOGIN
            };
            this.setUserInfo(userInfo);
            this.$router.push({ name: "home" });
          }
        })
        .catch(err => {
          this.loginLoading = false;
          this.$message.error("服务异常！");
          this.getValidateCode();
        });
    }
  }
};
</script>

<style lang='scss' scoped>
.login-wrap {
  width: 100%;
  height: 100%;
  .login-bg {
    height: 100%;
    background: linear-gradient(to right, #2f46c0 50%, #2f3db3 50%);
    .login {
      width: 100%;
      height: 100%;
      position: relative;
      background-repeat: no-repeat;
      background-image: url("../assets/banners.jpg");
      background-size: contain;
      .box {
        bottom: 50%;
        right: 75px;
        transform: translateY(50%);
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 414px;
        background-color: rgba(255, 255, 255, 0.1);
        width: 400px;
        padding: 50px 60px;
        box-sizing: border-box;
        border-radius: 10px;
        .form-box {
          .login-btn {
            width: 100%;
          }
          .title {
            text-align: center;
            color: #ffffff;
            font-size: 23px;
          }
          .mb20 {
            margin-bottom: 30px;
          }
          .validatecode-wrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .input {
              width: 155px;
            }
            .img-wrap {
              position: relative;
              .img {
                width: 120px;
                background: #ffffff;
                height: 40px;
              }
              .el-icon-loading {
                position: absolute;
                left: 50%;
                top: 28%;
              }
              .el-icon-refresh {
                cursor: pointer;
                position: absolute;
                top: 27%;
                right: -20px;
                color: #66b1ff;
              }
            }
          }
        }
      }
    }
  }
}
</style>
