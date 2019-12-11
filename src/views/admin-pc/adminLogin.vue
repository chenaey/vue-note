<template>
  <div class="body">
    <div class="box">
      <div class="login" v-loading="loading">
        <div id="tt">
          <p>记事本管理后台</p>
        </div>

        <!-- <p id="tt1">登陆</p> -->
        <p id="tt2">使用你的管理员账号登陆</p>

        <el-input style=" margin-bottom: 10px;" v-model="email" autofocus placeholder="登录邮箱"></el-input>

        <el-input v-model="password" show-password placeholder="请输入密码"></el-input>
        <el-button style="width:100%;margin-top:20px;" type="primary" @click="toLogin">立即登陆</el-button>
      </div>
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
    toUserLogin() {
      this.$router.push("../login");
    },
    toLogin() {
      this.loading = true;
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
              this.$router.push("/admin-pc/home");
            } else {
              Notify({ type: "danger", message: res.data.data.message });
            }
            this.loading = false;
          });
      } else {
        Toast("请检查输入是否有误");
        this.loading = false;
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
      errMsg: "",
      loading: false
    };
  }
};
</script>
<style scoped>
.dody {
  background: #fff;
  direction: ltr;
  font-size: 15px;
  line-height: 1.4286;
  margin: 0;
  padding: 0;
}

.box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 130px;
}

.login {
  padding: 30px;
  height: auto;
  min-height: 280px;
  width: 460px;
  border: 1px solid #ececec;
}

#logo {
  width: 50px;
  height: 50px;
}

#tt {
  display: flex;
  margin-left: -20px;
  justify-content: center;
  align-content: center;
  align-items: center;
}
#tt p {
  margin-top: 10px;
  display: flex;
  font-size: 20px;
  justify-content: center;
  align-content: center;
  align-items: center;
}

#tt1 {
  display: flex;
  font-size: 18px;
  justify-content: center;
}

#tt2 {
  display: flex;

  font-size: 15px;
  justify-content: center;
}
</style>