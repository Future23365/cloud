<template>
  <div class="player">
    <div class="w">
      <!-- 播放器 -->
      <audio :src="url" ref="myaudio" @timeupdate="updatetime" @durationchange="setdura" @ended="nextSong"></audio>
      <!-- 上一曲、播放暂停、下一曲，三个按钮 -->
      <div class="play">
        <div class="left" @click="lastSong()">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-previous-1"></use>
          </svg>
        </div>
        <div class="isplay" @click="puse()"><i :class="{'el-icon-video-play' : !ispuse, 'el-icon-video-pause' : ispuse}"></i></div>
        <div class="right" @click="nextSong()">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-next-1"></use>
          </svg>
        </div>
      </div>
      <!-- 中间进度条部分 -->
      <div class="center">
        <div class="up">
          <span class="name" @click="enterMusic()" title="回到播放界面">{{sname}}</span>
          <span class="author" v-for="(item,index) in author[0]" :key="index" style="font-size: 10px;" ><el-link :underline="false" @click="goArtist(item.id)">{{item.name}}</el-link></span> 
        </div>
        <div class="down">
          <div class="down-left"><el-slider v-model="value1.value" :show-tooltip="value1.showtooltip" style="max-width: 600px; min-width: 400px; height: 30px;" :max="value1.max" @change="settime" input-size="small"></el-slider></div>
          <div class="down-right">
            <span>{{nowtime}}</span>
            <span>/{{alltime}}</span>
          </div>
        </div>
      </div>
      <!-- 右边声音、播放列表、按钮 -->
      <div class="menu">
        <svg class="icon" aria-hidden="true" @click="isvoice = !isvoice">
            <use xlink:href="#icon-yinliang"></use>
        </svg>
        <div class="voice" v-show="isvoice">
          <el-slider v-model="value2.volume" vertical height="100px" :max="value2.max" :step="0.1" @input="setvolume"></el-slider>
        </div>
        <svg class="icon pattern" aria-hidden="true" @click="setModel">
          <use :xlink:href="playmodelicon"></use>
        </svg>
        <div class="el-icon-s-order list" @click="showm"></div>
      </div>
    </div>
    <!-- 播放列表显示，利用vue过渡效果 -->
    <transition name="fade">
      <div class="showlist" v-show="isListshow">
        <Musiclist ></Musiclist>
      </div>
    </transition>
    
  </div>

</template>

<script>
import iconfom from "@/assets/font/iconfont.js";
import { getsongUrl, getsongDetail, checkMusic } from '@/request/getdata';
import { tochance } from '@/common/tool';
import Musiclist from '@/components/Musiclist';
import { Message } from 'element-ui';

export default {
  name: 'Plalyer',
  components: {
    Musiclist
  },
  data() {
    return {
      //播放标记位
      ispuse: false,
      //初始歌名和作者
      songinf: {
        name: 'name',
        author: 'author'
      },
      //进度条参数
      value1: {
        value: 0,
        max: 100,
        showtooltip: false
      },
      //声音参数
      value2: {
        volume: 1,
        max: 1,
        steep: 0.1
      },
      alltime: '00:00', //总时间
      nowtime: '00:00', //当前时间
      isvoice: false, //声音显示标记为
      url: '',  //存储播放地址
      sname: '', //默认歌曲名
      author: [], //默认歌手名
      isListshow: false,  //播放列表显示标记位
      songList: [], //存歌曲
      firstIn: false, //是否是第一次进入
      setindex: 0, //更新进度标志位
      musicModel: 'allLoop'
    }
  },
  methods: {
    //播放暂停函数
    puse() {
      this.ispuse = !this.ispuse;
      this.ispuse && this.url !== '' ? this.$refs.myaudio.play() : this.$refs.myaudio.pause();
      this.savesonginf();
    },
    //更新播放时间
    updatetime(e) {
      this.value1.value = this.$refs.myaudio.currentTime;
      this.setindex ++;
      this.$emit('updateCome', this.$refs.myaudio.currentTime)
      if(this.setindex = 4) {
        this.nowtime = tochance(this.value1.value);
        this.setindex = 0;
        this.savesonginf()
      }
    },
    //音频加载完成之后设置总时长
    setdura(e) {
      this.value1.max = this.$refs.myaudio.duration;
      this.alltime = tochance(this.value1.max);
      this.value2.volume = this.$refs.myaudio.volume;
    },
    //点击进度条设置时间事件
    settime(e) {
      this.$refs.myaudio.currentTime = e;
      this.savesonginf();
    },
    // 设置声音事件
    setvolume(e) {
      this.$refs.myaudio.volume = e;
    },
    //保存歌曲状态到本地
    savesonginf() {
      let arr = [];
      let obj = {};
      obj.songtime = this.$refs.myaudio.currentTime.toFixed(5);
      obj.songid = this.updateid;
      obj.playmodel = this.musicModel
      arr.push(obj);
      localStorage.setItem('music', JSON.stringify(arr));
    },
    // 获取音频url
    geturl() {
      let what = this;
      //检查歌曲是否可以播放
      checkMusic(this.updateid).then(res => {
        let that = this;
        //如果可以播放则请求url
        if(res.success === true) {
          getsongUrl(this.updateid).then(res => {
            this.url = res.data[0].url;
            if(this.firstIn === false) {
              setTimeout(function() {
                that.puse();
              }, 1000)
            }
          })
        }else {
          Message({
          message: '此歌曲暂时无法播放',
        });
        }
      }, reject => {
        Message({
          message: '此歌曲暂时无法播放！',
        });
      })
      setTimeout(function() {
        what.firstIn = false;
      }, 900)
    },
    // 请求歌曲信息
    getsongDetial() {
      getsongDetail(this.updateid).then(res => {
        this.sname = res.songs[0].name;
        this.author = [];
        this.author.push(res.songs[0].ar);
      })
    },
    // 保存本地
    localSet() {
      if(localStorage.getItem('music') === [] || localStorage.getItem('music') === null) {
        localStorage.setItem('music', JSON.stringify([]));
      }else {
        let music = JSON.parse(localStorage.getItem('music'));
        if(music.length !== 0) {
          let obj = {};
          !!music[0].songid === true ?  obj.id = music[0].songid : '';
          !!music[0].songtime === true ? this.$refs.myaudio.currentTime = music[0].songtime : '';
          !!music[0].playmodel === true ? this.musicModel = music[0].playmodel : '';
          this.$store.commit('updateSong', obj);
          this.firstIn = true;
        } else {
          Message({
          message: '点首歌曲试试效果！',
          type: 'warning',
        });
        }
      }
    },
    // 显示、隐藏播放列表
    showm() {
      this.isListshow = !this.isListshow;
    },
    // 下一曲事件
    nextSong() {
      // 获取播放列表
      this.songList = this.$store.state.playlist;
      //歌单循环
      if(this.musicModel === 'allLoop') {
        // 循环找出当前的歌曲，获取下一曲，这方法属实有点鸡肋@_@
        for(let i = 0; i < this.songList.length; i++) {
          if((this.songList[i].id === this.$store.state.songid)) {
            // 如果是最后一首，则播放第一首
            if(i === this.songList.length - 1) {
              this.$store.commit('updateSong', {'id': this.songList[0].id})
              return 
            }
            // 将歌曲列表的下一曲提交到vuex
            this.$store.commit('updateSong', {'id': this.songList[i + 1].id})
            return 
          }
        }
      } else if(this.musicModel === 'randomplay') {
        let random = Math.floor(Math.random() * this.songList.length);
        if(this.songList[random].id === this.$store.state.songid) {
          this.nextSong()
        } else {
          this.$store.commit('updateSong', {'id': this.songList[random].id});
        }
      }
      
    },
    // 上一曲事件
    lastSong() {
      this.songList = this.$store.state.playlist;
      for(let i = 0; i < this.songList.length; i++) {
        if((this.songList[i].id === this.$store.state.songid)) {
          if(i === 0) {
            this.$store.commit('updateSong', {'id': this.songList[this.songList.length - 1].id})
            return
          }
          this.$store.commit('updateSong', {'id': this.songList[i - 1].id})
          return 
        }
      }
    },
    // 点击歌曲名进入详情页
    enterMusic() {
      if(this.$route.path === '/music') {
        Message({
          message: '已经在播放页面啦！',
        });
      }else{
        this.$router.push('/music')
      }
      
    },
    //点击歌手进入歌手详情
    goArtist(id) {
      if(this.$route.path === '/artist' && this.$route.query.artistid === id) {
        Message({
          message: '已经在歌手页面啦！',
        });
      } else {
        this.$router.push({
          path: "/artist",
          query: {
            artistid: id
          }
        });
      }
    },
    setModel() {
      console.log(this.musicModel)
      if(this.musicModel === 'allLoop') {
        this.musicModel = 'randomplay';
      }else if(this.musicModel === 'randomplay') {
        this.musicModel = 'allLoop';
      }
      this.savesonginf()
      // Message({
      //     message: '暂时还没有弄这个功能哦~_~',
      //   });
    }
  },
  computed: {
    //vuex中的正在播放的音乐
    updateid: function() {
      return this.$store.state.songid;
    },
    //返回播放模式图标
    playmodelicon: function() {
      let key_value = {
        allLoop: '#icon-xunhuan',
        randomplay: '#icon-suiji',
      }
      return key_value[this.musicModel]
    }
  },
  watch: {
    // 监听vuex歌曲id变化触发事件，重新获取url及歌曲信息
    updateid: function() {
      this.ispuse = false;
      this.geturl();
      this.getsongDetial();
    },
  },
  mounted() {
    this.localSet();
  }
}
</script>

<style lang="scss" scoped>

  .player {
    position: sticky;
    width: 100%;
    min-width: 800px;
    height: 50px;
    background-color: #67C23A;
    color: #fff;
    right: 0px;
    bottom: 0px;
    margin-top: 20px;
    z-index: 9999999;
    .w {
      height: 100%;
      max-width: 1200px;
      min-width: 800px;
      margin: 0 auto;
      display: flex;
      justify-content: space-around;
      .play {
        min-width: 100px;
        svg {
            color: #fff;
            transition: color .5s;
            &:hover {
              color: #f47920;
            }
          }
        .left {
          float: left;
          font-size: 20px;
          line-height: 50px;
          color: #fff;
          &:hover {
            cursor: pointer;
            
          }
        }
        .isplay {
          float: left;
          font-size: 40px;
          line-height: 50px;
          margin: 0 10px;
          i {
            transition: color .5s;
            &:hover {
              color: #f47920;
            }
          }
          &:hover {
            cursor: pointer;
          }
        }
        .right {
          float: left;
          font-size: 20px;
          line-height: 50px;
          color: #fff;
          &:hover {
            cursor: pointer;
          }
        }        
      }
      .center {
        width: 800px;
        height: 50px;
        margin-left: 30px;
        .up {
          height: 20px;
          .name {
            &:hover {
              cursor: pointer;
            }
          }
          .author {
            font-size: 19px;
            .el-link {
              margin-right: 5px;
              &:hover {
                color: #000;
              }
            }
          }
        }
        .name {
          margin-right: 20px;
        }
      }
      .down {
        width: 100%;
        line-height: 38px;
        height: 30px;
        .down-left{
          float: left;
          & /deep/ .el-slider {
            .el-slider__runway {
              margin: 9px 0 0 0;
            }
          }
        }
        .down-right {
          height: 30px;
          margin-top: -5px;
          margin-left: 10px;
          float: left;
        }
      }
      .menu {
        position: relative;
        min-width: 200px;
        width: 200px;
        height: 50px;
        /* background-color: blue; */
        .voice {
          position: absolute;
          top: -100px;
          left: 0;
          transition: color .5s;
          &:hover {
              color: #f47920;
          }
        }
        svg {
          width: 25px;
          height: 25px;
          margin-top: 12.5px;
          transition: color .5s;
          &:hover {
            cursor: pointer;
            color: #f47920;
          }
        }
        .pattern {
          width: 25px;
          height: 25px;
          margin-left: 10px;
        }
        .list {
          width: 25px;
          height: 25px;
          font-size: 25px;
          margin-left: 10px;
          &:hover {
            cursor: pointer;
            color: #f47920;
          }
        }
      }
    }
    .showlist {
      width: 800px;
      height: 300px; 
      position: absolute;
      // margin: 0 auto;
      margin-left: -400px;
      left: 50%;
      background-color: #afb4db;
      color: #fffef9;
      // opacity: .94;
      bottom: 50px;
      overflow: auto;
      border-radius: 10px;
    }
  }
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;

}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>