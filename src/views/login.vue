<template>
  <div>
    <van-row type="flex" class="padding topBg" justify="center">记事本-登录</van-row>
    <div class="margin-top">
      <van-cell-group>
        <van-field
          v-model="email"
          clearable
          label="登录邮箱"
          placeholder="登录邮箱,没有会自动注册哦"
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
        <van-button @click="toFindpassword">忘记密码?</van-button>
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
      //@TODO 服务器登录
      //   Toast("输入错误");
      var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      if (this.password.length < 6) {
        Toast("密码最短为6位数");
        return;
      }
      if (this.password && reg.test(this.email)) {
        this.axios
          .post("/api/login", {
            email: this.email,
            password: this.password
          })
          .then(res => {
            if (res.data.code === 200 || res.data.code === 201) {
              console.log(res.data);
              this.$global.user = res.data.data;
              Notify({ type: "success", message: res.data.data.message });
              this.$router.push("/edit");
            } else {
              Notify({ type: "danger", message: res.data.data.message });
            }
          });
      } else {
        Toast("请检查输入邮箱是否有误");
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