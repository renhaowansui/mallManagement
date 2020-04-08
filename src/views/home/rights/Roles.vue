<template>
  <div class="roles">
    <tip :itemName="['角色管理', '角色列表']" />
    <el-card class="box-card">
      <el-row><el-button type="primary" @click="addDialogVisible = true">添加角色</el-button></el-row>
      <el-table
        :data="tableData"
        stripe
        border
       >
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-form label-position="left"  class="demo-table-expand">
              <el-row class="btop" 
                      :class="index1 == scope.row.children.length-1? 'bbottom': '' " 
                      v-for="(tag1, index1) in scope.row.children"
                      :key="tag1.id">
                <el-col :span="6">
                  <el-tag closable
                          :disable-transitions="false"
                          @close="deleteRights(scope.row, tag1.id)">
                    {{tag1.authName}}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>        
                <el-col :span="18">
                  <el-row :class="index2 ==0 ? '': 'btop' "
                          v-for="(tag2, index2) in tag1.children"
                          :key="tag2.id">
                    <el-col :span="8">
                      <el-tag type='success' 
                              closable
                              :disable-transitions="false"
                              @close="deleteRights(scope.row, tag2.id)">
                        {{tag2.authName}}
                      </el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="16">
                      <el-tag type='warning' 
                              v-for="tag3 in tag2.children"
                              :key="tag3.id"
                              closable 
                              :disable-transitions="false"
                              @close="deleteRights(scope.row, tag3.id)">
                        {{tag3.authName}}
                      </el-tag>
                    </el-col>
                  </el-row>
                </el-col>      
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="#"
          width="50">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="200">
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
          width="250">
        </el-table-column>
        <el-table-column
          label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editRole(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" @click="setRights(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色提示框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClose">
      <el-form :model="addRoleForm" 
               status-icon 
               :rules="addRoleRules" 
               ref="addRoleFormRef" 
               label-width="80px" >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleTo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色提示框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClose">
      <el-form :model="editRoleForm" 
               status-icon 
               :rules="addRoleRules" 
               ref="editRoleFormRef" 
               label-width="80px" >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleTo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限提示框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setDialogVisible"
      width="40%"
      @close="setDialogClose">
      <el-tree
        :data="setRightsData"
        ref="rightsTree"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys = "haveRightsData"
        :props="setRightsDataProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRightsTo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { 
  getRolesRequest,
  addRoleRequest,
  editRoleRequest,
  deleteRoleRequest,
  deleteRightRequest,
  getRightsRequest,
  setRightsRequest,

  } from 'network/rolesRequest'

import Tip from 'components/tip'

export default {
  data() {
    return {
      rolesMessageTip: false,
      tableData: [],
      addDialogVisible: false,
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      addRoleRules: {
        roleName: [
          { validator: '', trigger: 'blur' },
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ]
      },
      editDialogVisible: false,
      editRoleForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      setRightsRolesId: '',
      setRightsData: [],
      haveRightsData: [],
      setDialogVisible: false,
      setRightsDataProps: {
        children: 'children',
        label: 'authName'
      }
    }
  },
  components: {
    Tip
  },
  created() {
    this._getRolesRequest()
  },
  methods: {
    /*
    * 数据请求方法
    */
    _getRolesRequest(){
      getRolesRequest().then(res => {
        this.tableData.splice(0,this.tableData.length)
        if(!this.rolesMessageTip){
          this.messageTip(res.meta)
          this.rolesMessageTip = true
        }
        const users = res.data.forEach(item => {
          this.tableData.push(item)
        })
      })
    },
    _addRoleRequest(roleInfo){
      addRoleRequest(roleInfo).then(res => {
        this.addDialogVisible = false
        this.messageTip(res.meta)
        this._getRolesRequest()
      })
    },
    _editRoleRequest(roleInfo){
      editRoleRequest(roleInfo).then(res => {
        this.editDialogVisible = false
        this.messageTip(res.meta)
        this._getRolesRequest()
      })
    },
    _deleteRoleRequest(roleId){
      deleteRoleRequest(roleId).then(res => {
        this.messageTip(res.meta)
        this._getRolesRequest()
      })
    },
    _deleteRightRequest(roleInfo, rightId){
      deleteRightRequest(roleInfo.id, rightId).then(res => {
        roleInfo.children = res.data
        this.messageTip(res.meta)
      })
    },
    _getRightsRequest(){
      getRightsRequest('tree').then(res => {
        this.setRightsData = res.data
        this.messageTip(res.meta)
      })
    },
    _setRightsRequest(roleId, rights){
      setRightsRequest(roleId, rights).then(res => {
        this._getRolesRequest()
        this.messageTip(res.meta)
      })
    },
    /*
    * 业务操作方法
    */
    addRoleTo(){
      this.$refs.addRoleFormRef.validate((valid) => {
        if (!valid) return
        this._addRoleRequest(this.addRoleForm)
      });
    },
    addDialogClose(){
      this.$refs.addRoleFormRef.resetFields()
    },
    editRole(roleInfo){
      this.editRoleForm.id = roleInfo.id
      this.editRoleForm.roleName = roleInfo.roleName
      this.editRoleForm.roleDesc = roleInfo.roleDesc
      this.editDialogVisible = true
    },
    editRoleTo(){
      this.$refs.editRoleFormRef.validate((valid) => {
        if (!valid) return
        this._editRoleRequest(this.editRoleForm)
      });
    },
    editDialogClose(){
      this.editDialogVisible = false
    },
    deleteRole(roleId){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._deleteRoleRequest(roleId)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    deleteRights(roleInfo, rightId){
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._deleteRightRequest(roleInfo, rightId)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    setRights(roleInfo){
      this.haveRightsData = []
      this.setRightsRolesId = roleInfo.id
      // 请求所有权限列表
      this._getRightsRequest()
      // 获取该角色拥有的权限列表
      this.getHaveRightsData(roleInfo, this.haveRightsData)
      this.setDialogVisible = true
    },
    getHaveRightsData(roleInfo, arr){
      if(!roleInfo.children) {
        return arr.push(roleInfo.id)
      }
      roleInfo.children.forEach( item => this.getHaveRightsData(item, arr) )
    },
    setRightsTo(){
      const rights = [
        ...this.$refs.rightsTree.getCheckedKeys(),
        ...this.$refs.rightsTree.getHalfCheckedKeys()
      ]
      this._setRightsRequest(this.setRightsRolesId, rights.join(','))
      this.setDialogVisible = false
    },
    setDialogClose(){
      this.haveRightsData = []
      this.setDialogVisible = false
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
    margin-top: 20px;
  }
  .el-row{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .el-tag{
      margin: 7px;
    }
    i{
      vertical-align: middle;
    }
  }
  .btop{
    border-top: 1px solid #eee;
  }
  .bbottom{
    border-bottom: 1px solid #eee;
  }
</style>