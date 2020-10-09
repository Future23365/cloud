<template>
  <div class="result">
    <div class="title">
      搜索<span>{{this.$route.query.s}}</span>,找到<span>{{songCount}}</span>个结果
    </div>
    <!-- 用标签页来显示结果, 歌手、专辑、歌单公用一个组件，视频和MV公用一个组件 -->
    <el-tabs type="border-card"  @tab-click="setTab">
      <el-tab-pane label="单曲" v-loading="loading"><Single @startRequest="getData" ref="childrenSingle"></Single></el-tab-pane>
      <el-tab-pane label="歌手" v-loading="loading"><Album ref="childrenAuthor"></Album></el-tab-pane>
      <el-tab-pane label="专辑" v-loading="loading"><Album ref="childrenAlbum"></Album></el-tab-pane>
      <el-tab-pane label="视频" v-loading="loading"><Mv ref="childrenVideo"></Mv></el-tab-pane>
      <el-tab-pane label="MV" v-loading="loading"><Mv ref="childrenMv"></Mv></el-tab-pane>
      <el-tab-pane label="歌单" v-loading="loading"><Album ref="childrenPlaylist"></Album></el-tab-pane>
      <el-tab-pane label="用户" v-loading="loading"><Userlist ref="childrenUserlist"></Userlist></el-tab-pane>
    </el-tabs>
    <!-- 分页器 -->
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
import Album from '@/components/Album';
import Userlist from '@/components/Userlist';

export default {
  name: 'result',
  components: {
    Single,
    Mv,
    Album,
    Userlist
  },
  data() {
    return {
      songCount: 0, //结果数量
      // songs: [],  //
      tabName: '单曲', //默认标签
      loading: true   //加载状态
    }
  },
  methods: {
    // 请求数据，如果没有传入参数，就从当前路由中取
    getData(type = 1, obj = {}) {
      let s, limit, offset;
      if('s' in obj) { s = obj.s };
      if('limit' in obj) { limit = obj.limit };
      if('offset' in obj) { offset = obj.offset };
      if('type' in obj) { type = obj.type };
      getsearchResult( s || this.$route.query.s, limit || this.$route.query.limit, offset || this.$route.query.offset, type || this.$route.query.type).then(res => {
        this.loading = false;
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
      }else if(this.tabName === '歌单') {
        this.getData(1000, {'offset': (page - 1) * 30})
      }
    },
    // 点击标签事件处理函数,根据点击的选项传入不同的参数请求数据
    setTab(e) {
      this.tabName = e.label;
      this.loading = true;
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
        case '歌单':
          this.getData(1000);
          break;
        case '用户':
          this.getData(1002);
          break;
        case '视频':
          this.getData(1014);
          break;
      }
    },
    // 根据选择的不同，传入不同组件不同的数据
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
        case 1000:
          this.sendPlaylist(data);
          break
        case 1002:
          this.sendUserlist(data);
          break;
        case 1014:
          this.sendVideo(data);
          break;
      }
    },
    //传单曲数据，利用$refs调用子组件函数
    sendSongs(res) {
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
    //传mv数据，利用$refs调用子组件函数
    sendMv(data) {
      this.songCount = data.result.mvCount;
      this.$refs.childrenMv.getMvdata(data.result.mvs);
    },
    //传专辑数据，利用$refs调用子组件函数
    sendAlbum(data) {
      this.songCount = data.result.albumCount;
      this.$refs.childrenAlbum.getAlbumdata(data.result.albums);
    },
    //传歌手数据，利用$refs调用子组件函数
    sendAuthor(data) {
      this.songCount = data.result.artistCount;
      this.$refs.childrenAuthor.getAlbumdata(data.result.artists);
    },
    //传歌单数据，利用$refs调用子组件函数
    sendPlaylist(data) {
      this.songCount = data.result.playlistCount;
      this.$refs.childrenPlaylist.getAlbumdata(data.result.playlists, '歌单');
    },
    //传用户数据，利用$refs调用子组件函数
    sendUserlist(data) {
      this.songCount = data.result.userprofileCount;
      this.$refs.childrenUserlist.getUserlistdata(data.result.userprofiles);
    },
    //传视频数据，利用$refs调用子组件函数
    sendVideo(data) {
      this.songCount = data.result.videoCount;
      this.$refs.childrenVideo.getMvdata(data.result.videos);
    }
  },
  watch: {
    // 监听路由变化请求数据
    '$route' : function() {
      if(this.$route.path === '/result') {
        this.getData();
      }
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
    .el-tabs {
      .el-tab-pane /deep/ .album {
          &:nth-of-type(1) {
            ul {
              li {
                margin-right: 28.333333px;
              }
            } 
          }
      }
      .el-tab-pane /deep/ .mv {
          &:nth-of-type(1) {
            ul {
              li {
                margin-right: 21px;
                // text-align: center;
              }
            } 
          }
      }
    }
  }
</style>