<template>
  <div>
    <van-row type="flex" class="padding topBg" justify="center">
      <!-- <span class="left" @click="back">返回</span> -->
      {{this.$global.appName}} 历史版本
    </van-row>
    <el-table :data="versionInfo" stripe border style="width: 100%">
      <el-table-column prop="version" label="版本号" width="120"></el-table-column>
      <el-table-column prop="description" label="版本描述" width="320"></el-table-column>
      <el-table-column prop="url" label="下载地址" width="300"></el-table-column>
      <el-table-column prop="time" label="发布时间" width="320"></el-table-column>
    </el-table>
    <!-- <div class="col">
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
      <van-button type="primary" size="small" @click="updateVersion">确定发布</van-button>
    </div>-->
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

    getVersion() {
      this.axios
        .post("/api/version", {
          body: {
            type: "get"
          }
        })
        .then(res => {
          console.log(res);
          var list = res.data.data.list;
          console.log(list);
          if (list.length > 0) {
            list.sort((a, b) => {
              return b.createTime - a.createTime;
            });
            list.forEach((each, index) => {
              list[index].time = this.parseTime(list[index].createTime);
            });
            this.versionInfo = list;
          }
        });
    },

    parseTime(time) {
      var date = new Date(time);
      var Y = date.getFullYear();
      var M = date.getMonth() + 1;
      var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var m =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      return `${Y}/${M}/${D} ${h}:${m}`;
    }
  },
  data() {
    return {
      versionInfo: [],
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