<template>
  <div>
    <van-row type="flex" class="padding topBg" justify="center">{{this.$global.appName}} 管理员</van-row>
    <van-grid :column-num="2">
      <van-grid-item
        v-for="(item,index) in menus"
        :key="index"
        :icon="item.icon"
        :text="item.name"
        :to="item.url"
      />
    </van-grid>
  </div>
</template>
<script>
import Vue from "vue";
import { Grid, GridItem } from "vant";

Vue.use(Grid).use(GridItem);
export default {
  data() {
    return {
      menus: [
        { name: "用户管理", icon: "friends-o", url: "user" },
        { name: "用户分享", icon: "like-o", url: "shares" },
        { name: "用户反馈", icon: "envelop-o", url: "feedback" },
        { name: "版本管理", icon: "cluster-o", url: "version" },
      ]
    };
  }
};
</script>