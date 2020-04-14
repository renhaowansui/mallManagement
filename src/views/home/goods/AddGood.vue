<template>
  <div class="addGood">
    <tip :itemName="['商品管理', '商品列表', '添加商品']" />
    <el-card class="box-card">
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon>
      </el-alert>
      <el-steps :active="activeStep - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="goodInfo" :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-tabs v-model="activeStep"
                 tab-position="left" 
                 @tab-click='tabClick'
                 :before-leave="tabBeforeLeave">
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodInfo.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="goodInfo.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_price">
              <el-input v-model.number="goodInfo.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_price">
              <el-input v-model.number="goodInfo.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="goodInfo.goods_cat"
                :options="allCategory"
                :props="{ 
                  value: 'cat_id',
                  label: 'cat_name',
                  expandTrigger: 'hover' }"
                @change="selectChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <el-form-item v-for="(item, index) in manyParams"
                          :key="index"
                          :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="tag in item.attr_vals" 
                             :key="tag" 
                             :label="tag" 
                             name="type"
                             border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item v-for="(item, index) in onlyParams"
                          :key="index"
                          :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="tag in item.attr_vals" 
                             :key="tag" 
                             :label="tag" 
                             name="type"
                             border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload
              class="upload-demo"
              :action="uploadFileInfo.action"
              :headers="uploadFileInfo.headers"
              :on-preview="filePreview"
              :on-remove="fileRemove"
              :on-success="fileSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <quill-editor
              ref="myQuillEditor"
              v-model="goodInfo.goods_introduce"
            />
            <el-button type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="preDialogVisible"
      width="30%">
      <img :src="preImgPath" alt="">
      <span slot="footer" class="dialog-footer">
        <el-button @click="preDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="preDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { getCategoryRequest } from 'network/categoryRequest'
import { getParamsRequest } from 'network/paramsRequest'
import { addGoodRequest } from 'network/goodsRequest' 

// 引入富文本编辑器组件
import { quillEditor } from 'vue-quill-editor'

import Tip from 'components/tip'

export default {
  data(){
    return {
      activeStep: 0,
      allCategory: [],
      manyParams: [],
      onlyParams: [],
      goodInfo: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        attrs: [],
        goods_introduce: '',
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      uploadFileInfo: {
        action: 'http://timemeetyou.com:8889/api/private/v1/upload',
        headers: {
          Authorization: window.sessionStorage.getItem('token')
        }
      },
      preImgPath: '',
      preDialogVisible: false
    }
  },
  computed: {
    getCategoryId(){
      return this.goodInfo.goods_cat[this.goodInfo.goods_cat.length - 1]
    }
  },
  components: {
    Tip,
    quillEditor
  },
  created(){
    this._getAllCategoryRequest()
  },
  methods: {
    /*
    * 请求数据方法
    */
    _getAllCategoryRequest(){
      getCategoryRequest().then(res => {
        this.allCategory = res.data
      })
    },
    _getParamsRequest(cat_id, sel){
      getParamsRequest(cat_id, sel).then(res => {
        res.data.forEach(item => {
          item.tagInputVisible = false
          item.tagInputValue = ''
          item.attr_vals = item.attr_vals? item.attr_vals.split(" ") : []
        })
        if(sel === 'many'){
          this.manyParams = res.data
        }else{
          this.onlyParams = res.data
        }
        if(!this.rolesMessageTip){
          this.messageTip(res.meta)
          this.rolesMessageTip = true
        }
      })
    },
    _addGoodRequest(goodInfo){
      addGoodRequest(goodInfo).then(res => {
        this.$router.replace('/goods')
        this.messageTip(res.meta)
      })
    },
    /*
    * 业务操作方法
    */
    selectChange(){
      // 清空参数数组
      this.manyParams = []
      this.onlyParams = []
    },
    tabClick(tab) {
      if(this.goodInfo.goods_cat.length !== 3) return 
      // 判断请求商品参数数据，还是请求商品属性数据
      if(tab.index == 1 && this.manyParams.length == 0){
        this._getParamsRequest(this.getCategoryId, 'many')
      }else if(tab.index ==2 && this.onlyParams.length == 0){
        this._getParamsRequest(this.getCategoryId, 'only')
      }
    },
    tabBeforeLeave(activeName, oldActiveName){
      if(oldActiveName === '0' && this.goodInfo.goods_cat.length !== 3){
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    filePreview(file) {
      this.preImgPath = file.response.data.url
      this.preDialogVisible = true
    },
    fileRemove(file) {
      const tmp_path = file.response.data.tmp_path
      const index = this.goodInfo.pics.findIndex(item => {
        item.pic === tmp_path
      })
      this.goodInfo.pics.splice(index, 1)
    },
    fileSuccess(res, file){
      if(this.messageTip(res.meta)){
        const obj = {
          'pic': res.data.tmp_path
        }
        this.goodInfo.pics.push(obj)
      }
    },
    add(){
      this.$refs.ruleForm.validate((valid) => {
        if (!valid){
          this.$message({
            message: '请完成表单必填内容',
            type: 'error'
          });
        }
        this.manyParams.forEach(item => {
          const obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.goodInfo.attrs.push(obj)
        })
        this.onlyParams.forEach(item => {
          const obj = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.goodInfo.attrs.push(obj)
        })
        this._addGoodRequest(this.goodInfo)
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
  }
}
</script>

<style lang="less" scoped>
  .el-steps{
    margin: 20px 0;
  }
  .el-cascader{
    width: 320px;
  }
</style>