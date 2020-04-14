<template>
  <div class="goods">
    <tip :itemName="['商品管理', '商品列表']" />
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-input class="searchInput" 
                    placeholder="请输入内容" 
                    v-model="searchInput"
                    clearable
                    @clear="searchGood">
            <el-button slot="append" icon="el-icon-search" @click="searchGood"></el-button>
          </el-input>
          <el-button type="primary" @click="addGood">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        stripe
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="#"
          width="50">
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="500">
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="120">
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="100">
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间"
          width="200">
          <template v-slot="scope">
            {{scope.row.add_time | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template v-slot='scope'>
            <el-button type="primary" 
                      icon="el-icon-edit" 
                      @click="editGood(scope.row)">
                      </el-button>
            <el-button type="danger" 
                      icon="el-icon-delete" 
                      @click="deleteGood(scope.row.goods_id)">
                      </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="requestInfo.pagenum"
        :page-sizes="[5, 10, 20]"
        :page-size="requestInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>

import { 
  getGoodsRequest,
  deleteGoodRequest,

} from "network/goodsRequest"

import Tip from 'components/tip'

import { formatDate } from 'common/utils'

export default {
  data(){
    return {
      requestInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      searchInput: '',
      total: 0,
      tableData: [],
      
    }
  },
  components: {
    Tip
  },
  created(){
    this._getGoodsRequest(this.requestInfo)
  },
  methods: {
    /*
    * 请求数据方法
    */
    async _getGoodsRequest(requestInfo){
      const res = await getGoodsRequest(requestInfo)
      if(this.messageTip(res.meta)){
        this.total = res.data.total
        this.tableData = res.data.goods
      }
    },
    async _deleteGoodRequest(goodId){
      const res = await deleteGoodRequest(goodId)
      if(this.messageTip(res.meta)){
        this._getGoodsRequest(this.requestInfo)
      }
    },
    /*
    * 业务操作方法
    */
    searchGood(){
      this.requestInfo.query = this.searchInput
      this.requestInfo.pagenum = 1
      this._getGoodsRequest(this.requestInfo)
    },
    handleSizeChange(val) {
      this.requestInfo.pagesize = val
      this._getGoodsRequest(this.requestInfo)
    },
    handleCurrentChange(val) {
      this.requestInfo.pagenum = val
      this._getGoodsRequest(this.requestInfo)
    },
    addGood(){
      this.$router.push('goods/add')
    },
    editGood(){
      this.$message({
        message: "未完成该功能",
        type: 'error'
      });
    },
    deleteGood(goodId){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._deleteGoodRequest(goodId)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
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
  },
  filters: {
    formatDate: function(value){
      const date = new Date(value * 1000)
      return formatDate(date, "yyyy-MM-dd")
    }
  }
}
</script>

<style lang="less" scoped>
  .searchInput{
    width: 400px;
    margin-right: 20px;
  }
  .el-table{
    margin: 20px 0;
  }
</style>