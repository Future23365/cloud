<template>
  <div class="user" >
    <!-- 头像部分 -->
    <div class="userInf" v-bind:style="{background: bgcURl}">
      <!-- 头像 -->
      <img :src="userData.profile.avatarUrl" alt="">
      <!-- 用于信息 -->
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
    <!-- 听歌排行 -->
    <div class="listenrecord">
      <div class="menu">
        <h3>听歌排行</h3>
        <span >
          <span :class=" isWeek === true ? 'sc' : ''" @click="setWeek('week')">最近一周</span>|<span :class=" isWeek === false ? 'sc' : ''" @click="setWeek('all')">所有时间</span>
        </span>
      </div>
      <div class="recond">
        <ul>
          <div v-show="!hasRecord || record.length === 0">暂无记录</div>
          <li v-for="(item, index) in record" :key="index" @mouseenter="enterLi(item.song.id)" @mouseleave="leaveLi(item.song.id)">
            <span class="one">{{index + 1}}.</span>
            <span class="two" @click="goMusic(item.song.id)">{{item.song.name}}</span>
            -<span v-for="(jtem, jndex) in item.song.ar" :key="jndex" class="three" @click="goAlbum(jtem.id)">{{jtem.name}}</span>
            <Musicmenu :musicid="item.song.id" :musicName="item.song.name" v-show="(showId === item.song.id)"></Musicmenu>
            <span class="four"><div :style="{'width': item.score + 'px'}"></div></span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 用户歌单 -->
    <div class="userlist">
        <h3>{{userData.profile.nickname}}创建的歌单</h3>
        <Album ref="childrenSonglist1"></Album>
        <div v-show="isHasmore"><button @click="getSonglistmore(songlistPage += 29)" class="moreButton">更多</button></div>
        <h3>{{userData.profile.nickname}}收藏的歌单</h3>
        <Album ref="childrenSonglist2"></Album>
        <!-- <div><button @click="getSonglistmore(2, songlistPage += 29)">更多</button></div> -->
    </div>
  </div>
</template>

<script>
import { getUserData, getUserplaylist, getUserRecord, getsongDetail } from '@/request/getdata';
import Album from '@/components/Album';
import Musicmenu from '@/components/Musicmenu';

export default {
  name: 'user',
  components: {
    Album,
    Musicmenu
  },
  data() {
    return {
      userData: {profile: {avatarUrl: ''}}, //用户数据
      gender: ['','#icon-nan', '#icon-nv'], //性别
      songlistPage: 30, //增加30个歌单
      isHasmore: true, //是否有更多歌单
      record: [], //听歌记录
      isWeek: true, //周记录和总记录标记
      ownPlaylist : [], //创建的歌单
      collectionPlaylist : [], //收藏的歌单
      showId: 0, //用于显示歌曲下载菜单
      hasRecord: true, //是否有听歌记录
    }
  },
  methods: {
    // 请求用户数据
    requsetUserdata(limit) {
      getUserData(this.$route.query.userId).then(res => {
        this.userData = res;
        this.$forceUpdate(); 
      })
      this.getplayList(limit);
      // 请求用户听歌记录
      getUserRecord(this.$route.query.userId, 1).then(res => {
        this.record = res.weekData;
        let that = this;
      },reject => {
        this.hasRecord = false
      })
    },
    // 请求用户歌单
    getplayList(limit) {
      getUserplaylist(this.$route.query.userId, limit).then(res => {
        for(let i = 0; i < res.playlist.length; i++) {
          if(res.playlist[i].userId === Number.parseInt(this.$route.query.userId)) {
            this.ownPlaylist.push(res.playlist[i])
          }else {
            this.collectionPlaylist.push(res.playlist[i])
          }
        }
        this.isHasmore = res.more;
        this.$refs.childrenSonglist1.getAlbumdata(this.ownPlaylist, "歌单");
        this.$refs.childrenSonglist2.getAlbumdata(this.collectionPlaylist, "歌单");
      })
    },
    // 获取更多歌曲按钮函数
    getSonglistmore(limit) {
      this.getplayList(limit);
    },
    // 选择听歌排行
    setWeek(type) {
      if(type === 'week' && this.isWeek === false) {
        this.isWeek = true;
        getUserRecord(this.$route.query.userId, 1).then(res => {
          this.record = res.weekData;
        },reject => {
          this.hasRecord = false
        })
      } else if(type === 'all' && this.isWeek === true) {
        this.isWeek = false;
        getUserRecord(this.$route.query.userId, 0).then(res => {
          this.record = res.allData;
        },reject => {
          this.hasRecord = false
        })
      }
    },
    // 点击音乐跳转路由
    goMusic(id) {
      let s = {};
      s.id = id;
      getsongDetail(id).then(res => {
        // 分发action使歌曲添加到播放列表
        let obj = {};
        obj.id = id;
        this.$store.dispatch('sendUpdatePlaylist', obj);
      })
      this.$store.commit('updateSong', s);
      this.$router.push('/music');
    },
    // 点击歌手跳转
    goAlbum(id) {
      this.$router.push({
          path: "/artist",
          query: {
            artistid: id
          }
        });
    },
    enterLi(id) {
      this.showId = id;
    },
    leaveLi(id) {
      this.showId = 0
    }
  },
  mounted() {
    this.requsetUserdata(this.songlistPage);
  },
  computed: {
    // 取得背景
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
  background-color: #fff;
  border: 1px solid #d3d3d3;
  .userInf {
    padding: 40px;
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
      overflow: hidden;
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
        
        span {
          font-size: 16px;
          margin-top: 4px;
          padding: 5px;
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
        // min-height: 50px;
        div {
          text-align: center;
        }
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

    .album {
      & /deep/ img {
        width: 140px;
        height: 140px;
        
      }
      & /deep/ ul {
        li {
        margin-right: 20.1px;
      }
      }
    }
    .moreButton {
      border: none;
      outline: none;
      float: right;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
.sc {
  color: #333;
}
</style>
