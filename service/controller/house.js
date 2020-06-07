const db = require("../common/common");
const createError = require('http-errors')

class HouseController{
    static async getHouseList(req,res,next){
      try{
        var params = req.method === 'GET' ? req.query :req.body;
        let page = params.page||1;
        let pageSize = params.pageSize|| 5;
        let housename = params.housename || -1;
        var id = req.cookies.uid;
        var roleid = req.cookies.roleid;
        let address = params.address || -1;
        let sql = "select a.*,b.username,b.mobile from bs_homeresources a,bs_user b where 1=1 and a.uid =b.id"
        let sqlcount = "select count(0) as total from bs_homeresources where 1=1";
        if(housename!=-1){
          housename = "%" + housename + "%";
          sql += " and a.housename like " + JSON.stringify(housename);
          sqlcount+=" and housename like "+JSON.stringify(housename);
        }
        if(address!=-1){
          address = "%" + address + "%";
          sql += " and a.address like " + JSON.stringify(address);
          sqlcount+=" and address like "+JSON.stringify(address);
        }
        if(roleid==2){
          sql+=" and a.uid="+id;
          sqlcount+=" and uid="+id
        }
        console.log(sql);
        sql+=" limit ?,?";
        let row = await db.insert(sql,[(page-1)*pageSize,parseInt(pageSize)])
        let total = await db.insert(sqlcount)
        for (let i = 0; i < row.length; i++) {
          if(row[i].status ==0){
            row[i].statusname = "待审核"
          }else if(row[i].status ==1){
            row[i].statusname = "待发布"
          }else if(row[i].status ==2){
            row[i].statusname = "审核不通过"
          }else if(row[i].status ==3){
            row[i].statusname = "已发布"
          }else if(row[i].status ==4){
            row[i].statusname = "已下架"
          }
          row[i].create_at = db.transtime(row[i].create_at)
        }
        res.status(200).json({
          code:0,
          R: row,
          L:total[0].total,
          P:roleid,
          msg: '查询成功'
        })
      }catch (e) {
        console.log(e);
        next(createError(e))
      }
    }
  static async getHouseListBystatus(req,res,next){
    try{
      var params = req.method === 'GET' ? req.query :req.body;
      let page = params.page||1;
      let pageSize = params.pageSize|| 5;
      let housename = params.housename || -1;
      let address = params.address || -1;
      let uid = req.cookies.uid;
      let sql = "select a.*,b.username,b.mobile from bs_homeresources a,bs_user b where 1=1 and a.uid =b.id and a.status=3"
      let sqlcount = "select count(0) as total from bs_homeresources where 1=1 and status!=0 and status=3";
      if(housename!=-1){
        housename = "%" + housename + "%";
        sql += " and a.housename like " + JSON.stringify(housename);
        sqlcount+=" and housename like "+JSON.stringify(housename);
      }
      if(address!=-1){
        address = "%" + address + "%";
        sql += " and a.address like " + JSON.stringify(address);
        sqlcount+=" and address like "+JSON.stringify(address);
      }
      sql+=" limit ?,?";
      let row = await db.insert(sql,[(page-1)*pageSize,parseInt(pageSize)])
      let total = await db.insert(sqlcount)
      for (let i = 0; i < row.length; i++) {
        if(row[i].status ==1){
          row[i].statusname = "待发布"
        }else if(row[i].status ==3){
          row[i].statusname = "已发布"
        }else if(row[i].status ==4){
          row[i].statusname = "已下架"
        }
        row[i].clloectstatus=0;
        if(uid){
          let count =await db.insert("select count(0) as total from bs_collect where uid=? and homeid=?",[uid,row[i].id])
          if(count[0].total>0){
            row[i].clloectstatus =1;
          }
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
    static async getHouseByid(req,res,next){
      try{
        var params = req.method === 'GET' ? req.query :req.body;
        let id = params.id || -1;
        let uid = req.cookies.uid;
        let sql = "select a.*,b.username,b.mobile from bs_homeresources a,bs_user b where 1=1 and a.uid =b.id and a.status!=0 and a.status!=2 and a.id=?"
        let row = await db.insert(sql,id)
          if(row[0].status ==1){
            row[0].statusname = "待发布"
          }else if(row[0].status ==3){
            row[0].statusname = "已发布"
          }else if(row[0].status ==4){
            row[0].statusname = "已下架"
           }
        row[0].clloectstatus=0;
          var userinfo={};
        if(uid){
          let count =await db.insert("select count(0) as total from bs_collect where uid=? and homeid=?",[uid,row[0].id])
          if(count[0].total>0){
            row[0].clloectstatus =1;
          }
          let user = await db.insert("select * from bs_user where id=?",uid);
          userinfo = user[0];
        }
        row[0].create_at = db.transtime(row[0].create_at);
        let comment =await db.insert("select a.*,b.username from bs_comment a,bs_user b where a.uid=b.id and a.homeid=?",row[0].id);
        row[0].comments_count = comment.length;
        res.status(200).json({
          code:0,
          R: row,
          L:comment,
          P:userinfo,
          msg: '查询成功'
        })
      }catch (e) {
        console.log(e);
        next(createError(e))
      }
    }
    static async getHouseInfo(req,res,next){
      try{
        var params = req.method === 'GET' ? req.query :req.body;
        let id = params.id || -1;
        let sql = "select a.*,b.username,b.mobile from bs_homeresources a,bs_user b where a.uid =b.id  and a.id=?";
        let row = await db.insert(sql,id);
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
    static async addorEditHouse(req,res,next){
      try{
        var params = req.method === 'GET' ? req.query :req.body;
        var id = params.id || -1;
        var housename = params.housename;
        var uid = req.cookies.uid;
        var address = params.address;
        var size = params.size;
        var price = params.price;
        var imgurl = params.imgurl;
        if(id==-1){
          var house = await db.insert("select * from bs_homeresources where housename=? and address=?",[housename,address]);
          if(house.length>0){
            res.json({
              code:-1,
              msg:"房源已存在"
            })
          }else{
            await db.insert("insert into bs_homeresources (housename,uid,address,size,price,imgurl,status,create_at) values(?,?,?,?,?,?,?,?)",[housename,uid,address,parseInt(size),parseInt(price),imgurl,0,new Date()])
            res.json({
              code:0,
              msg:"添加成功"
            })
          }
        }else{
          await db.insert("update bs_homeresources set housename=?,address=?,size=?,price=?,imgurl=? where id=?",[housename,address,parseInt(size),parseInt(price),imgurl,id]);
          res.json({
            code:0,
            msg:"修改成功"
          })
        }
      }catch (e) {
        console.log(e);
        next(createError(e))
      }
    }

    static async downHouse(req,res,next){
      try{
        var params = req.method === 'GET' ? req.query :req.body;
        var id = params.id || -1;
        let row=await db.insert("update bs_homeresources set status=4 where id=? and status =3",id);
        console.log(row);
        res.json({
          code:0,
          msg:"下架成功"
        })
      }catch (e) {
        console.log(e);
        next(createError(e))
      }
    }

    static async checkHouse(req,res,next){
      try{
        var params = req.method === 'GET' ? req.query :req.body;
        var id = params.id || -1;
        var status = params.status || -1;
        if(id==-1 || status ==-1){
          res.json({
            code:-1,
            msg:"参数不全"
          })
          return
        }
        let row = await db.insert("select * from bs_homeresources where id=?",id);
        if(row.length>0){
            if(row[0].status==0){
              await db.insert("update bs_homeresources set status=? where id=?",[parseInt(status),id]);
              res.json({
                code:0,
                msg:"审核成功"
              })
            }else{
              res.json({
                code:-1,
                msg:"房源不是待审核状态"
              })
            }
        }else{
          res.json({
            code:-1,
            msg:"房源不存在"
          })
        }

      }catch (e) {
        console.log(e);
        next(createError(e))
      }
    }
    static async upHouse(req,res,next){
    try{
      var params = req.method === 'GET' ? req.query :req.body;
      var id = params.id || -1;
      let row = await db.insert("select * from bs_homeresources where id=?",id);
      if(row.length>0){
        if(row[0].status==1){
          await db.insert("update bs_homeresources set status=3 where id=?",id);
          res.json({
            code:0,
            msg:"发布成功"
          })
        }else{
          res.json({
            code:-1,
            msg:"房源不是待发布状态"
          })
        }
      }else{
        res.json({
          code:-1,
          msg:"房源不存在"
        })
      }

    }catch (e) {
      console.log(e);
      next(createError(e))
    }
  }

    static async GetMyCollect(req,res,next){
      try{
        var params = req.method === 'GET' ? req.query :req.body;
        let page = params.page||1;
        let pageSize = params.pageSize|| 5;
        var uid = req.cookies.uid;
        let housename = params.housename || -1;
        let sql = "select a.*,b.housename,b.imgurl,b.status,b.price from bs_collect a,bs_homeresources b where 1=1 and a.homeid =b.id and a.uid="+uid
        let sqlcount = "select count(0) as total from bs_collect a,bs_homeresources b where 1=1 and a.homeid =b.id and a.uid="+uid;
        if(housename!=-1){
          housename = "%" + housename + "%";
          sql += " and b.housename like " + JSON.stringify(housename);
          sqlcount+=" and b.housename like "+JSON.stringify(housename);
        }
        sql+=" limit ?,?";
        let row = await db.insert(sql,[(page-1)*pageSize,parseInt(pageSize)]);
        let total = await db.insert(sqlcount);
        for (let i = 0; i < row.length; i++) {
          if(row[i].status ==0){
            row[i].statusname = "待审核"
          }else if(row[i].status ==1){
            row[i].statusname = "待发布"
          }else if(row[i].status ==2){
            row[i].statusname = "审核不通过"
          }else if(row[i].status ==3){
            row[i].statusname = "已发布"
          }else if(row[i].status ==4){
            row[i].statusname = "已下架"
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

    static async addCollect(req,res,next){
      try{
        var params = req.method === 'GET' ? req.query :req.body;
        let homeid = params.homeid||-1;
        var uid = req.cookies.uid;
        await db.insert("insert into bs_collect (uid,homeid) values(?,?)",[uid,homeid]);
        res.status(200).json({
          code:0,
          msg: '收藏成功'
        })
      }catch (e) {
        console.log(e);
        next(createError(e))
      }
    }

    static async cancelCollect(req,res,next){
      try{
        var params = req.method === 'GET' ? req.query :req.body;
        let homeid = params.homeid||-1;
        var uid = req.cookies.uid;
        await db.insert("delete from bs_collect where uid=? and homeid=?",[uid,homeid]);
        res.status(200).json({
          code:0,
          msg: '取消成功'
        })
      }catch (e) {
        console.log(e);
        next(createError(e))
      }
    }
  static async getCommentList(req,res,next){
    try{
      var params = req.method === 'GET' ? req.query :req.body;
      let page = params.page||1;
      let pageSize = params.pageSize|| 5;
      let content = params.content || -1;
      let housename = params.housename || -1;
      let sql = "SELECT a.*,b.housename,b.imgurl,c.username FROM bs_comment a,bs_homeresources b,bs_user c WHERE a.homeid=b.id AND a.uid = c.id"
      let sqlcount = "SELECT count(0) as total FROM bs_comment a,bs_homeresources b,bs_user c WHERE a.homeid=b.id AND a.uid = c.id";
      if(content!=-1){
        content = "%" + content + "%";
        sql += " and a.content like " + JSON.stringify(content);
        sqlcount+=" and a.content like "+JSON.stringify(content);
      }
      if(housename!=-1){
        housename = "%" + housename + "%";
        sql += " and b.housename like " + JSON.stringify(housename);
        sqlcount+=" and b.housename like "+JSON.stringify(housename);
      }
      sql+=" limit ?,?";
      let row = await db.insert(sql,[(page-1)*pageSize,parseInt(pageSize)])
      let total = await db.insert(sqlcount);
      for (let i = 0; i < row.length; i++) {
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
  static async addComment(req,res,next){
    try{
      var params = req.method === 'GET' ? req.query :req.body;
      let homeid = params.homeid||-1;
      var uid = req.cookies.uid;
      var content = params.content;
      await db.insert("insert into bs_comment (uid,homeid,content,create_at) values(?,?,?,?)",[uid,homeid,content,new Date()])
      res.status(200).json({
        code:0,
        msg: '评论成功'
      })
    }catch (e) {
      console.log(e);
      next(createError(e))
    }
  }

  static async deleteComment(req,res,next){
    try{
      var params = req.method === 'GET' ? req.query :req.body;
      let cid = params.cid||-1;
      await db.insert("delete from bs_comment where cid=?",cid)
      res.status(200).json({
        code:0,
        msg: '删除成功'
      })
    }catch (e) {
      console.log(e);
      next(createError(e))
    }
  }
}
module.exports = HouseController;
