<template>
  <div class="userlist">
    <ul>
      <li v-for="(item, index) in userlistData" :key="index">
        <img :src="item.avatarUrl" alt="">
        <div class="des">
          <a href="javascript:;" @click="goUser(item.userId)">{{item.nickname}}</a>
          <span>
            <svg class="icon" aria-hidden="true">
                <use v-bind:xlink:href='gender[item.gender]'></use>
              </svg>
          </span>
          <p>{{item.signature}}</p>
        </div>
        <div>歌单</div>
        <div>粉丝</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'userlist',
  data() {
    return {
      userlistData: [],
      gender: ['','#icon-nan', '#icon-nv'],
    }
  },
  methods: {
    getUserlistdata(data) {
      this.userlistData = data;
      console.log(data);
    },
    goUser(id) {
      this.$router.push({
        path: '/user',
        query: {
          userId: id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.userlist {
  ul {
    li {
      overflow: hidden;
      padding: 5px;
      transition: background-color .5s;
      &:hover {
        background-color: #cde6c7;
      }
      img {
        float: left;
        width: 50px;
        height: 50px;
        margin-right: 20px;
      }
      div {
        float: left;
        margin-right: 20px;
        a {
          color: #333;
          text-decoration: none;
          &:hover {
            text-decoration: underline;
          }
        }
        p {
          width: 500px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          color: #999;
          font-size: 14px;
        }
      }
    }
  }
}
</style>