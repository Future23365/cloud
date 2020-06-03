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
    <div class="userlist">
        <h3>{{userData.profile.nickname}}创建的歌单</h3>
        <Album ref="childrenSonglist"></Album>
        <div><button @click="getSonglistmore(songlistPage += 29)">更多</button></div>
    </div>
  </div>
</template>

<script>
import { getUserData, getUserplaylist } from '@/request/getdata';
import Album from '@/components/Album';


export default {
  name: 'user',
  components: {
    Album
  },
  data() {
    return {
      userData: {profile: {avatarUrl: ''}},
      gender: ['#icon-nv', '#icon-nan'],
      songlistPage: 30,
      isHasmore: true,
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
        console.log(res);
        this.$refs.childrenSonglist.getAlbumdata(res.playlist, "歌单");
        
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
  overflow: hidden;
  .userInf {
    img {
      width: 188px;
      height: 188px;
      float: left;
      margin-right: 40px;
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
  .userlist {
    margin-top: 50px;
    div {
      &:last-child {
      text-align: right;
    }
    }
    
  }
}
</style>