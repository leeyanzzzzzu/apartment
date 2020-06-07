import ajax from './ajax'

// 1. 基础路径
// const BASE_URL = '/api';  // 防跨域
const BASE_URL = 'http://localhost:3000';  // 服务器真实地址

// 2. 请求方法

// 修改用户信息
export const changeUserInfo = (params) => ajax(BASE_URL + '/users/change_user_msg', params, 'POST');

// 添加商品到数据库
export const addGoodsToRecom = (params) => ajax(BASE_URL + '/users/add_shop_recom', params, 'POST');

// 请求所有商品
export const getAllgoods = () => ajax(BASE_URL + '/api/allgoods');
