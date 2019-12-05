<template>
  <div>
    <van-row type="flex" class="padding topBg" justify="center">记事本-忘记密码</van-row>
    <div class="margin-top">
      <van-cell-group>
        <van-field
          v-model="email"
          clearable
          :disabled="password.length>0"
          label="登录邮箱"
          placeholder="请输入你的注册邮箱"
          :error-message="errMsg"
        />
        <van-field
          :disabled="password.length>0"
          v-model="safeKey"
          maxlength="6"
          clearable
          label="安全码"
          placeholder="请输入你的账号安全码"
        />
      </van-cell-group>
      <div v-if="password" style="margin-left:12px;">
        <p>该账号密码是:{{password}},请妥善保管好密码。</p>
      </div>
      <van-row type="flex" class="padding" justify="center">
        <van-button type="primary" class="margin-right" @click="toFindpassword">立即找回密码</van-button>
        <van-button @click="toLogin" class="margin-right">返回登录</van-button>
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
      if (!reg.test(inputEmail)) {
        this.errMsg = "邮箱格式错误";
      } else {
        this.errMsg = "";
      }
    }
  },

  methods: {
    toLogin() {
      this.$router.push("/login");
    },

    toFindpassword() {
      if (this.safeKey && this.safeKey.length > 0) {
        this.axios
          .post("/api/operatorUser", {
            body: {
              type: "findPasswd",
              email: this.email,
              safeKey: this.safeKey
            }
          })
          .then(res => {
            if (res.data.code === 200 || res.data.code === 201) {
              console.log(res.data);
              //   this.$global.user = res.data.data;
              //   sessionStorage.setItem("isLogin", true);
              this.password = res.data.data.password;
              Notify({ type: "success", message: res.data.data.message });
              //   this.$router.push("/edit");
            } else {
              Notify({ type: "danger", message: res.data.data.message });
            }
          });
      }
    }
  },
  data() {
    return {
      email: undefined,
      password: "",
      errMsg: "",
      showSafeKey: false,
      safeKey: undefined
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