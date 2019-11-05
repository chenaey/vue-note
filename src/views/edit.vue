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
      <van-col>
        <van-button type="default" size="small" @click="showAction">保存至:{{savePath}}</van-button>
      </van-col>
      <van-col>
        <van-button type="info" size="small">添加图片/视频</van-button>
      </van-col>
      <van-col>
        <van-button type="primary" size="small" @click="conformSave">确定保存</van-button>
      </van-col>
    </van-row>
    <van-action-sheet v-model="show" :actions="actions" @select="onSelect" />
  </div>
</template>


<script>
import Vue from "vue";

import { Toast, ActionSheet, Notify } from "vant";
Vue.use(Toast)
  .use(ActionSheet)
  .use(Toast);

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
      savePath: "我的记事本",
      tagString: undefined,
      show: false,
      actions: [
        { name: "我的记事本" },
        { name: "选项" },
        { name: "选项", subname: "描述信息" }
      ]
    };
  },

  methods: {
    conformSave() {
      var title = this.title;
      var text = this.text;
      var tags = this.tagList;
      var folder = "folder";
      var body = {
        title: title,
        email: this.$global.user.email,
        tags: tags,
        folder: folder
      };
      console.log(title);
      console.log(text);
      console.log(tags);
      this.axios
        .post("/api/addnote", {
          body: body
        })
        .then(res => {
          if (res.data.code === 200 || res.data.code === 201) {
            console.log(res.data);
            Notify({ type: "success", message: res.data.data.message });
          } else {
            Notify({ type: "danger", message: res.data.data.message });
          }
        });
    },

    onSelect(item) {
      this.show = false;
      this.savePath = item.name;
      Toast(item.name);
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

.row-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>