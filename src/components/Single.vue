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
          <a href="javascript:;" v-for="(item, index) in scope.row.songAuthor" :key="index">
            {{item}}
          </a>
        </template>
      </el-table-column>
      <el-table-column
        prop="songAlbum"
        label="专辑"
        min-width="180">
        <template slot-scope="scope">
          <a href="javascript:;">
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
  props: ['dingleData'],
  data() {
    return {
      tableData: [],
      loading: true,
    }
  },
  methods: {
    timeShow(time) {
      let minute;
      let second;
      if(time >= 60) {
        time = Math.ceil(time);
        minute = (time / 60).toString().split(".")[0];
        minute < 10 ? minute = "0" + minute : minute = minute;
        second= (time - minute * 60).toFixed(0); 
        second < 10 ? second = "0" + second : second = second;
        
      }else {
        minute = "00";
        second = time.toFixed(0);
        second < 10 ? second = "0" + second : second = second;
      }
      return minute + ":" + second;
    },
    settableData(data) {
      this.tableData = [];
      // console.log(data);
      for(let i = 0; i < data.length; i++) {
        let obj = {};
        obj.songId = data[i].id;
        obj.songName = data[i].name;
        obj.songAuthor = [];
        for(let j = 0; j < data[i].artists.length; j++) {
          obj.songAuthor.push(data[i].artists[j].name);
        }
        obj.songAlbum = `《${data[i].album.name}》`;
        obj.songTime = this.timeShow(data[i].duration / 1000);
        this.tableData.push(obj);
      }
      this.loading = false;
      // console.log(this.tableData);
    },
    goMusic(id) {
      // console.log(id);
      let s = {};
      s.id = id;
      this.$store.commit('updateSong', s);
      this.$router.push('/music');
    }
  },
  computed: {

  },
  watch: {

  },
  mounted() {
    this.$emit('startRequest');
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