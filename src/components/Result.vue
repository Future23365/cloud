<template>
  <div class="result">
    <div class="title">
      搜索<span>{{this.$route.query.s}}</span>,找到<span>{{songCount}}</span>个结果
    </div>
    <el-tabs type="border-card"  @tab-click="setTab">
      <el-tab-pane label="单曲"><Single :dingleData="songs" @startRequest="getData" ref="children"></Single></el-tab-pane>
      <el-tab-pane label="歌手">歌手</el-tab-pane>
      <el-tab-pane label="专辑">专辑</el-tab-pane>
      <el-tab-pane label="视频">视频</el-tab-pane>
      <el-tab-pane label="歌词">歌词</el-tab-pane>
      <el-tab-pane label="歌单">歌单</el-tab-pane>
      <el-tab-pane label="主播电台">主播电台</el-tab-pane>
      <el-tab-pane label="用户">用户</el-tab-pane>
    </el-tabs>
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="getNextdata"
      :page-size='30'
      :total="songCount">
    </el-pagination>
  </div>
</template>

<script>
import { getsearchResult } from '../request/getdata'
import Single from './Single'

export default {
  name: 'result',
  components: {
    Single,
  },
  data() {
    return {
      songCount: 0,
      songs: [],
      tabName: '',

    }
  },
  methods: {
    getData(s, limit, offset, type) {
      getsearchResult( s || this.$route.query.s, limit || this.$route.query.limit, offset || this.$route.query.offset, type || this.$route.query.type).then(res => {
        this.songCount = res.result.songCount;
        this.$refs.children.settableData(res.result.songs);
      }) 
    },
    getNextdata(page) {
      if(this.tabName === '单曲') {
        this.getData(this.keywords, this.limit, (page - 1)  * 30, this.type);
      }
    },
    setTab(e) {
      this.tabName = e.label;
    }
  },
  computed: {
    keywords: function() {
      return this.$route.query.s;
    },
    limit: function() {
      return this.$route.query.limit;
    },
    offset: function() {
      return this.$route.query.offset;
    },
    type : function() {
      return this.$route.query.type;
    }
  },
  mounted() {

  },
  watch: {
    '$route' : function() {
      this.getData();
    }
  }
}
</script>

<style lang="scss" scoped>
  .result {
    max-width: 1120px;
    min-width: 720px;
    min-height: 1000px;
    background-color: #ccc;
    margin: 0 auto;
    padding: 80px 40px;
  }
</style>