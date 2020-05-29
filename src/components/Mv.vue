<template>
  <div class="mv">
    <ul>
      <li v-for="(item, index) in mvData" :key="index">
        <div class="show" @click="playVideo(item.id)">
          <img :src="item.cover" alt />
          <div class="count">
            <i class="el-icon-view"></i>
            {{item.playCount.toLocaleString()}}
          </div>
          <div class="time">{{timeShow(item.duration / 1000)}}</div>
        </div>
        <div class="name">
          <a href="javascript:;" :title="item.name">{{item.name}}</a>
        </div>
        <div class="aughor">
          <el-link type="info">{{item.artistName}}</el-link>
        </div>
      </li>
    </ul>
  </div>
</template>
  
  
<script>
export default {
  name: "mv",
  data() {
    return {
      mvData: []
    };
  },
  methods: {
    getMvdata(data) {
      this.mvData = data;
      console.log(this.mvData);
    },
    timeShow(time) {
      let minute;
      let second;
      if (time >= 60) {
        time = Math.ceil(time);
        minute = (time / 60).toString().split(".")[0];
        minute < 10 ? (minute = "0" + minute) : (minute = minute);
        second = (time - minute * 60).toFixed(0);
        second < 10 ? (second = "0" + second) : (second = second);
      } else {
        minute = "00";
        second = time.toFixed(0);
        second < 10 ? (second = "0" + second) : (second = second);
      }
      return minute + ":" + second;
    },
    playVideo(id) {
      console.log("点击了播放");
      this.$router.push({
        path: "/mvideo",
        query: {
          mvId: id
        }
      });
    }
  },
  mounted() {
    // console.log("mv");
    // this.$emit('getMv', 1004);
  }
};
</script>

<style lang="scss" scoped>
.mv {
  ul {
    li {
      float: left;
      margin-left: 10px;
      margin-bottom: 10px;
      width: 159px;
      height: 137px;
      // background-color: skyblue;

      .show {
        height: 90px;
        position: relative;
        color: #fff;
        font-size: 14px;
        img {
          position: absolute;
          width: 159px;
          height: 90px;
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
          // height: 20px;
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
        // width: 159px;
        // height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 5px;
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