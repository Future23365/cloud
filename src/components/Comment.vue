<template>
  <div class="comment" v-loading="loading">
    <div class="marbox">精彩评论</div>
    <div class="com-li" v-for="(item, index) in goodiscuss" :key="index">
      <div class="user-head">
        <img :src="item.user.avatarUrl" alt="">
      </div>
      <div class="details">
        <div class="specific">
          <span class="user-name"><el-link type="primary" @click=goUser(item.user.userId)>{{item.user.nickname}}</el-link>:</span> {{item.content}}
        </div>
        <div class="other">
          <span class="time">{{new Date(item.time).toLocaleDateString()}}</span>
          <span class="fnumber">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zan"></use>
            </svg>
            {{item.likedCount.toLocaleString()}}</span>
        </div>
      </div>
    </div>
    <div class="marbox">最新评论</div>
    <div class="com-li" v-for="(item, index) in newdiscuss" :key="index + 's'">
      <div class="user-head">
        <img :src="item.user.avatarUrl" alt="">
      </div>
      <div class="details">
        <div class="specific">
          <span class="user-name"><el-link type="primary" @click=goUser(item.user.userId)>{{item.user.nickname}}</el-link>:</span> {{item.content}}
        </div>
        <div class="beReplied" v-if="item.beReplied.length > 0">
          <span class="rep-userhead"><img :src="item.beReplied[0].user.avatarUrl" alt=""></span>
          <span class="rep-username"><el-link type="primary">{{item.beReplied[0].user.nickname}}</el-link>:</span>
          {{item.beReplied[0].content}}
        </div>
        <div class="other">
          <span class="time">{{showTime(item.time)}}</span>
          <span class="fnumber">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zan"></use>
            </svg>
            {{item.likedCount.toLocaleString()}}</span>
        </div>
      </div>
    </div>
    <div class="pagination">
      <el-pagination
    background
    layout="prev, pager, next"
    :number="total"
    :page-size='pagesize'
    @current-change="changeData"
    :total="total">
    </el-pagination>
    </div>
    
  </div>
</template>

<script>
import { getsongComment } from '@/request/getdata';
export default {
  name: 'Comment',
  data() {
    return {
      goodiscuss: [],
      newdiscuss: [],
      pagesize: 20,
      total: 0,
      loading: true,
      requestTo: {}
    }
  },
  methods: {
    getComment(limit) {
      // console.log(this.requestTo);
      getsongComment(this.requestTo.id, 20, this.requestTo.target).then(res => {
        this.goodiscuss = res.hotComments;
        this.newdiscuss = res.comments;
        this.total = res.total;
        this.loading = false;
        // console.log(this.goodiscuss);
      })
    },
    changeData(e) {
      e--;
      e = e * 20;
      getsongComment(this.requestTo.id, 20, this.requestTo.target, e).then(res => {
        this.newdiscuss = res.comments;
        // console.log(res)
      })
    },
    showTime(t) {
      let nowdate = new Date();
      let date = new Date(t);
      if(nowdate.getDate() === date.getDate()) {
        let hour = date.getHours();
        hour < 10 ? hour = '0' + hour : hour = hour;
        let minu = date.getMinutes();
        minu < 10 ? minu = '0' + minu : minu = minu;
        return hour + ':' + minu
      } else {
        return date.toLocaleDateString();
      }
    },
    startRequset(obj) {
      this.requestTo.id = obj.id;
      this.requestTo.target = obj.target;
      this.getComment();
    },
    goUser(id) {
      this.$router.push({
        path: '/user',
        query: {
          userId: id
        }
      })
    }
  },
  mounted() {
  }
  
}
</script>

<style lang="scss" scoped>
 .comment {
   .marbox {
     height: 40px;
     width: 640px;
     margin-top: 50px;
     line-height: 40px;
     border-bottom: 1px solid #000;
   }
   .com-li {
     margin-top: 15px;
     width: 640px;
    //  height: 100px;
    //  background-color: #a03939;
      font-size: 15px;
      border-bottom: 1px solid #000;
      overflow: hidden;
     .user-head {
       float: left;
       width: 50px;
       height: 50px;
      //  background-color: #fff;
       img {
         width: 50px;
       }
     }
     .details {
       position: relative;
       float: right;
       width: 570px;
      //  height: 100px;
      //  background-color: skyblue;
       .specific {
         margin-bottom: 15px;
       }
       .beReplied {
         padding: 5px;
         background: #f4f4f4;
         border: 1px solid #dedede;
         
         .rep-userhead {
            img {
              width: 20px;
              height: 20px;
              vertical-align: text-bottom;
           }
           
         }
         .rep-username {
           margin: 0 5px;
           color: #666;
         }
       }
       .other {
         width: 570px;
         height: 40px;
         margin-bottom: 15px;
        //  background-color: pink;
         line-height: 40px;
        //  overflow: hidden;
         .time {
           float: left;
         }
         .fnumber {
           float: right;
           svg {
             width: 20px;
             height:20px;
             line-height: 20px;
           }
         }
       }
     }
   }
  .pagination {
    margin: 20px 0;
    text-align: center;
  }
 }
</style>