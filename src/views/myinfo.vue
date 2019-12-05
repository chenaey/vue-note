<template>
  <div class="about">
    <van-row type="flex" class="padding topBg" justify="center">
      <span class="left" @click="back">返回</span>
      {{this.$global.appName}} 我的信息
    </van-row>
    <div class="top-row">
      <img
        class="avator"
        src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
        alt
        srcset
      />
      <div class="username">
        <span>{{userInfo.username}}</span>
        <span>{{this.$global.user.email}}</span>
        <span style="margin-top:10px;" v-if="user.isVip===0">非会员</span>
        <span class="vipyes" v-if="user.isVip!==0">会员</span>
      </div>
    </div>

    <van-cell-group v-if="user.userInfo">
      <van-field v-model="safeKey" label="安全码" placeholder="安全码" maxlength="10" />

      <van-field v-model="userInfo.username" label="用户名" placeholder="用户名" maxlength="10" />
      <van-field
        v-model="user.userInfo.year"
        type="number"
        maxlength="3"
        label="年龄"
        placeholder="年龄"
      />
      <van-field v-model="userInfo.where" maxlength="22" label="地区" placeholder="地区" />
    </van-cell-group>

    <van-row type="flex" class="padding" justify="center">
      <van-button type="primary" @click="toSave">确定修改</van-button>
    </van-row>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast, Area } from "vant";
Vue.use(Area).use(Toast);

export default {
  created() {
    console.log("created");
    this.user = this.$global.user;
    console.log(this.$global.user);
    console.log("###########");
    this.axios
      .post("/api/operatorUser", {
        body: {
          type: "get",
          email: this.$global.user.email
        }
      })
      .then(res => {
        console.log(res);
        if (res.data.code === 200 || res.data.code === 201) {
          this.user = res.data.data;
          this.userInfo = res.data.data.userInfo;
          this.safeKey = res.data.data.safeKey;
          console.log(this.user);
        }
      });
  },
  data() {
    return {
      user: {},
      userInfo: {
        username: undefined,
        year: undefined,
        where: undefined
      },
      safeKey: undefined
    };
  },

  methods: {
    back() {
      this.$router.go(-1);
    },

    toSave() {
      var user = this.user;
      console.log(user);
      if (
        !user.userInfo.username ||
        !user.userInfo.where ||
        !user.userInfo.year
      ) {
        Toast("信息不完善");
        return;
      }
      if (this.safeKey.length < 3) {
        Toast("安全码不能低于3位数");

        return;
      }
      console.log(user.userInfo);
      this.axios
        .post("/api/operatorUser", {
          body: {
            type: "changeInfo",
            email: this.$global.user.email,
            userInfo: this.userInfo,
            safeKey: this.safeKey
          }
        })
        .then(res => {
          if (res.data.code === 200 || res.data.code === 201) {
            console.log(res);
            Toast(res.data.message);
          }
        });
    }
  }
};
</script>


<style scoped>
.avator {
  width: 56px;
  height: 56px;
  border-radius: 6px;
}

.top-row {
  display: flex;
  flex-direction: row;
  padding-bottom: 20px;
  margin: 10px 20px 20px 20px;
  border-bottom: 1px solid #ececec;
}

.username {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 20px;
}

.vipno {
  color: #409eff;
  font-weight: 600;
  padding-top: 2px;
}

.vipyes {
  width: 43px;
  margin-top: 2px;
  background-color: #67c23a;
  color: #fff;
  font-weight: 600;
  padding-left: 4px;
}

.left {
  position: absolute;
  left: 20px;
}
</style>