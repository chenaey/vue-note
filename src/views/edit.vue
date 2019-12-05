<template>
  <div class="edit bg-edit">
    <van-row type="flex" class="padding topBg" justify="center">{{this.$global.appName}} 新增记事</van-row>
    <van-row type="flex" justify="space-around" style="margin-top:10px;">
      <van-col>
        <van-button size="small" @click="conformCancle">重新编辑</van-button>
      </van-col>
      <van-col>
        <van-button type="primary" size="small" @click="conformSave">保存</van-button>
      </van-col>
    </van-row>

    <van-cell-group>
      <div class="title">
        <van-field class="bg-edit" v-model="title" maxlength="30" placeholder="在这里输入标题,最多30个字符" />
      </div>
      <div class="message">
        <van-field
          v-model="message"
          rows="10"
          autosize
          class="bg-edit"
          type="textarea"
          placeholder="又是美好的一天,写点东西吧~"
          maxlength="2048"
          show-word-limit
        />
      </div>
    </van-cell-group>
    <div class="tags">
      <el-tag
        :key="tag"
        class="eachtag"
        v-for="tag in tagList"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
      >{{tag}}</el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      ></el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新标签</el-button>
      <div v-if="publicTagList.length>0">
        <div class="my-title">便捷标签</div>
        <div class="row">
          <div
            v-for="(item,index) in publicTagList"
            v-bind:key="index"
            class="each"
            @click="addPublicTag(item)"
          >
            <van-tag size="medium" type="success">{{item}}</van-tag>
          </div>
        </div>
      </div>
    </div>

    <h2 class="tip tags" @click="showTypeAction">
      当前为
      <span>{{selectName}}</span>(点击切换)
    </h2>
    <div v-if="selectType===1" :style="{marginLeft:  62+'px'}">
      <van-uploader
        v-model="fileList"
        multiple
        class="bg-edit imgs"
        :before-read="beforeRead"
        :after-read="afterRead"
        :max-size="maxSize"
        :max-count="9"
      >
        <!-- <van-button icon="photo" size="small" type="primary">添加图片</van-button> -->
      </van-uploader>
    </div>
    <div v-if="selectType===2">
      <input
        type="file"
        class="videoBtn"
        id="selectVideo"
        @change="onSelectVideo"
        accept="video/*"
        capture="user"
      />
    </div>

    <van-row type="flex" justify="space-around">
      <van-col>
        <van-button class="bg-edit" type="default" size="small" @click="showAction">保存至:{{savePath}}</van-button>
      </van-col>
    </van-row>
    <van-action-sheet v-model="showType" :actions="actionType" @select="onSelectType" />
    <!--进度条-->
    <div v-if="percent!==0">
      <van-progress :percentage="percent" />
    </div>
    <van-action-sheet v-model="show" :actions="actions" @select="onSelect" />
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
    console.log(this.$global.user);
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
          console.log(res.data.data);
          this.publicTagList = res.data.data.tagList;
          console.log(res.data.data.folder);
          this.actions = res.data.data.folder.map(name => {
            return {
              name: name
            };
          });
        }
      });
  },
  watch: {
    // tagString() {
    //   if (this.tagString === "") {
    //     return;
    //   }
    //   this.tagList = this.tagString.split(" ");
    //   if (this.$global.user.isVip === 0 && this.tagList.length > 10) {
    //     Toast("非Vip仅支持10个标签");
    //     this.tagList = this.tagList.splice(0, 10);
    //     return;
    //   }
    // }
  },
  data() {
    return {
      title: "",
      message: "",
      tagList: [],
      savePath: "我的记事本",
      tagString: undefined,
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
      videoFile: "",
      fileListSuccess: 0, //上传成功数量
      percent: 0,
      uploadImgKey: [], //上传图片成功后返回的key
      inputVisible: false,
      inputValue: "",
      publicTagList: [] //便捷标签
    };
  },

  methods: {
    addPublicTag(name) {
      if (!this.tagList.includes(name)) this.tagList.push(name);
    },
    handleClose(tag) {
      this.tagList.splice(this.tagList.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      // this.$nextTick( => {
      //   this.$refs.saveTagInput.$refs.input.focus();
      // });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (this.$global.user.isVip === 0 && this.tagList.length >= 10) {
        Toast("非Vip仅支持10个标签");
        return;
      }
      if (inputValue) {
        this.tagList.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
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
      // const enableileType = ["video/mp4"];
      // if (file.length && file.length > 1) {
      //   var isTrue = file.some(file => {
      //     return !enableileType.includes(file.type);
      //   });
      //   if (isTrue) {
      //     Toast("仅支持上传.mp4格式");
      //     return false;
      //   }
      //   return true;
      // }

      // if (!enableileType.includes(file.type)) {
      //   Toast("仅支持上传.mp4格式");
      //   return false;
      // }
      return true;
    },
    beforeRead(file) {
      const enableileType = ["image/jpeg", "image/png", "image/gif"];
      console.log(file);
      if (file.length && file.length > 1) {
        var size = file.reduce((total, each) => {
          return total + each.size;
        }, 0);
        console.log(size);
        if (size > 1 * 1024 * 1024 && !this.$global.user.isVip) {
          Toast("非会员仅支持上传小于1M的文件");
          return false;
        }
        if (size > 10 * 1024 * 1024 && this.$global.user.isVip) {
          Toast("会员仅支持上传小于10M的文件");
          return false;
        }
        var isTrue = file.some(file => {
          return !enableileType.includes(file.type);
        });
        if (isTrue) {
          Toast("仅支持上传.jpeg/.png/.gif格式");
          return false;
        }
        return true;
      }
      var ssize = file.size;
      if (ssize > 1 * 1024 * 1024 && !this.$global.user.isVip) {
        Toast("非会员仅支持上传小于1M的文件");
        return false;
      }
      if (ssize > 10 * 1024 * 1024 && this.$global.user.isVip) {
        Toast("会员仅支持上传小于10M的文件");
        return false;
      }

      if (!enableileType.includes(file.type)) {
        Toast("仅支持上传.jpeg/.png/.gif/格式");
        return false;
      }
      return true;
    },

    conformCancle() {
      this.title = undefined;
      this.tagList = [];
      this.tagString = "";
      this.message = "";
    },

    conformSave() {
      Toast({ message: "正在上传数据 请勿离开此页面", duration: 1000 });
      if (this.title.length <= 0) {
        Notify({ type: "danger", message: "标题不能为空" });
        return;
      }
      console.log(this.fileList);
      if (this.selectName === "视频记事本") {
        console.log("视频");
        this.qiniuUploadVideo(this.videoFile);
      } else if (this.fileList.length > 0) {
        console.log("图片");
        this.uploadImg();
      } else {
        console.log("文字");
        var body = {
          title: this.title,
          email: this.$global.user.email,
          tags: this.tagList,
          folder: this.savePath,
          text: this.message,
          createTime: new Date().getTime()
        };
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
      }
    },

    onSelectVideo(event) {
      console.log(event.target.files[0]);
      var size = event.target.files[0].size;
      if (size > 10 * 1024 * 2014) {
        Toast("文件大于10M将上传失败");
        return;
      }
      // this.$global.user.isVip
      this.videoFile = event;
    },

    qiniuUploadVideo(event) {
      console.log(event);
      if (!event) {
        Toast("发生错误");
        return;
      }
      var file = event.target.files[0];
      const formdata = new FormData();
      formdata.append("file", file);
      formdata.append("token", this.uploadToken);
      this.$axios({
        method: "post",
        url: "http://upload-z2.qiniup.com/", // 七牛云的上传地址 华南区
        headers: {
          "Content-Type": "multipart/form-data"
        },
        data: formdata
      })
        .then(res => {
          console.log(res);
          console.log(res.data);

          //上传完成 将key写入数据库
          var body = {
            title: this.title,
            email: this.$global.user.email,
            tags: this.tagList,
            folder: this.savePath,
            text: this.message,
            imgs: this.uploadImgKey,
            createTime: new Date().getTime(),
            video: res.data.hash
          };
          console.log(this.message);
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
        })
        .catch(err => {
          console.log(err);
        });
    },

    uploadImg() {
      var config = {
        useCdnDomain: true
      };
      var fileList = this.fileList;
      console.log(fileList);

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

    afterReadVideo(file) {
      console.log(file);
      var config = {
        useCdnDomain: true
      };
      var observable = qiniu.upload(file, null, this.uploadToken, config);
      observable.subscribe(this.next, this.error, this.completeVideo);
      this.videoFile = file;
      console.log(this.videoFile);
    },

    afterRead(files) {
      console.log(files);
      console.log(this.fileList);
      console.log(qiniu);
    },

    error(err) {
      console.log(err);
    },
    completeVideo(res) {
      console.log(res);
      this.percent = 0;
      console.log("上传完成");
      var body = {
        title: this.title,
        email: this.$global.user.email,
        tags: this.tagList,
        folder: this.savePath,
        text: this.message,
        imgs: this.uploadImgKey,
        createTime: new Date().getTime(),
        video: res.key
      };
      console.log(this.message);
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
          tags: this.tagList,
          folder: this.savePath,
          text: this.message,
          imgs: this.uploadImgKey,
          createTime: new Date().getTime()
        };
        console.log(this.message);
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
      console.log(item);
      this.savePath = item.name;
      Toast(item.name);
    },

    onSelectType(item) {
      this.showType = false;
      if (item.type === 2 && this.$global.user.isVip === 0) {
        Toast("非会员不支持视频记事本");
        return;
      }
      console.log(item);
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
.edit {
  min-height: 500px;
  background: #ddd;
}

.bg-edit {
  background-color: #fff;
}
.each {
  margin: 10px 5px;
}
.add-btn {
  float: right;
  padding-top: 10px;
  padding-right: 20px;
}

.margin {
  margin: 0 30px;
}

.title {
  margin: 10px 30px;
  border: 1px solid #999;
}
/* 545c64 */

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
.message {
  margin: 10px 30px;
  border: 1px solid #999;
}

.tag {
  margin: 10px 30px;
  padding: 4px 10px;
  border: 1px solid #999;
}
.my-title {
  background-color: #fff;
  font-size: 16px;
  padding: 4px;
  margin-top: 6px;
  border-bottom: 1px solid #ececec;
}
.tip {
  font-size: 14px;
  color: rgba(69, 90, 100, 0.6);
  padding: 10px 15px 15px;
}

.videoBtn {
  padding: 6px;
}

.eachtag {
  margin-bottom: 5px;
}

.tags {
  border: 1px solid #999;
  margin: 10px 30px;
  padding: 10px 5px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>