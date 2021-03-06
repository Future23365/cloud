import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import Music from '@/views/Music.vue';
import Result from '@/views/Result.vue';
import Mvideo from '@/views/Mvideo.vue';
import Artist from '@/views/Artist.vue';
import Album from '@/components/Album.vue';
import Albumdetail from '@/views/Albumdetail.vue';
import User from '@/views/User.vue';
import Playlist from '@/views/Playlist';

Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
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
    },
    {
      path: '/playlist',
      name: 'playlist',
      component: Playlist
    },

  ]
})