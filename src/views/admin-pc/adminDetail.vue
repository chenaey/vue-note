<template>
  <div class="bg-edit">
    <van-row type="flex" class="padding topBg" justify="center">
      <span class="left" @click="back">返回</span>
      {{this.$global.appName}} 记事详情
    </van-row>
    <van-cell-group>
      <van-field
        class="bg-edit"
        v-model="note.content.title"
        maxlength="30"
        placeholder="在这里输入标题,最多30个字符"
      />
      <van-field
        v-model="note.content.text"
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
      <div v-for="(item,index) in note.content.tags" :key="index">
        <van-tag style="margin-right:4px;" type="success">{{item}}</van-tag>
      </div>
    </div>
    <div class="row">
      <div v-for="(item,index) in note.tagList" :key="index">
        <van-tag style="margin-right:4px;" type="success">{{item}}</van-tag>
      </div>
    </div>
    <!--video-->
    <div class="row-center" v-if="note.content.video">
      <video width="350" height="240" controls="controls">
        <source :src="baseUrl+note.content.video" type="video/mp4" />
        <source :src="baseUrl+note.content.video" type="video/ogg" />
        <source :src="baseUrl+note.content.video" type="video/webm" />
        <object :src="baseUrl+note.content.video" width="350" height="240">
          <embed :src="baseUrl+note.content.video" width="350" height="240" />
        </object>
      </video>
    </div>

    <h2 class="tip" @click="showTypeAction">
      当前为
      <span>{{selectName}}</span>
    </h2>
    <!-- <div v-if="selectType===1" :style="{marginLeft:  62+'px'}">
      <van-uploader
        v-model="fileList"
        multiple
        class="bg-edit imgs"
        :before-read="beforeRead"
        :after-read="afterRead"
        :max-size="maxSize"
        :max-count="9"
      ></van-uploader>
    </div>
    <div v-if="selectType===2">
      <van-uploader
        accept="video/mp4"
        class="bg-edit imgs"
        :before-read="beforeReadVideo"
        :after-read="afterReadVideo"
      ></van-uploader>
    </div>-->
    <div class="imgs" v-if="note.content.imgs">
      <div v-for="(item,index) in note.content.imgs" :key="index">
        <img class="img-one" :src="baseUrl+item" alt="图片" />
      </div>
    </div>
    <van-row
      type="flex"
      justify="space-around"
      v-if="this.$global.user.email===this.$global.noteDetail.email"
    >
      <!-- <van-col>
        <van-button type="primary" size="small" @click="conformSave">确定修改</van-button>
      </van-col> -->
    </van-row>
  </div>
</template>


<script>
import Vue from "vue";
const qiniu = require("qiniu-js");

import { Toast, ActionSheet, Notify, Uploader, Progress } from "vant";
Vue.use(Toast)
  .use(Progress)
  .use(ActionSheet)
  .use(Toast)
  .use(Uploader);

export default {
  created() {
    console.log("created");
    console.log(this.$global.noteDetail);
    if (!this.$global.noteDetail) {
      Notify({ type: "danger", message: "发生错误,请返回重试" });
    } else {
      var note = this.$global.noteDetail;
      this.tagList = note.content.tags;
      console.log(note.content.text);
      if (note.content.text === null) {
        note.content.text = "";
      }
      this.tagString = note.content.tags.join(" ");
      this.note = note;
      if (note.content.video) {
        this.selectName = "视频记事本";
      } else if (note.content.imgs && note.content.imgs.length > 0) {
        this.selectName = "图文记事本";
      } else {
        this.selectName = "文字记事本";
      }
      console.log(note);
    }
  },
  watch: {
    tagString() {
      if (this.tagString === "") {
        return;
      }
      this.note.content.tags = this.tagString.split(" ");
      if (this.tagList.length > 10) {
        Toast("非Vip仅支持10个标签");
        this.tagList = this.tagList.splice(0, 10);
        return;
      }
    }
  },
  data() {
    return {
      baseUrl: "http://cdn.i7code.cn/",
      note: undefined,
      title: "",
      message: "",
      tagList: [],
      savePath: "我的记事本",
      tagString: undefined,
      video: "",
      show: false,
      showType: false,
      actionType: [
        { name: "文字记事本", type: 0 },
        { name: "图文记事本", type: 1 },
        { name: "视频记事本", type: 2 }
      ],
      selectType: 0,
      selectName: "文字记事本",
      actions: [{ name: "我的记事本" }],
      maxSize: 1024 * 1024 * 1024, //byte 1 m,
      fileList: [],
      fileListSuccess: 0, //上传成功数量
      percent: 0,
      uploadImgKey: [] //上传图片成功后返回的key
    };
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

    beforeReadVideo(file) {
      console.log(file);
      const enableileType = ["video/mp4"];
      if (file.length && file.length > 1) {
        var isTrue = file.some(file => {
          return !enableileType.includes(file.type);
        });
        if (isTrue) {
          Toast("仅支持上传.mp4格式");
          return false;
        }
        return true;
      }

      if (!enableileType.includes(file.type)) {
        Toast("仅支持上传.mp4格式");
        return false;
      }
      return true;
    },
    back() {
      this.$router.go(-1);
    },

    beforeRead(file) {
      const enableileType = ["image/jpeg", "image/png", "image/gif"];
      if (file.length && file.length > 1) {
        var isTrue = file.some(file => {
          return !enableileType.includes(file.type);
        });
        if (isTrue) {
          Toast("仅支持上传.jpeg/.png/.gif格式");
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
      if (this.note.content.title <= 0) {
        Notify({ type: "danger", message: "标题不能为空" });
        return;
      }
      if (this.fileList.length > 0) {
        this.uploadImg();
      } else if (this.video !== "") {
        this.uploadVideo();
      } else {
        var body = {
          _id: this.note._id,
          isShare: this.note.isShare,
          folder: this.note.folder,
          content: this.note.content
        };
        this.axios
          .post("/api/updatenote", {
            body: body
          })
          .then(res => {
            if (res.data.code === 200) {
              console.log(res.data);
              Notify({ type: "success", message: res.data.data.message });
            } else {
              Notify({ type: "danger", message: res.data.data.message });
            }
          });
      }
    },

    uploadVideo() {
      console.log(this.video);
    },

    uploadImg() {
      var config = {
        useCdnDomain: true
      };
      var fileList = this.fileList;
      for (let i = 0; i < fileList.length; i++) {
        var observable = qiniu.upload(
          fileList[i].file,
          null,
          this.uploadToken,
          config
        );
        observable.subscribe(this.next, this.error, this.complete);
        // console.log(subscription);
        // subscription.unsubscribe(); // 上传取消
      }
    },

    next(res) {
      console.log(res);
      this.percent = res.total.percent;
      if (res.percent === 100) {
        Notify({ type: "success", message: "上传文件成功" });
      }
    },

    afterReadVideo(files) {
      console.log(files);
      console.log(this.fileList);
    },

    afterRead(files) {
      console.log(files);
      console.log(this.fileList);
      console.log(qiniu);
    },

    error(err) {
      console.log(err);
    },

    complete(res) {
      console.log(res);
      this.percent = 0;
      this.uploadImgKey.push(res.key);
      console.log(this.uploadImgKey);
      if (++this.fileListSuccess >= this.fileList.length) {
        console.log("最后一张");
        var body = {
          title: this.title,
          email: this.$global.user.email,
          tags: this.tags,
          folder: this.folder,
          text: this.text,
          imgs: this.uploadImgKey
        };
        this.axios
          .post("/api/addnote", {
            body: body
          })
          .then(res => {
            if (res.data.code === 200) {
              console.log(res.data);
              Notify({ type: "success", message: res.data.data.message });
            } else {
              Notify({ type: "danger", message: res.data.data.message });
            }
          });
      }
    },

    onSelect(item) {
      this.show = false;
      this.savePath = item.name;
      Toast(item.name);
    },

    onSelectType(item) {
      this.showType = false;
      this.selectName = item.name;
      this.selectType = item.type;
      Toast(item.name);
    },

    showTypeAction() {
      this.showType = true;
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

.img-one {
  width: 100%;
  height: auto;
}

.left {
  position: absolute;
  left: 320px;
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