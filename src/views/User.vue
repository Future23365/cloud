<template>
  <div class="user">
    <div class="userInf">
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
      <div class="menu"><h3>听歌排行</h3><span ><span :class=" isWeek === true ? 'sc' : ''">最近一周</span>|<span :class=" isWeek === false ? 'sc' : ''">所有时间</span></span></div>
      <div class="recond">
        <ul>
          <li v-for="(item, index) in record" :key="index">
            <span class="one">{{index + 1}}.</span>
            <span class="two">{{item.song.name}}</span>
            -<span v-for="(jtem, jndex) in item.song.ar" :key="jndex" class="three">{{jtem.name}}</span>
            <span class="four"><div :style="{'width': item.score + 'px'}"></div></span>
          </li>
        </ul>
      </div>
    </div>
    <div class="userlist">
        <h3>{{userData.profile.nickname}}创建的歌单</h3>
        <Album ref="childrenSonglist"></Album>
        <div><button @click="getSonglistmore(songlistPage += 29)">更多</button></div>
    </div>
  </div>
</template>

<script>
import { getUserData, getUserplaylist, getUserRecord } from '@/request/getdata';
import Album from '@/components/Album';


export default {
  name: 'user',
  components: {
    Album
  },
  data() {
    return {
      userData: {profile: {avatarUrl: ''}},
      gender: ['','#icon-nan', '#icon-nv'],
      songlistPage: 30,
      isHasmore: true,
      record: [],
      isWeek: true,

    }
  },
  methods: {
    requsetUserdata() {
      getUserData(this.$route.query.userId).then(res => {
        this.userData = res;
        this.$forceUpdate(); 
        // console.log(res);
      })

      getUserplaylist(this.$route.query.userId).then(res => {
        // console.log(res);
        this.$refs.childrenSonglist.getAlbumdata(res.playlist, "歌单");
      })

      getUserRecord(this.$route.query.userId, 1).then(res => {
        console.log(res);
        this.record = res.weekData;
      })
    },
    getSonglistmore(limit = 30) {
      if(!this.isHasmore) {
          this.$message({
            message: '没有更多了呦！',
          });
        }else {
          getUserplaylist(this.$route.query.userId, limit).then(res => {
            this.$refs.childrenSonglist.getAlbumdata(res.playlist, '歌单');
            this.isHasmore = res.more;
        })
      }
      
    },
  },
  mounted() {
    this.requsetUserdata();
  }
}
</script>

<style lang="scss" scoped>
.user {
  min-width: 720px;
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px;
  // background-color: #afb4db;
  background-color: #fff;
  border: 1px solid #d3d3d3;
  // overflow: hidden;
  .userInf {
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
            margin-right: 10px;
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
    margin-top: 100px;
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
      height: 400px;
      overflow: auto;
      border: 1px solid #ccc;
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
    margin-top: 50px;
    div {
      &:last-child {
        text-align: right;
      }
    }
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
