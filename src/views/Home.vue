<template>
  <div>
    <van-row type="flex" class="padding topBg" justify="center">{{this.$global.appName}} 首页</van-row>

    <van-collapse v-model="activeName">
      <van-collapse-item title="标题1" name="1">
        <van-collapse v-model="activeName1">
          <van-collapse-item title="标题1" name="1">内容</van-collapse-item>
        </van-collapse>
      </van-collapse-item>
      <van-collapse-item title="标题2" name="2">内容</van-collapse-item>
      <van-collapse-item title="标题3" name="3">内容</van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
import Vue from "vue";

import { Collapse, CollapseItem } from "vant";

Vue.use(Collapse).use(CollapseItem);

export default {
  methds: {
    changeTabBar(e) {
      console.log(e);
    }
  },
  data() {
    return {
      active: 0,
      activeName: ["1"],
      activeName1: ["1"],
      folder: [
        {
          name: "我的记事本",
          note: [
            {
              title: "title",
              crtateTime: "2019-12-12",
              content:'content',
              tags:['1','213'],

            }
          ]
        }
      ]
    };
  }
};
</script>>


