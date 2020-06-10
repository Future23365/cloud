<template>
  <div class="music">
    <div class="s-info">
      <div class="song-info">
        <div class="mask">
          <img :src="song.al.picUrl" alt="">
        </div>
        <div class="info">
          <p class="song-name">{{song.name}}</p>
          <p>歌手：</p>
          <p v-for="(item,index) in song.ar" :key="index" class="song-author"><el-link type="primary" @click="goArtist(item.id)">{{item.name}}</el-link></p>
          <p>专辑：</p>
          <p><el-link type="primary" @click="goAlbum(song.al.id)">{{song.al.name}}</el-link></p>
        </div>
      </div>
      <div class="lyric" :style="{height: height}" v-loading="loading">
        <ul>
          <li v-for="(item, value, index) in lyric" :key="index" :class="{'whiteActive': progressFlag[setClass(index)]}"  @click="aaa(index)" ref="qqq">{{item}}<br>{{value in translyric ? translyric[value] : ""}}</li>
        </ul>
      </div>
    </div>
    <el-button icon="el-icon-arrow-down" circle class="showlyric" v-on:click="setheight" :class="{'rota': isactive}"></el-button>
    <div class="comment">
      <Comment ref="childrenComment"></Comment>
    </div>
  </div>
</template>

<script>
import { getsongLyric, getsongDetail } from '@/request/getdata';
import { tochance } from '@/common/tool'
import Comment from '@/components/Comment'
export default {
  name: 'Music',
  props: ['musicTime'],
  data() {
    return {
      song: {al: {picUrl: '@/assets.img.logo.png'}},
      lyric: {},
      translyric: {},
      isactive: false,
      height: '500px',
      loading: true,
      setRequestTo: {},
      progressFlag: {},
      lyricFlag: 0,
      lyricFlagindex: 0,

    }
  },
  components: {
    Comment,
  },
  methods: {
    setheight() {
      if(!this.isactive) {
        let size = Object.keys(this.lyric).length + Object.keys(this.translyric).length;
        Object.keys(this.translyric).length < 5 ? size = size * 25 : size = size * 20; 
        
        this.height = size + 'px';
        this.isactive = !this.isactive;
      } else {
        this.height = '500px';
        this.isactive = !this.isactive;
      }
      
    },
    stolyric(arr) {
      let obj = {};
      for(let i = 0; i < arr.length; i++) {
        let a = arr[i].split("]");
        obj[a[0]] = a[1];
        this.progressFlag[this.trt(a[0].slice(1))] = false;
      }
      return obj;
    },
    getsong() {
      if(this.changeid) {
        getsongDetail(this.$store.state.songid).then(res => {
        this.song = res.songs[0];
      })
      }
    },
    getlyric() {
      if(this.changeid) {
        getsongLyric(this.$store.state.songid).then(res => {
          // console.log(res);
          this.loading = false;
          if('lrc' in res && 'lyric' in res.lrc) {
            this.lyric = this.stolyric(res.lrc.lyric.split('\n'));
          }
          if('tlyric' in res && 'lyric' in res.tlyric && res.tlyric.lyric != null) {
            this.translyric = this.stolyric(res.tlyric.lyric.split('\n'));  
          }
          
        })
      }
    },
    sendSongid() {
      let obj = {};
      obj.id = this.changeid;
      obj.target = 'music';
      this.$refs.childrenComment.startRequset(obj);
    },
    goArtist(id) {
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
    aaa(i) {
      this.progressFlag[Object.keys(this.progressFlag)[i]] = !this.progressFlag[Object.keys(this.progressFlag)[i]];
      this.$forceUpdate();
    },
    updateWhite(time) {
      // let to = ''
      for(let i = 0; i < Object.keys(this.progressFlag).length; i++) {
        if(time < Object.keys(this.progressFlag)[i]){
          this.progressFlag[Object.keys(this.progressFlag)[i -2]] = false;
          this.progressFlag[Object.keys(this.progressFlag)[i -1]] = true;
          this.$forceUpdate();
          return;
        }
      }

    },
    setClass(i) {
      return Object.keys(this.progressFlag)[i];
    },
    trt(t) {
      if(t.split(':') != ''){
      let a = t.split(':');
      let b = a[1].split('.');
      let c = `${Number.parseInt(a[0]) * 60 + Number.parseInt(b[0])}.${Number.parseInt(b[1])}`;
      return c;
      }
      
    }
    
  },
  computed: {
    changeid: function() {
      return this.$store.state.songid
    }
  },
  watch: {
    changeid: function(){
      this.sendSongid();
      this.getsong();
      this.getlyric();
    },
    musicTime: function() {
      this.updateWhite(this.musicTime);
    }
  },
  mounted() {
    this.sendSongid();
    this.getsong();
    this.getlyric();
    
  }
}
</script>

<style lang="scss" scoped>

  
  .music {
    // max-width: 980px;
    width: 640px;
    // height: 960px;
    margin: 0 auto;
    background-color: #fff;
    padding-top: 80px;
    padding-left: 80px;
    padding-right: 80px;
    // overflow: hidden;
    border: 1px solid #ccc;
    .s-info {
      width: 640px;
      // height: 500px;
      // background-color: #666;
      overflow: hidden;
      .song-info {
        float: left;
        position: relative;
        width: 200px;
        height: 500px;
        // background: #ffc20e;
        .mask {
          width: 200px;
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: url(../assets/img/singlecover.png) no-repeat -2.5px -2.5px;
          img {
            width: 135px;
            border-radius: 50%;
            animation: rotateimg 15s linear infinite;
            &:hover {
              animation-play-state: paused;
            }
            @keyframes rotateimg {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          }
        }
        .info {
          p{
            text-align: center;
            font-size: 10px;
            &:nth-child(2n) {
              color: #999;
              margin-top: 10px;
            }
          }
          .song-name {
            font-size: 20px;
          }
        }
        
        
      }
      .lyric {
          float: right;
          width: 440px;
          height: 500px;
          // background-color: #d3d7d4;
          font-size: 12px;
          overflow: hidden;
          color: #333;
          transition: height 3s ;
          ul {
            padding: 0 30px;
            
            li {
              margin-bottom: 8px;
              text-align: center;
              transition: color 1s;
            }
          }
          
        }
    }
    .rota {
      transform: rotate(180deg);
    }
    .showlyric {
      margin-left: 401px;
    }
    
    .comment {
      // height: 500px;
      width: 640px;

    }
  }
  .whiteActive {
    color: orange;
  }

  
</style>