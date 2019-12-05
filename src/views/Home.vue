<template>
  <div>
    <van-row type="flex" class="padding topBg" justify="center">{{this.$global.appName}} 我的笔记</van-row>
    <van-row type="flex" justify="space-around">
      <van-col>
        <van-button type="default" size="small" @click="showModel">创建新的文件夹</van-button>
      </van-col>
      <!-- <van-cell is-link @click="showModel">展示弹出层</van-cell> -->

      <!-- <van-col>
        <van-button type="primary" size="small" @click="conformSave">编辑</van-button>
      </van-col>-->
    </van-row>
    <!-- <van-collapse v-model="activeName">
      <div v-for="(item,index) in folder" :key="index">
        <van-collapse-item :title="item" name="3">内容</van-collapse-item>
      </div>
    </van-collapse>-->

    <van-collapse v-model="activeName">
      <van-collapse-item title="所有文件夹" name="1">
        <van-collapse v-model="activeName1" accordion>
          <div
            v-for="(item,index) in folder"
            :key="index"
            @touchstart="gtouchstart(index)"
            @touchmove="gtouchmove()"
            @touchend="gtouchend()"
          >
            <van-collapse-item :title="item" :name="index+1">
              <div v-for="(itemI,indexI) in notes[index]" :key="indexI">
                <van-swipe-cell>
                  <!-- <template slot="left">
                    <van-button square type="primary" :text="itemI.content.title" />
                  </template>-->
                  <van-cell
                    @click="lookDetail(itemI)"
                    :title="itemI.content.title"
                    :value="itemI.time"
                  />
                  <template slot="right">
                    <van-button @click="deleteNote(itemI)" square type="danger" text="删除" />
                    <van-button
                      v-if="itemI.isShare"
                      @click="shareNote(itemI,0)"
                      square
                      type="default"
                      text="取消分享"
                    />
                    <van-button
                      v-if="!itemI.isShare"
                      @click="shareNote(itemI,1)"
                      square
                      type="default"
                      text="分享"
                    />
                    <van-button square type="primary" text="邮件转发" @click="showEmial=true" />
                  </template>
                </van-swipe-cell>
              </div>
            </van-collapse-item>
          </div>
          <!-- <van-collapse-item title="标题1" name="1">内容</van-collapse-item> -->
        </van-collapse>
      </van-collapse-item>
    </van-collapse>

    <van-popup v-model="show" class="model">
      <van-field v-model="newFolderName" maxlength="10" label="创建文件夹" placeholder="输入文件夹名称" />
      <van-button class="center" type="primary" size="small" @click="conformAddFolder">确定创建</van-button>
    </van-popup>
    <van-action-sheet v-model="showAction" :actions="actions" @select="onSelect" />
    <van-popup v-model="showReName" class="model">
      <van-field v-model="newReFolderName" maxlength="10" label="重命名文件夹" placeholder="输入新的名称" />
      <van-button class="center" type="primary" size="small" @click="conformUpdateFolder">确定修改</van-button>
    </van-popup>
    <van-popup v-model="showEmial" class="model pawd">
      <div class="col">
        <div class="row-center">
          <span>将该记事本发送给好友</span>
        </div>
        <van-field v-model="email"  label="发送给" placeholder="请输入对方邮箱" />
      </div>
      <div v-if="isSend" class="center-pay">
        <van-loading size="24px">正在发送...</van-loading>
      </div>
      <div class="center-pay">
        <van-button
          class="center"
          :disabled="isSend"
          type="primary"
          size="small"
          @click="sendEmail"
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
  SwipeCell,
  Search
} from "vant";

Vue.use(Collapse)
  .use(CollapseItem)
  .use(Popup)
  .use(Notify)
  .use(Dialog)
  .use(SwipeCell)
  .use(Search)
  .use(ActionSheet);

export default {
  created() {
    console.log("created");
    var body = {
      type: "get",
      email: this.$global.user.email
    };
    console.log("#############");
    console.log(this.$global.user);
    console.log("#############");

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
  methods: {
    parseTime(time) {
      var date = new Date(time);
      var Y = date.getFullYear();
      var M = date.getMonth() + 1;
      var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var m =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      return `${Y}/${M}/${D} ${h}:${m}`;
    },

    deleteNote(item) {
      var that = this;
      console.log(item);
      Dialog.confirm({
        title: "提示",
        message: "将删除此记事"
      })
        .then(() => {
          var body = {
            type: "del",
            email: this.$global.user.email,
            _id: item._id
          };
          that.axios
            .post("/api/delnote", {
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

    shareNote(item, isShare) {
      console.log(item);
      var that = this;
      console.log(isShare);
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

    getMyNote() {
      var that = this;
      this.axios
        .post("/api/getnote", {
          body: {
            email: this.$global.user.email
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.code === 200) {
            console.log(res.data.data.note);
            console.log(res.data.data.note.length);

            var notes = res.data.data.note;
            var folders = that.folder;
            var needList = [];
            var collectCount = 0; //收藏数量

            for (var i = 0; i < folders.length; i++) {
              var list = [];
              for (var j = 0; j < notes.length; j++) {
                if (folders[i] === notes[j].folder) {
                  notes[j].time = that.parseTime(notes[j].createTime);
                  list.push(notes[j]);
                  // notes.splice(j, 1);
                  if (folders[i] === "我的收藏") {
                    collectCount++;
                  }
                }
              }
              needList.push(list);
            }
            console.log(needList);
            this.$global.user.collectCount = collectCount;
            if (NodeList) that.notes = needList;
          }
        });
    },

    lookDetail(item) {
      console.log(item);
      this.$global.noteDetail = item;
      this.$router.push("/detail");
    },

    conformAddFolder() {
      var body = {
        type: "add",
        email: this.$global.user.email,
        folderName: this.newFolderName
      };
      this.axios
        .post("/api/operatorUser", {
          body: body
        })
        .then(res => {
          if (res.data.code === 200 || res.data.code === 201) {
            Notify({ type: "success", message: res.data.data.message });
            this.folder = res.data.data.folder;
            this.show = false;
            console.log(res);
          }
        });
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
    },
    onSelect(item, index) {
      var that = this;
      console.log(item, index);
      console.log(this.folder);
      if (
        this.folder[this.selectIndex] === "我的记事本" ||
        this.folder[this.selectIndex] === "我的收藏"
      ) {
        Notify({ type: "danger", message: "默认记事本无法进行此操作" });
        this.showAction = false;
        return;
      }
      if (index === 0) {
        Dialog.confirm({
          title: "警告",
          message: "将删除此文件夹及该文件夹下所有记事"
        })
          .then(() => {
            that.folder.splice(this.selectIndex, 1);
            var body = {
              type: "del",
              email: this.$global.user.email,
              folder: this.folder
            };
            that.axios
              .post("/api/operatorUser", {
                body: body
              })
              .then(res => {
                that.showAction = false;
                console.log(res);
                if (res.data.code === 200 || res.data.code === 201) {
                  Notify({ type: "success", message: res.data.data.message });
                  that.folder = res.data.data.folder;
                }
              });
          })
          .catch(() => {
            // on cancel
          });
      }
      if (index === 1) {
        this.showReName = true;
        // that.folder.splice(this.selectIndex, 1);
        // var body = {
        //   type: "del",
        //   email: this.$global.user.email,
        //   folder: this.folder
        // };
        // that.axios
        //   .post("/api/operatorUser", {
        //     body: body
        //   })
        //   .then(res => {
        //     that.showAction = false;
        //     console.log(res);
        //     if (res.data.code === 200 || res.data.code === 201) {
        //       Notify({ type: "success", message: res.data.data.message });
        //       that.folder = res.data.data.folder;
        //     }
        //   });
      }
    },
    sendEmail() {
      this.isSend = true;
      var inputEmail = this.email;
      var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      if (!reg.test(inputEmail)) {
        this.isSend = false;
        Notify({ type: "danger", message: "邮箱格式错误" });
      } else {
        setTimeout(() => {
          this.isSend = false;
          this.showEmial = false;
          Notify({ type: "success", message: "发送成功" });
        }, 2600);
      }
    }
  },
  data() {
    return {
      active: 0,
      newFolderName: undefined, //创建
      newReFolderName: undefined, //重命名
      selectIndex: undefined, //长按菜单选中的index
      show: false,
      showReName: false,
      activeName: ["1"],
      activeName1: ["1"],
      timeOutEvent: 0,
      notes: [],
      showEmial: false,
      showAction: false,
      isSend: false,
      email: undefined,
      folder: ["我的记事本"],
      actions: [{ name: "删除" }, { name: "重命名" }],
      searchValue: undefined
    };
  }
};
</script>
<style  scoped>
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
.pawd {
  width: 280px;
  height: 150px;
  border-radius: 10px;
}
</style>

