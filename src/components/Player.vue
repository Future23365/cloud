<template>
  <div class="player">
    <div class="w">
      <audio :src="url" ref="myaudio" @timeupdate="updatetime" @durationchange="setdura" @ended="nextSong"></audio>
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
      <div class="center">
        <!-- <div class="mask"></div> -->
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
      <div class="menu">
        <svg class="icon" aria-hidden="true" @click="isvoice = !isvoice">
            <use xlink:href="#icon-yinliang"></use>
        </svg>

        <div class="voice" v-show="isvoice">
          <el-slider v-model="value2.volume" vertical height="100px" :max="value2.max" :step="0.1" @input="setvolume"></el-slider>
        </div>

        <svg class="icon pattern" aria-hidden="true">
          <use xlink:href="#icon-xunhuan"></use>
        </svg>

        <div class="el-icon-s-order list" @click="showm"></div>
      </div>
    </div>
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
      ispuse: false,
      songinf: {
        name: 'name',
        author: 'author'
      },
      value1: {
        value: 0,
        max: 100,
        showtooltip: false
      },
      value2: {
        volume: 1,
        max: 1,
        steep: 0.1
      },
      alltime: '00:00',
      nowtime: '00:00',
      isvoice: false,
      url: '',
      sname: '',
      author: [],
      isListshow: false,
      songList: [],
      firstIn: false
    }
  },
  methods: {
    puse() {
      this.ispuse = !this.ispuse;
      this.ispuse ? this.$refs.myaudio.play() : this.$refs.myaudio.pause();
      this.savesonginf();
    },
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
    setdura(e) {
      this.value1.max = this.$refs.myaudio.duration;
      this.alltime = tochance(this.value1.max);
      this.value2.volume = this.$refs.myaudio.volume;
    },
    settime(e) {
      this.$refs.myaudio.currentTime = e;
      this.savesonginf();
    },
    setvolume(e) {
      this.$refs.myaudio.volume = e;
    },
    savesonginf() {
      let arr = [];
      let obj = {};
      obj.songtime = this.$refs.myaudio.currentTime.toFixed(5);
      obj.songid = this.updateid;
      arr.push(obj);
      localStorage.setItem('music', JSON.stringify(arr));
    },
    geturl() {
      let what = this;
      checkMusic(this.updateid).then(res => {
        let that = this;
        if(res.success === true) {
          getsongUrl(this.updateid).then(res => {
            this.url = res.data[0].url;
            if(this.firstIn === false) {
              setTimeout(function() {
                that.puse();
              }, 700)
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
    getsongDetial() {
      getsongDetail(this.updateid).then(res => {
        this.sname = res.songs[0].name;
        this.author = []
        this.author.push(res.songs[0].ar);
      })
    },
    localSet() {
      this.firstIn = true;
      if(localStorage.getItem('music') === [] || localStorage.getItem('music') === null) {
        localStorage.setItem('music', JSON.stringify([]));
      }else {
        let music = JSON.parse(localStorage.getItem('music'));
        let obj = {};
        !!music[0].songid === true ?  obj.id = music[0].songid : '';
        !!music[0].songtime === true ? this.$refs.myaudio.currentTime = music[0].songtime : '';
        this.$store.commit('updateSong', obj)
      }
    },
    showm() {
      this.isListshow = !this.isListshow;
    },
    nextSong() {
      this.songList = this.$store.state.playlist;
      
      for(let i = 0; i < this.songList.length; i++) {
        if((this.songList[i].id === this.$store.state.songid)) {
          if(i === this.songList.length - 1) {
            if(this.songList.length === 1) {
              let va = this.playFlag + 1;
              console.log(va)
              this.$store.commit('updataFlag', va)
              return
            }
            this.$store.commit('updateSong', {'id': this.songList[0].id})
            return 
          }
          this.$store.commit('updateSong', {'id': this.songList[i + 1].id})
          console.log(this.$store.state.songid)
          return 
        }
      }
    },
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
    enterMusic() {
      if(this.$route.path === '/music') {
        Message({
          message: '已经在播放页面啦！',
        });
      }else{
        this.$router.push('/music')
      }
      
    },
    goArtist(id) {
      this.$router.push({
        path: "/artist",
        query: {
          artistid: id
        }
      });
    },
  },
  computed: {
    updateid: function() {
      return this.$store.state.songid;
    },
    playFlag: function() {
      return this.$store.state.flag;
    }
  },
  watch: {
    updateid: function() {
      this.ispuse = false;
      this.geturl();
      this.getsongDetial();
    },
    playFlag: function() {
      this.ispuse = false;
      this.geturl();
      this.getsongDetial();
    }
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