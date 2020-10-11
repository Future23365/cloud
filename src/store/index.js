import Vue from 'vue';
import vuex from 'vuex';
import { Message } from 'element-ui';
import { getsongDetail } from '@/request/getdata';

Vue.use(vuex);

export default new vuex.Store({
  state: {
    songid: 0,
    songname: '',
    songauthor: [],
    songurl: '',
    playlist: [],
    flag: 0,  //当只有一首的时候id更新不了，无法自动播放，增加一个标志位以触发自动播放（貌似多次一举^_^）
  },
  mutations: {
    // 更新当前播放的歌曲
    updateSong(state, songi) {
      !!songi.id === true  ? state.songid = songi.id: '';
      !!songi.name === true ? state.songname = songi.name: '';
      !!songi.url === true ? state.songurl = songi.url: '';
    },
    // 更新播放列表
    updatePlaylist(state, obj) {
      if( !state.playlist.find( item => {return item.id === obj.id})) {
        state.playlist.push(obj);
      }else {
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
          i--;
        }
      }
    },
    updataFlag(state,value) {
      state.flag = value;
    }
  },
  actions: {
    // 异步请求歌曲详情
    sendUpdatePlaylist(context, obj) {
      // 如果不在列表里则请求，否则不请求
      if( !context.state.playlist.find( item => { return item.id === obj.id })) {
        getsongDetail(obj.id).then(res => {
          this.song = res.songs[0];
          let obj = {};
          obj.id = res.songs[0].id;
          obj.name = res.songs[0].name;
          let arr = [];
          for(let i = 0; i < res.songs[0].ar.length; i++) {
            let o = {};
            o[res.songs[0].ar[i].name] = res.songs[0].ar[i].id;
            arr.push(o);
          }
          obj.ar = arr;
          obj.al = res.songs[0].al.name;
          obj.alId = res.songs[0].al.id;
          obj.time = res.songs[0].dt;
          context.commit('updatePlaylist', obj);
          Message({
            message: '已向播放列表添加歌曲',
          });
        })
      }else {
        Message({
          message: '播放列表已经有啦！...',
        });
      }
    },
  }
})