<template>
  <div class="player">
    <div class="w">
      <audio :src="url" ref="myaudio" @timeupdate="updatetime" @durationchange="setdura"></audio>
      <div class="play">
        <div class="left">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-previous-1"></use>
          </svg>
        </div>
        <div class="isplay" @click="puse()"><i :class="{'el-icon-video-play' : !ispuse, 'el-icon-video-pause' : ispuse}"></i></div>
        <div class="right">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-next-1"></use>
          </svg>
        </div>
      </div>
      <div class="center">
        <!-- <div class="mask"></div> -->
          <div class="up">
            <span class="name">{{sname}}</span>
            <span class="author" v-for="(item,index) in author" :key="index" style="font-size: 10px;" >/<el-link type="primary" :underline="false">{{item}}</el-link></span> 
          </div>
          <div class="down">
            <div class="down-left"><el-slider v-model="value1.value" :show-tooltip="value1.showtooltip" style="max-width: 600px; min-width: 400px;" :max="value1.max" @change="settime"></el-slider></div>
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

      </div>
    </div>
  </div>

</template>

<script>
import iconfom from "@/assets/font/iconfont.js"
import { getsongUrl, getsongDetail } from '@/request/getdata'
import { tochance } from '@/common/tool'

export default {
  name: 'Plalyer',
  // props: ['seturl'],
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
    }
  },
  methods: {
    puse() {
      this.ispuse = !this.ispuse;
      this.ispuse ? this.$refs.myaudio.play() : this.$refs.myaudio.pause();
      this.savesonginf();
      // this.$refs.myaudio.play();
    },
    
    updatetime(e) {
      // console.log(this.$refs.myaudio.currentTime);
      this.value1.value = this.$refs.myaudio.currentTime;
      this.setindex ++;
      this.$emit('updateCome', this.$refs.myaudio.currentTime)
      // console.log(this.$refs.myaudio.currentTime);
      if(this.setindex = 4) {
        this.nowtime = tochance(this.value1.value);
        this.setindex = 0;
      }
    },
    setdura(e) {
      // console.log(this.$refs.myaudio.duration);
      this.value1.max = this.$refs.myaudio.duration;
      this.alltime = tochance(this.value1.max);
      this.value2.volume = this.$refs.myaudio.volume;
    },
    settime(e) {
      this.$refs.myaudio.currentTime = e;
    },
    setvolume(e) {
      this.$refs.myaudio.volume = e;
    },
    savesonginf() {
      // let arr = JSON.parse(localStorage.getItem('music'));
      let arr = [];
      // localStorage.setItem('music', JSON.stringify(arr));
      // console.log(arr);
      let obj = {};
      obj.songtime = this.$refs.myaudio.currentTime.toFixed(5);
      obj.songid = this.updateid;
      arr.push(obj);
      localStorage.setItem('music', JSON.stringify(arr));
    },
    geturl() {
      getsongUrl(this.updateid).then(res => {
        this.url = res.data[0].url;
        console.log(res);
      })
    },
    getsongDetial() {
      getsongDetail(this.updateid).then(res => {
        this.sname = res.songs[0].name;
        this.author = [];
        for(let item in res.songs[0].ar) {
          this.author.push(res.songs[0].ar[item].name);
        }
        // console.log('获取歌');
      })
    },
    localSet() {
      if(localStorage.getItem('music') === [] || localStorage.getItem('music') === null) {
      localStorage.setItem('music', JSON.stringify([]));
      }else {
        let music = JSON.parse(localStorage.getItem('music'));
        let obj = {};
        !!music[0].songid === true ?  obj.id = music[0].songid : '';
        this.$store.commit('updateSong', obj)
        !!music[0].songtime === true ? this.$refs.myaudio.currentTime = music[0].songtime : '';
      }
      
      
  },
  },
  computed: {
    updateid: function() {
      return this.$store.state.songid;
    }
  },
  watch: {
    updateid: function() {
      this.geturl();
      this.getsongDetial();
      this.ispuse = false;
    }
  },
  beforeDestroy() {
    // this.savesonginf();
    // alert(this.$store);
  },
 
  mounted() {
    this.geturl();

    

    // console.log(this.$store.state.songtime);
    // console.log(this.$refs.myaudio.currentTime);
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
      /* background-color: #ccc; */
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
        /* min-width: 800px; */
        width: 800px;
        height: 50px;
        margin-left: 30px;
        /* background-color: red; */
        .up {
          height: 20px;
          .author {
            color: #000;
            font-size: 19px;
            .el-link {
              color: #000;
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
        height: 38px;
        .down-left{
          float: left;
          /* margin-left: 50px; */
          /* width: 600px; */
          /* height: 30px; */
        }
        .down-right {
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
        }
        svg {
          width: 25px;
          height: 25px;
          margin-top: 12.5px;
          &:hover {
            cursor: pointer;
          }
        }
        .pattern {
          width: 25px;
          height: 25px;
          margin-left: 10px;
        }
      }
    }
  }

</style>