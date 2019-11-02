<template>
  <div>
    <van-row type="flex" class="padding" justify="center">记事本-登录</van-row>
    <div class="margin-top">
      <van-cell-group>
        <van-field
          v-model="email"
          clearable
          label="登录邮箱"
          placeholder="登录邮箱,没有会自动注册哦"
          :error-message="errMsg"
        />
        <van-field v-model="password" type="password" label="登录密码" placeholder="请输入密码" />
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
import { Field, Cell, CellGroup, Toast } from "vant";
Vue.use(Field)
  .use(Cell)
  .use(CellGroup)
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

      if (this.email && this.password && this.errMsg !== "") {
        this.$router.push("/home");
      } else {
        this.Toast("输入错误");
      }
    },
    toFindpassword() {
      Toast("找回密码");
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
.padding {
  padding: 20px;
}

.margin-right {
  margin-right: 20px;
}
.margin-top {
  margin-top: 40px;
}
</style>