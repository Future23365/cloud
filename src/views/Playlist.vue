<template>
  <div class="albumdetail">
    <!-- 歌单信息 -->
    <div class="info">
      <img :src="playList.coverImgUrl" alt="">
      <div class="cntc">
        <h3>{{playList.name}}</h3>
        <p><img :src="playList.creator.avatarUrl" alt=""><span>{{playList.creator.nickname}}</span></p>
        <p><span>创建时间:</span><span>{{new Date(playList.createTime).toLocaleDateString()}}</span></p>
      </div>
    </div>
    <!-- 歌单描述 -->
    <div class="albdesc">
      <h3>歌单介绍</h3>
      <p>{{playList.description}}</p>
    </div>
    <!-- 具体歌曲及评论 -->
    <h3>包含歌曲列表</h3>
    <Single ref="childrenSingle"></Single>
    <button @click="goSonglist" class="requestMore" v-show="hasmore">获得详细歌单请点击</button>
    <!-- 显示全部歌曲 -->
    <PlaylistSongs v-show="isListSongsActive" :songList="songsListData"></PlaylistSongs>
    <Comment ref="childrenComment"></Comment>
  </div>
</template>

<script>
import { getUserPlaylistDetail } from '@/request/getdata';
import { timeShow } from '@/common/tool';
import Single from '@/components/Single';
import Comment from '@/components/Comment';
import PlaylistSongs from '@/components/PlaylistSongs';

export default {
  name: 'albumdetail',
  components: {
    Single,
    Comment,
    PlaylistSongs
  },
  data() {
    return {
      playList: {creator: {avatarUrl: ''}}, //保存歌单信息
      priviLeges: [],
      songsListData: [], //详细歌单数据
      isListSongsActive: false, //是否点击
      hasmore: true
    }
  },
  methods: {
    // 请求歌单数据
    getAlbum() {
      getUserPlaylistDetail(this.$route.query.playlistid).then(res => {
        this.playList = res.playlist;
        this.priviLeges = res.privileges
        this.$forceUpdate();
        let arr = [];
        for(let i = 0; i < res.playlist.tracks.length; i++) {
          let obj = {};
          obj.songId = res.playlist.tracks[i].id;
          obj.songName = res.playlist.tracks[i].name;
          obj.songAuthor = {};
          for(let j = 0; j < res.playlist.tracks[i].ar.length; j++) {
            obj.songAuthor[res.playlist.tracks[i].ar[j].id] = res.playlist.tracks[i].ar[j].name;
          }
          obj.songAlbum = `《${res.playlist.tracks[i].al.name}》`;
          obj.songAlbumId = res.playlist.tracks[i].al.id;
          obj.songTime = timeShow(res.playlist.tracks[i].dt / 1000);
          arr.push(obj);
        }
        // 如果还有全部歌曲，则显示更多按钮
        if(this.playList.trackIds.length <= this.playList.tracks.length) {
          this.hasmore = false;
        }
        let that = this;
        setImmediate(function() {
          that.$refs.childrenSingle.settableData(arr);
        }, 1000)
      })
    },
    // 点击详细歌单
    goSonglist() {
      this.isListSongsActive = !this.isListSongsActive;
      this.songsListData = this.playList;
    }
  },
  mounted() {
    // 初始化请求
    this.getAlbum();
    let that = this;
    setTimeout(function() {
      that.$refs.childrenComment.startRequset({id: that.$route.query.playlistid, target: 'playlist'});
    }, 1000)
  }
}
</script>

<style lang="scss" scoped>
.albumdetail {
  width: 720px;
  padding: 40px;
  margin: 0 auto;
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
        img {
          width: 35px;
          height: 35px;
          vertical-align: text-bottom;
          &+span {
            line-height: 35px;
            margin-left: 5px;
          }
        }
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
  .requestMore {
    border: none;
    outline: none;
    float: right;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>