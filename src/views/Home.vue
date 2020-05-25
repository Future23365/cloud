<template>
  <div class="home">
    <Newsong :list='newsong'></Newsong>
    <Ranking v-on:getRanking='getSong'></Ranking>
  </div>
</template>

<script>
import server from '../request/request';
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
      server({
        url: '/personalized/newsong',
        method: 'get'
      }).then(res => {
        this.newsong.push(res.result);  //获取新课
        
      })
    },
    getSong(song, name) {
      this.$emit('setau', song, name);
      // this.getinfsong(this.audio.data[0].id);

    },
    
    
  },
  created() {
    this.getData();
  }
}
</script>

<style scoped>
  /* .home {
    max-width: 1200px;
    min-width: 800px;
    margin: 0 auto;
    text-align: center;
  } */

</style>