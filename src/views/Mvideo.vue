<template>
  <div class="mvideo">
    <!-- 名字及信息 -->
    <div class="inf">
      <span class="mvname">{{mvData.mvName}}</span>
      <span class="author">{{mvData.author}}</span>
    </div>
    <!-- 视频播放器 -->
    <video :src="mvData.url" controls preload="auto"></video>
    <!-- 视频信息 -->
    <div class="introduce">
      <div class="publishTime"><span>发布时间:</span><span>{{mvData.publishTime}}</span></div>
      <div class="playCount"><span>播放次数:</span><span>{{mvData.playCount}}</span></div>
      <div class="subCount"><span>收藏次数:</span><span>{{mvData.subCount}}</span></div>
      <div class="shareCount"><span>分享次数:</span><span>{{mvData.shareCount}}</span></div>
      <p>{{mvData.desc}}</p>
    </div>
    <!-- 评论组件 -->
    <Comment ref="childrenComment"></Comment>
  </div>
</template>

<script>
import { getMvdata, getMvurl, getVideodata, getVideourl } from "@/request/getdata";
import Comment from "@/components/Comment";

export default {
  name: "mvideo",
  components: {
    Comment
  },
  data() {
    return {
      mvData: {}, //保存视频数据
    };
  },
  methods: {
    // 请求数据
    setMvdata() {
      // 根据路由参数id的位数判断是mv还是视频
      if(this.$route.query.mvId.length <= 8) {
        // 请求mv数据
        getMvdata(this.$route.query.mvId).then(res => {
          this.mvData.mvName = res.data.name;
          this.mvData.author = res.data.artistName;
          this.mvData.duration = res.data.duration;
          this.mvData.playCount = res.data.playCount.toLocaleString();
          this.mvData.publishTime = res.data.publishTime;
          this.mvData.shareCount = res.data.shareCount.toLocaleString();
          this.mvData.subCount = res.data.subCount.toLocaleString();
          this.mvData.desc = res.data.desc;
          this.$forceUpdate();
        })
        // 请求mv播放地址
        getMvurl(this.$route.query.mvId).then(res => {
          this.mvData.url = res.data.url;
          this.$forceUpdate();  //    强制渲染
        })
        // 请求评论数据
        this.$refs.childrenComment.startRequset({id: this.$route.query.mvId, target: 'mv'});
      } else if(this.$route.query.mvId.length > 8) {
        // 请求视频数据
        getVideodata(this.$route.query.mvId).then(res => {
          this.mvData.mvName = res.data.title;
          this.mvData.duration = res.data.durationms;
          this.mvData.playCount = res.data.playTime.toLocaleString();
          this.mvData.publishTime = new Date(res.data.publishTime).toLocaleDateString();
          this.mvData.shareCount = res.data.shareCount.toLocaleString();
          this.mvData.subCount = res.data.subscribeCount.toLocaleString();
          this.mvData.desc = res.data.description;
          this.$forceUpdate();
        })
        // 请求视频播放
        getVideourl(this.$route.query.mvId).then(res => {
          this.mvData.url = res.urls[0].url;
          this.$forceUpdate();  //    强制渲染
        })
        // 请求评论数据
        this.$refs.childrenComment.startRequset({id: this.$route.query.mvId, target: 'video'});
      }
    }
  },
  mounted() {
    // 请求输出初始化
    this.setMvdata();
  }
};
</script>

<style lang="scss" scoped>
.mvideo {
  width: 680px;
  margin: 0 auto;
  padding: 60px 60px;
  border: 1px solid #ccc;
  video {
    width: 680px;
    height: 382.5px;
    border-style: none;
    margin: 10px 0;
  }
  .mvname {
    font-size: 25px;
  }
  .author {
    color: #0c73c2;
    font-size: 14px;
    margin-left: 5px;
  }
  .introduce {
    font-size: 14px;
    color: #999;
    &:nth-child(n) {
      span {
        margin-right: 5px;
      }
    }
    p {
      margin-top: 8px;
    }
  }
}
</style>