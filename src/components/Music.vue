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
          <p v-for="(item,index) in song.ar" :key="index" class="song-author">{{item.name}}</p>
          <p>专辑：</p>
          <p>{{song.al.name}}</p>
        </div>
      </div>
      <div class="lyric" :style="{height: height}">
        <ul>
          <li v-for="(item, index) in lyric" :key="index">{{item}}<br>{{index in translyric ? translyric[index] : ""}}</li>
        </ul>
      </div>
    </div>
    <el-button icon="el-icon-arrow-down" circle class="showlyric" v-on:click="setheight" :class="{'rota': isactive}"></el-button>
    <div class="comment">
      <Comment :id="$store.state.songid"></Comment>
    </div>
  </div>
</template>

<script>
import server from '../request/request';
import Comment from './Comment'
export default {
  name: 'Music',
  // props: ['musicid'],
  data() {
    return {
      song: {al: {picUrl: '../assets.img.logo.png'}},
      lyric: {},
      translyric: {},
      isactive: false,
      height: '500px',
    }
  },
  components: {
    Comment,
  },
  methods: {
    setheight() {
      if(!this.isactive) {
        let size = Object.keys(this.lyric).length + Object.keys(this.translyric).length;
      size = size * 20;
      this.height = size + 'px';
      // console.log(size);
      // console.log("点击了");
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
        // this.width += this.width + 20;
      }
      return obj;
    },
    getsong() {
      if(this.$store.state.songid) {
        server({
        url: '/song/detail?ids=' + this.$store.state.songid,
        method: 'get'
      }).then(res => {
        this.song = res.songs[0];
        this.$store.state.songauthor = [];
        for(let item in res.songs[0].ar) {
          // console.log(res.songs[0].ar[item].name);
          this.$store.state.songauthor.push(res.songs[0].ar[item].name);
        }
        // console.log(this.$store.state);
      })
      }
    },
    getlyric() {
      if(this.$store.state.songid) {
        server({
          url: '/lyric?id=' + this.$store.state.songid,
          method: 'get'
        }).then(res => {
          // console.log("歌词:");
          // console.log(res);
          // this.width = 500;
          this.lyric = this.stolyric(res.lrc.lyric.split('\n'));
          this.translyric = this.stolyric(res.tlyric.lyric.split('\n'));         
        })
      }
    },
    
  },
  mounted() {
    this.getsong();
    this.getlyric();
  }
}
</script>

<style lang="scss" scoped>
  * {
    margin: 0;
    padding: 0;
  }
  li {
    list-style: none;

  }
  .music {
    // max-width: 980px;
    width: 640px;
    // height: 960px;
    margin: 0 auto;
    background-color: #ccc;
    padding-top: 80px;
    padding-left: 80px;
    padding-right: 80px;
    // overflow: hidden;
    .s-info {
      width: 640px;
      // height: 500px;
      background-color: #666;
      overflow: hidden;
      .song-info {
        float: left;
        position: relative;
        width: 200px;
        height: 500px;
        background: #ffc20e;
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
          background-color: #d3d7d4;
          font-size: 10px;
          overflow: hidden;
          transition: height 3s ;
          ul {
            padding: 0 30px;
            
            li {
              margin-bottom: 8px;
              text-align: center;
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

  
</style>