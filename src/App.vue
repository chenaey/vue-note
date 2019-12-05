<template>
  <div id="app">
    <div v-show="$route.meta.showTabBar">
      <van-tabbar route v-model="active">
        {{this.$global.showTabBar}}
        <van-tabbar-item to="/shares" icon="home-o">最新</van-tabbar-item>
        <van-tabbar-item to="/edit" icon="edit">写笔记</van-tabbar-item>
        <van-tabbar-item to="/home" icon="paid">文件夹</van-tabbar-item>
        <van-tabbar-item to="/my" icon="user-o">我的</van-tabbar-item>
      </van-tabbar>
    </div>
    <div v-if="!$route.meta.requireAdminAuth" class="overflow">
      <router-view />
    </div>
    <div v-if="$route.meta.requireAdminAuth">
      <el-container>
        <el-aside class="leftfix" width="300px">
          <el-col>
            <el-menu
              default-active="home"
              class="el-menu-vertical-demo"
              :default-openeds="openss"
              @open="handleOpen"
              @close="handleClose"
              background-color="#545c64"
              text-color="#fff"
              :router="true"
              active-text-color="#ffd04b"
            >
              <el-menu-item index="home">
                <i class="el-icon-menu"></i>
                <span slot="title">首页</span>
              </el-menu-item>

              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-user-solid"></i>
                  <span>用户模块</span>
                </template>

                <el-menu-item-group>
                  <el-menu-item index="user">用户管理</el-menu-item>
                </el-menu-item-group>
                <!-- <el-menu-item-group>
                  <el-menu-item index="uservip">会员管理</el-menu-item>
                </el-menu-item-group>-->
              </el-submenu>

              <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-s-promotion"></i>
                  <span>分享模块</span>
                </template>

                <el-menu-item-group>
                  <el-menu-item index="shares">分享管理</el-menu-item>
                </el-menu-item-group>
              </el-submenu>

              <el-submenu index="3">
                <template slot="title">
                  <i class="el-icon-chat-dot-round"></i>
                  <span>意见模块</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="feedback">反馈管理</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="4">
                <template slot="title">
                  <i class="el-icon-edit"></i>
                  <span>软件版本模块</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="version">版本管理</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                  <el-menu-item index="hisversion">历史发布</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="5">
                <template slot="title">
                  <i class="el-icon-info"></i>
                  <span>更多</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="admininfo">管理员信息</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-aside>
        <el-main style="padding:0;margin-left:300px;">
          <router-view />
        </el-main>
      </el-container>
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
      active: 0,
      opens: ["user", "shares", "version", "info"],
      openss: ["1", "2", "3", "4", "5"]
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>>


<style>
.leftfix {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
}
.overflow {
  margin-bottom: 60px;
}
.padding {
  padding: 10px;
}
.topBg {
  background-color: #545c64;
  color: #fff;
}
</style>