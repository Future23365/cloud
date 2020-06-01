<template>
  <div class="user">
    <div class="userInf">
      <img :src="userData.profile.avatarUrl" alt="">
      <div class="name">
        <div class="name-inf">
          <div class="name-head"><span>{{userData.profile.nickname}}</span><span>Lv.{{userData.level}}</span><span>{{gender[userData.profile.gender]}}</span></div>
          <div></div>
          <div></div>
          <div>
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
          <p><span>个人介绍</span>{{userData.profile.signature}}</p>
        </div>
        <div class="data"></div>
        <div class="base"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserData } from '@/request/getdata'

export default {
  name: 'user',
  data() {
    return {
      userData: {},
      gender: ['女', '男']
    }
  },
  methods: {
    requsetUserdata() {
      getUserData(this.$route.query.userId).then(res => {
        this.userData = res;
        this.$forceUpdate(); 
        console.log(res);
      })
    }
  },
  mounted() {
    this.requsetUserdata();
  }
}
</script>

<style lang="scss" scoped>
.user {
  min-width: 720px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  background-color: #afb4db;
  .userInf {
    img {
      width: 188px;
      height: 188px;
    }
  }
}
</style>