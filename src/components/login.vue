<template>
	<div class="login">
		<!--<div class="left">-->
			<!--<img src="../assets/img/login_bgc.png">-->
		<!--</div>-->
		<div class="right">
			<div class="logo">
				<img src="../assets/img/logo_0.png">
				<div>长租公寓平台</div>
        <span style="color: #5B9BD1;margin-left: 280px;font-size: 15px;margin-bottom:20px" @click="register()">去注册</span>
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
				<div class="btn" @click="login">登录</div><br>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'Login',
		data() {
			return {
				account: '',  // 账号
				password: '',  // 密码
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
				var data = {
          username: this.account,
					password: this.password
				}
				this.$axios.post('/users/userLogin',this.$qs.stringify(data))
				.then(res=>{
          console.log(res);
          if (res.data.code==0) {
				    	this.$message.success('登录成功');
				    	var userInfo = {
				    	  uid:res.data.R.id,
				    		userName: res.data.R.username,
				    		roleId: res.data.R.roleid,
				    		mobile: res.data.R.mobile
				    	}
				    	localStorage.setItem('adminInfo',JSON.stringify(userInfo));
				    	this.$router.push({
				    		name: 'Home'
				    	})
					} else {
						this.$message(res.data.msg);
					}
				})
				.catch(error=>{
					this.$message.error('error');
				})
			},
      register(){
			  this.$router.push('/register')
      },
		}
	}
</script>
<style>
	.login {
		width: 100%;
		height: 100%;
		background: #fff;
    background-image: url('../assets/img/1-7.png');
    background-size: cover;
    background-position: center;
    position: relative;
	}
	.login .right {
    -webkit-box-flex: 2;
    -ms-flex: 2;
    flex: 2;
    text-align: center;
    padding: 11% 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
	}
	.login .right .logo img {
		width: 90px;
		/*height: 129px;*/
	}
	.login .right .logo>div {
		margin-top: 20px;
		margin-bottom: 15px;
		font-size: 20px;
		font-weight: 600;
		color: #333;
		font-family: PingFangSC-Medium,PingFang SC;
	}
	.login .right .form>div {
		position: relative;
		width: 372px;
		height: 48px;
		margin-bottom: 14px;
		display: inline-block;
	}
	.login .right .form>div img {
		position: absolute;
		width: 24px;
		left: 12px;
		top: 50%;
		transform: translateY(-50%);
	}
	.login .right .form>div input {
		background: #F5F8F8;
		width: 100%;
		height: 100%;
		padding: 0 30px 0 65px;
		box-sizing: border-box;
	}
	.login .right .form>div input::-webkit-input-placeholder {
		color: #999;
		font-size: 14px;
	}
	.login .right .form .btn {
		width:240px;
		height:40px;
		line-height: 48px;
		background:rgba(26,173,25,1);
		border-radius:24px;
		font-size:20px;
		color: #fff;
		margin-top: 30px;
		box-shadow: 0 10px 30px #1AAD19;
		cursor: pointer;
	}
	.login .right .form .checkCode {
		position: relative;
	}
	.login .right .form .checkCode input {
		width: 68%;
		float: left;
	}
	.login .right .form .checkCode .checkImg {
		width: 112px;
		height: 48px;
		position: absolute;
		left: initial;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		background: #B4CEC7;
	}
</style>
