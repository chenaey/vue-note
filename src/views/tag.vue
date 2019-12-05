<template>
  <div>
    <van-row type="flex" class="padding topBg" justify="center">
      <span class="left" @click="back">返回</span>
      {{this.$global.appName}} 标签管理
    </van-row>

    <form action="/">
      <van-search
        v-model="searchValue"
        placeholder="输入标签关键字搜索笔记"
        show-action
        @search="onSearch"
        @cancel="onCancel"
      />
    </form>
    <van-cell v-if="tagList.length===0" title="当前暂无标签信息" />
    <div class="my-title">
      所有笔记标签
      <span class="export" @click="onShowExport">导出</span>
    </div>
    <div class="row">
      <div v-for="(item,index) in tagList" v-bind:key="index" class="each" @click="onSearch(item)">
        <van-tag size="medium" type="primary">{{item}}</van-tag>
      </div>
    </div>
    <div class="my-title">便捷标签</div>
    <div class="row">
      <div
        v-for="(item,index) in publicTagList"
        v-bind:key="index"
        class="each"
        @click="onSearch(item)"
      >
        <van-tag
          v-if="item.length>0"
          closeable
          @close="deleteTag(index)"
          size="medium"
          type="success"
        >{{item}}</van-tag>
      </div>
      <van-tag class="each" size="medium" @click="showAdd=true" type="primary">+新便捷标签</van-tag>
    </div>
    <div class="my-title">搜索结果</div>
    <van-cell style="margin-left:10px;" v-if="searchNote.length===0" title="暂无搜索结果" />

    <div class="search">
      <div
        v-for="(item,index) in searchNote"
        v-bind:key="index"
        class="eachnote"
        @click="lookDetail(item)"
      >
        <div class="title">{{item.content.title}}</div>
      </div>
    </div>
    <van-popup v-model="showAdd" class="model">
      <van-field v-model="newTagName" maxlength="10" label="新标签" placeholder="输入标签名称" />
      <van-button class="center" type="primary" size="small" @click="conformAddTag">确定创建</van-button>
    </van-popup>

    <!-- <el-dialog title="收货地址" :visible.sync="showExport">
      <el-select
        style="z-index:999;"
        v-if="showExport"
        v-model="selectTags"
        multiple
        placeholder="请选择标签以导出笔记"
      >
        <el-option v-for="item in allTags" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <van-button class="center" type="primary" size="small" @click="conformExport">确定导出</van-button>
    </el-dialog>-->
    <!-- </van-popup> -->
    <div v-if="showExport" class="ex-model">
      <el-select v-if="showExport" v-model="selectTags" multiple placeholder="请选择标签以导出笔记">
        <el-option v-for="item in allTags" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <van-button class="center" type="primary" size="small" @click="conformExport">确定导出</van-button>
    </div>
  </div>
</template>
<script>
import { Notify } from "vant";
// import Vue from "vue";
// Vue.use(Tag);
export default {
  created() {
    this.getNoteData();
  },
  data() {
    return {
      searchValue: "",
      notes: [],
      show: {
        primary: true,
        success: true
      },
      showExport: false,
      tagList: [],
      publicTagList: [],
      searchNote: [],
      showAdd: false,
      newTagName: undefined,
      allTags: [],
      selectTags: []
    };
  },
  methods: {
    onShowExport() {
      this.allTags = this.publicTagList.concat(this.tagList);
      this.showExport = true;
    },
    back() {
      this.$router.go(-1);
    },

    getNoteData() {
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
            //   this.tagList = this.tagList.concat(res.data.data.tagList);
            this.publicTagList = res.data.data.tagList;
            this.folder = res.data.data.folder;
            this.getMyNote();
          }
        });
    },

    conformExport() {
      console.log(this.selectTags);
      var selectTags = this.selectTags;
      var res = [];
      var notes = this.notes;
      for (var i = 0; i < selectTags.length; i++) {
        notes.forEach(list => {
          var data = list.filter(each => {
            return each.content.tags.includes(selectTags[i]);
          });
          res.push(...data);
        });
      }
      var body = {
        type: "export",
        email: this.$global.user.email,
        data: res
      };

      if (res.length === 0) {
        Notify({ type: "danger", message: "错误:该标签下无任何笔记" });
        return;
      }
      this.axios
        .post("/api/word", {
          body: body
        })
        .then(res => {
          if (res.data.code === 200 || res.data.code === 201) {
            console.log(res);
            Notify({ type: "success", message: res.data.message });
            this.showExport = false;
            window.open(this.$global.downloadUrl1 + res.data.file, "_blank");
          } else {
            Notify({ type: "danger", message: res.data.message });
          }
        });
      console.log(res);
    },

    deleteTag(index) {
      console.log(index);
      this.publicTagList.splice(index, 1);
      var body = {
        type: "deleteTag",
        email: this.$global.user.email,
        tagList: this.publicTagList
      };
      this.axios
        .post("/api/operatorUser", {
          body: body
        })
        .then(res => {
          if (res.data.code === 200 || res.data.code === 201) {
            console.log(res);
          }
        });
    },

    conformAddTag() {
      if (this.newTagName.length === 0) {
        Notify({ type: "danger", message: "标签名不能为空" });
        return;
      }
      if (this.tagList.includes(this.newTagName)) {
        Notify({ type: "danger", message: "该标签已存在" });
        return;
      }
      var body = {
        type: "addTag",
        email: this.$global.user.email,
        tagName: this.newTagName
      };
      this.axios
        .post("/api/operatorUser", {
          body: body
        })
        .then(res => {
          if (res.data.code === 200 || res.data.code === 201) {
            Notify({ type: "success", message: res.data.message });
            this.showAdd = false;
            console.log(res);
            this.publicTagList.push(this.newTagName);
            this.newTagName = "";
            this.getNoteData();
          }
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
            var tempTagList = [];
            var tagList = [];
            for (var i = 0; i < folders.length; i++) {
              var list = [];
              for (var j = 0; j < notes.length; j++) {
                if (folders[i] === notes[j].folder) {
                  notes[j].time = that.parseTime(notes[j].createTime);
                  list.push(notes[j]);
                  tempTagList.push(...notes[j].content.tags);
                  if (folders[i] === "我的收藏") {
                    collectCount++;
                  }
                }
              }
              needList.push(list);
            }
            for (var k = 0; k < tempTagList.length; k++) {
              if (tempTagList[k] && !tagList.includes(tempTagList[k])) {
                tagList.push(tempTagList[k]);
              }
            }
            console.log(tagList);
            this.tagList = tagList.concat(this.tagList);
            console.log(needList);
            this.$global.user.collectCount = collectCount;
            that.notes = needList;
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
.model {
  width: 90%;
  height: auto;
}
.ex-model {
  width: 90%;
  min-height: auto;
  padding: 5px 10px;
  z-index: -20;
}

.my-title {
  background-color: #fff;
  font-size: 17px;
  padding: 10px;
  margin: 0 10px;
  border-bottom: 1px solid #ececec;
}
.center {
  float: right;
  margin: 6px 0;
  margin-right: 20px;
}
.export {
  font-size: 12px;
  color: #fff;
  padding: 4px;
  margin: 0 10px;
  background-color: #409eff;
  position: absolute;
  right: 20px;
}
</style>