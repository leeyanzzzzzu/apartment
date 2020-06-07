var express = require('express');
var router = express.Router();
const House = require("../controller/house")
const Order = require("../controller/order")

//获取房源列表
router.all('/getHouseList',async function(req, res, next) {
  House.getHouseList(req,res,next)
});
//获取服务中心房源列表
router.all('/getHouseListBystatus',async function(req, res, next) {
  House.getHouseListBystatus(req,res,next)
});
router.all('/getHouseByid',async function(req, res, next) {
  House.getHouseByid(req,res,next)
});
router.all('/getHouseInfo',async function(req, res, next) {
  House.getHouseInfo(req,res,next)
});
//添加或修改房源接口
router.all('/addorEditHouse',async function(req, res, next) {
  House.addorEditHouse(req,res,next)
});
//下架房源接口
router.all('/downHouse',async function(req, res, next) {
  House.downHouse(req,res,next)
});
//审核房源接口
router.all('/checkHouse',async function(req, res, next) {
  House.checkHouse(req,res,next)
});
//发布房源接口
router.all('/upHouse',async function(req, res, next) {
  House.upHouse(req,res,next)
});
//下单接口
router.all('/createOrder',async function(req, res, next) {
  Order.createOrder(req,res,next)
});
//订单列表
router.all('/getOederList',async function(req, res, next) {
  Order.getOederList(req,res,next)
});
//我的订单列表
router.all('/getMyOederList',async function(req, res, next) {
  Order.getMyOederList(req,res,next)
});
//获取订单详情
router.all('/getOederByid',async function(req, res, next) {
  Order.getOederByid(req,res,next)
});

//支付订单接口
router.all('/payOrder',async function(req, res, next) {
  Order.payOrder(req,res,next)
});
//取消订单接口
router.all('/cancelOrder',async function(req, res, next) {
  Order.cancelOrder(req,res,next)
});
//获取我的收藏列表
router.all('/GetMyCollect',async function(req,res,next) {
  House.GetMyCollect(req,res,next)
})
//添加收藏
router.all('/addCollect',async function(req,res,next) {
  House.addCollect(req,res,next)
})
//取消收藏
router.all('/cancelCollect',async function(req,res,next) {
  House.cancelCollect(req,res,next)
});
//获取所有评论
router.all('/getCommentList',async function(req,res,next) {
  House.getCommentList(req,res,next)
})
//添加评论
router.all('/addComment',async function(req,res,next) {
  House.addComment(req,res,next)
})
//删除评论
router.all('/deleteComment',async function(req,res,next) {
  House.deleteComment(req,res,next)
})
module.exports = router;
