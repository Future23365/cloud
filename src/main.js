import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import ElementUI from 'element-ui';
import store from '@/store'

import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")

router.afterEach((to,from,next) => {
  window.scrollTo(0,0);
})