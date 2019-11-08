<template>
  <div>
    <van-row type="flex" class="padding topBg" justify="center">{{this.$global.appName}} 笔记广场</van-row>
    <div v-for="(item,index) in notes" :key="index">
      <van-swipe-cell>
        <van-cell :title="item.content.title" :value="item.time" />
        <template slot="right">
          <van-button square type="default" :text="item.email+'分享'" />
          <van-button @click="collectNote(item)" square type="primary" text="收藏" />
        </template>
      </van-swipe-cell>
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
    console.log("created");
    this.getNote();
  },
  methods: {
    collectNote(item) {
      console.log(item);
      var that = this;
      Dialog.confirm({
        title: "提示",
        message: "将收藏该笔记"
      })
        .then(() => {
          var body = item;
          body.folder = "我的收藏";
          body.email = this.$global.user.email;
          body.isShare = -1;
          body.title = body.content.title;
          body.tags = body.content.tags;
          body.text = body.content.text;
          body.video = body.content.video;
          body.imgs = body.content.imgs;
          that.axios
            .post("/api/addnote", {
              body: body
            })
            .then(res => {
              console.log(res);
              if (res.data.code === 200) {
                Notify({ type: "success", message: "收藏成功" });
              }
            });
        })
        .catch(() => {
          // on cancel
        });
    },
    parseTime(time) {
      var date = new Date(time);
      var Y = date.getFullYear();
      var M = date.getMonth() + 1;
      var D = date.getDate();
      var h = date.getHours();
      var m = date.getMinutes();
      return `${Y}/${M}/${D} ${h}:${m}`;
    },

    getNote() {
      var that = this;
      this.axios.post("/api/getsharenote").then(res => {
        console.log(res);
        if (res.data.code === 200) {
          console.log(res.data.data.note);
          var notes = res.data.data.note;
          for (var j = 0; j < notes.length; j++) {
            notes[j].time = that.parseTime(notes[j].createTime);
          }
          that.notes = notes;
        }
      });
    },

    lookDetail(item) {
      console.log(item);
      this.$global.noteDetail = item;
      this.$router.push("/detail");
    },

    showModel() {
      this.show = true;
    },

    gtouchstart(index) {
      this.timeOutEvent = setTimeout(() => {
        this.longPress(index);
      }, 500);
      return false;
    },

    //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
    gtouchend() {
      clearTimeout(this.timeOutEvent); //清除定时器
      if (this.timeOutEvent != 0) {
        console.log("XXX");
        //这里写要执行的内容（尤如onclick事件）
      }
      return false;
    },

    gtouchmove() {
      clearTimeout(this.timeOutEvent); //清除定时器
      this.timeOutEvent = 0;
    },

    longPress(index) {
      this.timeOutEvent = 0;
      this.selectIndex = index;
      console.log("长按事件", index);
      this.showAction = true;
    },
    conformUpdateFolder() {
      var that = this;
      console.log(this.newReFolderName, this.selectIndex);
      that.folder[this.selectIndex] = this.newReFolderName;
      var body = {
        type: "update",
        email: this.$global.user.email,
        folder: this.folder
      };
      that.axios
        .post("/api/operatorUser", {
          body: body
        })
        .then(res => {
          that.showReName = that.showAction = false;
          console.log(res);
          if (res.data.code === 200) {
            Notify({ type: "success", message: res.data.data.message });
            that.folder = res.data.data.folder;
          }
        });
    }
  },
  data() {
    return {
      notes: []
    };
  }
};
</script>
<style  scoped>
</style>

