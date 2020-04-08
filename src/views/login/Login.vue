<template>
  <div class="login">
    <div class="box">
      <div class="logo">
        <img src="~assets/img/logo.png" alt="">
      </div>
      <el-form class="form" ref="form" :model="form" :rules="rules" label-width="0">
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            prefix-icon="iconfont icon-user"
            v-model="form.username">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            prefix-icon="iconfont icon-3702mima"
            v-model="form.password">
          </el-input>
        </el-form-item>
        <el-form-item class="but">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>  
      </el-form>
    </div>
  </div>
</template>

<script>

import { loginRequest } from "network/loginRequest";

export default {
  data(){
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /*
    * 请求方法
    */
    _getLogin(username, password){
      return loginRequest(username, password)
    },
    /*
    * 业务方法
    */
    login(){
      this.$refs.form.validate(async valid =>{
        if(!valid) return 
        console.log(this.form)
        const resData = await this._getLogin(this.form.username, this.form.password)
        if(this.messageTip(resData.meta)){
          // 登录成功后保存token，访问其他接口需要token
          window.sessionStorage.setItem('token', resData.data.token)
          this.$router.push('/home')
        }
      })
    },
    reset(){
      this.$refs.form.resetFields();
    },
    messageTip(meta){
      if(meta.status == 200){
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
  .login{
    position: relative;
    height: 100%;
    background: gainsboro;
  }
  .box{
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 300px;
    background: white;
    border-radius: 10px;
  }
  .box .logo{
    display: inline-block;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    background: gainsboro;
    border: 8px solid white;
    border-radius: 50%;
  }
  .logo img{
    width: 100px;
    height: 100px;
    border: 8px solid white;
    border-radius: 50%;
  }
  .el-form{
    text-align: center;
    padding: 90px 20px 0 20px;
  }
  .el-input{
    margin-bottom: 13px;
  }
  .el-form-item__content{
    margin: 0 !important;
  }
</style>

