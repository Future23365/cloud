<template>
  <div class="comment">
    <div class="marbox">精彩评论</div>
    <div class="com-li" v-for="(item, index) in goodiscuss" :key="index">
      <div class="user-head">
        <img :src="item.user.avatarUrl" alt="">
      </div>
      <div class="details">
        <div class="specific">
          <span class="user-name">{{item.user.nickname}}:</span> {{item.content}}
        </div>
        <div class="other">
          <span class="time">{{item.time}}</span>
          <span class="fnumber">{{item.likedCount}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import server from '../request/request'
export default {
  name: 'Comment',
  props: ['id'],
  data() {
    return {
      goodiscuss: [],
      newdiscuss: [],
      total: 0,

    }
  },
  methods: {
    getcomment(limit) {
      server({
        url: '/comment/music?id=' + this.$store.state.songid + '&limit' + limit,
        methos: 'get'
      }).then(res => {
        this.goodiscuss = res.hotComments;
        this.newdiscuss = res.Comments;
        this.total = res.total;

        console.log(res)
      })
    }
  },
  mounted() {
    this.getcomment(50);
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
     background-color: #a03939;
     overflow: hidden;
     .user-head {
       float: left;
       width: 50px;
       height: 50px;
       background-color: #fff;
       img {
         width: 50px;
       }
     }
     .details {
       position: relative;
       float: right;
       width: 570px;
      //  height: 100px;
       background-color: skyblue;
       .specific {
         margin-bottom: 15px;
       }
       .other {
         width: 570px;
         height: 40px;
         margin-bottom: 15px;
         background-color: pink;
         line-height: 40px;
        //  overflow: hidden;
         .time {
           float: left;
         }
         .fnumber {
           float: right;
         }
       }
     }

   }
 }
</style>