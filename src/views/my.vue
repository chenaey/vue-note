<template>
  <div>
    <van-row type="flex" class="padding" justify="center">{{this.$global.appName}} 我的</van-row>
    <van-cell-group>
      <van-cell title="我的账号" value="12312321" />
      <van-cell @click="toPay" title="是否会员" value="非会员" label="点击立即开通" />
      <van-cell title="修改密码" is-link arrow-direction="down" />
    </van-cell-group>
  </div>
</template>


<script>
import Vue from "vue";

import { AddressEdit, Toast } from "vant";
Vue.use(Toast).use(AddressEdit);

export default {
  data() {
    return {
      areaList: [],
      searchResult: []
    };
  },

  methods: {
    toPay() {
        
      Toast("save");
    }
  }
};
</script>>