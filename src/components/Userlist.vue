<template>
  <div class="userlist">
    <ul>
      <li v-for="(item, index) in userlistData" :key="index">
        <!-- 用户头像 -->
        <img :src="item.avatarUrl" alt="头像走丢啦">
        <!-- 用户的名字性别及描述 -->
        <div class="des">
          <a href="javascript:;" @click="goUser(item.userId)">{{item.nickname}}</a>
          <span>
            <svg class="icon" aria-hidden="true">
                <use v-bind:xlink:href='gender[item.gender]'></use>
              </svg>
          </span>
          <p>{{item.signature}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import getUserData from '@/request/getdata';
export default {
  name: 'userlist',
  data() {
    return {
      userlistData: [], //存储用户列表数据
      gender: ['','#icon-nan', '#icon-nv'], //保存性别图片类名
    }
  },
  methods: {
    // 父组件传入数据
    getUserlistdata(data) {
      this.userlistData = data;
    },
    // 跳转路由之用户详情页
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