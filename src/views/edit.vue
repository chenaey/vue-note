<template>
  <div class="bg-edit">
    <van-row type="flex" class="padding topBg" justify="center">{{this.$global.appName}} 新增记事</van-row>

    <van-cell-group>
      <van-field class="bg-edit" v-model="title" maxlength="30" placeholder="在这里输入标题,最多30个字符" />
      <van-field
        v-model="message"
        rows="1"
        autosize
        class="bg-edit"
        type="textarea"
        placeholder="又是美好的一天,写点东西吧~"
        maxlength="2048"
        show-word-limit
      />
      <van-field class="bg-edit" v-model="tagString" placeholder="自定义标签 以空格间隔 " />
    </van-cell-group>

    <div class="row">
      <div v-for="(item,index) in tagList" :key="index">
        <van-tag style="margin-right:4px;" type="success">{{item}}</van-tag>
      </div>
    </div>
    <h2 class="tip">添加图片记事</h2>
    <div :style="{marginLeft:  62+'px'}">
      <van-uploader
        v-model="fileList"
        multiple
        class="bg-edit imgs"
        :before-read="beforeRead"
        :after-read="afterReadImg"
        :max-size="maxSize"
        :max-count="9"
      >
        <!-- <van-button icon="photo" size="small" type="primary">添加图片</van-button> -->
      </van-uploader>
    </div>
    <h2 class="tip">添加视频记事</h2>

    <van-uploader :before-read="beforeRead" :max-size="maxSize">
      <van-button icon="video" size="small" type="primary">添加视频</van-button>
    </van-uploader>

    <!-- 每个元素的两侧间隔相等 -->
    <van-row type="flex" justify="space-around">
      <van-col>
        <van-button type="default" size="small" @click="showAction">保存至:{{savePath}}</van-button>
      </van-col>
      <!-- <van-col>
        <van-button type="info" size="small">添加图片/视频</van-button>
      </van-col>-->

      <van-col>
        <van-button type="primary" size="small" @click="conformSave">确定保存</van-button>
      </van-col>
    </van-row>
    <van-action-sheet v-model="show" :actions="actions" @select="onSelect" />
  </div>
</template>


<script>
import Vue from "vue";
const qiniu = require("qiniu-js");

import { Toast, ActionSheet, Notify, Uploader } from "vant";
Vue.use(Toast)
  .use(ActionSheet)
  .use(Toast)
  .use(Uploader);

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
      actions: [{ name: "我的记事本" }],
      maxSize: 1024 * 1024 * 1024, //byte 1 m,
      fileList: []
    };
  },

  created() {
    console.log("created");
    var body = {
      type: "get",
      email: this.$global.user.email
    };
    this.getUpLoadToken();
    this.axios
      .post("/api/operatorUser", {
        body: body
      })
      .then(res => {
        if (res.data.code === 200 || res.data.code === 201) {
          console.log(res.data.data.folder);
          this.actions = res.data.data.folder.map(name => {
            return {
              name: name
            };
          });
        }
      });
  },

  methods: {
    //获取上传凭证token
    getUpLoadToken() {
      this.axios
        .post("/api/getuploadtoken", {
          email: this.$global.user.email
        })
        .then(res => {
          if (res.data.code === 200) {
            this.uploadToken = res.data.data.token;
          } else {
            Notify({ type: "danger", message: res.data.data.message });
          }
        });
    },
    // 返回布尔值
    beforeRead(file) {
      const enableileType = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "video/mp4"
      ];

      console.log(file);
      if (file.length && file.length > 1) {
        var isTrue = file.some(file => {
          return !enableileType.includes(file.type);
        });
        if (isTrue) {
          Toast("仅支持上传.jpeg/.png/.gif/格式");
          return false;
        }
        return true;
      }

      if (!enableileType.includes(file.type)) {
        Toast("仅支持上传.jpeg/.png/.gif/格式");
        return false;
      }
      return true;
    },
    conformSave() {
      this.uploadImg();
      var title = this.title;
      var text = this.text;
      var tags = this.tagList;
      var folder = this.savePath;
      var body = {
        title: title,
        email: this.$global.user.email,
        tags: tags,
        folder: folder,
        text: text
      };
      console.log(body);
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

    uploadImg() {
      var config = {
        useCdnDomain: true
      };
      //          fileList[i].file.name,

      console.log(this.uploadToken);
      var fileList = this.fileList;
      for (let i = 0; i < fileList.length; i++) {
        var observable = qiniu.upload(
          fileList[i].file,
          null,
          this.uploadToken,
          config
        );
        var subscription = observable.subscribe(
          this.next,
          this.error,
          this.complete
        );
        console.log(subscription);
        // subscription.unsubscribe(); // 上传取消
      }
    },
    afterReadImg(files) {
      console.log(files);
      console.log(this.fileList);
      console.log(qiniu);
    },
    next(res) {
      console.log(res);
      if (res.percent === 100) {
        Notify({ type: "success", message: "上传文件成功" });
      }
    },

    error(err) {
      console.log(err);
    },

    complete(res) {
      console.log(res);
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
.bg-edit {
  background-color: #fffcf6;
}
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

.tip {
  font-size: 14px;
  color: rgba(69, 90, 100, 0.6);
  padding: 10px 15px 15px;
}
</style>