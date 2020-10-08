<template>
  <div class="home">
    <!-- 新歌轮播图子组件 -->
    <Newsong></Newsong>
    <!-- 榜单子组件 -->
    <Ranking></Ranking>
  </div>
</template>

<script>
import Newsong from '@/components/Newsong';
import Ranking from '@/components/Ranking';


export default {
  name: 'Home',
  data() {
    return {
      newsong: [],
      ranking: [],
    }
  },
  components: {
    Newsong,
    Ranking,
  },
}
</script>

<style scoped>
  

</style>