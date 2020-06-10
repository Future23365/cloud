<template>
  <div class="album">
    <ul>
      <li v-for="(item, index) in albumData" :key="index">
        <div class="show" @click="toAlbum(item.id)">
          <img :src="item.cover || item.picUrl || item.coverImgUrl || item.img1v1Url" :alt="item.name" :title="item.name" />
        </div>
        <div class="name">
          <a href="javascript:;" :title="item.name">{{item.name}}</a>
        </div>
        <div class="aughor">
          <el-link type="info">{{'artist' in item ? item.artist.name : ''}}</el-link>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'album',
  data() {
    return {
      albumData: [],
      albumFlag: '专辑',

    }
  },
  methods: {
    getAlbumdata(data , type = '专辑') {
      this.albumData = data;
      console.log(data);
      if(type != '专辑') {
        this.albumFlag = type;
      }
    },
    toAlbum(id) {
      if(this.albumFlag === '专辑') {
        if('artist' in this.albumData[0]) {
          this.$router.push({
          path: "/albumdetail",
          query: {
            albumdetailId: id
          }
        });
        } else {
          this.$router.push({
          path: '/artist',
          query: {
            artistid: id
            }
          })
        }
      } else if(this.albumFlag === '歌单') {
        this.$router.push({
          path: '/playlist',
          query: {
            playlistid: id
            }
          })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.album {
  ul {
    overflow: hidden;
    li {
      float: left;
      margin-right: 19px;
      margin-bottom: 20px;
      width: 153px;
      height: 168px;
      .show {
        height: 130px;
        position: relative;
        color: #fff;
        font-size: 14px;
        img {
          position: absolute;
          width: 153px;
          height: 130px;
          &:hover {
            cursor: pointer;
          }
        }
        .count {
          position: absolute;
          display: inline;
          top: 0;
          right: 0;
          background-color: rgba(0, 0, 0, 0.3);
          &:hover {
            cursor: pointer;
          }
        }
        .time {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 20px;
          &:hover {
            cursor: pointer;
          }
        }
      }
      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 10px;
        a {
          font-size: 15px;
          color: #0c73c2;
          &:link {
            text-decoration: none;
          }
          &:hover {
            text-decoration: underline;
          }
        }
      }
      .author {
        margin-top: 5px;
        font-size: 13px;
      }
    }
  }
}
</style>