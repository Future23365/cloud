<template>
  <div class="music">
    <!-- 歌曲信息及歌词 -->
    <div class="s-info">
      <!-- 歌曲信息 -->
      <div class="song-info">
        <!-- 歌曲图片 -->
        <div class="mask">
          <img :src="song.al.picUrl" alt="">
        </div>
        <!-- 歌曲名字歌手专辑 -->
        <div class="info">
          <p class="song-name">{{song.name}}</p>
          <p>歌手：</p>
          <p v-for="(item,index) in song.ar" :key="index" class="song-author"><el-link type="primary" @click="goArtist(item.id)">{{item.name}}</el-link></p>
          <p>专辑：</p>
          <p><el-link type="primary" @click="goAlbum(song.al.id)">{{song.al.name}}</el-link></p>
        </div>
      </div>
      <!-- 歌词 -->
      <div class="lyric" :style="{height: height}" v-loading="loading">
        <ul>
          <div v-show="!hasLyric">纯音乐，请欣赏</div>
          <!-- 一个li包含一句原歌词和一句翻译，先遍历原歌词，在找到原歌词对应翻译的索引 -->
          <li v-for="(item, value, index) in lyric" :key="index" :class="{'whiteActive': progressFlag[setClass(index)]}" ref="qqq">{{item}}<br>{{value in translyric ? translyric[value] : ""}}</li>
        </ul>
      </div>
    </div>
    <!-- 展开关闭歌词按钮 -->
    <el-button icon="el-icon-arrow-down" circle class="showlyric" v-on:click="setheight" :class="{'rota': isactive}"></el-button>
    <!-- 评论 -->
    <div class="comment">
      <Comment ref="childrenComment"></Comment>
    </div>
  </div>
</template>

<script>
import { getsongLyric, getsongDetail } from '@/request/getdata';
import { tochance } from '@/common/tool';
import Comment from '@/components/Comment';
export default {
  name: 'Music',
  props: ['musicTime'], //  从父组件取得歌曲的实时时间
  data() {
    return {
      song: {al: {picUrl: '@/assets.img.logo.png'}}, //存储歌曲信息
      lyric: {},  //存储源歌词信息
      translyric: {}, //存储翻译歌词信息
      isactive: false, //展开按钮的状态
      height: '500px',  //歌词显示框默认高
      loading: true,  //默认显示加载动画标志位
      progressFlag: {}, //存储歌词是否变亮,键为时间，值为true或false
      nowLyric: 0,  //存储现在歌词的位置
      hasLyric: true, //是否有歌词
      lyricSize: 0
    }
  },
  components: {
    Comment,
  },
  methods: {
    // 设置歌词框的高
    setheight() {
      if(!this.isactive) {
        // 如果没有歌词，则设置为默认500px，否则设置高
        this.lyricSize === 0 ? this.height = '500px' : this.height = this.lyricSize + 'px';
        this.isactive = !this.isactive;
      } else {
        this.height = '500px';
        this.isactive = !this.isactive;
      }
      
    },
    //请求歌曲信息
    getsongInf(id) {
      getsongDetail(id).then(res => {
        this.song = res.songs[0];
      })
    },
    // 进一步处理歌词
    stolyric(arr, flag = false) {
      let obj = {};
      // 因为返回的歌词结果是 [时间]歌词 的形式 所以将歌词通过]分开，在判断如果是原歌词，则将时间传入trt函数并将返回的结果当做标记为保存在progressFlag里面
      for(let i = 0; i < arr.length; i++) {
        let a = arr[i].split("]");
        obj[a[0].slice(1)] = a[1];
        if(flag === true) {
          this.progressFlag[this.trt(a[0].slice(1))] = false;
        }
      }
      return obj;
    },
    // 请求获取歌曲歌词
    getlyric() {
      if(this.changeid) {
        getsongLyric(this.$store.state.songid).then(res => {
          this.loading = false;
          this.hasLyric = true;
          this.lyric = {};
          this.translyric = {};
          this.height = '500px';
          this.isactive = false;
          // 如果歌词存在，则根据回车将歌词存如数组里面(每一行就代表几句歌词)，然后请求stolyric进一步处理数组,返回一个对象，这个对象就是时间-歌词的形式
          if('lrc' in res && 'lyric' in res.lrc) {
            this.lyric = this.stolyric(res.lrc.lyric.split('\n'), true);
          }
          if('tlyric' in res && 'lyric' in res.tlyric && res.tlyric.lyric != null) {
            this.translyric = this.stolyric(res.tlyric.lyric.split('\n'));  
          }
          // 如果歌词不存在，则将歌词标记为false
          if((!('lrc' in res && 'lyric' in res.lrc) && !('tlyric' in res && 'lyric' in res.tlyric && res.tlyric.lyric != null)) || ((!!res.lrc === false) && (!!res.tlyric.lyric === false))) {
            this.hasLyric = false;
          }
          // 如果歌词有翻译，则每行25px,否则每行20px,同一句歌词个翻译算作一行
            this.lyricSize = Object.keys(this.lyric).length + Object.keys(this.translyric).length;
            Object.keys(this.translyric).length < 5 ? this.lyricSize = this.lyricSize * 25 : this.lyricSize = this.lyricSize * 20;
        })
      }
    },
    // 当前播放歌词变化重新调用子组件中的请求函数请求评论数据
    sendSongid() {
      let obj = {};
      obj.id = this.changeid;
      obj.target = 'music';
      this.$refs.childrenComment.startRequset(obj);
    },
    // 点击歌手跳转函数
    goArtist(id) {
      this.$router.push({
        path: '/artist',
        query: {
          artistid: id
        }
      })
    },
    // 点击专辑跳转函数
    goAlbum(id) {
      this.$router.push({
        path: "/albumdetail",
        query: {
          albumdetailId: id
        }
      });
    },
    // 实时歌词函数
    updateWhite(time) {
      // 提前0.4秒预留出动画时间
      time = time + 0.400;
      let arr = Object.keys(this.progressFlag);
      //循环找到当前时间的下一句歌词时间，将下一句的前一句标记为true，
      for(let i = 0, len = arr.length; i < len; i++) {
        if(time < arr[i]){
          this.progressFlag[arr[this.nowLyric]] = false;
          this.progressFlag[arr[i -1]] = true;
          this.nowLyric = i - 1;
          this.$forceUpdate();
          return;
        }
      }
    },
    // 取得保存歌词状态， i为遍历的索引，获取对应的true或false值
    setClass(i) {
      return Object.keys(this.progressFlag)[i];
    },
    //将冒号形式的时间转换为.的形式 ,转换过程很鸡肋，待优化！
    trt(t) {
      if(t.split(':') != ''){
        let a = t.split(':');
        let b = []
        try {
          b = a[1].split('.');
        }catch {
          b[1] = ''
        }
        if(b[1]) {
          return `${Number.parseInt(a[0]) * 60 + Number.parseInt(b[0])}.${Number.parseInt(b[1])}`;
        }else if(!b[1]) {
          return `${Number.parseInt(a[0]) * 60 + Number.parseInt(b[0])}.000`;
        }
      }
    }
    
  },
  computed: {
    // 获取当前正在播放的歌曲id
    changeid: function() {
      if(this.$store.state.songid !== 0) {
        return this.$store.state.songid
      }
    },
    
  },
  watch: {
    // 监听歌曲ID是否改变
    changeid: function(){
      this.sendSongid();
      this.getsongInf(this.changeid);
      this.getlyric();
    },
    // 监听歌曲时间，实时显示歌词进度
    musicTime: function() {
      this.updateWhite(this.musicTime);
    }
  },
  mounted() {
    // 初始化调用
    if(this.changeid !== undefined) {
      this.sendSongid();
      this.getsongInf(this.changeid);
      this.getlyric();
    }
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
          div {
            line-height: 440px;
            text-align: center;
          } 
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