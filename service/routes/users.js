var express = require('express');
var router = express.Router();
const admin = require("../controller/admin")
const formidable =require('formidable');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//用户登录接口
router.all('/userLogin',async function(req, res, next) {
  admin.userLogin(req,res,next)
});
//用户注册接口
router.all('/register',async function(req, res, next) {
  admin.register(req,res,next)
});
//获取用户菜单接口
router.all('/getMenuTree',async function(req, res, next) {
  admin.getMenuTree(req,res,next)
});
//获取用户列表接口
router.all('/getUserList',async function(req, res, next) {
  admin.getUserList(req,res,next)
});
//获取用户信息接口
router.all('/getUserByid',async function(req, res, next) {
  admin.getUserByid(req,res,next)
});
//添加或修改用户信息接口
router.all('/addOrEditUser',async function(req, res, next) {
  admin.addOrEditUser(req,res,next)
});
//修改用户信息接口
router.all('/change_user_msg',async function(req, res, next) {
  admin.change_user_msg(req,res,next)
});

//添加修改房源
router.all('/add_shop_recom',async function(req, res, next) {
  admin.add_shop_recom(req,res,next)
});
//冻结用户接口
router.all('/frozenUser',async function(req, res, next) {
  admin.frozenUser(req,res,next)
});
//获取角色列表接口
router.all('/getRoleList',async function(req, res, next) {
  admin.getRoleList(req,res,next)
});
//添加或修改角色接口
router.all('/addorEditRole',async function(req, res, next) {
  admin.addorEditRole(req,res,next)
});
//删除角色
router.all('/deleteRole',async function(req, res, next) {
  admin.deleteRole(req,res,next)
});
//分配角色权限
router.all('/updateRoleMenu',async function(req, res, next) {
  admin.updateRoleMenu(req,res,next)
});


module.exports = router;
