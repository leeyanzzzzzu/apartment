import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		pageType: 1,  // 当前页面类型
		userInfo: {},  // 用户信息
		hasMessage: false,  // 是否有消息通知
	},
	mutations: {
		// 存储用户信息
		setInfo(state,info) {
			state.userInfo = info;
		},
		// 存储当前页面类型
		setPage(state,val) {
			state.pageType = val;
		},
		// 消息通知
		setMessage(state,val) {
			state.hasMessage = val;
		}
	}
});

export default store;