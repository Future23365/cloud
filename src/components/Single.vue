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
      <el-table-column
        prop="songTime"
        label="时长"
        min-width="180">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getsongDetail } from '@/request/getdata'
import Musicmenu from '@/components/Musicmenu'

export default {
  name: 'single',
  components: {
    Musicmenu
  },
  data() {
    return {
      tableData: [],
      loading: true,
      showId: 0,
    }
  },
  methods: {
    
    settableData(data) {
      this.tableData = [];
      // console.log(data);
      this.tableData = data;
      this.loading = false;
      // console.log(this.tableData);
    },
    goMusic(id) {
      // console.log(id);
      let s = {};
      s.id = id;
      getsongDetail(id).then(res => {
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
        console.log(obj);
        this.$store.commit('updatePlaylist', obj);
      })
      this.$store.commit('updateSong', s);
      this.$router.push('/music');
    },
    goArtist(id) {
      // console.log('歌手id');
      // console.log(id);
      this.$router.push({
        path: '/artist',
        query: {
          artistid: id
        }
      })
    },
    goAlbum(id) {
      this.$router.push({
        path: "/albumdetail",
        query: {
          albumdetailId: id
        }
      });
    },
    enterColum(row) {
      this.showId = row.songId;
      console.log(row);
      this.$forceUpdate();
    },
    leaveColum() {
      this.showId = 0;
    },
  },
  computed: {

  },
  watch: {
    
  },
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