<template>
  <div class="header">
    <div class="main">
      <div class="logo">
      <a href="/" title="回到首页">
      <div class="page"></div>
      </a>
      </div>
      <el-menu :default-active="activeIndex"
      class="el-menu-demo menu"
      mode="horizontal" 
      @select="handleSelect" 
      background-color="#33a3dc"
      text-color="#fff"
      active-text-color="#ffd04b"
      router
      >
        <el-menu-item index="1" style="height: 50px;line-height: 50px" route="/" >发现音乐</el-menu-item>
        <el-menu-item index="2" style="height: 50px;line-height: 50px" route="/my">我的音乐</el-menu-item>
      </el-menu>
      <Search></Search>
      <span @click="dialogVisible = true">关于</span>
    </div>
    
    <el-dialog title="关于本项目" :visible.sync="dialogVisible" width="30%">
      <p>作者:刘松柏</p>
      <p>简介：
        <br>
        <ul>
          <li>一个正在努力的大三学生</li>
          <li>喜欢编程，但技术还不太行</li>
          <li>奋斗有点晚，但没有迟到</li>
          <li>向往自由，对未来充满想象</li>
        </ul>
      </p>
      <p>源码：<a href="https://github.com/Future23365/cloud" title="https://github.com/Future23365/cloud">源码地址</a>
      后端来自Binaryity:<a href="https://github.com/Binaryify/NeteaseCloudMusicApi" title="https://github.com/Binaryify/NeteaseCloudMusicApi">感谢提供后端接口</a>
      </p>
      <p>技术栈:
        <ul>
          <li>- Vue</li>
          <li>- Vue Router</li>
          <li>- vuex</li>
          <li>- ElementUI</li>
          <li>- Axios</li>
        </ul>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Search from '@/components/Search'
export default {
  name: 'Header',
  data() {
    return {
      dialogVisible: false,
      activeIndex: '1'
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key,keyPath);
    }
  },
  components: {
    Search
  }
}
</script>

<style lang="scss" scoped>
  .header {
    min-width: 800px;
    height: 50px;
    background: #67C23A;
    .main {
      margin: 0 auto;
      max-width: 1200px;
      min-width: 800px;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .logo a {
        /* display: block; */
        float: left;
        width: 157px;
        height: 50px;
        .page {
          width: 157px;
          height: 50px;
          background: url(../assets/img/topbar.png) no-repeat;
          background-position: 0 -10px;
        }
      }
      span {
        /* float: right; */
        height: 50px;
        line-height: 50px;
        color: #fff;
        cursor: pointer;
      }
    }
    .el-dialog {
      p {
        margin-top: 10px;
      }
    }
  }
</style>