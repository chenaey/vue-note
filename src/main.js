import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'vant/lib/index.css';
import './plugins/axios'

import { Button, Row, Col, Cell, CellGroup, Icon, Field, AddressEdit, Toast, Tag, ActionSheet } from 'vant'
import './plugins/element.js'

Vue.use(Button).use(Row).use(Col).use(Cell).use(CellGroup).use(Icon).use(Field).use(AddressEdit).use(Toast).use(Tag).use(ActionSheet);
Vue.config.productionTip = false




Vue.prototype.$global = {
  baseUrl: "http://127.0.0.1:8002/",
  downloadUrl: "http://cdn.i7code.cn/",
  downloadUrl1: "http://note.i7code.cn/file/",
  appName: "记事本",
  user: {
    email: "1@qq.com",
    isVip: 0,
  },
  noteDetail: {
    email: '12@qq.com',
    isShare: 0,
    folder: '我的记事本',
    content: {
      title: '我的第一次记事',
      tags: ["标签", "标签1"],
      text: "'我的第一次记事''我的第一次记事''我的第一次记事'",
      imgs: [],
      video: null
    }
  }
};

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')


