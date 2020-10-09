<template>
  <div class="search">
    <el-autocomplete
      ref="cpm"
      v-model="state"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入内容搜索音乐,回车确认"
      :clearable="true"
      @change="getResult"
      @select="handleSelect">
      </el-autocomplete>
  </div>
</template>

<script>
import { getsearchSuggest, getsongDetail } from '@/request/getdata';
export default {
  name: 'Search',
  data() {
    return {
      songs: {}, //保存歌曲列表
      state: '',  //
      timeout:  null,
      enterInput: true
    }
  },
  methods: {
    // queryString为输入框的内容，cb为回调函数，传输显示的数据
    querySearchAsync(queryString, cb) {
      if(!!queryString.trim()) {
        getsearchSuggest(queryString).then(res => {
          let datasongs = [];
          if(!!res.result.songs) {
            for(let i = 0; i < res.result.songs.length; i++) {
              this.songs[`${res.result.songs[i].name}  ${res.result.songs[i].artists[0].name}`] = res.result.songs[i].id
              datasongs.push({'value': `${res.result.songs[i].name}  ${res.result.songs[i].artists[0].name}`})
            }
            cb(datasongs)
          }
        })
      }else {
        cb([])
      }
    },
    // 选择建议函数
    handleSelect(item) {
      this.enterInput = false;
      let s = {};
      s.id = this.songs[item.value];
      s.name = item.value;
      this.$store.commit('updateSong', s);
      getsongDetail(s.id).then(res => {
        // this.song = res.songs[0];
        // 分发action使歌曲添加到播放列表
        let obj = {};
        obj.id = res.songs[0].id;
        this.$store.dispatch('sendUpdatePlaylist', obj);
      })
      if(this.$route.path !== '/music') {
        this.$router.push('/music');
      }
    },
    // 输入框失去焦点触发此事件跳转到结果页，增加一个标志位并延时来使点击选项使不触发此事件,
    getResult(s) {
      let that = this;
      setTimeout(function() {
        if(that.enterInput) {
          that.$router.push({
            path: '/result',
            query: {
              s: s,
              limit: 30,
              offset: 0,
              type: 1
            }
          });
        }
        that.enterInput = true;
      }, 500)
    }
  }
}
</script>

<style lang='scss' scoped>
  .search {
    .el-autocomplete {
      width: 300px;
    }
  }
</style>