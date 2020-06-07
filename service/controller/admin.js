var express = require('express')
var app = express()
const db = require("../common/common");
const formidable = require('formidable');
const path = require('path');

const createError = require('http-errors');
var cookieParser = require('cookie-parser')
app.use(cookieParser())

class AdminController{
    static async userLogin(req, res, next){
      try{
        var params = req.method === 'GET' ? req.query :req.body;
        let username =params.username;
        let password =params.password;
        let user =await db.insert("select * from bs_user where username =?",username);
        if(user.length==0){
          res.status(200).json({
            code:-1,
            msg: '用户不存在'
          })
        }else{
            if(password == user[0].password){
              res.cookie('uid', user[0].id, {
                path: '/',
                maxAge: 1000 * 60 * 60 * 2
              })
              res.cookie('roleid', user[0].roleid, {
                path: '/',
                maxAge: 1000 * 60 * 60 * 2
              })
              res.status(200).json({
                code:0,
                R: user[0],
                msg: '登录成功'
              })
            }else{
              res.status(200).json({
                code:-1,
                msg: '用户名或密码错误'
              })
            }
        }
      }catch (e) {
        next(createError(e))
      }

    }
    static async register(req,res,next){
      try{
        var params = req.method === 'GET' ? req.query :req.body;
        let username =params.username;
        let password =params.password;
        let roleid =params.roleid;
        let user = await db.insert("select * from bs_user where username=?",username);
        if(user.length>0){
          res.json({
            code:-1,
            msg:"用户名已存在"
          })
          return;
        }
        await db.insert("insert into bs_user (username,password,roleid) values(?,?,?)",[username,password,roleid])
        res.json({
          code:0,
          msg:"注册成功"
        })
      }catch (e) {
        console.log(e);
        next(createError(e))
      }
    }
  //获取菜单权限树
  static async getMenuTree(req,res,next){
    try{
      var params = req.method === 'GET' ? req.query :req.body;
      let roleId = params.roleid;
      let rolemenu= await db.insert("select * from bs_menu_role where role_id=?",parseInt(roleId));

      let menu_roles = await db.insert("SELECT * FROM bs_menu ");
      var menurole=[]
      for (let i = 0; i < rolemenu.length; i++) {
        menurole.push(rolemenu[i].menu_id)
      }
      var obj={
        roleid:parseInt(roleId),
        menuid:menurole
      }
      var menus = [];
      if (menu_roles.length) {
        for (var i = 0; i < menu_roles.length; i++) {
          var menuRoleObj = menu_roles[i];
          var parent_id = menuRoleObj['parentid'];
          if (parent_id == 0) {
            var menuObj = {};
            menuObj['parentid'] = parent_id;
            menuObj['menuid'] = menuRoleObj['menuid'];
            menuObj['menuname'] = menuRoleObj['menuname'];
            menuObj['menuurl'] = menuRoleObj['menuurl'];
            menuObj['menuchildren'] = [];
            menus.push(menuObj);
          } else {
            for (var j = 0; j < menus.length; j++) {
              var menuObj = menus[j];
              var pid = menuObj['menuid'];
              if (pid == parent_id) {
                var childObj = {}, menu_id = menuRoleObj['menuid'], menu_url = menuRoleObj['menuurl'],menu_name = menuRoleObj['menuname'];
                childObj['menuid'] = menu_id;
                childObj['parentid'] = menuRoleObj['parentid'];
                childObj['menuurl'] = menu_url;
                childObj['menuname'] = menu_name;
                menuObj['menuchildren'].push(childObj);
              }
            }
          }
        }
      }
      res.status(200).json({
        code:0,
        R: menus,
        L:obj,
        msg: '查询成功'
      })
    }catch (e) {
      next(createError(e))
    }
  }

  static async getUserList(req, res, next){
      try{
        var params = req.method === 'GET' ? req.query :req.body;
        let page = params.page||1;
        let pageSize = params.pageSize|| 5;
        let username = params.username || -1;
        let mobile = params.mobile || -1;
        let sql = "select * from bs_user where 1=1"
        let sqlcount = "select count(0) as total from bs_user where 1=1"
        if(username!=-1){
          sql+=" and username="+JSON.stringify(username);
          sqlcount+=" and username="+JSON.stringify(username);
        }
        if(mobile!=-1){
          sql+=" and mobile ="+mobile
          sqlcount+=" and mobile ="+mobile
        }
        sql+=" limit ?,?";
        let row = await db.insert(sql,[(page-1)*pageSize,parseInt(pageSize)])
        let total = await db.insert(sqlcount)
        for (let i = 0; i < row.length; i++) {
          if(row[i].roleid ==1){
            row[i].rolename = "管理员"
          }else if(row[i].roleid ==2){
            row[i].rolename = "房东"
          }else if(row[i].roleid ==3){
            row[i].rolename = "普通用户"
          }
        }
        res.status(200).json({
          code:0,
          R: row,
          L:total[0].total,
          msg: '查询成功'
        })
      }catch (e) {
        console.log(e);
        next(createError(e))
      }
  }
  static async getUserByid(req,res,next){
      try{
        var params = req.method === 'GET' ? req.query :req.body;
        var id = req.cookies.uid;
        let user = await db.insert("select * from bs_user where id=?",id)
        let role = await db.insert("select * from bs_role");
        for (let i = 0; i < role.length; i++) {
            if(user[0].roleid == role[i].role_id){
                user[0].rolename = role[i].role_name
            }
        }
        res.status(200).json({
          code:0,
          R: user[0],
          L:role,
          msg: '查询成功'
        })
      }catch (e) {
        console.log(e);
        next(createError(e))
      }
  }
  static async addOrEditUser(req,res,next){
      try{
        var params = req.method === 'GET' ? req.query :req.body;
        var id = params.id || -1;
        var mobile = params.mobile || -1;
        var roleid = params.roleid || -1;
        var username = params.username || -1;
        var password = params.password || -1;
        if(id==-1){
            var user = await db.insert("select * from bs_user where mobile=?",mobile);
            if(user.length>0){
              res.json({
                code:-1,
                msg:"手机号已存在"
              })
            }else{
              await db.insert("insert into bs_user (mobile,username,roleid,password,status) values(?,?,?,?,?)",[mobile,username,parseInt(roleid),password,0])
              res.json({
                code:0,
                msg:"添加成功"
              })
            }
        }else{
          var user = await db.insert("select * from bs_user where mobile=? and id !=?",[mobile,id]);
          if(user.length>0) {
            res.json({
              code: -1,
              msg: "手机号已存在"
            })
          }else{
            await db.insert("update bs_user set mobile=?,username=?,roleid=?,password=? where id=?",[mobile,username,parseInt(roleid),password,id])
            res.json({
              code:0,
              msg:"修改成功"
            })
          }
        }
      }catch (e) {
        console.log(e);
        next(createError(e))
      }
  }
  static change_user_msg(req, res,next){
      try{
        // 获取客户端传过来的商品信息
        const form = new formidable.IncomingForm();
        form.uploadDir = db.uploadsAvatarPath;  // 上传图片放置的文件夹
        form.keepExtensions = true; // 保持文件的原始扩展名
        form.parse(req, (err, fields, files)=>{
          if(err){
            return next(createError(err));
          }
          var id = fields.id;
          let mobile = fields.mobile || '';
          let email = fields.email || '';
          let sex = fields.sex || '';
          let realname = fields.realname || '';
          let id_card = fields.id_card || '';
          let user_avatar = 'http://localhost:3000/avatar_uploads/head.jpg';
          if(files.avatar){
            user_avatar = 'http://localhost:3000/avatar_uploads/' + path.basename(files.avatar.path);
          }
          if(!id){
            res.json({code:10000,msg:"请先登录"})
            return;
          }
          // 更新数据
          let sqlStr = "UPDATE bs_user SET mobile = ? , email = ?, sex = ?, avatar = ?, realname = ?, id_card = ? WHERE id = " + id;
          let strParams = [mobile, email, sex, user_avatar, realname, id_card];
          db.inserts(sqlStr, strParams,function (err,roe) {
              if(err){
                res.json({
                  code:-1,
                  msg:"修改失败"
                })
              }else{
                res.json({
                  code:0,
                  msg:"修改用户信息成功"
                })
              }
          });
        });
      }catch (e) {
        console.log(e);
        next(createError(e))
      }
  }
  static add_shop_recom(req,res,next){
      try{
        // 获取客户端传过来的商品信息
        const form = new formidable.IncomingForm();
        form.uploadDir = db.uploadsGoodsPath;  // 上传图片放置的文件夹
        form.keepExtensions = true; // 保持文件的原始扩展名
        form.parse(req, (err, fields, files)=>{
          if(err){
            return next(createError(err));
          }
          let id = fields.id;
          var uid = fields.uid;
          let housename = fields.housename;
          let address = fields.address;
          let price = fields.price;
          let size = fields.size;
          let image_url = 'http://localhost:3000/images/' + path.basename(files.imgurl.path);
          var msgs="";
          var sql="";
          var data=[]
          if(!id){
            sql ="insert into bs_homeresources (uid,housename,address,size,price,imgurl,status,create_at) values (?,?,?,?,?,?,?,?)"
              data=[uid,housename,address,size,price,image_url,0,new Date()];
              msgs="添加"
          }else{
              sql = "update bs_homeresources set housename=?,address=?,size=?,price=?,imgurl=?,status=0 where id=?"
              data=[housename,address,size,price,image_url,id];
              msgs="修改"
          }
          db.inserts(sql,data,function (err,roe) {
              if(err){
                console.log(err);
                res.json({code:-1,msg:msgs+"失败"})
              }else{
                res.json({code:0,msg:msgs+"成功"})
              }
          })
        });
      }catch (e) {
        console.log(e);
        next(createError(e))
      }
  }
  static async frozenUser(req,res,next){
      try{
        var params = req.method === 'GET' ? req.query :req.body;
        var id = params.id || -1;
        await db.insert("delete from bs_user where id=?",id);
        res.json({
          code:0,
          msg:"删除成功"
        })
      }catch (e) {
        console.log(e);
      }
  }
  static async getRoleList(req,res,next){
      try{
        let role = await db.insert("select * from bs_role");
        res.status(200).json({
          code:0,
          R: role,
          msg: '查询成功'
        })
      }catch (e) {
          next(createError(e))
      }
  }
  static async addorEditRole(req,res,next){
    try{
      var params = req.method === 'GET' ? req.query :req.body;
      var roleid = params.roleid || -1;
      var rolename = params.rolename || -1;
      var description = params.description || -1;
      if(roleid==-1){
        var role = await db.insert("select * from bs_role where role_name=?",rolename);
        if(role.length>0){
          res.json({
            code:-1,
            msg:"角色名已存在"
          })
        }else{
          await db.insert("insert into bs_role (role_name,description) values(?,?)",[rolename,description]);
          res.json({
            code:0,
            msg:"添加成功"
          })
        }
      }else{
        var role = await db.insert("select * from bs_role where role_name=? and role_id !=?",[rolename,parseInt(roleid)]);
        if(role.length>0) {
          res.json({
            code: -1,
            msg: "角色名已存在"
          })
        }else{
          await db.insert("update bs_role set role_name=?,description=? where role_id=?",[rolename,description,parseInt(roleid)])
          res.json({
            code:0,
            msg:"修改成功"
          })
        }
      }
    }catch (e) {
      console.log(e);
      next(createError(e))
    }
  }
  static async deleteRole(req,res,next){
      try{
        var params = req.method === 'GET' ? req.query :req.body;
        var roleid = params.roleid || -1;
        await db.insert("delete from bs_role where role_id=?",parseInt(roleid));
        res.json({
          code:0,
          msg:"删除成功"
        })
      }catch (e) {
        console.log(e);
      }
  }

  static async updateRoleMenu(req,res,next){
    try{
      var params = req.method === 'GET' ? req.query :req.body;
      console.log(params);
      var roleid = params.roleid || -1;
      var menuids = params.menuids || -1;
      if(menuids==-1){
        res.json({
          code:-1,
          msg:"请选择权限"
        })
        return;
      }
      let menudata= menuids.split(",");
      await db.insert("delete from bs_menu_role where role_id=?",parseInt(roleid));
      var data=[];
      for (let i = 0; i < menudata.length; i++) {
        var obj=[];
        obj.push(parseInt(roleid))
        obj.push(parseInt(menudata[i]))
        data.push(obj);
      }
      await db.insert("insert into bs_menu_role (role_id,menu_id) values ?",[data]);
      res.json({
        code:0,
        msg:"分配成功"
      })
    }catch (e) {
      console.log(e);
    }
  }
}

module.exports = AdminController;
