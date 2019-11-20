
<template>
  <div>
    <van-row type="flex" class="padding topBg" justify="center">
      <span class="left" @click="back">返回</span>
      {{this.$global.appName}} 分享管理
    </van-row>
    <van-cell v-if="notes.length===0" title="当前暂无用户分享信息" />

    <div v-for="(item,index) in notes" :key="index">
      <van-swipe-cell>
        <!-- <template slot="left">
                    <van-button square type="primary" :text="itemI.content.title" />
        </template>-->
        <van-cell @click="lookDetail(item)" :title="item.content.title" :value="item.time" />
        <template slot="right">
          <van-button square type="default" :text="item.email+'分享'" />
          <van-button @click="toDelete(item)" square type="danger" text="删除" />
          <!-- <van-button
            @click="toDelete(itemI)"
            square
            type="danger"
            text="违规封禁"
          />-->
        </template>
      </van-swipe-cell>
      <!-- <van-swipe-cell>
        <template slot="left">
          <van-button square type="default" :text="item.email" />
        </template>
        <van-cell :title="item.content" :value="item.time" />
        <template slot="right">
          <van-button @click="toDelete(item)" square type="default" text="删除" />
          <van-button @click="showModel(item)" square type="primary" text="回复" />
        </template>
      </van-swipe-cell>-->
    </div>
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
    this.getNotes();
  },
  methods: {
    sendFeedBack() {},
    getNotes() {
      this.axios.post("/api/getsharenote").then(res => {
        console.log(res);
        var list = res.data.data.list;
        list.sort((a, b) => {
          return b.createTime - a.createTime;
        });
        list.forEach((each, index) => {
          list[index].time = this.parseTime(each.createTime);
        });
        this.notes = res.data.data.list;
      });
    },

    lookDetail(item) {
      console.log(item);
      this.$global.noteDetail = item;
      this.$router.push("/detail");
    },

    toDelete(item) {
      console.log(item);
      Dialog.confirm({
        title: "提示",
        message: "将删除此项"
      })
        .then(() => {
          this.axios
            .post("/api/delnote", {
              body: {
                _id: item._id
              }
            })
            .then(res => {
              console.log(res);
              if (res.data.code === 200) {
                this.getNotes();
                Notify({
                  type: "success",
                  message: res.data.data.message,
                  duration: 1500
                });
              }
            });
        })
        .catch(() => {
          // on cancel
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
    }
  },
  data() {
    return {
      message: "",
      showFeedBack: false,
      notes: [],
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

