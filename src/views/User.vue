<template>
  <div class="user" >
    <div class="userInf" v-bind:style="{background: bgcURl}">
      <img :src="userData.profile.avatarUrl" alt="">
      <div class="name">
        <div class="name-inf">
          <div class="name-head">
            <span>{{userData.profile.nickname}}</span>
            <span>Lv.{{userData.level}}</span>
            <span>
              <svg class="icon" aria-hidden="true">
                <use v-bind:xlink:href='gender[userData.profile.gender]'></use>
              </svg>
            </span>
          </div>
          <div class="at"><span v-for="(item, index) in userData.profile.allAuthTypes" :key="index">{{item.desc}}</span></div>
          <div class="tab">
            <span>
              <p>{{userData.profile.eventCount}}</p>
              <p>动态</p>
            </span>
            <span>
              <p>{{userData.profile.follows}}</p>
              <p>关注</p>
            </span>
            <span>
              <p>{{userData.profile.followeds}}</p>
              <p>粉丝</p>
            </span>
          </div>
          <p class="person"><span>个人介绍:  </span>{{userData.profile.signature}}</p>
        </div>
        <div class="data"></div>
        <div class="base"></div>
      </div>
    </div>
    <div class="listenrecord">
      <div class="menu">
        <h3>听歌排行</h3>
        <span >
          <span :class=" isWeek === true ? 'sc' : ''" @click="setWeek('week')">最近一周</span>|<span :class=" isWeek === false ? 'sc' : ''" @click="setWeek('all')">所有时间</span>
        </span>
      </div>
      <div class="recond">
        <ul>
          <li v-for="(item, index) in record" :key="index">
            <span class="one">{{index + 1}}.</span>
            <span class="two" @click="goMusic(item.song.id)">{{item.song.name}}</span>
            -<span v-for="(jtem, jndex) in item.song.ar" :key="jndex" class="three" @click="goAlbum(jtem.id)">{{jtem.name}}</span>
            <Musicmenu :musicid="item.song.id" :musicName="item.song.name"></Musicmenu>
            <span class="four"><div :style="{'width': item.score + 'px'}"></div></span>
          </li>
        </ul>
      </div>
    </div>
    <div class="userlist">
        <h3>{{userData.profile.nickname}}创建的歌单</h3>
        <Album ref="childrenSonglist1"></Album>
        <div v-show="isHasmore"><button @click="getSonglistmore(songlistPage += 29)">更多</button></div>
        <h3>{{userData.profile.nickname}}收藏的歌单</h3>
        <Album ref="childrenSonglist2"></Album>
        <!-- <div><button @click="getSonglistmore(2, songlistPage += 29)">更多</button></div> -->
    </div>
  </div>
</template>

<script>
import { getUserData, getUserplaylist, getUserRecord, getsongDetail } from '@/request/getdata';
import Album from '@/components/Album';
import Musicmenu from '@/components/Musicmenu'

export default {
  name: 'user',
  components: {
    Album,
    Musicmenu
  },
  data() {
    return {
      userData: {profile: {avatarUrl: ''}},
      gender: ['','#icon-nan', '#icon-nv'],
      songlistPage: 30,
      isHasmore: true,
      record: [],
      isWeek: true,
      ownPlaylist : [],
      collectionPlaylist : [],
    }
  },
  methods: {
    requsetUserdata(limit) {
      getUserData(this.$route.query.userId).then(res => {
        console.log(res);
        this.userData = res;
        this.$forceUpdate(); 
        // console.log(res);
      })
      this.getplayList(limit);
      getUserRecord(this.$route.query.userId, 1).then(res => {
        console.log(res);
        this.record = res.weekData;
      })
    },
    getplayList(limit) {
      getUserplaylist(this.$route.query.userId, limit).then(res => {
        // console.log(res);
        
        for(let i = 0; i < res.playlist.length; i++) {
          console.log(this.$route.query.userId)
          if(res.playlist[i].userId === Number.parseInt(this.$route.query.userId)) {
            this.ownPlaylist.push(res.playlist[i])
          }else {
            this.collectionPlaylist.push(res.playlist[i])
          }
        }
        this.isHasmore = res.more;
        // console.log(ownPlaylist);
        // console.log(collectionPlaylist)
        this.$refs.childrenSonglist1.getAlbumdata(this.ownPlaylist, "歌单");
        this.$refs.childrenSonglist2.getAlbumdata(this.collectionPlaylist, "歌单");
      })
    },
    getSonglistmore(limit) {
      this.getplayList(limit);
    },
    setWeek(type) {
      if(type === 'week' && this.isWeek === false) {
        this.isWeek = true;
        getUserRecord(this.$route.query.userId, 1).then(res => {
        console.log(res);
        this.record = res.weekData;
      })
        console.log(this.isWeek);
      } else if(type === 'all' && this.isWeek === true) {
        this.isWeek = false;
        getUserRecord(this.$route.query.userId, 0).then(res => {
        console.log(res);
        this.record = res.allData;
      })
        console.log(this.isWeek);
      }
    },
    goMusic(id) {
      // console.log(id);
      let s = {};
      s.id = id;

      getsongDetail(id).then(res => {
        this.song = res.songs[0];
        let obj = {};
        obj.id = res.songs[0].id;
        obj.name = res.songs[0].name;
        let arr = [];
        for(let i = 0; i < res.songs[0].ar.length; i++) {
          let o = {};
          o[res.songs[0].ar[i].name] = res.songs[0].ar[i].id;
          arr.push(o);
        }
        obj.ar = arr;
        obj.al = res.songs[0].al.name;
        obj.alId = res.songs[0].al.id;
        obj.time = res.songs[0].dt;
        console.log(obj);
        this.$store.commit('updatePlaylist', obj);
      })
      this.$store.commit('updateSong', s);
      this.$router.push('/music');
    },
    goAlbum(id) {
      console.log(id);
      this.$router.push({
          path: "/artist",
          query: {
            artistid: id
          }
        });
    }
  },
  mounted() {
    this.requsetUserdata(this.songlistPage);
  },
  computed: {
    bgcURl: function() {
      return `url(${this.userData.profile.backgroundUrl}) no-repeat`
    }
  },
}
</script>

<style lang="scss" scoped>
.user {
  min-width: 720px;
  max-width: 1120px;
  margin: 0 auto;
  // padding: 40px;
  // background-color: #afb4db;
  background-color: #fff;
  border: 1px solid #d3d3d3;
  // overflow: hidden;
  .userInf {
    padding: 40px;
    // background-color: #fffef9;
    background-size: 100% auto !important;
    overflow: hidden;
    img {
      width: 188px;
      height: 188px;
      float: left;
      margin-right: 40px;
      overflow: hidden;
    }
    .name {
      // float: left;
      overflow: hidden;
      // min-width: 492px;
      // max-width: 892px;
      min-height: 188px;
      background-color: rgba(255, 255, 255, 0.7);
      .name-inf {
        .name-head {
          font-size: 22px;
          span {
            margin-right: 10px;
          }
        }
        .tab {
          overflow: hidden;
          span {
            float: left;
            margin-right: 30px;
          } 
        }
      }
      .at {
        font-size: 14px;
        color: #666;
        span {
          margin-right: 20px;
          color: #faa755;
        }
        &:nth-child(2) {
          margin-top: 10px;
        }
        
      }
      .tab {
        font-size: 20px;
        color: #666;
        margin-top: 10px;
        border-top: 1px solid #666;
        
        // padding: 4px;
        // text-align: center;
        span {
          font-size: 16px;
          margin-top: 4px;
          padding: 5px;
          // text-align: center;
          // border-right: 1px solid #666;
        }
      }
      .person {
        font-size: 14px;
        color: #666;
      }
    }
  }
  .listenrecord {
    margin: 40px ;
    .menu {
      line-height: 30px;
      h3 {
        display: inline-block;
        font-size: 22px;
      }
      &>span {
        float: right;
        color: #666;
        font-size: 14px;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .recond {
      max-height: 400px;
      overflow: auto;
      border: 1px solid #ccc;
      ul {
        li {
          .musicmenu {
            position: relative;
            margin-left: 50px;
          }
        }
      }
    }
    ul {
      li {
        height: 36px;
        padding: 2px;
        line-height: 36px;
        color: #aeaeae;
        &:nth-child(2n) {
          background-color: #f7f7f7;
        }
        .one {
          display: inline-block;
          width: 50px;
          text-align: right;
          color: #333;
          
        }
        .two {
          margin-left: 5px;
          font-size: 16px;
          margin-right: 5px;
          color: #333;
          &:hover {
            text-decoration: underline;
            cursor: pointer;
          }
        }
        .three {
          font-size: 12px;
          // color: #aeaeae;
          &:hover {
            text-decoration: underline;
            cursor: pointer;
          }
        }
        .four {
          // display: inline-block;
          float: right;
          width: 100px;
          text-align: right;
          div {
            height: 36px;
            background-color: #4eb4f5;
            float: right;
            opacity: .2;
          }
        }
      }
    }
  }
  .userlist {
    margin: 40px;
    // div {
    //   &:last-child {
    //     text-align: right;
    //   }
    // }
    .album {
      & /deep/ img {
        width: 140px;
        height: 140px;
      }
    }
  }
}
.sc {
  color: #333;
}
</style>
