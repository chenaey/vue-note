<template>
  <div>
    <van-row type="flex" class="padding topBg" justify="center">
      <!-- <span class="top-left" @click="back">返回</span> -->
      {{this.$global.appName}}后台 首页
    </van-row>

    <div class="row">
      <div class="myround">用户总数 {{users.length}}</div>
      <div class="myround">日访问量 {{users.visitCountDay}}</div>
      <div class="myround">总访问量 {{users.visitCount}}</div>

      <div class="myround">会员总数 {{users.vipCount}}</div>
      <div class="myround">总收入 {{users.vipCount*188}}￥</div>
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
      users: []
    };
  },
  methods: {
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
  margin-top: 20px;
}
.myround {
  padding: 30px;
  border-radius: 999px;
  color: #fff;
  font-size: 24px;
  background-color: #545c64;
}
</style>
        