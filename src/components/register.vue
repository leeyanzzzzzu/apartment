<template>
  <div class="register">
    <!--<div class="left">-->
    <!--<img src="../assets/img/login_bgc.png">-->
    <!--</div>-->
    <div class="right">
      <div class="logo">
        <img src="../assets/img/logo_0.png">
        <div>注册</div>
        <span style="color: #5B9BD1;margin-left: 260px;font-size: 15px;margin-bottom:20px" @click="tologin()">返回登录</span>
      </div>
      <div class="form">
        <div>
          <img src="../assets/img/icon_name.png">
          <input type="" name="" placeholder="账号" v-model="account">
        </div><br>
        <div>
          <img src="../assets/img/icon_pass.png">
          <input type="password" name="" placeholder="密码" v-model="password">
        </div><br>
        <div>
          <img src="../assets/img/icon_pass.png">
          <input type="password" name="" placeholder="确认密码" v-model="repassword">
        </div><br>
        <div >
          <img src="../assets/img/icon_name.png">
          <el-select style="background: #F5F8F8;width: 90%;height: 100%;padding: 0 30px 0 65px;box-sizing: border-box;" v-model="roleType" placeholder="请选择角色" >
            <el-option
              v-for="(item,index) in roleList"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <br>
        <div class="btn" @click="login">点击注册</div><br>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'register',
    data() {
      return {
        account: '',  // 账号
        password: '',  // 密码
        repassword: '',  // 确认密码
        roleType:'',
        roleList:[
          {
            id:2,
            name:"房东"
          },
          {
            id:3,
            name:"普通用户"
          },
        ]
      }
    },
    methods: {
      // 登录
      login() {
        if (this.account=='') {
          this.$message('账号不能为空');
          return;
        }
        if (this.password=='') {
          this.$message('密码不能为空');
          return;
        }
        if (this.repassword=='') {
          this.$message('确认密码不能为空');
          return;
        }
        if(this.password!=this.repassword){
          this.$message('两次密码不一致');
          return;
        }
        if(this.roleType==''){
          this.$message('请选择角色');
          return;
        }
        this.$axios.get('/users/register?username='+this.account+'&password='+this.password+'&roleid='+this.roleType)
          .then(res=>{
            console.log(res);
            if (res.data.code==0) {
              this.$message.success('注册成功');
              this.$router.push('/')
            } else {
              this.$message(res.data.msg);
            }
          })
          .catch(error=>{
            this.$message.error('error');
          })
      },
      tologin(){
        this.$router.push('/')
      },

    }
  }
</script>
<style>
  .register {
    width: 100%;
    height: 100%;
    background: #fff;
    background-image: url('../assets/img/back.jpg');
    background-size: cover;
    background-position: center;
    position: relative;
  }
  .register .right {
    -webkit-box-flex: 2;
    -ms-flex: 2;
    flex: 2;
    text-align: center;
    padding: 11% 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;

  }
  .register .right .logo img {
    width: 90px;
    /*height: 129px;*/
  }
  .register .right .logo>div {
    margin-top: 23px;
    margin-bottom: 40px;
    font-size: 20px;
    font-weight: 600;
    color: #333;
    font-family: PingFangSC-Medium,PingFang SC;
  }
  .register .right .form>div {
    position: relative;
    width: 372px;
    height: 40px;
    margin-bottom: 10px;
    display: inline-block;
  }
  .register .right .form>div img {
    position: absolute;
    width: 24px;
    left: 25px;
    top: 50%;
    transform: translateY(-50%);
  }
  .register .right .form>div input {
    background: #F5F8F8;
    width: 90%;
    height: 100%;
    padding: 0 30px 0 65px;
    box-sizing: border-box;
  }
  .register .right .form>div input::-webkit-input-placeholder {
    color: #999;
    font-size: 14px;
  }
  .register .right .form .btn {
    width:240px;
    height:48px;
    line-height: 48px;
    background:rgba(26,173,25,1);
    border-radius:24px;
    font-size:20px;
    color: #fff;
    margin-top: 60px;
    box-shadow: 0 10px 30px #1AAD19;
    cursor: pointer;
  }
  .register .right .form .checkCode {
    position: relative;
  }
  .register .right .form .checkCode input {
    width: 68%;
    float: left;
  }
  .register .right .form .checkCode .checkImg {
    width: 112px;
    height: 48px;
    position: absolute;
    left: initial;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background: #B4CEC7;
  }
  .el-input{
    height: 100%;
  }
  .el-input__inner{
    border: none;
    text-align: left;
  }
</style>
