<template>
  <div class="rights">
    <tip :itemName="['权限管理', '权限列表']" />
    <el-card class="box-card">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="#"
          width="50">
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
          width="250">
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径"
          width="250">
        </el-table-column>
        <el-table-column
          prop="level"
          label="权限等级">
          <template v-slot="scope">
            <el-tag :type="tag[scope.row.level].type">{{tag[scope.row.level].title}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>

import {
  getRightsRequest
} from 'network/rightsRequest'

import Tip from 'components/tip'

export default {
  data(){
    return {
      tableData: [],
      tag: [
        {
          type: "",
          title: "一级权限"
        },
        {
          type: "success",
          title: "二级权限"
        },
        {
          type: "warning",
          title: "三级权限"
        }
      ]
    }
  },
  components: {
    Tip
  },
  created(){
    this._getRightsRequest('list')
  },
  methods: {
    _getRightsRequest(type){
      getRightsRequest(type).then(res => {
        if(this.messageTip(res.meta)){
          this.tableData.push(...res.data)
        }
      })
    },
    messageTip(meta){
      if(meta.status == 200 || meta.status == 201){
        this.$message({
          message: meta.msg,
          type: 'success'
        });   
        return true
      }else{
        this.$message({
          message: meta.msg,
          type: 'error'
        });
        return false
      }
    }
  }
}
</script>

<style>

</style>