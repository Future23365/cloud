<template>
  <div class="artist">
    <div class="artistName"><h3>{{artistName}}</h3><span></span></div>
    <img :src="picUrl" alt="">
    <div class="desc">
      <h3>个人简介</h3>
      <p>{{desc.briefDesc}}</p>
      <div class="introduction" v-for="(item, index) in desc.introduction" :key="index">
        <h3>{{item.ti}}</h3>
        <pre>{{item.txt}}</pre>
      </div>
    </div>
    <el-tabs value="hot" type="card" @tab-click="handleClick">
      <el-tab-pane label="热门作品" name="hot"><Single ref="childrenSingle"></Single></el-tab-pane>
      <el-tab-pane label="所有专辑">
        <Album ref="childrenAlbum"></Album>
        <div><button @click="getArtistAlbummore(mvPage += 30)">更多</button></div>
      </el-tab-pane>
      <el-tab-pane label="相关mv">
        <mv ref="childrenMv"></mv>
        <div><button @click="getArtistMvmore(mvPage += 30)">更多</button></div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getArtistdesc, getArtistsongs, getArtistalbum, getArtistmv, getMvdata } from '../request/getdata';
import { timeShow } from '@/common/tool';
import Single from '@/components/Single';
import Mv from '@/components/Mv';
import Album from '@/components/Album'

export default {
  name: 'artist',
  components: {
    Single,
    Mv,
    Album,

  },
  data() {
    return {
      desc: {
        briefDesc: '',
        introduction: [],
      },
      artistName: '',
      picUrl: '',
      hotSongs: [],
      mvPage: 30,
      isHasmore: true,

    }
  },
  methods: {
    
    getArtistdata() {
      getArtistdesc(this.$route.query.artistid).then(res => {
        this.desc.briefDesc = res.briefDesc;
        this.desc.introduction = res.introduction;
      })

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
        // console.log(arr);
        this.$refs.childrenSingle.settableData(arr);
      })

      
    },
    getArtistMvmore(limit = 30) {
      if(!this.isHasmore) {
          this.$message({
            message: '没有更多了呦！',
          });
        }else {
          getArtistmv(this.$route.query.artistid, limit).then(res => {
            console.log(res);
            this.$refs.childrenMv.getMvdata(res.mvs);
            this.isHasmore = res.hasMore;
            console.log(this.mvPage);
        })
      }
      
    },
    getArtistAlbummore(limit = 30) {

      if(!this.isHasmore) {
          this.$message({
            message: '没有更多了呦！',
          });
        }else {
          getArtistalbum(this.$route.query.artistid, limit).then(res => {
            console.log(res);
            this.$refs.childrenAlbum.getAlbumdata(res.hotAlbums);
            this.isHasmore = res.more;
            console.log(this.isHasmore)
            console.log(this.mvPage);
        })
      }
    },
    handleClick(e) {
      console.log(e.label);
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
  mounted() {
    this.getArtistdata();
    // this.getArtistMv();
  },
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
    
  }
  
}
</style>