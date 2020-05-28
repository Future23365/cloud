<template>
  <div class="result">
    <div class="title">
      搜索<span>{{this.$route.query.s}}</span>,找到<span>{{songCount}}</span>个结果
    </div>
    <el-tabs type="border-card"  @tab-click="setTab">
      <el-tab-pane label="单曲"><Single @startRequest="getData" ref="childrenSingle"></Single></el-tab-pane>
      <el-tab-pane label="歌手">歌手</el-tab-pane>
      <el-tab-pane label="专辑">专辑</el-tab-pane>
      <el-tab-pane label="视频">视频</el-tab-pane>
      <el-tab-pane label="MV"><mv ref="childrenMv"></mv></el-tab-pane>
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
import Mv from './Mv'

export default {
  name: 'result',
  components: {
    Single,
    Mv
  },
  data() {
    return {
      songCount: 0,
      songs: [],
      tabName: '单曲',

    }
  },
  methods: {
    getData(type = 1, obj = {}) {
      let s, limit, offset;
      console.log(type);
      if('s' in obj) { s = obj.s };
      if('limit' in obj) { limit = obj.limit };
      if('offset' in obj) { offset = obj.offset };
      if('type' in obj) { type = obj.type };
      getsearchResult( s || this.$route.query.s, limit || this.$route.query.limit, offset || this.$route.query.offset, type || this.$route.query.type).then(res => {

        console.log(res);
        this.sendTableData(res.result, type);
      }) 
    },
    getNextdata(page) {
      // console.log(this.tabName);
      if(this.tabName === '单曲') {
        // console.log("点击");
        this.getData(1, {'offset': (page - 1)  * 30});
      }else if(this.tabName === 'MV') {
        this.getData(1004, {'offset': (page - 1)  * 30});
      }
    },
    setTab(e) {
      this.tabName = e.label;
      switch(e.label) {
        case 'MV':
          this.getData(1004);
          break;
      }

    },
    sendTableData(data, type) {
      switch(type) {
        case 1: 
          this.songCount = data.songCount;
          this.$refs.childrenSingle.settableData(data.songs);
          break;
        case 1004:
          this.songCount = data.mvCount;
          this.$refs.childrenMv.getMvdata(data.mvs);
          break;
      }
      
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
  },
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