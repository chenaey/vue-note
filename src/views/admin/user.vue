
<template>
  <div>
    <van-row type="flex" class="padding topBg" justify="center">
      <span class="top-left" @click="back">返回</span>
      {{this.$global.appName}} 用户管理
    </van-row>

    <van-row type="flex" justify="space-around">
      <van-button type="default" size="small">当前用户数为:{{users.length}}</van-button>

      <van-button type="primary" size="small" @click="show=true">创建新的用户</van-button>
    </van-row>
    <van-cell v-if="users.length===0" title="当前暂无用户" />
    <div v-for="(item,index) in users" :key="index">
      <van-swipe-cell>
        <template slot="left">
          <van-button square type="default" :text="item.time" />
        </template>
        <!-- @click="lookDetail(item)" -->
        <van-cell
          @click="showPassword(item.password)"
          :title="item.email"
          :value="item.isVip?'VIP':'非VIP'"
        />
        <template slot="right">
          <van-button
            square
            type="default"
            @click="setVip(item._id,1)"
            v-if="!item.isVip"
            text="赠送会员"
          />
          <van-button
            square
            type="default"
            @click="setVip(item._id,0)"
            v-if="item.isVip"
            text="取消会员"
          />

          <van-button @click="toDelete(item)" square type="danger" text="删除" />
          <!-- <van-button
            @click="toDelete(itemI)"
            square
            type="danger"
            text="违规封禁"
          />-->
        </template>
      </van-swipe-cell>
      <!-- <van-swipe-cell>
        <template slot="left">
          <van-button square type="default" :text="item.email" />
        </template>
        <van-cell :title="item.content" :value="item.time" />
        <template slot="right">
          <van-button @click="toDelete(item)" square type="default" text="删除" />
          <van-button @click="showModel(item)" square type="primary" text="回复" />
        </template>
      </van-swipe-cell>-->
    </div>

    <van-popup v-model="show" class="model">
      <van-field v-model="email" label="注册邮箱" placeholder="输入注册邮箱" />
      <van-field v-model="password" maxlength="12" label="注册密码" placeholder="输入注册密码" />

      <van-button class="center" type="primary" size="small" @click="toLogin">确定创建</van-button>
    </van-popup>
  </div>
</template>

<script>
import Vue from "vue";

import {
  Collapse,
  CollapseItem,
  Popup,
  Notify,
  ActionSheet,
  Dialog,
  SwipeCell
} from "vant";

Vue.use(Collapse)
  .use(CollapseItem)
  .use(Popup)
  .use(Notify)
  .use(Dialog)
  .use(SwipeCell)
  .use(ActionSheet);

export default {
  created() {
    this.getUserss();
  },
  methods: {
    sendFeedBack() {},
    getUserss() {
      var that = this;
      this.axios
        .post("/api/adminuser", {
          body: { type: "getAll" }
        })
        .then(res => {
          console.log(res);
          var list = res.data.data.list;
          list.sort((a, b) => {
            return b.createTime - a.createTime;
          });
          list.forEach((each, index) => {
            list[index].time = this.parseTime(each.createTime);
          });
          console.log(res.data.data.list);
          that.users = res.data.data.list;
          console.log(that.users.length);
        });
    },

    // lookDetail(item) {
    //   console.log(item);
    //   this.$global.noteDetail = item;
    //   this.$router.push("/detail");
    // },

    setVip(id, isVip) {
      var message = "将该用户设置为VIP";
      if (isVip === 0) {
        message = "取消该用户的VIP";
      }
      console.log(isVip);
      Dialog.confirm({
        title: "提示",
        message: message
      })
        .then(() => {
          this.axios
            .post("/api/adminuser", {
              body: {
                id: id,
                type: "updateVip",
                isVip: isVip
              }
            })
            .then(res => {
              console.log(res);
              if (res.data.code === 200) {
                this.getUserss();
                Notify({
                  type: "success",
                  message: res.data.data.message,
                  duration: 1500
                });
              }
            });
        })
        .catch(() => {});
    },

    showPassword(password) {
      Notify({ type: "success", message: password, duration: 1000 });
    },
    toDelete(item) {
      console.log(item);
      Dialog.confirm({
        title: "提示",
        message: "将删除用户账号"
      })
        .then(() => {
          this.axios
            .post("/api/adminuser", {
              body: {
                id: item._id,
                type: "del"
              }
            })
            .then(res => {
              console.log(res);
              if (res.data.code === 200) {
                this.getUserss();
                Notify({
                  type: "success",
                  message: res.data.data.message,
                  duration: 1500
                });
              }
            });
        })
        .catch(() => {});
    },

    back() {
      this.$router.go(-1);
    },

    parseTime(time) {
      var date = new Date(time);
      var Y = date.getFullYear();
      var M = date.getMonth() + 1;
      var D = date.getDate();
      var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var m =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      return `${Y}/${M}/${D} ${h}:${m}`;
    },
    toLogin() {
      var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      if (this.password.length < 6) {
        Notify({ type: "danger", message: "密码最短为6位数", duration: 1500 });
        return;
      }
      if (this.password && reg.test(this.email)) {
        this.axios
          .post("/api/login", {
            email: this.email,
            password: this.password,
            createTime: new Date().getTime()
          })
          .then(res => {
            if (res.data.code === 200 || res.data.code === 201) {
              console.log(res.data);
              Notify({ type: "success", message: "注册成功", duration: 1500 });
              this.show = false;
              this.getUserss();
            } else {
              Notify({
                type: "danger",
                message: "注册错误,当前邮箱可能已被注册",
                duration: 1500
              });
            }
          });
      } else {
        Notify({
          type: "danger",
          message: "请检查输入邮箱是否有误",
          duration: 1500
        });
      }
    }
  },
  data() {
    return {
      message: "",
      users: [],
      password: "",
      email: "",
      show: false,
      item: undefined
    };
  }
};
</script>
<style  scoped>
.top-left {
  position: absolute;
  left: 20px;
}
.pawd {
  width: 280px;
  height: 150px;
  border-radius: 10px;
}
.col {
  display: flex;
  flex-direction: column;
}
.center-pay {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
}
.row {
  display: flex;
  flex-direction: row;
  padding-bottom: 20px;
}

.row-center {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}
.model {
  width: 90%;
  height: auto;
}
.center {
  float: right;
  margin: 6px 0;
  margin-right: 20px;
}
</style>

