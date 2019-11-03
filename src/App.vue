<template>
  <div id="app">
    <dir v-show="$route.meta.showTabBar">
      <van-tabbar route v-model="active">
        {{this.$global.showTabBar}}
        <van-tabbar-item to="/edit" icon="home-o">添加记事</van-tabbar-item>
        <van-tabbar-item to="/home" icon="search">查看记事</van-tabbar-item>
        <van-tabbar-item icon="friends-o">会员中心</van-tabbar-item>
        <van-tabbar-item to="/my" icon="setting-o">我的</van-tabbar-item>
      </van-tabbar>
    </dir>
    <div class="overflow">
      <router-view />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Tabbar, TabbarItem } from "vant";
Vue.use(Tabbar).use(TabbarItem);

export default {
  data() {
    return {
      appName: "记事本",
      active: 0
    };
  },
  methods: {}
};
</script>>


<style>
.overflow {
  margin-bottom: 60px;
}
.padding {
  padding: 10px;
}

.topBg {
  background-color: #409eff;
  color: #fff;
}
</style>
