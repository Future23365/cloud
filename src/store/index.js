import Vue from 'vue';
import vuex from 'vuex';
import serve from '../request/request'
Vue.use(vuex);

export default new vuex.Store({
  state: {
    songid: 0,
    songname: '',
    songauthor: [],
    songurl: '',
    playlist: [],
  },
  mutations: {
    updateSong(state, songi) {
      !!songi.id === true  ? state.songid = songi.id: '';
      !!songi.name === true ? state.songname = songi.name: '';
      !!songi.url === true ? state.songurl = songi.url: '';
    },
    updatePlaylist(obj, type) {
      playlist.push(obj);
    }
  }
})