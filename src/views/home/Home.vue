<template>
  <el-container>
    <el-header>
      <div class="logo">
        <img src="~assets/img/logo.png" alt="">
        <span>商城后台管理系统</span>
      </div>
      <el-button type="info" @click="quit">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :style="{width: !isCollapse? '200px':''}">
        <my-menu :menuList="menu"
                 @collapseClick="handleCollapse" />
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

import { homeRequest } from 'network/homeRequest'

import myMenu from './childComponents/Menu'

export default {
  name: 'Home',
  data(){
    return {
      menu: [],
      isCollapse: false,
    }
  },
  components: {
    myMenu
  },
  created(){
    this._getHomeRequest()
  },
  methods: {
    _getHomeRequest(){
      homeRequest().then(res =>{
        this.menu = res.data
      })
    },

    handleCollapse(){
      this.isCollapse = !this.isCollapse
    },
    quit(){
      this.$router.replace('/login')
      window.sessionStorage.clear();
    },
  }
}
</script>

<style lang="less" scoped>
  .logo{
    display: flex;
    align-items: center;
  }
  .logo img{
    display: inline-block;
    width: 35px;
    height: 35px;
    margin-right: 10px;
  }
  
</style>