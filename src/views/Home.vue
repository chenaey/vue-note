<template>
  <div>
    <van-row type="flex" class="padding topBg" justify="center">{{this.$global.appName}} 首页</van-row>
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
            <van-collapse-item :title="item" :name="index+1">内容</van-collapse-item>
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
  Dialog
} from "vant";

Vue.use(Collapse)
  .use(CollapseItem)
  .use(Popup)
  .use(Notify)
  .use(Dialog)
  .use(ActionSheet);

export default {
  created() {
    console.log("created");
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
        }
      });
  },
  methods: {
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
      if (this.folder[this.selectIndex] === "我的记事本") {
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
      showAction: false,
      folder: ["我的记事本"],
      actions: [{ name: "删除" }, { name: "重命名" }]
    };
  }
};
</script>
<style  scoped>
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

