<template>
  <div class="single">
    <el-table
      v-loading="loading"
      :data="tableData"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
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
export default {
  name: 'single',
  data() {
    return {
      tableData: [],
      loading: true,
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
    }
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