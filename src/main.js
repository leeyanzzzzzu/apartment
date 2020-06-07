// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'
import qs from 'qs'
import store from './store/store'
import 'lib-flexible/flexible.js'
import { Message,MessageBox,DatePicker,TimePicker,Loading} from 'element-ui';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import global_ from './components/common/global';

Vue.use(DatePicker,TimePicker,MessageBox);
Vue.use(ElementUI)
// Vue.use(ElementUI)
Vue.prototype.$message = function (msg) {
  Message({
    message: msg,
    duration: 1500
  })
}
Vue.prototype.$message.success = function (msg) {
  Message.success({
    message: msg,
    duration: 1000
  })
}
Vue.prototype.$message.warning = function (msg) {
  Message.warning({
    message: msg,
    duration: 1500
  })
}
Vue.prototype.$message.error = function (msg) {
  Message.error({
    message: msg,
    duration: 1500
  })
}
Vue.prototype.$confirm = MessageBox.confirm;

// Axios.defaults.baseURL = 'http://flove.vip';
Axios.defaults.baseURL = '/api';
Object.defineProperty(Vue.prototype,'$axios',{
	get(){
		return Axios;
	}
});
Object.defineProperty(Vue.prototype,'$qs',{
	get(){
		return qs;
	}
});
Vue.prototype.global = global_;
Vue.config.productionTip = false
//拦截器  //开启loading
let loadingInstance;
Axios.interceptors.request.use(config=>{
	// var url = config.url;
	// if(localStorage.getItem('userInfo')){
	// 	config.headers.common['token'] = JSON.parse(localStorage.getItem('userInfo')).token;
	// }
	loadingInstance = Loading.service()
	return config;
})
Axios.interceptors.response.use(response=>{
	loadingInstance.close();
	return response;
}, error=>{
  loadingInstance.close();
})
// 路由拦截
router.beforeEach((to, from, next) => {
	var userInfo = localStorage.getItem('adminInfo');
	if (userInfo) {
		store.commit('setInfo',JSON.parse(userInfo));
	}
	if (to.matched.some(record => record.meta.requireLogin)){  // 判断该路由是否需要登录权限
		if (userInfo) {  // 判断当前用户的登录信息userInfo是否存在
			next();
		} else {  // 提示登录
 			MessageBox.confirm('您还未登录，先去登录？', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'info'
	        }).then(() => {
	          next({
	          	path: '/'
	          });
	        }).catch(() => {

	        });
		}
	} else {
		next();
	}
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
