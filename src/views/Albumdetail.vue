<template>
  <div class="albumdetail">
    <!-- 专辑信息 -->
    <div class="info">
      <img :src="albumData.blurPicUrl" alt="">
      <div class="cntc">
        <h3>{{albumData.name}}</h3>
        <p><span>歌手:</span><span v-for="(item, index) in albumData.artists" :key="index"> {{item.name}}</span></p>
        <p><span>发行时间:</span><span>{{new Date(albumData.publishTime).toLocaleDateString()}}</span></p>
        <p><span>发行公司:</span><span>{{albumData.company}}</span></p>
      </div>
    </div>
    <!-- 专辑介绍 -->
    <div class="albdesc">
        <h3>专辑介绍</h3>
        <p><pre style="display: inline">    </pre>{{albumData.description}}</p>
    </div>
    <!-- 歌曲及评论 -->
    <h3>包含歌曲列表</h3>
    <Single ref="childrenSingle"></Single>
    <Comment ref="childrenComment"></Comment>
  </div>
</template>

<script>
import { getAlbumdata, getAlbum } from '@/request/getdata';
import { timeShow } from '@/common/tool';
import Single from '@/components/Single';
import Comment from "@/components/Comment";

export default {
  name: 'albumdetail',
  components: {
    Single,
    Comment
  },
  data() {
    return {
      albumData: {}, //专辑数据
      albumSongs: []  //歌曲数据
    }
  },
  methods: {
    // 请求专辑数据
    getAlbum() {
      getAlbum(this.$route.query.albumdetailId).then(res => {
        this.albumData = res.album;
        this.albumSongs = res.songs
        this.$forceUpdate();
        let arr = [];
        for(let i = 0; i < res.songs.length; i++) {
          let obj = {};
          obj.songId = res.songs[i].id;
          obj.songName = res.songs[i].name;
          obj.songAuthor = {};
          for(let j = 0; j < res.songs[i].ar.length; j++) {
            obj.songAuthor[res.songs[i].ar[j].id] = res.songs[i].ar[j].name;
          }
          obj.songAlbum = `《${res.songs[i].al.name}》`;
          obj.songAlbumId = res.songs[i].al.id;
          obj.songTime = timeShow(res.songs[i].dt / 1000);
          arr.push(obj);
        }
        this.$refs.childrenSingle.settableData(arr);
      })
    }
  },
  mounted() {
    // 请求专辑数据
    this.getAlbum();
    // 设置评论数据
    this.$refs.childrenComment.startRequset({id: this.$route.query.albumdetailId, target: 'album'});
  }
}
</script>

<style lang="scss" scoped>
.albumdetail {
  width: 720px;
  padding: 40px;
  margin: 0 auto;
  background-color: #fff;
  border: 1px solid #ccc;
  p {
    color: #666;
    font-size: 14px;
    margin-top: 10px;
    &:last-child {
      line-height: 24px;
    }
  }
  .info {
    margin: 0 auto;
    width: 720px;
    overflow: hidden;
    img {
      width: 177px;
      float: left;
    }
    .cntc {
      float: left;
      margin-left: 50px;;
      width: 493px;
      &>p {
          &:nth-child(2) {
            span {
              color: #0c73c2;
              &:hover {
                text-decoration: underline;
                cursor: pointer;
              }
              &:nth-child(1) {
                color: #666;
              }
            }
          }
        }
    }
    
  }
  .albdesc {
    h3 {
      margin-top: 28px;
    }
  }
  &>h3 {
    margin-top: 28px;
  }
}
</style>