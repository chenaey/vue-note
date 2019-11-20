<template>
  <div>
    <van-row type="flex" class="padding topBg" justify="center">记事本-管理员登录</van-row>
    <div class="margin-top">
      <van-cell-group>
        <van-field
          v-model="email"
          clearable
          label="登录邮箱"
          placeholder="登录邮箱"
          :error-message="errMsg"
        />
        <van-field
          v-model="password"
          type="password"
          maxlength="12"
          label="登录密码"
          placeholder="请输入密码"
        />
      </van-cell-group>

      <van-row type="flex" class="padding" justify="center">
        <van-button type="primary" class="margin-right" @click="toLogin">立即登录</van-button>
        <van-button type="default" class="margin-right" @click="toUserLogin">普通用户登录</van-button>
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
    toUserLogin() {
      this.$router.push("../login");
    },
    toLogin() {
      if (this.password && this.email) {
        this.axios
          .post("/api/adminlogin", {
            email: this.email,
            password: this.password
          })
          .then(res => {
            if (res.data.code === 200) {
              console.log(res.data);
              this.$global.user = res.data.data;
              sessionStorage.setItem("isAdmin", true);
              Notify({ type: "success", message: res.data.data.message });
              this.$router.push("/admin/home");
            } else {
              Notify({ type: "danger", message: res.data.data.message });
            }
          });
      } else {
        Toast("请检查输入是否有误");
      }
    },

    toFindpassword() {
      Toast("请联系网站管理员找回密码");
    }
  },
  data() {
    return {
      isRegister: true,
      email: undefined,
      password: undefined,
      errMsg: ""
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
</style>