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
      type="index">
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
          @click="setsongId(scope.row.hotmusicid), getsong(scope.row.hotmusicid)">
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
          @click="setsongId(scope.row.newmusicid), getsong(scope.row.newmusicid)">
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
          @click="setsongId(scope.row.electronicid), getsong(scope.row.electronicid)">
          {{scope.row.electronic}}</a>
          <Musicmenu :musicid="scope.row.electronicid" :musicName="scope.row.electronic" v-show="(showId === scope.row.electronicid) && (columShow === scope.column.label)"></Musicmenu>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getsongTop, getsongUrl, serverAll, getsongDetail, getToplist, getUserPlaylistDetail } from '@/request/getdata';
import Musicmenu from '@/components/Musicmenu'

export default {
  name: 'Ranking',
  components: {
    Musicmenu,
  },
  data() {
    return {
      // ranking: {},
      tableData: [],  //组件用于存入
      // music: [[],[],[]],  //存入三种排行榜
      loading: true,  //加载状态标记为
      showId: 0,    //控制需要显示菜单德尔一行
      columShow: '',  //控制菜单要显示的哪一列

    }
  },
  methods: {
    // 请求歌曲数据
    getsong(id) {
      getsongDetail(id).then(res => {
        // this.song = res.songs[0];
        // let obj = {};
        // obj.id = res.songs[0].id;
        // obj.name = res.songs[0].name;
        // let arr = [];
        // for(let i = 0; i < res.songs[0].ar.length; i++) {
        //   let o = {};
        //   o[res.songs[0].ar[i].name] = res.songs[0].ar[i].id;
        //   arr.push(o);
        // }
        // obj.ar = arr;
        // obj.al = res.songs[0].al.name;
        // obj.alId = res.songs[0].al.id;
        // obj.time = res.songs[0].dt;
        // this.$store.commit('updatePlaylist', obj);

        // 分发action使歌曲添加到播放列表
        let obj = {};
        obj.id = id;
        this.$store.dispatch('sendUpdatePlaylist', obj);
      })
    },
    // 设置表格要显示的数据
    setTabledata(arr) {
      console.log(arr)
      for(let i = 0; i < 50; i++) {
        this.tableData.push({
          hotmusic: arr[0].playlist.tracks[i].name,
          newmusic: arr[1].playlist.tracks[i].name,
          electronic: arr[2].playlist.tracks[i].name,
          hotmusicid: arr[0].playlist.tracks[i].id,
          newmusicid: arr[1].playlist.tracks[i].id,
          electronicid: arr[2].playlist.tracks[i].id,
        });
          // this.music[0].push(arr[0].playlist.tracks[i]);
          // this.music[1].push(arr[1].playlist.tracks[i]);
          // this.music[2].push(arr[2].playlist.tracks[i]);
      }
    },
    // 请求数据
    getRanking() {
      // 先获取歌单ID，再由歌单ID获取歌单详细数据
      getToplist().then(res => {
        let hotmusic = 0;
        let newmusic = 0;
        let electric = 0;
        for(let item of res.list) {
          if(item.name === '云音乐热歌榜') {
            hotmusic = item.id
          }else if(item.name === '云音乐新歌榜') {
            newmusic = item.id
          }else if(item.name === '云音乐电音榜') {
            electric = item.id
          }
        }
        // 通过Promise.all并发请求
        serverAll([getUserPlaylistDetail(hotmusic), getUserPlaylistDetail(newmusic), getUserPlaylistDetail(electric)]).then(res => {
          this.setTabledata(res);
          this.loading = false;
        })
      })
    },
    // 点击歌曲事件处理函数
    setsongId(id, name) {
        let s = {};
        s.id = id;
        this.$store.commit('updateSong', s);
        this.$router.push('/music');
    },
    // 鼠标进入单元格事件处理函数，根据列标签判断进入的是哪一列，由此取出对应的歌曲ID
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
      // this.$forceUpdate();
    },
    // 离开单元格将歌曲ID归零
    leaveColum() {
      this.showId = 0;
    },
  },
  mounted() {
    // 调用请求数据函数
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