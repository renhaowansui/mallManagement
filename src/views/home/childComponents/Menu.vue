<template>
  <div class="menu">
    <div class="collapseBut" :v-model="isCollapse" @click="collapseClick()">|||</div>
    <el-menu  class="el-menu-vertical-demo" 
              @open="handleOpen" 
              @close="handleClose" 
              :collapse="isCollapse"
              text-color="#fff"
              background-color="#333744"
              :collapse-transition="false"
              unique-opened
              router
              :default-active="currentIndex">
      <el-submenu :index="item.id + ''" 
                  v-for="(item, index) in menuList" 
                  :key="index">
        <template slot="title">
          <i :class="fontIcon[item.id]"></i>
          <span slot="title">{{item.authName}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item :index="subItem.path" 
                        v-for="(subItem, subIndex) in item.children"
                        :key="subIndex"
                        @click="itemClick">
            <i class="el-icon-s-operation"></i>
            <span slot="title">{{subItem.authName}}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: {
    menuList: {
      type: Array,
      default(){
        return []
      }
    }
  },
  data(){
    return {
      isCollapse: false,
      fontIcon: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      currentIndex: ""
    }
  },
  mounted(){
    this.itemClick()
  },
  methods: {
    collapseClick(){
      this.isCollapse = !this.isCollapse
      this.$emit("collapseClick")
    },
    handleOpen(){
      console.log("1")
    },
    handleClose(){
      console.log("2")
    },
    itemClick(){
      const pathStr = this.$route.path.split('/')
      console.log(pathStr)
      this.currentIndex = pathStr[1]
    }
  },
  watch: {
    '$route': 'itemClick'
  }
}
</script>

<style lang="less" scoped>
  .menu{
    height: 100%;
  }
  .collapseBut{
    background: gray;
  }
  i{
    font-size: 23px;
    margin-right: 10px;
  }
</style>