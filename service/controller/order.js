const db = require("../common/common");
const createError = require('http-errors')

class OrderController{
  static async getOederList(req,res,next){
    try{
      var params = req.method === 'GET' ? req.query :req.body;
      let page = params.page||1;
      let pageSize = params.pageSize|| 5;
      let orderNo = params.orderNo || -1;
      var id = req.cookies.uid;
      var roleid = req.cookies.roleid;
      let housename = params.housename || -1;
      let sql = "select a.*,b.housename,b.imgurl,c.username from bs_order a, bs_homeresources b,bs_user c where a.homeid = b.id and a.uid = c.id"
      let sqlcount = "select count(0) as total from bs_order a, bs_homeresources b,bs_user c where a.homeid = b.id and a.uid = c.id"
      if(orderNo!=-1){
        sql += " and a.orderNo = " + orderNo;
        sqlcount+=" and a.orderNo = "+orderNo;
      }
      if(housename!=-1){
        housename = "%" + housename + "%";
        sql += " and a.housename like " + JSON.stringify(housename);
        sqlcount+=" and housename like "+JSON.stringify(housename);
      }
      if(roleid==2){
        sql+=" and b.uid="+id;
        sqlcount+=" and b.uid="+id
      }
      sql+=" limit ?,?";
      let row = await db.insert(sql,[(page-1)*pageSize,parseInt(pageSize)])
      let total = await db.insert(sqlcount);
      for (let i = 0; i < row.length; i++) {
        if(row[i].status ==0){
          row[i].statusname = "待支付"
        }else if(row[i].status ==1){
          row[i].statusname = "已支付"
        }else if(row[i].status ==2){
          row[i].statusname = "已取消"
        }
        row[i].create_at = db.transtime(row[i].create_at)
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
  static async getOederByid(req,res,next){
    try{
      var params = req.method === 'GET' ? req.query :req.body;
      var id = params.id;
      var sql = "select a.*,a.create_at as createtime,a.price as orderprice,a.status as orderstatus,b.*,c.username from bs_order a, bs_homeresources b,bs_user c where a.homeid = b.id and a.uid = c.id and a.oid=?"
      let row = await db.insert(sql,id);
      row[0].createtime = db.transtime(row[0].createtime)
      res.status(200).json({
        code:0,
        R: row,
        msg: '查询成功'
      })
    }catch (e) {
      console.log(e);
      next(createError(e))
    }
  }
  static async getMyOederList(req,res,next){
    try{
      var params = req.method === 'GET' ? req.query :req.body;
      let page = params.page||1;
      let pageSize = params.pageSize|| 5;
      let orderNo = params.orderNo || -1;
      let housename = params.housename || -1;
      var uid = req.cookies.uid;
      let sql = "select a.*,b.housename,b.imgurl from bs_order a, bs_homeresources b where a.homeid = b.id and a.uid="+uid
      let sqlcount = "select count(0) as total from bs_order a, bs_homeresources b where a.homeid = b.id and a.uid="+uid
      if(orderNo!=-1){
        sql += " and a.orderNo = " + orderNo;
        sqlcount+=" and a.orderNo = "+orderNo;
      }
      if(housename!=-1){
        housename = "%" + housename + "%";
        sql += " and a.housename like " + JSON.stringify(housename);
        sqlcount+=" and housename like "+JSON.stringify(housename);
      }
      sql+=" limit ?,?";
      let row = await db.insert(sql,[(page-1)*pageSize,parseInt(pageSize)])
      let total = await db.insert(sqlcount)
      for (let i = 0; i < row.length; i++) {
        if(row[i].status ==0){
          row[i].statusname = "待支付"
        }else if(row[i].status ==1){
          row[i].statusname = "已支付"
        }else if(row[i].status ==2){
          row[i].statusname = "已取消"
        }
        row[i].create_at =db.transtime(row[i].create_at)
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
  //下单接口
  static async createOrder(req,res,next){
    try{
      var params = req.method === 'GET' ? req.query :req.body;
      var homeid = params.homeid || -1;
      var uid = req.cookies.uid;
      var month = params.month;
      if(homeid==-1 || uid==-1){
        res.json({
          code:-1,
          msg:"请选择房源"
        })
        return;
      }
      let order =await db.insert("select * from bs_order where uid=? and status=0 and homeid=?",[uid,homeid]);
      if(order.length>0){
        var dateTime=new Date();
        dateTime= dateTime.setDate(dateTime.getDate()-1);
        dateTime=new Date(dateTime)
        if(order[0].create_at>dateTime){
          res.json({
            code:-1,
            msg:"24H小时内请勿重复下单"
          })
          return;
        }
      }

      let home = await db.insert("select * from bs_homeresources where id=?",homeid);
      //生成6位订单号
      let orderNo = db.getRanNum();
      let price =parseInt(month)*home[0].price
      await db.insert("insert into bs_order (uid,orderNo,homeid,month,price,status,create_at) values(?,?,?,?,?,?,?)",[uid,orderNo,homeid,month,price,0,new Date()])
      res.json({
        code:0,
        msg:"下单成功"
      })

    }catch (e) {
      console.log(e);
      next(createError(e))
    }
  }

  static async payOrder(req,res,next){
    try{
      var params = req.method === 'GET' ? req.query :req.body;
      var oid = params.oid || -1;
      var uid = req.cookies.uid;
      let row=await db.insert("select * from bs_order where oid=?",oid);
      await db.insert("insert into bs_pay (uid,oid,money,create_at) values(?,?,?,?)",[uid,oid,row[0].price,new Date()]);
      await db.insert("update bs_order set status = 1 where oid=? and status =0",oid)
      res.json({
        code:0,
        msg:"支付成功"
      })
    }catch (e) {
      console.log(e);
      next(createError(e))
    }
  }

  static async cancelOrder(req,res,next){
    try{
      var params = req.method === 'GET' ? req.query :req.body;
      var oid = params.oid || -1;
      await db.insert("update bs_order set status = 2 where oid=? and status =0",oid)
      res.json({
        code:0,
        msg:"取消成功"
      })
    }catch (e) {
      console.log(e);
      next(createError(e))
    }
  }

}


module.exports = OrderController;
