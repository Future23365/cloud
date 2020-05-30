import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home.vue';
import My from '../views/My.vue';
import Music from '../components/Music.vue';
import Result from '../components/Result.vue';
import Mvideo from '../components/Mvideo.vue';
import Artist from '../components/Artist.vue'
import Album from '../components/Album.vue'
import Albumdetail from '../components/Albumdetail.vue'

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
    },
    {
      path: '/mvideo',
      name: 'mvideo',
      component: Mvideo
    },
    {
      path: '/artist',
      name: 'artist',
      component: Artist
    },
    {
      path: '/album',
      name: 'album',
      component: Album
    },
    {
      path: '/albumdetail',
      name: 'albumdetail',
      component: Albumdetail
    }
  ]
})