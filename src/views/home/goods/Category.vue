<template>
  <div class="category">
    <tip :itemName="['商品管理', '商品列表']" />
    <el-card class="box-card">
      <el-row> 
        <el-col>
          <el-button type="primary" 
                     @click="addCategory">
                     添加分类</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        style="width: 100%"
        row-key="cat_id"
        border
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column
          label="#"
          type='index'
          width="50">
        </el-table-column>
        <el-table-column
          prop="cat_name"
          label="分类名称"
          width="250">
        </el-table-column>
        <el-table-column
          prop="cat_deleted"
          label="是否有效"
          width="250">
          <template v-slot="scope">
            <i class="el-icon-success" 
               style="color: lightgreen;"
               v-if="!scope.row.cat_deleted"></i>
            <i class="el-icon-error" 
               style="color: red;"
               v-else></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="cat_level"
          label="排序">
          <template v-slot='scope'>
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template v-slot='scope'>
            <el-button type="primary" 
                      icon="el-icon-edit" 
                      @click="editCategory(scope.row)">
                      编辑</el-button>
            <el-button type="danger" 
                      icon="el-icon-delete" 
                      @click="deleteCategory(scope.row.cat_id)">
                      删除</el-button>
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
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClose">
      <el-form :model="addCategoryInfo" 
               :rules="addDialogRules" 
               ref="addDialogFormRef" 
               label-width="80px" >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoryInfo.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" prop="cat_pid">
          <el-cascader
            v-model="selectCategory"
            :options="allCategory"
            :props="{ 
              value: 'cat_id',
              label: 'cat_name',
              checkStrictly: true 
            }"
            clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategoryTo()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogVisible = false">
      <el-form :model="editCategoryInfo" 
               :rules="addDialogRules" 
               ref="editDialogFormRef" 
               label-width="80px" >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCategoryInfo.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategoryTo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import {
  getCategoryRequest,
  addCategoryRequest,
  editCategoryRequest,
  deleteCategoryRequest,

} from 'network/categoryRequest'

import Tip from 'components/tip'

export default {
  data(){
    return {
      rolesMessageTip: false,
      requestInfo: {
        type: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      rowIndex: 0,
      tableData: [],
      addDialogVisible: false,
      allCategory: [],
      addCategoryInfo: {
        cat_name: ''
      },
      addDialogRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ]
      },
      selectCategory: [],
      editDialogVisible: false,
      editCategoryInfo: {
        cat_id: '',
        cat_name: ''
      }
    }
  },
  components: {
    Tip
  },
  created(){
    this._getCategoryRequest(this.requestInfo)
  },
  methods: {
    /*
    * 请求数据方法
    */
    _getCategoryRequest(requestInfo){
      getCategoryRequest(requestInfo).then(res => {
        this.total = res.data.total
        this.tableData = res.data.result
        if(!this.rolesMessageTip){
          this.messageTip(res.meta)
          this.rolesMessageTip = true
        }
      })
    },
    _getAllCategoryRequest(){
      getCategoryRequest().then(res => {
        this.allCategory = res.data
      })
    },
    _addCategoryRequest(cat_pid, cat_name, cat_level){
      addCategoryRequest(cat_pid, cat_name, cat_level).then(res =>{ 
        this.messageTip(res.meta)
        this._getCategoryRequest(this.requestInfo)
      })
    },
    _editCategoryRequest(cat_id, cat_name){
      editCategoryRequest(cat_id, cat_name).then(res => {
        this.messageTip(res.meta)
        this._getCategoryRequest(this.requestInfo)
      })
    },
    _deleteCategoryRequest(cat_id){
      deleteCategoryRequest(cat_id).then(res => {
        this.messageTip(res.meta)
        this._getCategoryRequest(this.requestInfo)
      })
    },
    /*
    * 业务操作方法
    */
    addCategory(){
      this._getAllCategoryRequest()
      this.addDialogVisible = true
    },
    addCategoryTo(){
      this.$refs.addDialogFormRef.validate((valid) => {
        if (!valid) return
        let cat_pid = 0
        let cat_level = 0
        if(this.selectCategory.length > 0){
          cat_pid = this.selectCategory[this.selectCategory.length - 1]
          cat_level = this.selectCategory.length
        }else{
          cat_pid = 0
          cat_level = 0
        }
        this._addCategoryRequest(cat_pid, this.addCategoryInfo.cat_name, cat_level)
        this.addDialogVisible = false
      });
    },
    addDialogClose(){
      this.selectCategory = []
      this.$refs.addDialogFormRef.resetFields()
    },
    editCategory(cateInfo){
      this.editCategoryInfo.cat_id = cateInfo.cat_id
      this.editCategoryInfo.cat_name = cateInfo.cat_name
      this.editDialogVisible = true
    },
    editCategoryTo(){
      this._editCategoryRequest(this.editCategoryInfo.cat_id, this.editCategoryInfo.cat_name)
      this.editDialogVisible = false
    },
    deleteCategory(cat_id){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._deleteCategoryRequest(cat_id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    handleSizeChange(val){
      this.requestInfo.pagesize = val
      this._getCategoryRequest(this.requestInfo)
    },
    handleCurrentChange(val){
      this.requestInfo.pagenum = val
      this._getCategoryRequest(this.requestInfo)
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
  .el-table{
    margin: 20px 0;
  }
  .el-cascader{
    width: 100%;
  }
</style>