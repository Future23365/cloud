<template>
  <div class="ranking">
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :data="tableData"
      @cell-mouse-enter="enterColum"
      @cell-mouse-leave="leaveColum"
      stripe
      style="width: 100%">
      <el-table-column
      width="50"
      align="center"
      type="index"
      prop="hotmusic">
      </el-table-column>
      <el-table-column 
      label="云音乐热歌榜Top50"
      min-width="200"
      align="center"
      class="table-row"
      >
        <template slot-scope="scope">
          <a href="javascript: void(0);" 
          style="text-decoration: none; color: #232323;" 
          :data-songid="scope.row.hotmusicid"
          @mouseenter="aaa(scope.column.label)"
          @click="setsongId(scope.row.hotmusicid)">
          {{scope.row.hotmusic}}</a>
          <Musicmenu :musicid="scope.row.hotmusicid" :musicName="scope.row.hotmusic" v-show="(showId === scope.row.hotmusicid) && (columShow === scope.column.label)"></Musicmenu>
        </template>
      </el-table-column>
      
      <el-table-column 
      label="云音乐新歌榜Top50"
      min-width="200"
      align="center"
      >
        <template slot-scope="scope">
          <a href="javascript: void(0);" 
          style="text-decoration: none; color: #232323;" 
          :data-songid="scope.row.newmusicid" 
          @click="setsongId(scope.row.newmusicid)">
          {{scope.row.newmusic}}</a>
          <Musicmenu :musicid="scope.row.newmusicid" :musicName="scope.row.newmusic" v-show="(showId === scope.row.newmusicid) && (columShow === scope.column.label)"></Musicmenu>
        </template>
      </el-table-column>
      <el-table-column 
      label="云音乐电音榜Top50"
      min-width="200"
      align="center"
      >
        <template slot-scope="scope">
          <a href="javascript: void(0);" 
          style="text-decoration: none; color: #232323;" 
          :data-songid="scope.row.electronicid"
          @click="setsongId(scope.row.electronicid)">
          {{scope.row.electronic}}</a>
          <Musicmenu :musicid="scope.row.electronicid" :musicName="scope.row.electronic" v-show="(showId === scope.row.electronicid) && (columShow === scope.column.label)"></Musicmenu>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getsongTop, getsongUrl, serverAll } from '@/request/getdata';
import Musicmenu from '@/components/Musicmenu'

export default {
  name: 'Ranking',
  components: {
    Musicmenu,
  },
  data() {
    return {
      ranking: {},
      tableData: [],
      music: [[],[],[]],
      loading: true,
      showId: 0,
      columShow: '',

    }
  },
  methods: {
    // savelocal(id, name, url) {
    //   if(localStorage.getItem('music') === null) {
    //     localStorage.setItem('music', JSON.stringify([]))
    //   }
    //   let music = {};
    //   let arr = []
    //   music.songid = id;
    //   music.songname = name;
    //   music.songurl = url;
    //   arr.push(music);
    //   localStorage.setItem('music', JSON.stringify(arr));
    // },
    setTabledata(arr) {
      for(let i = 0; i < 50; i++) {
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
      serverAll([getsongTop(1), getsongTop(0), getsongTop(25)]).then(res => {
        this.ranking = res;
        this.setTabledata(this.ranking);
        this.loading = false;
        // console.log(this.ranking);
      })
    },
    setsongId(id, name) {
        let s = {};
        s.id = id;
        this.$store.commit('updateSong', s);
        this.$router.push('/music');
    },
    enterColum(row, colum, cell, enent) {
      switch(colum.label) {
        case '云音乐热歌榜Top50':
          this.showId = row.hotmusicid;
          this.columShow = '云音乐热歌榜Top50';
          break;
        case '云音乐新歌榜Top50':
          this.showId = row.newmusicid;
          this.columShow = '云音乐新歌榜Top50';
          break;
        case '云音乐电音榜Top50':
          this.showId = row.electronicid
          this.columShow = '云音乐电音榜Top50';
          break;
      }
      this.$forceUpdate();
    },
    leaveColum() {
      this.showId = 0;
    },
    aaa(a) {
      console.log(a)
    }
  },
  // computed: {
  //   monitorSong: function() {
  //     return this.$store.state.songid;
  //   }
  // },
  // watch: {
  //   monitorSong: function() {
  //     this.getSongurl();
  //   }
  // },
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