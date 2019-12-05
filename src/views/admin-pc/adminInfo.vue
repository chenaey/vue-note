<template>
  <div>
    <van-row type="flex" class="padding topBg" justify="center">
      <!-- <span class="top-left" @click="back">返回</span> -->
      {{this.$global.appName}}后台 管理员账号信息
    </van-row>

    <div class="row">
      <div class="myround">登录邮箱{{userName}}</div>
      <div class="myround">登录密码 {{password}}</div>
    </div>
    <div class="row">
      <div class="myround-prim" @click="toLogin">前往记事本登录页面</div>
      <div class="myround-exit" @click="exit">退出当前账号</div>
    </div>
  </div>
</template>
<script>
export default {
  created() {
    this.getUserss();
  },
  data() {
    return {
      userName: "admin@qq.com",
      password: "admin"
    };
  },
  methods: {
    toLogin() {
      this.$global.user = {};
      sessionStorage.setItem("isAdmin", false);
      this.$router.push("/login");
    },

    exit() {
      this.$global.user = {};
      sessionStorage.setItem("isAdmin", false);
      this.$router.push("/admin-pc/login");
    },

    getUserss() {
      var that = this;
      this.axios
        .post("/api/adminuser", {
          body: { type: "getAll" }
        })
        .then(res => {
          var list = res.data.data.list;
          var vipCount = 0;
          list.forEach((each, index) => {
            if (list[index].isVip) {
              vipCount++;
            }
          });
          console.log(res.data.data.list);
          that.users = res.data.data.list;
          that.users.vipCount = vipCount;
          that.users.visitCountDay = Math.floor(Math.random() * 1000);
          that.users.visitCount =
            that.users.visitCountDay + Math.floor(Math.random() * 1000);
        });
    }
  }
};
</script>
<style scoped>
.row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 120px;
}
.myround-prim {
  padding: 30px;
  border-radius: 999px;
  color: #fff;
  font-size: 24px;
  background-color: #409eff;
}

.myround-exit {
  padding: 30px;
  border-radius: 999px;
  color: #fff;
  font-size: 24px;
  background-color: #f56c6c;
}
.myround {
  padding: 30px;
  border-radius: 999px;
  color: #fff;
  font-size: 24px;
  background-color: #545c64;
}
</style>
        