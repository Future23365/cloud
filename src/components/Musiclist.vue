<template>
  <div class="musiclist">
    <div class="head" @click="fatherShow" title="隐藏列表">播放列表({{listlength}})<span @click.stop="deleteAlllist" title="删除全部">删除全部</span></div>
    <div class="list">
      <div class="mess">
        <span></span>
        <span>歌曲</span>
        <span>歌手</span>
        <span>专辑</span>
        <span>时间</span>
        <span>操作</span>
      </div>
      <ul>
        <li v-for="(item, index) in song" :key="index" :class="ischoose === item.id ? 'choose': ''" @click="playMusic(item.id)">
          <span class="el-icon-caret-right" v-bind:class="nowSong === item.id ? 'color-blue' : ''"></span>
          <span>{{item.name}}</span>
          <span ><div v-for="(jtem, jndex) in item.ar" :key="jndex">{{Object.keys(jtem)[0]}}</div></span>
          <span>{{item.al}}</span>
          <span>{{time(item.time)}}</span>
          <span @click.stop="deleteList(index)">删除</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { timeShow } from '@/common/tool'
export default {
  name: 'musiclist',
  data() {
    return {
      song: [],
      ischoose: '',

    }
  },
  methods: {
    deleteList(index) {
      this.$store.commit('deletePlaylist', index);
      console.log(event)
    },
    playMusic(id) {
      let s = {};
      s.id = id;
      this.$store.commit('updateSong', s);
      
      if(this.$route.path !== '/music') {
        this.$router.push('/music');
        console.log(this.$route.path)
      }
    },
    time(time) {
      return timeShow(time / 1000)
    },
    deleteAlllist() {
      console.log("12")
      this.$store.commit("deleteAll")
    },
    fatherShow() {
      this.$parent.showm();
    }
    
  },
  computed: {
    listlength: function() {
      return this.$store.state.playlist.length;
    },
    nowSong: function() {
      return this.$store.state.songid;
    },
  },
  watch: {
    listlength: function() {
      this.song = this.$store.state.playlist;
      console.log(this.song);
    },
    nowSong: function() {
      this.ischoose = this.nowSong
    }
  }
}
</script>

<style lang="scss" scoped>
.musiclist {
  width: 100%;
  height: 100%;
  // overflow-y: hidden;
    /*滚动条整体样式*/
  .head {
    position: sticky;
    top: 0;
    right: 0;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    background-color: #494e8f;
    &:hover {
      cursor: pointer;
    }
    span {
      font-size: 14px;
      float: right;
      margin-right: 10px;
      &:hover {
        cursor: pointer;
        
        color: #afb4db;
      }
    }
  }
  .list {
    .mess {
      position: sticky;
      background-color: #4e72b8;
      top: 40px;
      right: 0;
      span {
        display: inline-block;
        width: 150px;
        &:nth-child(1) {
          width: 20px;
        }
        &:nth-child(3) {
          width: 300px;
        }
        &:nth-child(5) {
          width: 50px;
        }
        &:nth-last-child(1) {
          width: 50px;
          float: right;
          margin-right: 5px;
        }
      }
    }
    ul {
      li {
        height: 28px;
        width: 100%;
        font-size: 12px;
        span {
          display: inline-block;
          width: 150px;
          height: 28px;
          overflow: hidden;
          // margin-right: 10px;
          line-height: 28px;
          font-size: 12px;
          &:nth-child(1) {
            width: 20px;
            font-size: 16px;
          }
          &:nth-child(3) {
            width: 300px;
          }
          &:nth-child(5) {
            width: 50px;
          }
          &:nth-last-child(1) {
            width: 50px;
            float: right;
            margin-right: 5px;
            transition: color .2s;
            &:hover {
              color: #6950a1
            }
          }
          div {
            display: inline;
            margin-right: 5px;
          }
        }
        &:hover {
          cursor: pointer;
          background-color: #9b95c9;
        }
      }
    }
  }
}
.choose {
  background-color: #c77eb5;
}
.color-blue {
  color:  #6950a1;
}
</style>