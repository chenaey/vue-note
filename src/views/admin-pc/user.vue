
<template>
  <div>
    <van-row type="flex" class="padding topBg" justify="center">
      <!-- <span class="top-left" @click="back">返回</span> -->
      {{this.$global.appName}} 用户管理
    </van-row>

    <van-row type="flex" justify="space-around">
      <!-- <van-button type="default" size="small">当前用户数为:{{users.length}}</van-button> -->

      <van-button type="primary" size="small" @click="show=true">创建新的用户</van-button>
    </van-row>
    <van-cell v-if="users.length===0" title="当前暂无用户" />

    <el-table :data="users" stripe border style="width: 100%">
      <el-table-column fixed prop="_id" label="用户id" width="200"></el-table-column>
      <el-table-column prop="time" label="注册时间" width="140"></el-table-column>
      <el-table-column prop="email" label="注册邮箱" width="120"></el-table-column>
      <!-- <el-table-column prop="password" label="用户密码" width="120"></el-table-column> -->
      <el-table-column prop="isVipText" label="是否会员" width="60"></el-table-column>

      <el-table-column prop="userInfo.username" label="用户名" width="80">
        <template slot-scope="{row,$index}">
          <el-input size="mini" v-if="showEdit[$index]" v-model="row.userInfo.username"></el-input>
          <span v-if="!showEdit[$index]">{{row.userInfo.username}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userInfo.year" label="年龄" width="90">
        <template slot-scope="{row,$index}">
          <el-input
            type="number"
            maxlength="3"
            size="mini"
            v-if="showEdit[$index]"
            v-model="row.userInfo.year"
          ></el-input>
          <span v-if="!showEdit[$index]">{{row.userInfo.year}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userInfo.where" label="地区" width="70">
        <template slot-scope="{row,$index}">
          <el-input type="text" size="mini" v-if="showEdit[$index]" v-model="row.userInfo.where"></el-input>
          <span v-if="!showEdit[$index]">{{row.userInfo.where}}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column prop="userInfo.username" label="用户名" width="80"></el-table-column>
      <el-table-column prop="userInfo.year" label="年龄" width="70"></el-table-column>
      <el-table-column prop="userInfo.where" label="地区" width="70"></el-table-column>-->

      <el-table-column prop="safeKey" label="安全码" width="100">
        <template slot-scope="{row,$index}">
          <el-input size="mini" v-if="showEdit[$index]" v-model="row.safeKey"></el-input>
          <span v-if="!showEdit[$index]">{{row.safeKey}}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column prop="safeKey" label="安全码" width="100"></el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="!showEdit[scope.$index]"
            size="mini"
            @click.native="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>

          <el-button
            v-if="showEdit[scope.$index]"
            type="success"
            size="small"
            @click.native="handleSave(scope.$index, scope.row)"
          >保存</el-button>
          <el-button
            v-if="scope.row.isVip"
            size="mini"
            type="danger"
            @click="setVip(scope.row._id,0)"
          >取消会员</el-button>

          <el-button
            v-if="!scope.row.isVip"
            size="mini"
            type="primary"
            @click="setVip(scope.row._id,1)"
          >赠送会员</el-button>
          <el-button size="mini" type="warning" @click="showChangePassword(scope.row)">修改密码</el-button>

          <el-button size="mini" type="danger" @click="toDelete(scope.row)">删除账号</el-button>
        </template>
      </el-table-column>
    </el-table>

    <van-popup v-model="show" class="model">
      <van-field v-model="email" label="注册邮箱" :errMsg="errMsg" placeholder="输入注册邮箱" />
      <van-field v-model="password" maxlength="12" label="注册密码" placeholder="输入注册密码" />

      <van-button class="center" type="primary" size="small" @click="toLogin">确定创建</van-button>
    </van-popup>
    <van-popup v-model="showPass" class="model">
      <van-field v-model="newPassword" maxlength="12" label="修改密码" placeholder="输入修改后的密码" />

      <van-button class="center" type="primary" size="small" @click="changePassword">确定修改</van-button>
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
  watch: {
    password() {
      this.password = this.password.replace(/[\u4e00-\u9fa5]/gi, "");
    },
    email() {
      var inputEmail = this.email;
      var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      this.email = this.email.replace(/[\u4e00-\u9fa5]/gi, "");
      if (!reg.test(inputEmail)) {
        this.errMsg = "邮箱格式错误";
      } else {
        this.errMsg = "";
      }
    }
  },
  created() {
    this.getUserss();
  },
  data() {
    return {
      message: "",
      users: [],
      tempValue: "",
      password: "",
      email: "",
      show: false,
      item: undefined,
      showEdit: [], //显示编辑框,
      isautofocus: false,
      showBtn: [],
      changePasswordItem: undefined,
      showPass: false,
      newPassword: ""
    };
  },
  methods: {
    showChangePassword(item) {
      this.showPass = true;
      this.changePasswordItem = item;
    },
    sendFeedBack() {},
    //点击编辑
    handleEdit(index, row) {
      this.showEdit = [];
      this.showBtn = [];

      this.isautofocus = true;
      this.showEdit[index] = true;
      this.showBtn[index] = true;
      this.tempValue = row;
      this.$set(this.showEdit, row, true);
      this.$set(this.showBtn, row, true);
    },
    //取消编辑
    handleSave(index, row) {
      var that = this;
      console.log(row);
      that.showEdit[index] = false;
      that.showBtn[index] = false;
      that.$set(this.showEdit, row, false);
      that.$set(this.showBtn, row, false);
      console.log(this.showEdit);
      console.log(this.showBtn);
      this.showEdit = [];
      this.showBtn = [];
      
      if (row.safeKey.length < 3) {
        this.$message({
          message: "修改失败:安全码不能低于3位数",
          type: "error"
        });
        this.users[index].safeKey = this.tempValue.safeKey;
        this.tempValue = "";
        return;
      }
      if (/.*[\u4e00-\u9fa5]+.*$/.test(row.safeKey)) {
        this.$message({
          message: "修改失败:安全码包含非法字符:中文",
          type: "error"
        });
        this.users[index].safeKey = this.tempValue.safeKey;
        this.tempValue = "";
        return;
      }
      this.axios
        .post("/api/operatorUser", {
          body: {
            type: "changeInfo",
            email: row.email,
            userInfo: row.userInfo,
            safeKey: row.safeKey
          }
        })
        .then(res => {
          if (res.data.code === 200 || res.data.code === 201) {
            console.log(res);
            that.$message({
              message: res.data.message,
              type: "success"
            });
          }
        });
      // this.axios
      //   .post("/api/operatorUser", {
      //     body: {
      //       type: "changeSafeKey",
      //       email: row.email,
      //       password: row.password,
      //       safeKey: row.safeKey
      //     }
      //   })
      //   .then(res => {
      //     console.log(res);

      //     that.$message({
      //       message: res.data.data.message,
      //       type: "success"
      //     });
      //   });
    },

    getUserss() {
      var that = this;
      this.axios
        .post("/api/adminuser", {
          body: { type: "getAll" }
        })
        .then(res => {
          console.log(res);
          var list = res.data.data.list;
          list.sort((a, b) => {
            return b.createTime - a.createTime;
          });
          list.forEach((each, index) => {
            list[index].time = this.parseTime(each.createTime);
            if (list[index].isVip) {
              list[index].isVipText = "是";
            } else {
              list[index].isVipText = "否";
            }
          });
          console.log(res.data.data.list);
          that.users = res.data.data.list;
          console.log(that.users.length);
        });
    },

    // lookDetail(item) {
    //   console.log(item);
    //   this.$global.noteDetail = item;
    //   this.$router.push("/detail");
    // },
    changePassword() {
      if (this.newPassword.length < 6) {
        Notify({ type: "danger", message: "密码最短为6位数" });
        return;
      }
      var item = this.changePasswordItem;
      // type: "changePwd",
      //   email: this.$global.user.email,
      //   newPassword: this.newPassword,
      //   password: this.password
      this.axios
        .post("/api/operatorUser", {
          body: {
            type: "adminChangePwd",
            email: item.email,
            password: item.password,
            newPassword: this.newPassword
          }
        })
        .then(res => {
          console.log(res);
          this.showCPwd = false;
          if (res.data.code === 200) {
            this.newPassword = this.changePasswordItem = null;
            this.showPass = false;
            Notify({ type: "success", message: res.data.data.message });
          } else {
            Notify({ type: "danger", message: res.data.data.message });
          }
        });
    },
    setVip(id, isVip) {
      var message = "将该用户设置为VIP";
      if (isVip === 0) {
        message = "取消该用户的VIP";
      }
      console.log(isVip);
      Dialog.confirm({
        title: "提示",
        message: message
      })
        .then(() => {
          this.axios
            .post("/api/adminuser", {
              body: {
                id: id,
                type: "updateVip",
                isVip: isVip
              }
            })
            .then(res => {
              console.log(res);
              if (res.data.code === 200) {
                this.getUserss();
                Notify({
                  type: "success",
                  message: res.data.data.message,
                  duration: 1500
                });
              }
            });
        })
        .catch(() => {});
    },

    showPassword(password) {
      Notify({ type: "success", message: password, duration: 1000 });
    },
    toDelete(item) {
      console.log(item);
      Dialog.confirm({
        title: "提示",
        message: "将删除用户账号"
      })
        .then(() => {
          this.axios
            .post("/api/adminuser", {
              body: {
                id: item._id,
                type: "del"
              }
            })
            .then(res => {
              console.log(res);
              if (res.data.code === 200) {
                this.getUserss();
                Notify({
                  type: "success",
                  message: res.data.data.message,
                  duration: 1500
                });
              }
            });
        })
        .catch(() => {});
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
    },
    toLogin() {
      var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      if (this.password.length < 6) {
        Notify({ type: "danger", message: "密码最短为6位数", duration: 1500 });
        return;
      }
      if (this.password && reg.test(this.email)) {
        this.axios
          .post("/api/login", {
            email: this.email,
            password: this.password,
            createTime: new Date().getTime()
          })
          .then(res => {
            if (res.data.code === 200 || res.data.code === 201) {
              console.log(res.data);
              Notify({ type: "success", message: "注册成功", duration: 1500 });
              this.show = false;
              this.getUserss();
            } else {
              Notify({
                type: "danger",
                message: "注册错误,当前邮箱可能已被注册",
                duration: 1500
              });
            }
          });
      } else {
        Notify({
          type: "danger",
          message: "请检查输入邮箱是否有误",
          duration: 1500
        });
      }
    }
  }
};
</script>
<style  scoped>
.top-left {
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

