import Vue from 'vue';
import vuex from 'vuex';
import serve from '../request/request'
import { Message } from 'element-ui';

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
    updatePlaylist(state, obj, type) {
      
      if( !state.playlist.find( item => {
        return item.id === obj.id
      })) {
        state.playlist.push(obj);
        console.log(state.playlist);
      }
      else {
        Message({
          message: '播放列表已经有啦！',
        });
      }
      

      
    },
    deletePlaylist(state, index) {
      state.playlist.splice(index, 1);
    },
    deleteAll(state) {
      for(let i = 0; i < state.playlist.length; i++) {
        if(state.playlist[i].id !== state.songid) {
          state.playlist.splice(i, 1);
          console.log(state.playlist.length)
          i--;
        }
      }
    }
  }
})