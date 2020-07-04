<template>
  <div class="musicmenu">
    <button class="el-icon-plus" @click="addlist"></button>
    <button class="el-icon-download" @click="musicDownload"></button>
  </div>
</template>

<script>
import { getsongUrl, getMp3, getsongDetail } from '@/request/getdata';
export default {
  name: 'musicmenu',
  props: ['musicid', 'musicName'],
  data() {
    return {
      mid: '',
    }
  },
  methods: {
    musicDownload(e) {
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
        })
        this.$forceUpdate();  //    强制渲染
      })
    },
    addlist() {
      getsongDetail(this.musicid).then(res => {
        let obj = {};
        obj.id = res.songs[0].id;
        obj.name = res.songs[0].name;
        let arr = [];
        for(let i = 0; i < res.songs[0].ar.length; i++) {
          let o = {};
          o[res.songs[0].ar[i].name] = res.songs[0].ar[i].id;
          arr.push(o);
        }
        obj.ar = arr;
        obj.al = res.songs[0].al.name;
        obj.alId = res.songs[0].al.id;
        obj.time = res.songs[0].dt;
        this.$store.commit('updatePlaylist', obj);
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