import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'vant/lib/index.css';
import './plugins/axios'

import { Button, Row, Col, Cell, CellGroup, Icon, Field, AddressEdit, Toast, Tag, ActionSheet } from 'vant'

Vue.use(Button).use(Row).use(Col).use(Cell).use(CellGroup).use(Icon).use(Field).use(AddressEdit).use(Toast).use(Tag).use(ActionSheet);
Vue.config.productionTip = false




Vue.prototype.$global = {
  appName: "记事本", user: {
    email: "1@qq.com",
    isVip:0
  }
};

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
