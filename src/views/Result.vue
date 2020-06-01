<template>
  <div class="result">
    <div class="title">
      搜索<span>{{this.$route.query.s}}</span>,找到<span>{{songCount}}</span>个结果
    </div>
    <el-tabs type="border-card"  @tab-click="setTab">
      <el-tab-pane label="单曲"><Single @startRequest="getData" ref="childrenSingle"></Single></el-tab-pane>
      <el-tab-pane label="歌手"><Album ref="childrenAuthor"></Album></el-tab-pane>
      <el-tab-pane label="专辑"><Album ref="childrenAlbum"></Album></el-tab-pane>
      <el-tab-pane label="视频">视频</el-tab-pane>
      <el-tab-pane label="MV"><mv ref="childrenMv"></mv></el-tab-pane>
      <el-tab-pane label="歌词">歌词</el-tab-pane>
      <el-tab-pane label="歌单">歌单</el-tab-pane>
      <el-tab-pane label="主播电台">主播电台</el-tab-pane>
      <el-tab-pane label="用户">用户</el-tab-pane>
    </el-tabs>
    <div class="pag">
      <el-pagination
      background
      layout="prev, pager, next"
      @current-change="getNextdata"
      :page-size='30'
      :total="songCount">
      </el-pagination>
    </div>
    
  </div>
</template>

<script>
import { getsearchResult } from '@/request/getdata';
import { timeShow } from '@/common/tool';
import Single from '@/components/Single';
import Mv from '@/components/Mv';
import Album from '@/views/Album';

export default {
  name: 'result',
  components: {
    Single,
    Mv,
    Album
  },
  data() {
    return {
      songCount: 0,
      songs: [],
      tabName: '单曲',

    }
  },
  methods: {
    
    getData(type = 1, obj = {}) {
      let s, limit, offset;
      // console.log(type);
      if('s' in obj) { s = obj.s };
      if('limit' in obj) { limit = obj.limit };
      if('offset' in obj) { offset = obj.offset };
      if('type' in obj) { type = obj.type };
      getsearchResult( s || this.$route.query.s, limit || this.$route.query.limit, offset || this.$route.query.offset, type || this.$route.query.type).then(res => {

        console.log(res);
        this.sendTableData(res, type);
      }) 
    },
    getNextdata(page) {
      // console.log(this.tabName);
      if(this.tabName === '单曲') {
        // console.log("点击");
        this.getData(1, {'offset': (page - 1)  * 30});
      }else if(this.tabName === 'MV') {
        this.getData(1004, {'offset': (page - 1)  * 30});
      }else if(this.tabName === '专辑') {
        this.getData(10, {'offset': (page - 1) * 30})
      }else if(this.tabName === '歌手') {
        this.getData(100, {'offset': (page - 1) * 30})
      }
    },
    setTab(e) {
      this.tabName = e.label;
      switch(e.label) {
        case '单曲':
          this.getData(1);
          break;
        case 'MV':
          this.getData(1004);
          break;
        case '专辑':
          this.getData(10);
          break;
        case '歌手':
          this.getData(100);
          break;
      }

    },
    sendTableData(data, type) {
      switch(type) {
        case 1: 
          this.sendSongs(data);
          break;
        case 1004:
          this.sendMv(data);
          break;
        case 10:
          this.sendAlbum(data);
          break;
        case 100:
          this.sendAuthor(data);
          break;
      }
    },
    sendSongs(res) {
      console.log(res);
      let arr = [];
        for(let i = 0; i < res.result.songs.length; i++) {
          let obj = {};
          obj.songId = res.result.songs[i].id;
          obj.songName = res.result.songs[i].name;
          obj.songAuthor = {};
          for(let j = 0; j < res.result.songs[i].artists.length; j++) {
            obj.songAuthor[res.result.songs[i].artists[j].id] = res.result.songs[i].artists[j].name;
          }
          obj.songAlbum = `《${res.result.songs[i].album.name}》`;
          obj.songAlbumId = res.result.songs[i].album.id;
          obj.songTime = timeShow(res.result.songs[i].duration / 1000);
          arr.push(obj);
        }
        this.songCount = res.result.songCount;
        this.$refs.childrenSingle.settableData(arr);
    },
    sendMv(data) {
      this.songCount = data.result.mvCount;
      this.$refs.childrenMv.getMvdata(data.result.mvs);
    },
    sendAlbum(data) {
      this.songCount = data.result.albumCount;
      this.$refs.childrenAlbum.getAlbumdata(data.result.albums);
    },
    sendAuthor(data) {
      this.songCount = data.result.artistCount;
      this.$refs.childrenAuthor.getAlbumdata(data.result.artists);
    }
  },
  computed: {
    keywords: function() {
      return this.$route.query.s;
    },
    limit: function() {
      return this.$route.query.limit;
    },
    offset: function() {
      return this.$route.query.offset;
    },
    type : function() {
      return this.$route.query.type;
    }
  },
  mounted() {
    
  },
  watch: {
    '$route' : function() {
      // if(this.$route.params.path.search('result')) {
        console.log(this.$route);
        this.getData();
      // }
      
    }
  },
}
</script>

<style lang="scss" scoped>
  .result {
    max-width: 1120px;
    min-width: 720px;
    min-height: 1000px;
    background-color: #ccc;
    margin: 0 auto;
    padding: 80px 40px;
    .title {
      color: #999;
      margin-bottom: 28px;
      span {
        &:last-child {
          color: #c20c0c;
          margin: 0 3px;
        }
      }
    }
    .pag {
      text-align: center;
    }
  }
</style>