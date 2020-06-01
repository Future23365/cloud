import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import My from '@/views/My.vue';
import Music from '@/views/Music.vue';
import Result from '@/views/Result.vue';
import Mvideo from '@/views/Mvideo.vue';
import Artist from '@/views/Artist.vue';
import Album from '@/views/Album.vue';
import Albumdetail from '@/components/Albumdetail.vue';
import User from '@/views/User.vue'

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
    },
    {
      path: '/user',
      name: 'user',
      component: User
    }
  ]
})