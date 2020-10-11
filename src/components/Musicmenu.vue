<template>
  <div class="musicmenu">
    <button class="el-icon-plus" @click="addlist"></button>
    <button class="el-icon-download" @click="musicDownload"></button>
  </div>
</template>

<script>
import { getsongUrl, getMp3, getsongDetail } from '@/request/getdata';
import { Message } from 'element-ui';
export default {
  name: 'musicmenu',
  props: ['musicid', 'musicName'], //父组件传入歌名和id
  methods: {
    // 下载方法
    musicDownload(e) {
      Message({
        message: '请稍等^_^',
      });
      getsongUrl(this.musicid).then(res => {
        /*下载MP3文件*/ 
        fetch(res.data[0].url).then(res => {
          return res.blob();
        }).then(res => {
          var bURL = URL.createObjectURL(res);
          var link = document.createElement('a');
          link.href = bURL;
          link.setAttribute('download', this.musicName);
          link.click();
        }, reject => {
          Message({
            message: '下载失败，要不再试一次？^_^',
          });
        })
        this.$forceUpdate();  //    强制渲染
      })
    },
    //添加歌曲到播放列表
    addlist() {
      getsongDetail(this.musicid).then(res => {
        let obj = {};
        obj.id = res.songs[0].id;
        this.$store.dispatch('sendUpdatePlaylist', obj);
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.musicmenu {
  display: inline-block;
  position: absolute;
  right: 0;
  button {
    background-color: transparent;
    border: none;
    font-size: 20px;
    margin-right: 5px;
    outline: none;
    &:hover {
      cursor: pointer;
      color: #67C23A;
    }
  }
}
</style>