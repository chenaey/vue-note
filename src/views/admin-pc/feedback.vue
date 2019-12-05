<template>
  <div>
    <van-row type="flex" class="padding topBg" justify="center">
      <!-- <span class="left" @click="back">返回</span> -->
      {{this.$global.appName}} 用户反馈
    </van-row>
    <van-cell v-if="feedBacks.length===0" title="当前暂无反馈信息" />

    <el-table :data="feedBacks" stripe border style="width: 100%">
      <el-table-column prop="time" label="反馈时间" width="180"></el-table-column>
      <el-table-column prop="email" label="反馈人邮箱" width="220"></el-table-column>
      <el-table-column prop="content" label="反馈内容" width="560"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.isVip"
            size="mini"
            type="primary"
            @click="showModel(scope.row)"
          >回复</el-button>

          <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
          <el-button size="mini" type="danger" @click="toDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <div v-for="(item,index) in feedBacks" :key="index">
      <van-swipe-cell>
        <template slot="left">
          <van-button square type="default" :text="item.email" />
        </template>
        <van-cell :title="item.content" :value="item.time" />
        <template slot="right">
          <van-button @click="toDelete(item)" square type="default" text="删除" />
          <van-button @click="showModel(item)" square type="primary" text="回复" />
        </template>
      </van-swipe-cell>
    </div>-->

    <van-popup v-model="showFeedBack" class="model pawd">
      <div class="col">
        <div class="row-center">
          <span>反馈回复</span>
        </div>
        <van-field
          v-model="message"
          rows="1"
          autosize
          class="bg-edit"
          type="textarea"
          placeholder="输入回复信息"
          maxlength="512"
          show-word-limit
        />
      </div>

      <div class="center-pay">
        <van-button
          :disabled="!showFeedBack"
          class="center"
          type="primary"
          size="small"
          @click="replay"
        >发送</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Vue from "vue";

import {
  Collapse,
  CollapseItem,
  Popup,
  Notify,
  ActionSheet,
  Dialog,
  SwipeCell
} from "vant";

Vue.use(Collapse)
  .use(CollapseItem)
  .use(Popup)
  .use(Notify)
  .use(Dialog)
  .use(SwipeCell)
  .use(ActionSheet);

export default {
  created() {
    this.getFeedBack();
  },
  methods: {
    sendFeedBack() {},
    getFeedBack() {
      this.axios
        .post("/api/feedback", {
          body: {
            type: "getAll"
          }
        })
        .then(res => {
          console.log(res);
          var list = res.data.data.list;
          list.sort((a, b) => {
            return b.createTime - a.createTime;
          });
          list.forEach((each, index) => {
            list[index].time = this.parseTime(each.createTime);
          });
          this.feedBacks = res.data.data.list;
        });
    },

    toDelete(item) {
      console.log(item);
      Dialog.confirm({
        title: "提示",
        message: "将删除此反馈"
      })
        .then(() => {
          this.axios
            .post("/api/feedback", {
              body: {
                type: "del",
                id: item._id
              }
            })
            .then(res => {
              console.log(res);
              if (res.data.code === 200) {
                this.getFeedBack();
                Notify({ type: "success", message: res.data.data.message });
              }
            });
        })
        .catch(() => {
          // on cancel
        });
    },

    showModel(item) {
      this.showFeedBack = true;
      this.item = item;
    },

    replay() {
      console.log(this.item);
      var item = this.item;
      if (this.message.length < 10) {
        Notify({ type: "danger", message: "回复字符不少于10" });
        return;
      }
      this.axios
        .post("/api/feedback", {
          body: {
            type: "replay",
            id: item._id,
            reply: this.message
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.code === 200) {
            this.getFeedBack();
            this.showFeedBack = false;
            Notify({ type: "success", message: res.data.data.message });
          }
        });
    },

    back() {
      this.$router.go(-1);
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
    },

    gtouchmove() {
      clearTimeout(this.timeOutEvent); //清除定时器
      this.timeOutEvent = 0;
    }
  },
  data() {
    return {
      message: "",
      showFeedBack: false,
      feedBacks: [],
      item: undefined
    };
  }
};
</script>
<style  scoped>
.left {
  position: absolute;
  left: 20px;
}
.pawd {
  width: 280px;
  height: 150px;
  border-radius: 10px;
}
.col {
  display: flex;
  flex-direction: column;
}
.center-pay {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
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
.model {
  width: 90%;
  height: auto;
}
.center {
  float: right;
  margin: 6px 0;
  margin-right: 20px;
}
</style>

