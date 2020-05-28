<template>
  <div class="search">
    <el-autocomplete
      v-model="state"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入内容"
      @change="getResult"
      @select="handleSelect">
      </el-autocomplete>
  </div>
</template>

<script>
import { getsearchSuggest } from '../request/getdata'
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
        // this.songs = res;
        let datasongs = [];
        if(!!res.result.songs) {
          for(let i = 0; i < res.result.songs.length; i++) {
          this.songs[res.result.songs[i].name] = res.result.songs[i].id
          datasongs.push({'value': `${res.result.songs[i].name}  ${res.result.songs[i].artists[0].name}`})
          }
          cb(datasongs)
        }
        
        // console.log(res);
      })
      }
      
    },
    handleSelect(item) {
      let s = {};
      s.id = this.songs[item.value];
      s.name = item.value;
      this.$store.commit('updateSong', s);
      // this.$router.go(0);
      this.$router.push('/music');
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
      })
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