<template>
  <div class="playlistsongs">
    <el-table
    :data="tableData"
    stripe
    v-loading="loading"
    @cell-mouse-enter="enterColum"
    @cell-mouse-leave="leaveColum"
    style="width: 100%; overflow: auto">
    <el-table-column
      prop="song"
      label="歌曲"
      width="180">
      <template slot-scope="scope">
        <a href="javascript:;" >
          {{scope.row.song}}
        </a>
        <Musicmenu :musicid="scope.row.id" :musicName="scope.row.song" v-show="(showId === scope.row.id)"></Musicmenu>
      </template>
    </el-table-column>
    <el-table-column
      prop="artist"
      label="歌手"
      width="180">
      <template slot-scope="scope">
        <a href="javascript:;" v-for="(item, index) in scope.row.artist" :key="index">
          {{item.name}}
        </a>
      </template>
    </el-table-column>
    <el-table-column
      prop="album"
      label="专辑">
      <template slot-scope="scope">
        <a href="javascript:;">
          {{scope.row.album.name}}
        </a>
      </template>
    </el-table-column>
    <el-table-column
      prop="time"
      label="时长">
    </el-table-column>
  </el-table>
  <div class="pag">
    <el-pagination
    :page-size="15"
    layout="prev, pager, next"
    @current-change="getnextSongs"
    :total="total">
    </el-pagination>
  </div>
  
  </div>
</template>

<script>
import { getsongDetail } from '@/request/getdata';
import { timeShow } from '@/common/tool';
import Musicmenu from '@/components/Musicmenu';

export default {
  name: 'playlistsongs',
  props: ['songList'],
  components: {
    Musicmenu
  },
  data() {
    return {
      songsData: [],
      flag: 750,
      start: 0,
      tableData: [],
      total: 0,
      loading: true,
      showId: 0,
    }
  },
  methods: {
    getSongs() {
      this.tableData = [];
      let ids = '';
      for(let i = this.start; i < this.songsData.trackIds.length - this.flag; i++) {
        if(i === this.songsData.trackIds.length - this.flag - 1) {
          ids += `${this.songsData.trackIds[i].id}`
        } else {
          ids += `${this.songsData.trackIds[i].id},`
        }
      }
      getsongDetail(ids).then(res => {
        for(let i = 0; i < res.songs.length; i++) {
          let arr = {};
          arr.song = res.songs[i].name;
          arr.id = res.songs[i].id;
          arr.artist = [];
          for(let j = 0; j < res.songs[i].ar.length; j++) {
            let a = {};
            a.name = res.songs[i].ar[j].name;
            a.id = res.songs[i].ar[j].id;
            arr.artist.push(a);
          }
          arr.time = timeShow(res.songs[i].dt / 1000);
          arr.album = {};
          arr.album.id = res.songs[i].al.id;
          arr.album.name = res.songs[i].al.name;
          this.tableData.push(arr);
        }
        this.loading = false;
      })
      this.start = this.start + 15;
      this.flag - 15 > 0 ? this.flag = this.flag - 15 : this.flag = 0;
      console.log(this.flag);
      this.$forceUpdate();
    },
    getnextSongs() {
      this.loading = true;
      this.getSongs();
    },
    enterColum(row) {
      this.showId = row.id;
      this.$forceUpdate();
    },
    leaveColum() {
      this.showId = 0;
    },
  },
  watch: {
    songList: function() {
      this.songsData = this.songList;
      this.start = this.songsData.tracks.length;
      this.songsData.trackIds.length - 15 - this.start > 0 ? this.flag = this.songsData.trackIds.length - 15 - this.start : this.flag = 0;
      this.total = this.songsData.trackIds.length - this.start;
      this.getSongs();
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
.playlistsongs {
  .el-table {
      .el-table__row {
        a {
          color: #333;
          &:link {
            text-decoration: none;
          }
          &:hover {
            color: #0c73c2;
            text-decoration: underline;
          }
        }
      }
    }
  .pag {
    text-align: center;
  }
}
</style>