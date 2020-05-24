<template>
  <div class="home">
    <Newsong :list='newsong'></Newsong>
    <Player></Player>
    <Ranking ></Ranking>
    
  </div>
</template>

<script>
import server from '../request/request';
import Newsong from '../components/Newsong';
import Ranking from '../components/Ranking';
import Player from '../components/Player';

export default {
  name: 'Home',
  data() {
    return {
      newsong: [],
      ranking: []
    }
  },
  components: {
    Newsong,
    Ranking,
    Player
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
    
  },
  created() {
    this.getData();
  }
}
</script>

<style scoped>
  .home {
    max-width: 1200px;
    min-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

</style>