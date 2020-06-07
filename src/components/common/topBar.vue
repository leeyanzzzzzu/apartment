<template>
	<div class="topBar">
		<div class="logo">
			<img src="../../assets/img/logo.png">
			<span>长租公寓</span>
      <!--<div id="allmap" style="width: 0;height: 0; display: none;">点击刷新</div>-->
		</div>
		<div class="menu">
			<img src="../../assets/img/message.png" v-if="$store.state.hasMessage" @click="seeMessage">
			<span style="color: #1AAD19;font-weight: 600;">欢迎您： {{userName}}</span>
			<span @click="outLogin">退出</span>
		</div>
	</div>
</template>
<script>
  // import BMap from 'BMap';
	export default {
		name: 'TopBar',
		data() {
			return {
				active: 1,
				userName: '',
			}
		},
		created() {
			this.active = this.$store.state.pageType;
			this.userName = JSON.parse(localStorage.getItem('adminInfo')).userName;
		},
		methods: {
			// 退出
			outLogin() {
				// this.$message('功能正在开发中...');
				// return;
				localStorage.removeItem('adminInfo');
				this.$message.success('退出成功');
				this.$router.push({name: 'Login'});
			},
			// 查看消息
			seeMessage() {
				this.$parent.getMenus(10037);
				this.$parent.choosedRouter('UnreadMessage');
			},
      //获取位置
      // local(){
      //   //若需赋值，在此记得定义that
      //   const that=this
      //   const map = new BMap.Map("allmap");
      //   const point = new BMap.Point(101.77,37.27);
      //   map.centerAndZoom(point,12);
      //   const geolocation = new BMap.Geolocation();
      //   geolocation.getCurrentPosition(function(r){
      //     const mk = new BMap.Marker(r.point);
      //     map.addOverlay(mk);
      //     map.panTo(r.point);
      //     const point = new BMap.Point(r.point.lng,r.point.lat);
      //     const gc = new BMap.Geocoder();
      //     gc.getLocation(point, function(rs){
      //       const addComp = rs.addressComponents;
      //       const address = rs.address;
      //       that.accidentForm.orgLocation = rs.address;
      //       that.mapInfo.city = addComp.city;
      //     });
      //   },{enableHighAccuracy: true})
      // },
		}
	}
</script>
<style scoped>
	.topBar {
		width: 100%;
		height: 48px;
		line-height: 48px;
		padding: 0 12px;
		box-sizing: border-box;
		background: #fff;
		position: fixed;
		top: 0;
		z-index: 999;
	}
	.topBar>div {
		display: inline-block;
		position: relative;
		font-size: 14px;
		color: #333;
	}
	.topBar .logo img {
		width: 24px;
		left: 12px;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}
	.topBar .logo span {
		margin-left: 45px;
	}
	.topBar .menu {
		float: right;
		color: #666;
		font-size: 12px;
	}
	.topBar .menu span {
		padding: 0 8px;
		cursor: pointer;
	}
	.topBar .menu img {
		width: 22px;
		vertical-align: middle;
		cursor: pointer;
		margin-right: 10px;
	}
</style>
