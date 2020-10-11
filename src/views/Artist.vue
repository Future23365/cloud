<template>
  <div class="artist">
    <!-- 歌手名 -->
    <div class="artistName"><h3>{{artistName}}</h3><span></span></div>
    <!-- 歌手照片 -->
    <img :src="picUrl" alt="">
    <!-- 歌手简及描述介 -->
    <div class="desc">
      <h3>个人简介</h3>
      <p>{{desc.briefDesc}}</p>
      <div class="introduction" v-for="(item, index) in desc.introduction" :key="index">
        <h3>{{item.ti}}</h3>
        <pre>{{item.txt}}</pre>
      </div>
    </div>
    //歌手单曲、专辑、及mv
    <el-tabs value="hot" type="card" @tab-click="handleClick">
      <el-tab-pane label="热门作品" name="hot"><Single ref="childrenSingle"></Single></el-tab-pane>
      <el-tab-pane label="所有专辑">
        <Album ref="childrenAlbum"></Album>
        <div v-show="isHasmore" ><button @click="getArtistAlbummore(mvPage += 30)" class="requestMore">获取更多</button></div>
      </el-tab-pane>
      <el-tab-pane label="相关mv">
        <Mv ref="childrenMv"></Mv>
        <div v-show="isHasmore" ><button @click="getArtistMvmore(mvPage += 30)" class="requestMore">获取更多</button></div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getArtistdesc, getArtistsongs, getArtistalbum, getArtistmv, getMvdata } from '../request/getdata';
import { timeShow } from '@/common/tool';
import Single from '@/components/Single';
import Mv from '@/components/Mv';
import Album from '@/components/Album';

export default {
  name: 'artist',
  components: {
    Single,
    Mv,
    Album,
  },
  data() {
    return {
      desc: { //描述的默认数据
        briefDesc: '',
        introduction: [],
      },
      artistName: '', //歌手名字
      picUrl: '', //歌手照片
      hotSongs: [], //热门歌曲
      mvPage: 30, //默认翻页数量
      isHasmore: true,  //专辑和mv更多请求标记位
    }
  },
  methods: {
    // 请求歌手数据
    getArtistdata() {
      // 请求歌手描述
      getArtistdesc(this.$route.query.artistid).then(res => {
        this.desc.briefDesc = res.briefDesc;
        this.desc.introduction = res.introduction;
      })
      // 请求各自单曲
      getArtistsongs(this.$route.query.artistid).then(res => {
        this.artistName = res.artist.name;
        this.picUrl = res.artist.picUrl;
        this.hotSongs = res.hotSongs;
        let arr = [];
        for(let i = 0; i < res.hotSongs.length; i++) {
          let obj = {};
          obj.songId = res.hotSongs[i].id;
          obj.songName = res.hotSongs[i].name;
          obj.songAuthor = {};
          for(let j = 0; j < res.hotSongs[i].ar.length; j++) {
            obj.songAuthor[res.hotSongs[i].ar[j].id] = res.hotSongs[i].ar[j].name;
          }
          obj.songAlbum = `《${res.hotSongs[i].al.name}》`;
          obj.songAlbumId = res.hotSongs[i].al.id;
          obj.songTime = timeShow(res.hotSongs[i].dt / 1000);
          arr.push(obj);
        }
        // 单曲利用single组件显示
        this.$refs.childrenSingle.settableData(arr);
      })
    },
    // 请求歌手mv数据
    getArtistMvmore(limit = 30) {
      getArtistmv(this.$route.query.artistid, limit).then(res => {
        this.$refs.childrenMv.getMvdata(res.mvs);
        this.isHasmore = res.hasMore;
      })
    },
    // 请求歌曲专辑数据
    getArtistAlbummore(limit = 30) {
      getArtistalbum(this.$route.query.artistid, limit).then(res => {
        this.$refs.childrenAlbum.getAlbumdata(res.hotAlbums);
        this.isHasmore = res.more;
      })
    },
    // 获取更多按钮
    handleClick(e) {
      this.mvPage = 30;
      this.isHasmore = true;
      switch(e.label) {
        case '相关mv':
          this.getArtistMvmore();
          break;
        case '所有专辑':
          this.getArtistAlbummore();
          break;
      }
    },
  },
  // 默认请求歌手数据
  mounted() {
    this.getArtistdata();
  },
  // 监听路由变化实时更新显示
  watch: {
    '$route': function() {
      this.getArtistdata();
    }
  }
}
</script>

<style lang="scss" scoped>
.artist {
  max-width: 1120px;
  min-width: 720px;
  margin: 0 auto;
  padding: 40px;
  .artistName {
    font-size: 20px;
    h3 {
      font-weight: normal;
    }
  }
  img {
    width: 640px;
    height: 300px;
    // margin: 0 ;
    object-fit: cover;
  }
  .desc {
    h3 {
      font-size: 18px;
      margin: 28px 0 8px 0;
    }
    p, pre {
      font-size: 14px;
      color: #666;
      white-space: pre-wrap;
      // font-weight: normal;
    }
  }
  .el-tabs {
    margin-top: 28px;
    .el-tab-pane div:last-child {
      text-align: right;
    }
    .requestMore {
      outline: none;
      border: none;
      &:hover {
        cursor: pointer;
        color: #67C23A;
      }
    }
  }
  
}
</style>