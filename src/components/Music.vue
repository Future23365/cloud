<template>
  <div class="music">
    <div class="s-info">
      <div class="mask"></div>
      <div class="info">
        <div class="lyric"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Music'
}
</script>

<style lang="scss" scoped>
  .music {
    max-width: 1200px;
    min-width: 800px;
    height: 960px;
    margin: 0 auto;
    background-color: #ccc;
    padding-top: 80px;
    padding-left: 80px;

    .s-info {
      width: 640px;
      height: 500px;
      background-color: #666;
      
    }
  }
</style>