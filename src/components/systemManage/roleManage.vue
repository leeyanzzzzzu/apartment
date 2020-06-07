<template>
	<div class="roleManage">
		<div v-if="!addShow&&!showPower" class="roleList">
			<div class="top">
				<div class="title">角色管理</div>
				<div class="addRole" @click="addShow=true;addOrAdd=1;">添加角色</div>
			</div>
			<div class="list">
				<div class="head">
					<div>序号</div>
					<div>角色名称</div>
					<div>角色描述</div>
					<div>操作</div>
				</div>
				<div class="item" v-for="(item,index) in dataList" :key='index'>
					<div>{{index+1}}</div>
					<div>{{item.role_name}}</div>
					<div>{{item.description}}</div>
					<div class="operate">
						<span class="power" @click="givePower(item.role_id)">分配权限</span>
						<span class="edit" @click="editRole(item)">编辑</span>
						<span class="delete" @click="del(item.role_id)">删除</span>
					</div>
				</div>
				<div id="empty" v-if="dataList.length==0">
					<img src="../../assets/img/empty.png">
					<div>暂无数据</div>
				</div>
			</div>
		</div>
		<div v-if="addShow" class="addPage">
			<div class="top public">
				<div class="back" @click="back">
					<img src="../../assets/img/back.png">
					<span>返回</span>
				</div>
				<div>添加/编辑角色</div>
			</div>
			<div class="list">
				<div class="item">
					<span>名称：</span>
					<input type="" name="" v-model="roleName">
				</div>
				<div class="item">
					<span>角色描述：</span>
					<textarea v-model="roleDesc"></textarea>
				</div>
				<!-- <div class="item">
					<span>创建时间：</span>
					<el-date-picker
				      size="small"
				      v-model="createTime"
				      type="datetime"
				      range-separator="——"
				      placeholder="创建时间">
				    </el-date-picker>
				</div> -->
				<div class="submit"><span @click="submit">提交</span></div>
			</div>
		</div>
		<div v-if="showPower" class="powerPage">
			<div class="top public">
				<div class="back" @click="showPower=false;">
					<img src="../../assets/img/back.png">
					<span>返回</span>
				</div>
				<div>权限配置</div>
			</div>
			<div class="powerList">
				<div class="list" v-for="menu in powerMenus">
					<el-checkbox-group v-model="checkPower" @change="handleCheckedChange(menu)">
					    <el-checkbox :label="menu.menuid">{{menu.menuname}}</el-checkbox>
					</el-checkbox-group>
					<div class="item" v-for="item in menu.menuchildren">
						<el-checkbox-group v-model="checkPower" @change="handleCheckedChange(item)">
						    <el-checkbox :label="item.menuid">{{item.menuname}}</el-checkbox>
						</el-checkbox-group>
					</div>
				</div>
				<div class="confirm"><span @click="confirm">确认</span></div>
			</div>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue';
	import {Checkbox,CheckboxGroup} from 'element-ui';
	Vue.use(Checkbox)
	Vue.use(CheckboxGroup)
	export default {
		name: 'RoleManage',
		data() {
			return {
				dataList: [],
				addShow: false,  // 添加角色显示
				roleName: '',  // 角色名称
				roleDesc: '',  // 角色描述
				createTime: new Date(), // 角色创建时间
				showPower: false,  // 展示权限分配
				powerMenus: [],  // 全部权限
				checkPower: [],  // 已选权限列表
				isIndeterminate: false,
				roleId: '',  // 角色id
				addOrAdd: 1,  // 添加角色1，编辑2
			}
		},
		created() {
			this.getData();
		},
		methods: {
			// 获取角色列表
			getData() {
				this.$axios.get('/users/getRoleList')
				.then(res=>{
					if (res.data.code==0) {
						this.dataList = res.data.R;
					} else {
						this.$message(res.data.msg);
					}
				})
				.catch(error=>{
					this.$message.error('error');
				})
			},
			// 创建角色，修改角色
			submit() {
				if (this.roleName.trim()=='') {
					this.$message('角色名称不能为空');
					return;
				}
				var url = this.addOrAdd==1?'/users/addorEditRole?rolename='+this.roleName+'&description='+this.roleDesc:'/users/addorEditRole?roleid='+this.roleId+'&rolename='+this.roleName+'&description='+this.roleDesc
				this.$axios.get(url)
				.then(res=>{
					if (res.data.code==0) {
						this.$message.success(this.addOrAdd==1?'创建成功':'修改成功');
						this.back();
						this.getData();
					} else {
						this.$message(res.data.msg);
					}
				})
				.catch(error=>{
					this.$message.error('error');
				})
			},
			// 权限选择事件
			handleCheckedChange(item) {
				if (item.parentid==0) {  // 点的是父级
					if (this.checkPower[this.checkPower.length-1]==item.menuid) {  // 全选
						for(var i=0;i<item.menuchildren.length;i++) {
							if (this.checkPower.indexOf(item.menuchildren[i].menuid)==-1) {
								this.checkPower.push(item.menuchildren[i].menuid)
							}
						}
					} else {  // 全取消
						for(var i=0;i<item.menuchildren.length;i++) {
							for(var j=0;j<this.checkPower.length;j++) {
								if (this.checkPower[j]==item.menuchildren[i].menuid) {
									this.checkPower.splice(j,1)
								}
							}
						}
					}
				} else {  // 子级
					if (this.checkPower.indexOf(item.menuid)>-1) {  // 选中,父级也需选中
						if (this.checkPower.indexOf(item.parentid)==-1) {
							this.checkPower.push(item.parentid)
						}
					} else {  // 取消选中，如果子级全部取消，则父级也取消
						var children = [];  // 当前全部子级
						for(var i=0;i<this.powerMenus.length;i++) {
							if (this.powerMenus[i].menuid==item.parentid) {
								children = this.powerMenus[i].menuchildren;
							}
						}
						var cancel = true;  // 子级全取消
						for(var j=0;j<children.length;j++) {
							if (this.checkPower.indexOf(children[j].menuid)>-1) {  // 还有选中的子级
								cancel = false;
							}
						}
						if (cancel) {  // 取消父级
							for(var k=0;k<this.checkPower.length;k++) {
								if (this.checkPower[k]==item.parentid) {
									this.checkPower.splice(k,1)
								}
							}
						}
					}
				}
			},
			// 获取权限信息
			givePower(id) {
				this.roleId = id;
				this.$axios.get('/users/getMenuTree?roleid='+id)
				.then(res=>{
					if (res.data.code==0) {
						this.showPower = true;
						this.powerMenus = res.data.R;
						if (res.data.L.menuid) {
							this.checkPower = res.data.L.menuid;
						}
					} else {
						this.$message(res.data.msg);
					}
				})
				.catch(error=>{
					this.$message.error('error');
				})
			},
			// 确认分配权限
			confirm() {
        console.log(this.checkPower);
        console.log(this.checkPower.join(','));
        this.$axios.get('/users/updateRoleMenu?roleid='+this.roleId+'&menuids='+this.checkPower.join(','))
				.then(res=>{
					if (res.data.code==0) {
						this.$message.success('权限配置成功');
						this.showPower = false;
						this.$parent.getMenus(10041);
						this.$parent.choosedRouter('RoleManage');
					} else {
						this.$message(res.data.msg);
					}
				})
				.catch(error=>{
					this.$message.error('error');
				})
			},
			// 返回首页
			back() {
				this.addShow = false;
				this.roleName = '';
				this.roleDesc = '';
			},
			// 点击编辑角色
			editRole(item) {
				this.addOrAdd = 2;
				this.addShow = true;
				this.roleName = item.role_name;
				this.roleDesc = item.description;
			},
			// 点击删除角色
			del(id) {
				this.$confirm('确认删除当前角色吗？')
				.then(()=>{
					this.$axios.get('/users/deleteRole?roleid='+id)
					.then(res=>{
						if (res.data.code==0) {
							this.$message.success('删除成功');
							this.getData();
						} else {
							this.$message(res.data.msg);
						}
					})
					.catch(error=>{
						this.$message.error('error');
					})
				})
				.catch(()=>{})
			}
		}
	}
</script>
<style scoped>
	.roleList .top {
		position: relative;
	}
	.roleList .top .title {
		font-size:18px;
		font-family:PingFangSC-Medium,PingFang SC;
		font-weight:500;
		color: #333;
		font-weight: 600;
		margin-bottom: 24px;
	}
	.roleList .top .addRole {
		position: absolute;
		right: 30px;
		top: 50%;
		transform: translateY(-50%);
		border: 1px solid #1AAD19;
		color: #1AAD19;
		padding: 5px 15px;
		border-radius: 3px;
		cursor: pointer;
	}
	.roleList .list {
		position: relative;
		min-height: 400px;
		background: #fff;
	}
	.roleList .list>div {
		display: flex;
		padding: 0 20px;
	}
	.roleList .list>div>div {
		flex: 1;
		text-align: center;
	}
	.roleList .list>div>div:first-child {
		flex: 0.3;
		text-align: left;
	}
	.roleList .list .head {
		height: 40px;
		line-height: 40px;
		background: #F4F4F4;
		text-align: center;
	}
	.roleList .list .head>div {
		font-size: 11px;
		color: #666;
	}
	.roleList .list .item {
		height: 60px;
		align-items: center;
		text-align: center;
		background: #fff;
		border-bottom: 1px solid #eee;
	}
	.roleList .list .item>div {
		font-size: 12px;
		color: #333;
	}
	.roleList .operate>span {
		color: #fff;
		padding: 5px 10px;
		border-radius: 3px;
		cursor: pointer;
	}
	.roleList .operate .power {
		background: #007AFF;
	}
	.roleList .operate .edit {
		background: #1AAD19;
		margin: 0 5px;
	}
	.roleList .operate .delete {
		background: #E24949;
	}
	.public .back {
		cursor: pointer;
	}
	.public img {
		width: 13px;
		vertical-align: middle;
	}
	.public .back span {
		vertical-align: middle;
		font-size: 12px;
		color: #1AAD19;
		font-weight: 400;
	}
	.public>div {
		display: inline-block;
		vertical-align: middle;
		font-size: 14px;
		margin-right: 10px;
		font-weight: 600;
	}
	.addPage .list {
		background: #fff;
		margin-top: 24px;
		padding: 20px 100px;
		color: #333;
	}
	.addPage .list .item {
		margin-bottom: 20px;
	}
	.addPage .list .item input {
		width: 200px;
		height: 30px;
		border: 1px solid #eee;
		padding: 0 10px;
		font-size: 12px;
	}
	.addPage .list .item>span {
		display: inline-block;
		width: 100px;
		text-align: right;
		margin-right: 30px;
	}
	.addPage .list .item textarea {
		vertical-align: top;
		width: 400px;
		height: 100px;
		padding: 5px 10px;
		font-size: 12px;
	}
	.addPage .submit {
		font-size: 16px;
		color: #fff;
		font-weight: 600;
		margin-top: 50px;
		padding-left: 200px;
	}
	.addPage .submit span {
		cursor: pointer;
		display: inline-block;
		background: #1AAD19;
		width: 200px;
		height: 35px;
		line-height: 35px;
		text-align: center;
	}
	.powerPage .list {
		margin-bottom: 10px;
	}
	.powerPage .item {
		margin-left: 25px;
		margin-top: 2px;
	}
	.powerList {
		background: #fff;
		padding: 20px 30px;
		margin-top: 20px;
	}
	.powerList .confirm span {
		display: inline-block;
		background: #409EFF;
		width: 200px;
		height: 30px;
		line-height: 30px;
		text-align: center;
		color: #fff;
		font-size: 16px;
		margin-top: 20px;
		cursor: pointer;
	}
</style>
