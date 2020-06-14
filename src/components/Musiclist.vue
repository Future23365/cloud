<template>
  <div class="musiclist">
    <div class="head">播放列表({{listlength}})</div>
    <div class="list">
      <ul>
        <li v-for="(item, index) in song" :key="index">
          <span class="el-icon-caret-right"></span>
          <span>{{item.name}}</span>
          <span v-for="(jtem, jndex) in item.ar" :key="jndex">{{Object.keys(jtem)[jndex]}}</span>
          <span>{{item.al}}</span>
          <span>时间</span>
          <span @click="deleteList(index)">删除</span>
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
      song: []
    }
  },
  methods: {
    deleteList(index) {
      this.$store.commit('deletePlaylist', index);
    }
  },
  computed: {
    listlength: function() {
      return this.$store.state.playlist.length;
    }
  },
  watch: {
    listlength: function() {
      this.song = this.$store.state.playlist;
      // console.log(this.song);
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
        }
      }
    }
  }
}
</style>