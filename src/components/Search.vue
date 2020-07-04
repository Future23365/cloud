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
      songs: {},
      state: '',
      timeout:  null
    }
  },
  methods: {
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
      }
      
    },
    handleSelect(item) {
      let s = {};
      s.id = this.songs[item.value];
      s.name = item.value;
      this.$store.commit('updateSong', s);
      getsongDetail(s.id).then(res => {
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
        this.$store.commit('updatePlaylist', obj);
      })
      if(this.$route.path === '/music') {

      }else{
        this.$router.push('/music');
      }
      
      
    },
    getResult(s) {
      this.$router.push({
        path: '/result',
        query: {
          s: s,
          limit: 30,
          offset: 0,
          type: 1
        }
      });

    }
  },
  mounted() {

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