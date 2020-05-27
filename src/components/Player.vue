<template>
  <div class="player">
    <div class="w">
      <audio :src="url" ref="myaudio" @timeupdate="updatetime" @durationchange="setdura"></audio>
      <div class="play">
        <button><i class="el-icon-caret-left"></i></button>
        <button @click="puse()"><i :class="{'el-icon-video-play' : !ispuse, 'el-icon-video-pause' : ispuse}"></i></button>
        <button><i class="el-icon-caret-right"></i></button>
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
import iconfom from "../assets/font/iconfont.js"
import { getsongUrl, getsongDetail } from '../request/getdata'
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
    tochance(time) {
      let minute;
      let second;
      if(time >= 60) {
        minute = (time / 60).toFixed(2).split(".")[0];
        minute < 10 ? minute = "0" + minute : minute = minute;
        second= (time - minute * 60).toFixed(0); 
        second < 10 ? second = "0" + second : second = second;
        
      }else {
        minute = "00";
        second = time.toFixed(0);
        second < 10 ? second = "0" + second : second = second;
      }
      return minute + ":" + second;
    }
    ,
    updatetime(e) {
      // console.log(this.$refs.myaudio.currentTime);
      this.value1.value = this.$refs.myaudio.currentTime;
      this.setindex ++;
      if(this.setindex = 4) {
        this.nowtime = this.tochance(this.value1.value);
        this.setindex = 0;
      }
    },
    setdura(e) {
      // console.log(this.$refs.myaudio.duration);
      this.value1.max = this.$refs.myaudio.duration;
      this.alltime = this.tochance(this.value1.max);
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
      obj.name = this.sname;
      obj.url = this.url;
      obj.author = this.author;
      arr.push(obj);
      localStorage.setItem('music', JSON.stringify(arr));
    },
    geturl() {
      getsongUrl(this.updateid).then(res => {
        this.url = res.data[0].url;
      })
    },
    getsongDetial() {
      getsongDetail(this.updateid).then(res => {
        this.sname = res.songs[0].name;
        this.author = [];
        for(let item in res.songs[0].ar) {
          // console.log(res.songs[0].ar[item].name);
          this.author.push(res.songs[0].ar[item].name);
        }
        // console.log('获取歌');
      })
    },
    localSet() {
      setTimeout(function() {
        console.log('成功调用');
        if(localStorage.getItem('music') === [] || localStorage.getItem('music') === null) {
        localStorage.setItem('music', JSON.stringify([]));
        }else {
          let music = JSON.parse(localStorage.getItem('music'));
          console.log(music);
          !!music[0].songname === true ? this.sname = music[0].songname : '';
          !!music[0].songurl === true ? this.url = music[0].songurl : '';
          !!music[0].songaughor === true ? this.author = music[0].songaughor : '';
          !!music[0].songtime === true ? this.$refs.myaudio.currentTime = music[0].songtime : '';
        }
      }, 2000)
      
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
    }
  },
  beforeDestroy() {
    this.savesonginf();
    // alert(this.$store);
  },
 
  mounted() {
    this.geturl();

    

    // console.log(this.$store.state.songtime);
    // console.log(this.$refs.myaudio.currentTime);
  }
}
</script>

<style scoped>

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
  }
  .w {
    height: 100%;
    max-width: 1200px;
    min-width: 800px;
    margin: 0 auto;
    /* background-color: #ccc; */
    display: flex;
    justify-content: space-around;
  }
  .w .play {
    min-width: 150px;
  }
  .w .play button{
    width: 50px;
    height: 50px;
    font-size: 30px;
    border-radius: 50%;
  }
  .w .play button i {
    display: inline-block;
  }
  .w .center {
    /* min-width: 800px; */
    width: 800px;
    height: 50px;
    margin-left: 50px;
    /* background-color: red; */
  }

  .w .menu {
    position: relative;
    min-width: 200px;
    width: 200px;
    height: 50px;
    /* background-color: blue; */
  }
  .w .menu .voice {
    position: absolute;
    top: -100px;
    left: 0;
  }
  .w .center .up {
    height: 20px;
  }
  .w .center .name {
    margin-right: 20px;
  }
  .w .center .up .author {
    color: #000;
    font-size: 19px;
  }
  .w .center .up .author .el-link {
    color: #000;
  }
  .w .center .down {
    width: 100%;
    line-height: 38px;
    height: 38px;
  }
  .w .center .down .down-left{
    float: left;
    /* margin-left: 50px; */
    /* width: 600px; */
    /* height: 30px; */
  }
  .w .center .down .down-right {
    float: left;
  }
  .w .menu svg {
    width: 25px;
    height: 25px;
    margin-top: 12.5px;
    
  }
  .w .menu svg:hover {
    cursor: pointer;
  }
  .menu .pattern {
    width: 25px;
    height: 25px;
    margin-left: 10px;
  }
</style>