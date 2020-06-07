<template>
	<div class="home">
		<topBar></topBar>
		<div class="sideBar">
			<div class="menu" v-for="menu in menus" v-if="myMenus.indexOf(menu.menuid)>-1">
				<div class="title" @click="menuId=menu.menuid" v-if="menu.menuchildren.length>0">
					<span>{{menu.menuname}}</span>
					<img src="../assets/img/arrow_top.png" v-if="menuId==menu.menuid">
					<img src="../assets/img/arrow_down.png" v-else>
				</div>
				<!-- 没有子菜单 -->
				<div class="title public" v-if="menu.menuchildren.length==0" @click="menuId=menu.menuid;choosedRouter(menu.menuurl)" :id="routerName==menu.menuurl?'choosed':''">{{menu.menuname}}</div>
				<!-- 有子菜单 -->
				<div class="menuItem" v-if="menuId==menu.menuid&&menu.menuchildren.length>0&&myMenus.indexOf(item.menuid)>-1" v-for="item in menu.menuchildren">
					<div @click="choosedRouter(item.menuurl)" :id="routerName==item.menuurl?'choosed':''">{{item.menuname}}</div>
				</div>
			</div>
		</div>
		<div class="content">
			<userManage v-if="routerName=='UserManage'"></userManage>
			<roleManage v-if="routerName=='RoleManage'"></roleManage>
			<serviceCentre v-if="routerName=='ServiceCentre'"></serviceCentre>
			<myOrder v-if="routerName=='MyOrder'"></myOrder>
			<myInfo v-if="routerName=='MyInfo'"></myInfo>
			<myCollect v-if="routerName=='MyCollect'"></myCollect>
			<houseManage v-if="routerName=='HouseManage'"></houseManage>
			<orderManage v-if="routerName=='OrderManage'"></orderManage>
			<payManage v-if="routerName=='PayManage'"></payManage>
			<comment v-if="routerName=='Comment'"></comment>
			<houseInfo v-if="routerName=='HouseInfo'"></houseInfo>
			<orderInfo v-if="routerName=='OrderInfo'"></orderInfo>
			<addHouse v-if="routerName=='AddHouse'"></addHouse>
		</div>
	</div>
</template>
<script>
	import topBar from './common/topBar'
	import myOrder from './my/myOrder'
	import myInfo from './my/myInfo'
	import myCollect from './my/myCollect'
	import houseManage from './house/houseManage'
	import orderManage from './order/orderManage'
	import payManage from './order/payManage'
	import comment from './house/comment'
	import houseInfo from './house/houseInfo'
	import orderInfo from './order/orderInfo'
	import userManage from './systemManage/userManage'
	import roleManage from './systemManage/roleManage'
	import serviceCentre from './systemManage/serviceCentre'
	import addHouse from './house/addHouse'

	export default {
		components: {
			topBar,  // 头部
			myOrder,//我的订单
			myInfo,//个人信息
			myCollect,//我的收藏
			houseManage,//房源管理
			houseInfo,	// 房源详情
			orderInfo,//订单详情
			orderManage,//订单管理
			payManage,//支付管理
			comment,	// 评价管理
			userManage,		// 用户管理
			roleManage,		// 角色管理
			serviceCentre,	// 服务中心
			addHouse,	// 添加商品
		},
		nam: 'Home',
		data() {
			return {
				menuId: '',  // 菜单id
        value:'',
				routerName: 'MyOrder',  // 路由名称
				menus: [],  // 菜单项
				myMenus: [],  // 我有的权限id列表
			}
		},
		created() {
			this.getMenus();
		},
		methods: {
			// 获取菜单项
			getMenus(id) {
				this.$axios.get('/users/getMenuTree?roleid='+this.$store.state.userInfo.roleId)
				.then(res=>{
					if (res.data.code==0) {
						this.menus = res.data.R;
						if (id) {
							this.menuId = id;
						} else {
							this.menuId = this.menus[0].menuid;
						}
						this.myMenus = res.data.L.menuid;
            // if (this.myMenus.indexOf(1)>-1) {  // 是否有消息通知权限
						// 	this.$store.commit('setMessage',true);
						// } else {
						// 	this.$store.commit('setMessage',false);
						// }
					} else {
						this.$message(res.data.msg);
					}
				})
				.catch(error=>{
					this.$message.error('error');
				})
			},
			// 左侧菜单事件
			choosedRouter(router,id) {
        if(id){
          this.value = id;
        }
        console.log(this.value);
        this.routerName = router;
			}
		}
	}
</script>
<style scoped>
	.home .sideBar {
		width: 153px;
		height: 100%;
		background: #FCFCFE;
		position: fixed;
		left: 0;
		overflow-y: auto;
		padding-bottom: 40px;
		padding-top: 48px;
		box-sizing: border-box;
	}
	.home .sideBar::-webkit-scrollbar {
		display: none;
	}
	.home .sideBar .menu {
		border-bottom: 1px solid #F2F6FF;
		cursor: pointer;
	}
	.home .sideBar .menu .title {
		padding-left: 12px;
		font-size: 14px;
		color: #333;
		position: relative;
		height: 60px;
		line-height: 60px;
	}
	.home .sideBar .menu .public:hover {
		background: #D8D8D8;
	}
	.home .sideBar .menu .title img {
		width: 16px;
		position: absolute;
		top: 50%;
		right: 24px;
		transform: translateY(-50%);
	}
	.home .sideBar .menu .menuItem {
		color: #666;
		font-size: 12px;
		text-align: center;
	}
	.home .sideBar .menu .menuItem>div {
		height: 40px;
		line-height: 40px;
		padding-right: 12px;
		border-bottom: 1px solid #FCFCFE;
	}
	.home .sideBar .menu .menuItem>div:hover {
		background: #D8D8D8;
	}
	.home .sideBar .menu .menuItem>div:last-child {
		border-bottom: none;
	}
	.home .sideBar .menu .menuItem .unReadNum {
		position: relative;
	}
	.home .sideBar .menu .menuItem .unReadNum>span {
		position: absolute;
		width: 34px;
		height: 16px;
		line-height: 16px;
		border-radius: 10px;
		background: #1AAD19;
		color: #fff;
		font-size: 12px;
		right: 20px;
		top: 50%;
		transform: translateY(-50%);
	}
	.home .content {
		padding: 65px 17px 17px 180px;
		box-sizing: border-box;
		height: 100%;
		overflow-y: scroll;
		background: #F4F7FE;
	}
	.home .content::-webkit-scrollbar {
		display: none;
	}
	#choosed {
		background: #D8D8D8;
	}
</style>
