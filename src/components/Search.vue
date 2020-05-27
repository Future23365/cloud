<template>
  <div class="search">
    <el-autocomplete
      v-model="state"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入内容"
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
      if(!!queryString) {
        getsearchSuggest(queryString).then(res => {
        // this.songs = res;
        let datasongs = [];
        for(let i = 0; i < res.result.songs.length; i++) {
          this.songs[res.result.songs[i].name] = res.result.songs[i].id
          datasongs.push({'value': res.result.songs[i].name})
        }
        cb(datasongs)
        console.log(res);
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