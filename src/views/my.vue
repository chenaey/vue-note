<template>
  <div>
    <van-row type="flex" class="padding topBg" justify="center">{{this.$global.appName}} 我的</van-row>
    <div class="top-row">
      <img
        class="avator"
        src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
        alt
        srcset
      />
      <div class="username">
        <span>{{user.username}}</span>
        <span>{{user.email}}</span>
        <span style="margin-top:10px;" v-if="user.isVip===0">
          非会员
          <span class="vipno" @click="toPay">点击立即开通</span>
        </span>
        <span class="vipyes" v-if="user.isVip!==0">会员</span>
      </div>
    </div>
    <div class="row-around">
      <span class="my-round" style="background-color:#67C23A;" @click="toMyShare">分享数 {{shareCount}}</span>

      <span class="my-round" style="background-color:#409EFF;" @click="toHome">收藏数 {{collectCount}}</span>

      <span class="my-round" style="background-color:#a18cd1;" @click="toShares">笔记数 {{noteCount}}</span>
    </div>
    <van-cell-group>
      <!-- <van-cell title="我的账号" :value="user.email" /> -->
      <van-cell title="标签管理" is-link @click="toTag" />
      <van-cell title="分享管理" is-link @click="toMyShare" />

      <van-cell title="我的信息" is-link @click="toMyInfo" />

      <van-cell title="我的信箱" is-link @click="lookMyMessage" />

      <!-- <van-cell @click="toPay" v-if="user.isVip===0" title="是否会员" value="非会员" label="点击立即开通" />
      <van-cell v-if="user.isVip!==0" title="是否会员" value="是" />-->
      <van-cell title="意见反馈" is-link @click="showFeedBack = true" />

      <van-cell title="修改密码" is-link @click="showCPwd = true" />
      <van-cell title="关于我们" is-link @click="toAbout" />
      <van-cell title="当前版本" :value="versionInfo.version" is-link @click="updateVersion" />

      <!-- <van-cell title="修改密码" is-link arrow-direction="down" /> -->
    </van-cell-group>
    <div class="row-center">
      <van-button type="danger" @click="exit">退出登录</van-button>
    </div>

    <van-popup v-model="showCPwd" class="model pawd">
      <div class="col">
        <div class="row-center">
          <span>修改密码</span>
        </div>
        <van-field
          v-model="password"
          type="password"
          maxlength="12"
          label="当前密码"
          placeholder="请输入当前账号密码"
        />
        <van-field v-model="newPassword" maxlength="12" label="新密码" placeholder="请输入新密码" />
        <van-field v-model="surePassword" maxlength="12" label="确认密码" placeholder="请再次输入新密码" />
      </div>

      <div class="center-pay">
        <van-button class="center" type="primary" size="small" @click="changePassWord">确定修改</van-button>
      </div>
    </van-popup>

    <van-popup v-model="showFeedBackReplay" class="model replay-model">
      <div class="col">
        <div class="row-center">
          <span>我的信箱</span>
        </div>
      </div>
      <div class="col">
        <div class="replay" v-for="(item,index) in feedBackReplay" :key="index">
          <p>{{index+1}}.我：{{item.content}}</p>
          <div v-if="feedBackReplay[index].reply">
            <div v-for="(item1,index1) in feedBackReplay[index].reply" :key="index1">
              <p>回复：{{item1}}</p>
            </div>
          </div>
          <div v-else>
            <p>暂无回复</p>
          </div>
        </div>
      </div>
    </van-popup>

    <van-popup v-model="showVersion" class="model pawd">
      <div class="col">
        <div class="row-center">
          <span>最新版本为{{versionInfo.version}}</span>
        </div>
        <div></div>
      </div>
      <div class="row-center">
        <span>发布时间：{{versionInfo.time}}</span>
      </div>
      <div class="row-center">
        <span>描述信息：{{versionInfo.description}}</span>
      </div>
      <div class="center-pay">
        <van-button
          :disabled="!versionInfo.url"
          class="center"
          type="primary"
          size="small"
          @click="downloadApp(versionInfo.url)"
        >下载该版本</van-button>
      </div>
    </van-popup>

    <van-popup v-model="showFeedBack" class="model pawd">
      <div class="col">
        <div class="row-center">
          <span>意见反馈</span>
        </div>
        <van-field
          v-model="feedBack"
          rows="1"
          autosize
          class="bg-edit"
          type="textarea"
          placeholder="请在此出输入您的反馈信息,开发者可能会通过您的注册邮箱再次联系您"
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
          @click="sendFeedback"
        >发送给开发者</van-button>
      </div>
    </van-popup>

    <van-popup v-model="showPay" class="model pay">
      <div class="col">
        <div class="row-center">
          <span>开通永久会员</span>
        </div>
        <div class="row-center">
          <span id="money">$198.00</span>
        </div>
        <div class="row">
          <span class="left">支付方式</span>
          <span class="right">微信支付</span>
        </div>
      </div>
      <div v-if="isPay" class="center-pay">
        <van-loading size="24px">正在支付...</van-loading>
      </div>
      <div class="center-pay">
        <van-button class="center" type="primary" size="small" @click="conformPay">立即支付</van-button>
      </div>
    </van-popup>
  </div>
</template>


<script>
import Vue from "vue";

import { AddressEdit, Toast, Dialog, Notify, Loading } from "vant";
Vue.use(Toast)
  .use(AddressEdit)
  .use(Dialog)
  .use(Loading)
  .use(Notify);

export default {
  watch: {
    password() {
      this.password = this.password.replace(/[\u4e00-\u9fa5]/gi, "");
    },
    newPassword() {
      this.newPassword = this.newPassword.replace(/[\u4e00-\u9fa5]/gi, "");
    },
    surePassword() {
      this.surePassword = this.surePassword.replace(/[\u4e00-\u9fa5]/gi, "");
    }
  },
  created() {
    var that = this;
    console.log("created");
    this.user = this.$global.user;
    this.axios
      .post("/api/operatorUser", {
        body: {
          type: "get",
          email: this.$global.user.email
        }
      })
      .then(res => {
        if (res.data.code === 200 || res.data.code === 201) {
          console.log(res);
          that.user.isVip = res.data.data.isVip;
          this.folder = res.data.data.folder;
          this.getMyNote();
        }
      });
    this.getVersionInfo();
  },
  data() {
    return {
      areaList: [],
      searchResult: [],
      password: undefined,
      newPassword: undefined,
      surePassword: undefined,
      showPay: false,
      isPay: false,
      showCPwd: false,
      showFeedBackReplay: false,
      feedBackReplay: undefined,
      showFeedBack: false,
      feedBack: "",
      user: {},
      showVersion: false,
      versionInfo: {
        version: "null"
      },
      shareCount: 0,
      collectCount: 0,
      noteCount: 0,
      notes: []
    };
  },

  methods: {
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
            var notes = res.data.data.note;
            var folders = that.folder;
            var needList = [];
            var collectCount = 0; //收藏数量
            this.noteCount = notes.length;

            var shareCount = notes.reduce((allcount, next) => {
              return allcount + next.isShare;
            }, 0);
            for (var i = 0; i < folders.length; i++) {
              var list = [];
              for (var j = 0; j < notes.length; j++) {
                if (folders[i] === notes[j].folder) {
                  notes[j].time = that.parseTime(notes[j].createTime);
                  list.push(notes[j]);
                  notes.splice(j, 1);
                  if (folders[i] === "我的收藏") {
                    collectCount++;
                  }
                }
              }
              needList.push(list);
            }
            console.log(needList);

            this.shareCount = shareCount;
            this.collectCount = collectCount;
            this.$global.user.collectCount = collectCount;
            if (needList) {
              that.notes = needList;
            }
          }
        });
    },

    showChangePassword() {
      this.showCPwd = true;
    },

    downloadApp(url) {
      window.open("http://cdn.i7code.cn/" + url, "_blank");
    },

    getVersionInfo() {
      this.axios
        .post("/api/version", {
          body: {
            type: "get",
            email: this.$global.user.email
          }
        })
        .then(res => {
          var list = res.data.data.list;
          console.log(list);
          if (list.length > 0) {
            list.sort((a, b) => {
              return b.createTime - a.createTime;
            });
            this.versionInfo = list[0];

            this.versionInfo.time = this.parseTime(this.versionInfo.createTime);
          }
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
    },
    changePassWord() {
      var password = this.password;
      var newPassword = this.newPassword;
      var surePassword = this.surePassword;
      console.log(password, newPassword, surePassword);
      if (surePassword !== newPassword) {
        Notify({ type: "danger", message: "两次输入密码不一致" });
        return;
      }
      if (newPassword.length < 6) {
        Notify({ type: "danger", message: "密码最短为6位数" });
        return;
      }

      this.axios
        .post("/api/operatorUser", {
          body: {
            type: "changePwd",
            email: this.$global.user.email,
            newPassword: this.newPassword,
            password: this.password
          }
        })
        .then(res => {
          console.log(res);
          this.showCPwd = false;
          if (res.data.code === 200) {
            this.password = this.newPassword = this.surePassword = null;
            Notify({ type: "success", message: res.data.data.message });
          } else {
            Notify({ type: "danger", message: res.data.data.message });
          }
        });
    },

    toAbout() {
      this.$router.push("/about");
    },

    toTag() {
      this.$router.push("/mytag");
    },

    toHome() {
      this.$router.push("/home");
    },

    toShares() {
      this.$router.push("/shares");
    },

    updateVersion() {
      this.$router.push("/version");

      // this.showVersion = true;
      // this.getVersionInfo();
    },

    toMyInfo() {
      this.$router.push("/myinfo");
    },

    toMyShare() {
      this.$router.push("/myshare");
    },

    exit() {
      this.$router.push("/login");
    },

    conformPay() {
      this.isPay = true;
      this.axios
        .post("/api/operatorUser", {
          body: {
            type: "updateVip",
            email: this.$global.user.email
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.code === 200) {
            setTimeout(() => {
              this.isPay = false;
              this.showPay = false;
              this.$global.user.isVip = 1;
              Notify({ type: "success", message: "开通会员成功" });
            }, 2300);
          } else {
            this.isPay = false;
            this.showPay = false;
            Notify({ type: "danger", message: "开通会员失败" });
          }
        });
    },
    toPay() {
      this.showPay = true;
    },
    lookMyMessage() {
      this.axios
        .post("/api/feedback", {
          body: {
            type: "get",
            email: this.$global.user.email
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.code === 200) {
            var replayList = res.data.data.list;
            console.log(replayList);
            if (replayList.length > 0) {
              console.log("@#$!#@!3");
              this.feedBackReplay = replayList;
              this.showFeedBackReplay = true;
            } else {
              Notify({ type: "danger", message: "暂无消息" });
            }
          }
        });
    },

    sendFeedback() {
      var that = this;
      if (this.feedBack.length < 10) {
        Notify({ type: "danger", message: "请输入至少10个字符" });
        return;
      }
      this.axios
        .post("/api/feedback", {
          body: {
            createTime: new Date().getTime(),
            content: this.feedBack,
            type: "add",
            email: this.$global.user.email
          }
        })
        .then(res => {
          if (res.data.code === 200) {
            Notify({ type: "success", message: "反馈成功" });
            that.showFeedBack = false;
          }
        });
      console.log(this.feedBack);
    }
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

.avator {
  width: 56px;
  height: 56px;
  border-radius: 6px;
}

.top-row {
  display: flex;
  flex-direction: row;
  padding-bottom: 20px;
  margin: 10px 20px 20px 20px;
  border-bottom: 1px solid #ececec;
}

.username {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 20px;
}

.center-pay {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
}

.row-around {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding-bottom: 20px;
  border-bottom: 1px solid #ececec;
}

.my-round {
  padding: 12px;
  border-radius: 2px;
  color: #fff;
}

.row-center {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.replay {
  border-bottom: 1px solid #ececec;
  padding-left: 10px;
}

.replay-model {
  width: 80%;
  height: 40%;
  border-radius: 10px;
}

.pawd {
  width: 280px;
  height: 220px;
  border-radius: 10px;
}
.pay {
  width: 240px;
  height: 220px;
  border-radius: 10px;
}

.left {
  display: flex;
  justify-content: flex-start;
  padding-left: 10px;
  padding-top: 20px;
}

.right {
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;
  flex: 1;
  padding-top: 20px;
}

#money {
  font-size: 34px;
  font-weight: 800;
}

.vipno {
  color: #409eff;
  font-weight: 600;
  padding-top: 20px;
}

.vipyes {
  width: 43px;
  margin-top: 10px;
  background-color: #67c23a;
  color: #fff;
  font-weight: 600;
  padding-left: 4px;
}
</style>