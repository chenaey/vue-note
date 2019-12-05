<template>
  <div class="page">
    <van-row type="flex" class="padding topBg" justify="center">
      <span class="left" @click="back">返回</span>
      {{this.$global.appName}} 分享管理
    </van-row>

    <div class="content">
      <div class="title">我的分享 ({{myshareList.length}})</div>
      <van-cell v-if="myshareList.length===0" title="当前暂无分享" />

      <!-- <div v-for="(item) in myshareList" :key="item.createTime" class="border">
        <van-cell @click="lookDetail(item)" :title="item.content.title" :value="item.time" />
        <div class="right">
          <van-button type="primary" size="small" @click="cancelShare(item,0)">取消分享</van-button>
        </div>
      </div>-->

      <div v-for="(item,index) in myshareList" :key="index">
        <van-swipe-cell>
          <van-cell @click="lookDetail(item)" :title="item.content.title" :value="item.time" />
          <template slot="right">
            <!-- <van-button square type="default" :text="item.email+'分享'" /> -->
            <van-button @click="cancelShare(item,0)" square text="取消分享" />
          </template>
        </van-swipe-cell>
      </div>

      <div style="margin-top:10px;" class="title">他人分享({{shareNotes.length}})</div>
      <div v-for="(item) in shareNotes" :key="item.createTime">
        <van-swipe-cell>
          <van-cell @click="lookDetail(item)" :title="item.content.title" :value="item.time" />
          <template slot="right">
            <van-button square type="default" :text="item.email+'分享'" />
            <van-button @click="collectNote(item)" square type="primary" text="收藏" />
          </template>
        </van-swipe-cell>
      </div>
    </div>

    <!-- <div class="search">
      <div v-for="(item,index) in myshareList" v-bind:key="index" class="eachnote">
        <div @click="lookDetail(item)" class="title">{{item.content.title}}</div>
        <div class="right">
          <van-button type="primary" size="small" @click="cancelShare(item,0)">取消分享</van-button>
        </div>
      </div>
    </div>-->
  </div>
</template>
<script>
import Vue from "vue";
import { Tag, Notify, Dialog,Toast } from "vant";

Vue.use(Tag);
export default {
  created() {
    this.getShareNotes();

    var body = {
      type: "get",
      email: this.$global.user.email
    };
    this.axios
      .post("/api/operatorUser", {
        body: body
      })
      .then(res => {
        if (res.data.code === 200 || res.data.code === 201) {
          console.log(res);
          this.folder = res.data.data.folder;
          this.getMyNote();
        }
      });
  },
  data() {
    return {
      searchValue: "",
      myNotes: [], //我的分享
      shareNotes: [], //他人分享
      show: {
        primary: true,
        success: true
      },
      tagList: [],
      myshareList: []
    };
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
          if (this.$global.user.collectCount >= 20 && this.$global.user.isVip) {
            Toast("非会员收藏上限为20");
            return;
          }
          if (
            this.$global.user.collectCount >= 50 &&
            !this.$global.user.isVip
          ) {
            Toast("会员收藏上限为50");
            return;
          }
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
    getShareNotes() {
      var that = this;
      this.axios.post("/api/getsharenote").then(res => {
        console.log(res);
        if (res.data.code === 200) {
          console.log(res.data.data.note);
          var notes = res.data.data.list;
          for (var j = 0; j < notes.length; j++) {
            notes[j].time = that.parseTime(notes[j].createTime);
          }
          that.shareNotes = notes;
        }
      });
    },
    back() {
      this.$router.go(-1);
    },

    cancelShare(item, isShare) {
      var that = this;
      var message = "您的笔记将出现在笔记广场中";
      if (!isShare) {
        message = "取消笔记分享";
      }
      Dialog.confirm({
        title: "提示",
        message: message
      })
        .then(() => {
          var body = {
            _id: item._id,
            isShare: isShare,
            content: item.content,
            folder: item.folder
          };
          that.axios
            .post("/api/updatenote", {
              body: body
            })
            .then(res => {
              console.log(res);

              if (res.data.code === 200) {
                this.getMyNote();
                Notify({ type: "success", message: res.data.data.message });
              }
            });
        })
        .catch(() => {
          // on cancel
        });
    },

    onCancel() {
      this.searchValue = "";
    },

    onSearch(searchValue) {
      var notes = this.notes;
      var res = [];
      notes.forEach(list => {
        var data = list.filter(each => {
          return each.content.tags.includes(searchValue);
        });
        res.push(...data);
      });
      console.log(res);
      this.searchNote = res;
    },

    getMyNote() {
      var that = this;
      this.axios
        .post("/api/getnote", {
          body: {
            email: this.$global.user.email
          }
        })
        .then(res => {
          if (res.data.code === 200) {
            var notes = res.data.data.note;
            var folders = that.folder;
            var needList = [];
            var collectCount = 0; //收藏数量
            var myshareList = [];
            for (var i = 0; i < folders.length; i++) {
              var list = [];
              for (var j = 0; j < notes.length; j++) {
                if (folders[i] === notes[j].folder) {
                  notes[j].time = that.parseTime(notes[j].createTime);
                  list.push(notes[j]);
                  if (folders[i] === "我的收藏") {
                    collectCount++;
                  }
                  if (notes[j].isShare == "1") {
                    myshareList.push(notes[j]);
                  }
                }
              }
              needList.push(list);
            }
            this.myshareList = myshareList;
            console.log(myshareList);
            console.log(needList);
            this.$global.user.collectCount = collectCount;
            that.myNotes = needList;
          }
        });
    },

    lookDetail(item) {
      console.log(item);
      this.$global.noteDetail = item;
      this.$router.push("/detail");
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
  }
};
</script>
<style scoped>
.page {
  background-color: #ececec;
  min-height: 667px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
.content {
  margin: 0 4px;
  border-radius: 10px;
  border: 1px solid #ececec;
}
.title {
  background-color: #fff;
  font-size: 17px;
  font-weight: 600;
  padding: 10px;
  margin-top: 4px;
  border-bottom: 1px solid #999;
}
.border {
  border-bottom: 1px solid #ececec;
}
.left {
  position: absolute;
  left: 20px;
}
.row {
  margin: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.each {
  margin: 5px;
}
.search {
  margin: 20px;
}
.eachnote {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ececee;
  border-top: 1px solid #ececee;
}
.right {
  position: absolute;
  right: 10px;
}
</style>