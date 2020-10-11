<template>
  <div class="playlistsongs">
    <el-table
    :data="tableData"
    stripe
    v-loading="loading"
    @cell-mouse-enter="enterColum"
    @cell-mouse-leave="leaveColum"
    style="width: 100%; overflow: auto">
    <!-- 歌曲列 -->
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
    <!-- 歌手列 -->
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
    <!-- 专辑列 -->
    <el-table-column
      prop="album"
      label="专辑">
      <template slot-scope="scope">
        <a href="javascript:;">
          {{scope.row.album.name}}
        </a>
      </template>
    </el-table-column>
    <!-- 时长列 -->
    <el-table-column
      prop="time"
      label="时长">
    </el-table-column>
  </el-table>
  <!-- 分页器 -->
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
  props: ['songList'], //保存父组件传来的数据
  components: {
    Musicmenu
  },
  data() {
    return {
      songsData: [], //提取具体的歌曲数据
      flag: 0,  //已经有的歌曲数量
      start: 0, //已经显示个歌曲
      tableData: [], //表格数据
      total: 0, //总长度
      loading: true,
      reNumber: 15, //每列显示个数
      showId: 0,
    }
  },
  methods: {
    // 请求歌曲具体数据
    getSongs(nowPage = 1) {
      // 保存请求id字符串
      this.tableData = [];
      let ids = '';
      // 设置下一个取出的id个数，如果还剩15个，就取15个，不够15个，取出剩余的个数
      (this.total - (nowPage - 1) * 15) > 15 ? this.reNumber = 15: this.reNumber = this.total - (nowPage - 1) * 15;
      let reStart = this.start + (nowPage - 1) * 15;
      // 判断末尾不加逗号
      for(let i = reStart; i < reStart + this.reNumber; i++) {
        if(i === reStart + this.reNumber - 1) {
          ids += `${this.songsData.trackIds[i].id}`
        } else {
          ids += `${this.songsData.trackIds[i].id},`
        }
      }
      // 请求歌曲数据
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
      this.$forceUpdate();
    },
    // 翻页事件
    getnextSongs(nowPage) {
      this.loading = true;
      this.getSongs(nowPage);
    },
    // 进入显示设置id
    enterColum(row) {
      this.showId = row.id;
      this.$forceUpdate();
    },
    // 移出归0id
    leaveColum() {
      this.showId = 0;
    },
  },
  watch: {
    // 监听父组件传过来的数据设置每页请求个数，总个数,请求数据
    songList: function() {
      this.songsData = this.songList;
      this.start = this.songsData.tracks.length;
      this.total = this.songsData.trackIds.length - this.start;
      this.getSongs();
    }
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