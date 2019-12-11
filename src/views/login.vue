<template>
  <div>
    <van-row type="flex" class="padding topBg" justify="center">记事本-登录</van-row>
    <div class="margin-top">
      <van-cell-group>
        <van-field
          v-model="email"
          clearable
          label="登录邮箱"
          :disabled="showSafeKey"
          placeholder="登录邮箱,没有会自动注册哦"
          :error-message="errMsg"
        />
        <van-field
          v-model="password"
          type="password"
          maxlength="12"
          :disabled="showSafeKey"
          label="登录密码"
          placeholder="请输入密码"
        />
        <van-field
          v-if="showSafeKey"
          v-model="safeKey"
          maxlength="6"
          clearable
          label="安全码"
          placeholder="请填写账号安全码"
          error-message="通过安全码可以找回你的账号密码，请妥善保存你的安全码"
        />
      </van-cell-group>

      <van-row type="flex" class="padding" justify="center">
        <van-button type="primary" class="margin-right" @click="toLogin">立即登录</van-button>
        <van-button @click="toFindpassword" class="margin-right">忘记密码?</van-button>
        <!-- <van-button @click="adminLogin">管理员登录</van-button> -->
      </van-row>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Field, Cell, CellGroup, Toast, Notify } from "vant";
Vue.use(Field)
  .use(Cell)
  .use(CellGroup)
  .use(Notify)
  .use(Toast);

export default {
  watch: {
    email() {
      var inputEmail = this.email;
      var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      this.email = this.email.replace(/[\u4e00-\u9fa5]/gi, "");
      if (!reg.test(inputEmail)) {
        this.errMsg = "邮箱格式错误";
      } else {
        this.errMsg = "";
      }
    },
    password() {
      this.password = this.password.replace(/[\u4e00-\u9fa5]/gi, "");
    }
  },

  methods: {
    toFindpassword() {
      this.$router.push("/findpasswd");
    },

    adminLogin() {
      this.$router.push("../admin-pc/login");
    },

    toLogin() {
      //@TODO 服务器登录
      //   Toast("输入错误");
      if (!this.password || !this.email) {
        Toast("请检查输入是否有误");
        return;
      }
      var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      if (this.password.length < 6) {
        Toast("密码最短为6位数");
        return;
      }
      if (this.showSafeKey) {
        if (this.safeKey.length < 3) {
          Toast("安全码最短为3位数");
          return;
        }
        this.axios
          .post("/api/operatorUser", {
            body: {
              type: "changeSafeKey",
              email: this.email,
              password: this.password,
              safeKey: this.safeKey
            }
          })
          .then(res => {
            if (res.data.code === 200 || res.data.code === 201) {
              console.log(res.data);
              this.showSafeKey = false;
              this.$global.user = res.data.data;

              sessionStorage.setItem("isLogin", true);
              sessionStorage.setItem("email", this.email);

              Notify({ type: "success", message: res.data.data.message });
              this.$router.push("/edit");
            } else {
              Notify({ type: "danger", message: res.data.data.message });
            }
          });
      } else if (this.password && reg.test(this.email)) {
        this.axios
          .post("/api/login", {
            email: this.email,
            password: this.password,
            createTime: new Date().getTime()
          })
          .then(res => {
            if (res.data.code === 200 || res.data.code === 201) {
              console.log(res.data);
              if (res.data.data.message === "注册成功") {
                this.showSafeKey = true;
                Notify({
                  type: "danger",
                  message: "当前邮箱未注册,填写账号安全码后即可注册成功"
                });

                return;
              }
              this.$global.user = res.data.data;
              sessionStorage.setItem("isLogin", true);
              Notify({ type: "success", message: res.data.data.message });
              this.$router.push("/edit");
            } else {
              Notify({ type: "danger", message: res.data.data.message });
            }
          });
      } else {
        Toast("请检查输入邮箱是否有误");
      }
    }
  },
  data() {
    return {
      isRegister: true,
      email: undefined,
      password: undefined,
      errMsg: "",
      showSafeKey: false,
      safeKey: ""
    };
  }
};
</script>
<style scoped>
.margin-right {
  margin-right: 20px;
}
.margin-top {
  margin-top: 40px;
}
.adminLogin {
  display: flex;
  justify-content: center;
}
</style>