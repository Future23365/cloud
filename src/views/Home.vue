<template>
  <div class="home">
    <Newsong :list='newsong'></Newsong>
    <Ranking></Ranking>
  </div>
</template>

<script>
import { getsongNew } from '../request/getdata';
import Newsong from '../components/Newsong';
import Ranking from '../components/Ranking';


export default {
  name: 'Home',
  data() {
    return {
      newsong: [],
      ranking: [],
      songinformation: {}
    }
  },
  components: {
    Newsong,
    Ranking,
  },
  methods: {
    getData() {
      getsongNew().then(res => {
        this.newsong.push(res.result);  //获取新课
        
      })
    },
    // getSong(song, name) {
    //   // this.$emit('setau', song, name);
    //   // this.getinfsong(this.audio.data[0].id);

    // },
    
    
  },
  mounted() {
    this.getData();
  }
}
</script>

<style scoped>
  

</style>