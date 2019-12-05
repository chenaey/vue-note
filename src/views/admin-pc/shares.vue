
<template>
  <div>
    <van-row type="flex" class="padding topBg" justify="center">{{this.$global.appName}} 分享管理</van-row>
    <van-cell v-if="notes.length===0" title="当前暂无用户分享信息" />

    <el-table :data="notes" stripe border style="width: 100%">
      <el-table-column prop="time" label="分享时间" width="180"></el-table-column>
      <el-table-column prop="email" label="分享人账号" width="220"></el-table-column>
      <el-table-column prop="content.title" label="记事标题" width="320"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.isVip"
            size="mini"
            type="primary"
            @click="lookDetail(scope.row)"
          >查看详情</el-button>

          <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
          <el-button size="mini" type="danger" @click="toDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 
    <div v-for="(item,index) in notes" :key="index">
      <van-swipe-cell>

        <van-cell @click="lookDetail(item)" :title="item.content.title" :value="item.time" />
        <template slot="right">
          <van-button square type="default" :text="item.email+'分享'" />
          <van-button @click="toDelete(item)" square type="danger" text="删除" />

        </template>
      </van-swipe-cell>

    </div>-->
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
      this.$router.push("/admin-pc/detail");
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
      var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
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

