<template>
  <div>
    <van-row type="flex" class="padding topBg" justify="center">
      <span class="left" @click="back">返回</span>
      {{this.$global.appName}} 版本管理
    </van-row>

    <div class="col">
      <div class="row-center">
        <span>当前版本</span>
      </div>
      <van-field v-model="versionInfo.version" type="text" label="版本号" placeholder="请输入版本号" />
      <van-field v-model="versionInfo.description" type="text" label="版本描述" placeholder="请输入版本描述" />
      <input
        style="padding:10px;"
        type="file"
        class="videoBtn"
        id="selectVideo"
        @change="onSelectFile"
        capture="user"
      />
    </div>
    <div class="row-center">
      <van-button type="primary" size="small" @click="updateVersion">确定修改</van-button>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Panel, Toast, Notify } from "vant";

Vue.use(Panel)
  .use(Toast)
  .use(Notify);

export default {
  created() {
    console.log("created");
    this.getVersion();
  },

  methods: {
    onSelectFile(event) {
      this.file = event;
    },

    updateVersion() {
      Toast("正在更新版本信息 请勿离开此页面");
      var event = this.file;
      if (!event) {
        Toast("发生错误");
        return;
      }
      if (event.target.files[0].size > 30 * 1024 * 2014) {
        Toast("文件大于30M将上传失败");
        return;
      }
      this.axios
        .post("/api/getuploadtoken", {
          email: "1@qq.com"
        })
        .then(res => {
          if (res.data.code === 200) {
            var uploadToken = res.data.data.token;
            var file = event.target.files[0];
            const formdata = new FormData();
            formdata.append("file", file);
            formdata.append("token", uploadToken);
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
                var info = this.versionInfo;
                var body = {
                  id: info._id,
                  type: "update",
                  version: info.version,
                  createTime: new Date().getTime(),
                  description: info.description,
                  url: res.data.hash
                };
                this.axios
                  .post("/api/version", {
                    body: body
                  })
                  .then(res => {
                    console.log(res.data);
                    if (res.data.code === 200) {
                      console.log(res.data);
                      Notify({
                        type: "success",
                        message: res.data.data.message
                      });
                    } else {
                      Notify({
                        type: "danger",
                        message: res.data.data.message
                      });
                    }
                  });
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            Notify({ type: "danger", message: res.data.data.message });
          }
        });
    },
    back() {
      this.$router.go(-1);
    },
    getVersion() {
      this.axios
        .post("/api/version", {
          body: {
            type: "get"
          }
        })
        .then(res => {
          console.log(res);
          res.data.result.time = this.parseTime(res.data.result.createTime);
          this.versionInfo = res.data.result;
          console.log(res.data.result);
        });
    },

    parseTime(time) {
      var date = new Date(time);
      var Y = date.getFullYear();
      var M = date.getMonth() + 1;
      var D = date.getDate();
      var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var m =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      return `${Y}/${M}/${D} ${h}:${m}`;
    }
  },
  data() {
    return {
      versionInfo: {},
      showVersion: false,
      file: undefined
    };
  }
};
</script>

<style  scoped>
.col {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  flex-direction: row;
  padding-bottom: 20px;
}

.row-center {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.pawd {
  width: 280px;
  height: 220px;
  border-radius: 10px;
}

.left {
  position: absolute;
  left: 20px;
}
</style>