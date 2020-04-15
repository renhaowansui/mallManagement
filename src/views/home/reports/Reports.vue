<template>
  <div class="reports">
    <tip :itemName="['数据统计', '数据报表']" />
    <el-card class="box-card">
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import {
  getReportsRequest
} from 'network/reportsRequest'

import Tip from 'components/tip'

import echarts from 'echarts'
import _ from 'lodash'

export default {
  data(){
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  components: {
    Tip
  },
  created(){
    this._getReportsRequest()
  },
  methods: {
    async _getReportsRequest(){
      const res = await getReportsRequest()
      if(this.messageTip(res.meta)){
        // this.options = Object.assign(this.options, res.data)
        this.draw(res.data)
      }
    },
    draw(data){
      var myChart = echarts.init(document.getElementById("main"));
      const resultData = _.merge(this.options, data)
      myChart.setOption(resultData);
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

</style>