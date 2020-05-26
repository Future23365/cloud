<template>
  <div class="ranking">
    <el-table
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
      width="50"
      align="center"
      type="index"
      prop="hotmusic">
      </el-table-column>
      <el-table-column 
      label="云音乐热歌榜"
      min-width="200"
      align="center"
      class="table-row"
      >
        <template slot-scope="scope">
          <a href="javascript: void(0);" style="text-decoration: none; color: #232323;" :data-songid="scope.row.hotmusicid" @click="getSongurl(scope.row.hotmusicid, scope.row.hotmusic)">{{scope.row.hotmusic}}</a>
        </template>
      </el-table-column>
      
      <el-table-column 
      label="云音乐新歌榜"
      min-width="200"
      align="center"
      >
        <template slot-scope="scope">
          <a href="javascript: void(0);" style="text-decoration: none; color: #232323;" :data-songid="scope.row.newmusicid" @click="getSongurl(scope.row.newmusicid, scope.row.newmusic)">{{scope.row.newmusic}}</a>
        </template>
      </el-table-column>
      <el-table-column 
      label="云音乐电音榜"
      min-width="200"
      align="center"
      >
        <template slot-scope="scope">
          <a href="javascript: void(0);" style="text-decoration: none; color: #232323;" :data-songid="scope.row.electronicid" @click="getSongurl(scope.row.electronicid, scope.row.electronic)">{{scope.row.electronic}}</a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios';
import server from '../request/request';
export default {
  name: 'Ranking',
  
  data() {
    return {
      ranking: {},
      tableData: [],
      music: [[],[],[]],
    }
  },
  methods: {
    savelocal(id, name, url) {
      if(localStorage.getItem('music') === null) {
        localStorage.setItem('music', JSON.stringify([]))
      }
      let music = {};
      let arr = []
      music.songid = id;
      music.songname = name;
      music.songurl = url;
      arr.push(music);
      localStorage.setItem('music', JSON.stringify(arr));
    },
    setTabledata(arr) {
      for(let i = 0; i < 20; i++) {
        this.tableData.push({
          hotmusic: arr[0].playlist.tracks[i].name,
          newmusic: arr[1].playlist.tracks[i].name,
          electronic: arr[2].playlist.tracks[i].name,
          hotmusicid: arr[0].playlist.tracks[i].id,
          newmusicid: arr[1].playlist.tracks[i].id,
          electronicid: arr[2].playlist.tracks[i].id,
          });
          this.music[0].push(arr[0].playlist.tracks[i]);
          this.music[1].push(arr[1].playlist.tracks[i]);
          this.music[2].push(arr[2].playlist.tracks[i]);
      }
      // console.log(this.tableData);
    },
    getRanking() {
      axios.all([server({
        url: '/top/list?idx=1',
        method: 'get'
      }),server({
        url: '/top/list?idx=0',
        method: 'get'
      }),server({
        url: '/top/list?idx=25',
        method: 'get'
      })]).then(res => {
        this.ranking = res;
        this.setTabledata(this.ranking);
        // console.log(this.ranking);
      })
    },
    getSongurl(id, name) {
      server({
        url: '/song/url?id=' + id,
        method: 'get'
      }).then(res => {
        this.$emit('getRanking',res, name);
        // console.log(res);
        this.$store.state.songid = res.data[0].id;
        this.$store.state.songurl = res.data[0].url;
        this.$store.state.songauthor = [];
        this.$store.state.songname = name;
        // console.log(this.$store.state);
        this.savelocal(res.data[0].id, name, res.data[0].url);
      })
    }
    
    
  },
  mounted() {
    this.getRanking();
  }
}
</script>

<style scoped>
  .ranking {
    max-width: 1200px;
    min-width: 800px;
    margin: 0 auto;
    text-align: center;
  }
</style>