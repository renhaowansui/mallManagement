<template>
  <div class="params">
    <tip :itemName="['商品管理', '参数列表']" />
    <el-card class="box-card">
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon>
      </el-alert>
      <div class="select">
        <span>选择商品分类：</span>
        <el-cascader
          v-model="selectCategory"
          :options="categoryData"
          :props="{ 
            value: 'cat_id',
            label: 'cat_name',
            expandTrigger: 'hover' }"
            @change="selectChange">
        </el-cascader>
      </div>
      <el-tabs v-model="tabActiveName" @tab-click="tabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" 
                     size='mini' 
                     :disabled='isSelected'
                     @click="addParams">添加属性</el-button>
          <el-table
            :data="manyTableData"
            style="width: 100%">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(tag, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="deleteParamsTag(scope.row, index)">
                  {{tag}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.tagInputVisible"
                  v-model="scope.row.tagInputValue"
                  ref="saveTagInput"
                  @keyup.enter.native="addParamsTag(scope.row)"
                  @blur="addParamsTag(scope.row)"
                >
                </el-input>
                <el-button v-else 
                           class="button-new-tag" 
                           size="small" 
                           @click="showTagInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="#"
              type="index">
            </el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
              width="500px">
            </el-table-column>
            <el-table-column
              label="操作">
              <template v-slot='scope'>
                <el-button type="primary" icon="el-icon-edit" @click="editParams(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" 
                     size='mini' 
                     :disabled='isSelected'
                     @click="addParams">添加参数</el-button>
          <el-table
            :data="onlyTableData"
            style="width: 100%">
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag
                  v-for="(tag, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="deleteParamsTag(scope.row, index)">
                  {{tag}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.tagInputVisible"
                  v-model="scope.row.tagInputValue"
                  ref="saveTagInput"
                  @keyup.enter.native="addParamsTag(scope.row)"
                  @blur="addParamsTag(scope.row)"
                >
                </el-input>
                <el-button v-else 
                           class="button-new-tag" 
                           size="small" 
                           @click="showTagInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="#"
              type="index">
            </el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
              width="500px">
            </el-table-column>
            <el-table-column
              label="操作">
              <template v-slot='scope'>
                <el-button type="primary" icon="el-icon-edit" @click="editParams(scope.row)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog
      :title="'添加' + getTabTitle"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClose">
      <el-form ref="addDialogForm" 
               :model="addDialogInfo" 
               label-width="80px"
               :rules="dialogRules">
        <el-form-item :label="getTabTitle" prop="attr_name">
          <el-input v-model="addDialogInfo.attr_name" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogTo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      :title="'编辑' + getTabTitle"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClose">
      <el-form ref="editDialogForm" 
              :model="editDialogInfo" 
              label-width="80px"
              :rules="dialogRules">
        <el-form-item :label="getTabTitle" prop="attr_name">
          <el-input v-model="editDialogInfo.attr_name" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogTo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { getCategoryRequest } from 'network/categoryRequest'
import {
  getParamsRequest,
  addParamsRequest,
  editParamsRequest,
  deleteParamsRequest,
  
} from 'network/paramsRequest'

import Tip from 'components/tip'

export default {
  data(){
    return {
      rolesMessageTip: false,
      categoryData: [],
      selectCategory: [],
      tabActiveName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      addDialogInfo: {
        cat_id: '',
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      },
      dialogRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editDialogInfo: {
        cat_id: '',
        attr_id: '',
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      },
    }
  },
  computed: {
    isSelected(){
      return this.selectCategory.length? false : true
    },
    getTabTitle(){
      return this.tabActiveName == 'many'? '动态参数' : '静态属性'
    },
    getSelectCategoryId(){
      return this.selectCategory[this.selectCategory.length -1]
    }
  },
  components: {
    Tip
  },
  created(){
    this._getCategoryRequest()
  },
  methods: {
    /*
    * 请求数据方法
    */
    _getCategoryRequest(){
      getCategoryRequest().then(res => {
        this.categoryData = res.data
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
          this.manyTableData = res.data
        }else{
          this.onlyTableData = res.data
        }
        if(!this.rolesMessageTip){
          this.messageTip(res.meta)
          this.rolesMessageTip = true
        }
      })
    },
    _addParamsRequest(addParamsInfo){
      addParamsRequest(addParamsInfo).then(res => {
        this._getParamsRequest(this.getSelectCategoryId, this.tabActiveName)
        this.messageTip(res.meta)
      })
    },
    _editParamsRequest(editParamsInfo){
      editParamsRequest(editParamsInfo).then(res => {
        this._getParamsRequest(this.getSelectCategoryId, this.tabActiveName)
        this.messageTip(res.meta)
      })
    },
    _addTagParamsRequest(editParamsInfo){
      editParamsRequest(editParamsInfo).then(res => {
        this.messageTip(res.meta)
      })
    },
    _deleteParamsRequest(cat_id, attr_id){
      deleteParamsRequest(cat_id, attr_id).then(res => {
        this._getParamsRequest(this.getSelectCategoryId, this.tabActiveName)
        this.messageTip(res.meta)
      })
    },
    /*
    * 业务操作方法
    */
    selectChange(){
      this._getParamsRequest(this.getSelectCategoryId, this.tabActiveName)
    },
    tabClick(){
      if(!this.selectCategory.length) return
      this._getParamsRequest(this.getSelectCategoryId, this.tabActiveName)
    },
    addParams(){
      this.addDialogVisible = true
    },
    addDialogClose(){
      this.addDialogVisible = false
      this.$refs.addDialogForm.resetFields();
    },
    addDialogTo(){
      this.$refs.addDialogForm.validate((valid) => {
        if (!valid) return 
        this.addDialogInfo.cat_id = this.getSelectCategoryId
        this.addDialogInfo.attr_sel = this.tabActiveName
        this._addParamsRequest(this.addDialogInfo)
        this.addDialogVisible = false
      });
    },
    editParams(paramsInfo){
      this.editDialogInfo.cat_id = this.getSelectCategoryId
      this.editDialogInfo.attr_id = paramsInfo.attr_id
      this.editDialogInfo.attr_name = paramsInfo.attr_name
      this.editDialogInfo.attr_sel = paramsInfo.attr_sel
      this.editDialogInfo.attr_vals = paramsInfo.attr_vals
      this.editDialogVisible = true
    },
    editDialogClose(){
      this.editDialogVisible = false
      this.$refs.editDialogForm.resetFields();
    },
    editDialogTo(){
      this.$refs.editDialogForm.validate((valid) => {
        if (!valid) return 
        this._editParamsRequest(this.editDialogInfo)
        this.editDialogVisible = false
      });
    },
    deleteParams(paramsInfo){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._deleteParamsRequest(paramsInfo.cat_id, paramsInfo.attr_id) 
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    addParamsTag(row){
      if(row.tagInputValue.length){
        row.attr_vals.push(row.tagInputValue)
        this._addTagParamsRequest(row)
      }
      row.tagInputVisible = false
      row.tagInputValue = ''
    },
    deleteParamsTag(row, index){
      row.attr_vals.splice(index, 1)
      this._addTagParamsRequest(row)
    },
    showTagInput(row){
      row.tagInputVisible = true
      // 页面上元素被重新渲染之后，才会指定回调
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
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

<style lang="less" scoped>
  .el-alert{
    width: 400px;
  }
  .select{
    margin: 20px 0;
    font-size: 14px;
  }
  .el-cascader{
    width: 300px;
  }
  .el-tag{
    margin-right: 10px;
  }
  .input-new-tag{
    width: 80px;
  }
</style>