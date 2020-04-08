<template>
  <div class="tip">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in itemName" 
                          :key="index">
        {{item}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: {
    itemName: {
      type: Array,
      default(){
        return []
      }
    }
  }
}
</script>

<style>

</style>