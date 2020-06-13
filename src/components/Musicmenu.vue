<template>
  <div class="musicmenu">
    <button class="el-icon-plus"></button>
    <button class="el-icon-download" @click="musicDownload"></button>
  </div>
</template>

<script>
import { getsongUrl, getMp3 } from '@/request/getdata'
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
      console.log('234');
      console.log(this.musicid);
      getsongUrl(this.musicid).then(res => {
        console.log(res);
        /*下载MP3文件*/ 
        fetch(res.data[0].url).then(res => {
          console.log(res);
          return res.blob();
        }).then(res => {
          console.log(res);
          var bURL = URL.createObjectURL(res);
          var link = document.createElement('a');
          link.href = bURL;
          link.setAttribute('download', this.musicName);
          link.click();
        })
        this.$forceUpdate();  //    强制渲染
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
}
</style>