<template>
  <div class="orders">
    <tip :itemName="['订单管理', '订单列表']" />
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-input class="searchInput" 
                    placeholder="请输入内容" 
                    v-model="searchInput"
                    clearable
                    @clear="searchOrder">
            <el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>
          </el-input>
        </el-col>
      </el-row>
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
          prop="order_number"
          label="订单编号">
        </el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="140">
        </el-table-column>
        <el-table-column
          prop="pay_status"
          label="是否付款"
          width="100">
          <template v-slot='scope'>
            <el-tag type="success" v-if="scope.row.pay_status == 1">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="100">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="下单时间"
          width="250">
        </el-table-column>
        <el-table-column
          label="操作"
          width="250">
          <template>
            <el-button type="primary" icon="el-icon-edit" @click="addrClick"></el-button>
            <el-button type="success" icon="el-icon-location" @click="locaClick"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="requestInfo.pagenum"
        :page-sizes="[5, 10, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addrDialogVisible"
      width="30%">
      <el-form ref="form" :model="addrInfo" label-width="80px">
        <el-form-item label="省市区/县">
          <el-cascader
            v-model="addrInfo.selectAddr"
            :options="addrData"
            :props="{ expandTrigger: 'hover' }">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="addrInfo.detailAddr"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addrDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addrDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="locaDialogVisible"
      width="40%"
      @close='locaDialogClose'>
      <el-timeline reverse>
        <el-timeline-item
          v-for="(activity, index) in locaInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>

import {
  getOrdersRequest,
  logisticsInfoRequest,

} from 'network/ordersRequest'

import Tip from 'components/tip'

import cityData from 'common/citydata'

export default {
  data(){
    return {
      requestInfo: {
        query: '',
        pagenum: 5,
        pagesize: 5
      },
      searchInput: '',
      total: 0,
      tableData: [],
      addrDialogVisible: false,
      addrData: [],
      addrInfo: {
        selectAddr: [],
        detailAddr: ''
      },
      locaDialogVisible: false,
      locaInfo: []
    }
  },
  components: {
    Tip
  },
  created(){
    this._getOrdersRequest(this.requestInfo)
  },
  methods: {
    async _getOrdersRequest(requestInfo){
      const res = await getOrdersRequest(requestInfo)
      if(this.messageTip(res.meta)){
        this.tableData = res.data.goods
        this.total = res.data.total
      }
    },
    async _logisticsInfoRequest(){
      const res = await logisticsInfoRequest()
      if(this.messageTip(res.meta)){
        this.locaInfo = res.data
      }
    },
    searchOrder(){
      this.requestInfo.query = this.searchInput
      this._getOrdersRequest(this.requestInfo)
    },
    addrClick(){
      this.addrData = cityData
      this.addrDialogVisible = true
    },
    locaClick(){
      this._logisticsInfoRequest()
      this.locaDialogVisible = true
    },
    locaDialogClose(){
      this.locaInfo = []
    },
    handleSizeChange(val){
      this.requestInfo.pagesize = val
      this._getOrdersRequest(this.requestInfo)
    },
    handleCurrentChange(val){
      this.requestInfo.pagenum = val
      this._getOrdersRequest(this.requestInfo)
    },
    messageTip(meta){
      if(meta.status == 200 || meta.status == 201){
        this.$message({
          message: meta.msg || meta.message,
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
  .searchInput{
    width: 400px;
  }
  .el-table{
    margin: 20px 0;
  }
  .el-cascader{
    width: 100%;
  }
  .el-form-item__label{
    float: left !important;
  }
</style>