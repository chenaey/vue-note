import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import 'vant/lib/index.css';

import { Button, Row, Col, Cell, CellGroup, Icon, Field, AddressEdit, Toast, Tag } from 'vant'

Vue.use(Button).use(Row).use(Col).use(Cell).use(CellGroup).use(Icon).use(Field).use(AddressEdit).use(Toast).use(Tag);
Vue.config.productionTip = false




Vue.prototype.$global = { appName: "记事本" };

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
