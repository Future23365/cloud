import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home.vue';
import My from '../views/My.vue';
import Music from '../components/Music.vue';
import Result from '../components/Result.vue';

Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/my',
      name: 'my',
      component: My
    },
    {
      path: '/music',
      name: 'music',
      component: Music
    },
    {
      path: '/result',
      name: 'result',
      component: Result
    }
  ]
})