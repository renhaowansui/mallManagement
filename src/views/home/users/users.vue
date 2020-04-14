<template>
  <div class="users">
    <tip :itemName="['用户管理', '用户列表']" />
    <div class="table">
      <!-- 搜索列表内容输入框 -->
      <el-input class="searchInput"
                 placeholder="请输入内容" 
                 v-model="requestInfo.query">
        <el-button slot="append" icon="el-icon-search" @click="searchClick"></el-button>
      </el-input>
      <el-button class="searchBut" type="primary" @click="addDialogVisible = true">添加用户</el-button>
      <!-- 内容显示 -->
      <el-table
        :data="tableData"
        border
        stripe>
        <el-table-column
          fixed
          type="index"
          label="#"
          width="50">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
          width="180">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色"
          width="180">
        </el-table-column>
        <el-table-column
          prop="mg_state"
          label="状态"
          width="180">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="_userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editUser(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
            <el-button type="warning" icon="el-icon-setting" @click="setUserRole(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="requestInfo.pagenum"
        :page-sizes="[5, 10, 20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="36%"
      @closed="addDialogClose">
      <el-form :model="addUserForm" 
               status-icon 
               :rules="addUesrRules" 
               ref="addUserFormRef" 
               label-width="70px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addUserForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserTo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="36%">
      <el-form :model="editUserForm" 
               status-icon 
               :rules="addUesrRules" 
               ref="editUserFormRef" 
               label-width="70px" >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserTo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配用户角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="36%"
      @close="setSelectRole=''">
      <el-form :model="userRoleForm" 
               status-icon 
               ref="userRoleFormRef" 
               label-width="70px" >
        <p>当前用户：{{userRoleForm.username}}</p>
        <p>当前角色：{{userRoleForm.role_name}}</p>
        分配新角色：
        <el-select v-model="setSelectRoleId" placeholder="请选择">
          <el-option
            v-for="item in role"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setUserRoleTo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { 
  usersRequest,
  userStateChangedRequest,
  addUserRequest,
  editUserRequest,
  deleteUserRequest,
  setUserRoleRequest

} from 'network/usersRequest'
import {
  getRolesRequest
} from 'network/rolesRequest'


import Tip from 'components/tip'

export default {
  data(){
    var checkEmail = (rule, value, callback) => {
      var emailRegExp = /^\w+@[a-zA-Z0-9]+(\.com)$/
      if (!emailRegExp.test(value)) {
        callback(new Error('请正确的邮箱'));
      }else {
        callback();
      }
    };
    var checkMobile = (rule, value, callback) => {
      var mobileRegExp = /^(1[3-9])[0-9]{9}$/
      if (!mobileRegExp.test(value)) {
        callback(new Error('请正确的电话'));
      } else {
        callback();
      }
    };
    return {
      requestInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      tableData: [],
      addDialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUesrRules: {
        username: [
          { validator: '', trigger: 'blur' },
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { validator: '', trigger: 'blur' },
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        email: [
          { validator: '', trigger: 'blur' },
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { validator: '', trigger: 'blur' },
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editUserForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      setRoleDialogVisible: false,
      role: [],
      userRoleForm: {},
      setSelectRoleId: null
    }
  },
  components: {
    Tip
  },
  created(){ 
    this._getUsersRequest(this.requestInfo)
  },
  methods: {
    /*
    * 数据请求
    */
    _getUsersRequest(requestInfo){
      this.tableData.splice(0,this.tableData.length)
      usersRequest(requestInfo).then(res => {
        this.messageTip(res.meta)
        const users = res.data.users.forEach(item => {
          this.tableData.push(item)
        })
        this.total = res.data.total
      })
    },
    _userStateChanged(userInfo) {
      userStateChangedRequest(userInfo.id, userInfo.mg_state).then(res => {
        this.messageTip(res.meta)
      })
    },
    _addUserRequest(userInfo){
      addUserRequest(userInfo).then(res => {
        this.messageTip(res.meta)
        // 刷新页面
        this._getUsersRequest(this.requestInfo)
      })
    },
    _editUserRequest(userInfo){
      editUserRequest(userInfo).then(res => {
        this.messageTip(res.meta)
        // 刷新页面
        this._getUsersRequest(this.requestInfo)
      })
    },
    _deleteUserRequest(userId){
      deleteUserRequest(userId).then(res => {
        this.messageTip(res.meta)
        // 刷新页面
        this._getUsersRequest(this.requestInfo)
      })
    },
    _getRolesRequest(){
      getRolesRequest().then(res => {
        this.role = res.data
        this.messageTip(res.meta)
      })
    },
    _setUserRoleRequest(userId, roleInfo){
      setUserRoleRequest(userId, roleInfo).then(res => {
        this.messageTip(res.meta)
        // 刷新页面
        this._getUsersRequest(this.requestInfo)
      })
    },
    /*
    * 操作函数
    */
    handleSizeChange(val) {
      this.requestInfo.pagesize = val
      this._getUsersRequest(this.requestInfo)
    },
    handleCurrentChange(val) {
      this.requestInfo.pagenum = val
      this._getUsersRequest(this.requestInfo)
    },
    searchClick(){
      this._getUsersRequest(this.requestInfo)
    },
    addDialogClose(){
      this.$refs.addUserFormRef.resetFields()
    },
    addUserTo(){
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) return
        this._addUserRequest(this.addUserForm)
        this.addDialogVisible = false
      });
    },
    editUser(userInfo){
      this.editUserForm.id = userInfo.id
      this.editUserForm.username = userInfo.username
      this.editUserForm.email = userInfo.email
      this.editUserForm.mobile = userInfo.mobile
      this.editDialogVisible = true
    },
    editUserTo(){
      this.$refs.editUserFormRef.validate(async valid => {
        if (!valid) return
        // 发送修改用户请求
        this._editUserRequest(this.editUserForm)
        this.editDialogVisible = false
      });
    },
    deleteUser(userId){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._deleteUserRequest(userId)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    setUserRole(userInfo){
      this.userRoleForm.userId = userInfo.id
      this.userRoleForm.username = userInfo.username
      this.userRoleForm.role_name = userInfo.role_name
      this._getRolesRequest()
      this.setRoleDialogVisible = true
    },
    setUserRoleTo(){
      this._setUserRoleRequest(this.userRoleForm.userId, this.setSelectRoleId)
      this.setRoleDialogVisible = false
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
  .table{
    margin-top: 20px;
    padding: 20px 20px;
    background: white;
    border-radius: 5px;
    min-width: 1200px;
  }
  .searchInput{
    width: 400px;
    margin-bottom: 20px;
    margin-right: 20px;
  }
  .el-pagination{
    margin-top: 20px;
  }
</style>