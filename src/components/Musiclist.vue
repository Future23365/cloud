<template>
  <div class="musiclist">
    <div class="head">播放列表({{listlength}})</div>
    <div class="list">
      <ul>
        <li v-for="(item, index) in song" :key="index" :class="ischoose === item.id ? 'choose': ''" @click="playMusic(item.id)">
          <span class="el-icon-caret-right"></span>
          <span>{{item.name}}</span>
          <span v-for="(jtem, jndex) in item.ar" :key="jndex">{{Object.keys(jtem)[jndex]}}</span>
          <span>{{item.al}}</span>
          <span>时间</span>
          <span @click.stop="deleteList(index)">删除</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
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
        this.$router.push('/music');
    }
  },
  computed: {
    listlength: function() {
      return this.$store.state.playlist.length;
    },
    nowSong: function() {
      return this.$store.state.songid;
    }
  },
  watch: {
    listlength: function() {
      this.song = this.$store.state.playlist;
      // console.log(this.song);
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
  .head {
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
    background-color: #494e8f;
  }
  .list {
    ul {
      li {
        height: 28px;
        width: 100%;
        span {
          margin-left: 10px;
          &:nth-last-child(1) {
            float: right;
            margin-right: 5px;
            transition: color .2s;
            &:hover {
              color: #6950a1
            }
          }
        }
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}
.choose {
  background-color: #c77eb5;
}
</style>