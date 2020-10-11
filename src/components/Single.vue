<template>
  <div class="single">
    <el-table
      v-loading="loading"
      :data="tableData"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      @cell-mouse-enter="enterColum"
      @cell-mouse-leave="leaveColum"
      stripe
      style="width: 100%">
      <!-- 歌曲名列 -->
      <el-table-column
        prop="songName"
        label="歌曲"
        min-width="180">
        <template slot-scope="scope">
          <a href="javascript:;" @click="goMusic(scope.row.songId)">
            {{scope.row.songName}}
          </a>
            <Musicmenu :musicid="scope.row.songId" :musicName="scope.row.songName" v-show="(showId === scope.row.songId)"></Musicmenu>
        </template>
      </el-table-column>
      <!-- 歌手列 -->
      <el-table-column
        prop="songAuthor"
        label="歌手"
        min-width="180">
        <template slot-scope="scope">
          <a href="javascript:;" v-for="(item, name, index) in scope.row.songAuthor" :key="index" @click="goArtist(name)">
            {{item}}
          </a>
        </template>
      </el-table-column>
      <!-- 专辑列 -->
      <el-table-column
        prop="songAlbum"
        label="专辑"
        min-width="180">
        <template slot-scope="scope">
          <a href="javascript:;" @click="goAlbum(scope.row.songAlbumId)">
            {{scope.row.songAlbum}}
          </a>
        </template>
      </el-table-column>
      <!-- 时长列 -->
      <el-table-column
        prop="songTime"
        label="时长"
        min-width="180">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getsongDetail } from '@/request/getdata';
import Musicmenu from '@/components/Musicmenu';
import { Message } from 'element-ui';

export default {
  name: 'single',
  components: {
    Musicmenu
  },
  data() {
    return {
      tableData: [], //表格数据
      loading: true,  //加载标记位
      showId: 0,  //标记进入的每一行
    }
  },
  methods: {
    // 父组件调用此函数将数据传入过来
    settableData(data) {
      this.tableData = [];
      this.tableData = data;
      this.loading = false;
    },
    // 点击歌曲名播放
    goMusic(id) {
      let s = {};
      s.id = id;
      // 请求歌曲并分发action
      getsongDetail(id).then(res => {
        // 分发action使歌曲添加到播放列表
        let obj = {};
        obj.id = id;
        this.$store.dispatch('sendUpdatePlaylist', obj);
      })
      this.$store.commit('updateSong', s);
      this.$router.push('/music');
    },
    // 点击歌手跳转
    goArtist(id) {
      if(this.$route.path !== '/artist' && this.$route.query.artistid !== id) {
        this.$router.push({
          path: '/artist',
          query: {
            artistid: id
          }
        })
      }else{
        Message({
          message: '已经在这啦！',
        });
      }
    },
    // 点击专辑跳转
    goAlbum(id) {
      if(this.$route.path === '/albumdetail') {
        Message({
          message: '已经在这啦！',
        });
      } else{
        this.$router.push({
            path: "/albumdetail",
            query: {
              albumdetailId: id
          }
        });
      } 
    },
    // 保存鼠标进入的当前行的id
    enterColum(row) {
      this.showId = row.songId;
      // console.log(row);
      this.$forceUpdate();
    },
    // 离开当前行将id清零
    leaveColum() {
      this.showId = 0;
    },
  },
  // 因为默认显示歌曲结果，所以向父组件请求方法来获取数据
  mounted() {
    this.$emit('startRequest', 1);
  }
}
</script>

<style lang="scss" scoped>
  .single {
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
  }
  .cola {
    color: #0c73c2;
  }
</style>