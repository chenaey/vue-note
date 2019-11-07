<template>
  <div>
    <van-row type="flex" class="padding topBg" justify="center">{{this.$global.appName}} 问题反馈</van-row>

    <van-cell-group>
      <van-field
        v-model="message"
        rows="2"
        autosize
        label="反馈信息"
        type="textarea"
        maxlength="512"
        placeholder="请输入您的反馈信息"
        show-word-limit
      />
    </van-cell-group>
    <van-row type="flex" class="padding" justify="center">
      <van-button type="primary" @click="sendFeedBack">发送给开发者</van-button>
    </van-row>

    <div v-if="isSuccess" class="success">
      <span>发送成功,感谢您的反馈！</span>
      <van-icon name="success" size="40px" color="#07c160" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      message: "",
      isSuccess: false
    };
  },
  created() {},
  methods: {
    sendFeedBack() {
      console.log(this.message);
      console.log(this.$global.user.email);
      if (this.message.length > 0 && !this.isSuccess) {
        console.log("12");
        this.isSuccess = true;
      }
    }
  }
};
</script>
<style  scoped>
.success {
  padding: 10px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>


