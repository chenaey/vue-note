<template>
  <div>
    <van-row type="flex" class="padding topBg" justify="center">{{this.$global.appName}} 新增记事</van-row>

    <van-cell-group>
      <van-field v-model="title" maxlength="30" placeholder="在这里输入标题,最多30个字符" />
      <van-field
        v-model="message"
        rows="1"
        autosize
        type="textarea"
        placeholder="又是美好的一天,写点东西吧~"
        maxlength="2048"
        show-word-limit
      />
      <van-field v-model="tagString" placeholder="自定义标签 以空格间隔 " />
    </van-cell-group>

    <div class="row">
      <div v-for="(item,index) in tagList" :key="index">
        <van-tag style="margin-right:4px;" type="success">{{item}}</van-tag>
      </div>
    </div>

    <!-- 每个元素的两侧间隔相等 -->
    <van-row type="flex" justify="space-around">
      <van-col span="8">
        <van-button type="default" size="small">保存至:我的记事本</van-button>
      </van-col>
      <van-col span="8">
        <van-button type="primary" size="small">添加图片/视频</van-button>
      </van-col>
    </van-row>

    <!-- <div class="operator">
      <van-button type="default" size="small">保存至:我的记事本</van-button>

      <van-button type="primary" size="small">添加标签</van-button>

      <van-icon @click="showAction" class="add-btn" size="40px" color="#409EFF" name="add-o" />
    </div>

    <van-action-sheet v-model="show" :actions="actions" cancel-text="取消" @cancel="onCancel" />-->
  </div>
</template>


<script>
import Vue from "vue";

import { Toast, ActionSheet } from "vant";
Vue.use(Toast).use(ActionSheet);

export default {
  watch: {
    tagString() {
      if (this.tagString === "") {
        return;
      }

      this.tagList = this.tagString.split(" ");
      if (this.tagList.length > 10) {
        Toast("非Vip仅支持10个标签");
        this.tagList = this.tagList.splice(0, 10);

        return;
      }
    }
  },
  data() {
    return {
      title: "",
      message: "",
      tagList: [],
      tagString: undefined,
      show: false,
      actions: [{ name: "图片" }, { name: "视频" }]
    };
  },

  methods: {
    onCancel() {
      this.show = false;
      Toast("cancel");
    },
    showAction() {
      this.show = true;
    }
  }
};
</script>

<style  scoped>
.add-btn {
  float: right;
  padding-top: 10px;
  padding-right: 20px;
}

.row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 6px;
}
</style>