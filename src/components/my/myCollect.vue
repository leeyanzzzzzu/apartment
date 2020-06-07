<template>
  <div class="myCollect">
    <div class="enterBox">
      <div>
        <span>房源名称</span>
        <input type="" name="" v-model="houseName">
      </div>
      <div class="btn">
         <el-button type="primary" round @click="getData">查询</el-button>
         <el-button type="success" round @click="init">重置</el-button>
      </div>
    </div>
    <div  class="userList">
      <div class="top">
        <div class="title">我的收藏</div>
        <!--<div class="addUser" @click="addUser">添加用户</div>-->
      </div>
      <div class="list">
        <div class="topTitle">
          <div>序号</div>
          <div>房源名称</div>
          <div>房源图片</div>
          <div>房源价格/月</div>
          <div>房源状态</div>
          <div>操作</div>
        </div>
        <div class="item" v-for="(item,index) in dataList" :key="index">
          <div>{{index+1}}</div>
          <div>{{item.housename}}</div>
          <div><img :src="item.imgurl"></div>
          <div>{{item.price}}/元</div>
          <div>{{item.statusname}}</div>
          <div class="operate">
            <!-- <span class="edit" @click="info(item.homeid)">详情</span>
            <span class="delete" @click="cancelCollect(item.homeid)">取消收藏</span> -->
             <el-button type="primary" icon="el-icon-tickets" circle @click="info(item.homeid)"></el-button>
             <el-button type="danger" icon="el-icon-delete" circle @click="cancelCollect(item.homeid)"></el-button>
          </div>
        </div>
        <div id="empty" v-if="dataList.length==0">
          <img src="../../assets/img/empty.png">
          <div>暂无数据</div>
        </div>
        <div id="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="total"
            :hide-on-single-page="true">
          </el-pagination>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import Vue from 'vue';
  import {Select,Option} from 'element-ui';
  Vue.use(Select)
  Vue.use(Option)
  export default {
    name: 'myCollect',
    data() {
      return {
        dataList: [],
        pageSize: 8,  // 默认一页展示条数
        total: 0,  // 总条数
        page: 1,  // 当前页
        houseName:'', //查询条件 房源名称
      }
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.$axios.get('/GetMyCollect?page='+this.page+'&pageSize='+this.pageSize+'&housename='+this.houseName)
          .then(res=>{
            if (res.data.code==0) {
              this.dataList = res.data.R;
              this.total = res.data.L;
            } else {
              this.$message(res.data.msg);
            }
          })
          .catch(error=>{
            this.$message.error('error');
          })
      },
      // 改变当前页
      handleCurrentChange(page) {
        this.page = page;
        this.getData();
      },
      cancelCollect(id){
        this.$axios.get('/cancelCollect?homeid='+id)
          .then(res=>{
            if (res.data.code==0) {
              this.$message.success("取消成功")
              this.getData()
            } else {
              this.$message(res.data.msg);
            }
          })
          .catch(error=>{
            this.$message.error('error');
          })
      },
      info(id){
        this.$parent.choosedRouter('HouseInfo',id)
      },
      init() {
        this.page = 1;
        this.orderNo = '';
        this.houseName = '';
        this.getData();
      }
    }
  }
</script>
<style scoped>
  .userList .top {
    position: relative;
  }
  .userList .title {
    font-size:18px;
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:500;
    color: #333;
    font-weight: 600;
  }
  .enterBox>div {
    display: inline-block;
    margin-bottom: 19px;
    color: #333;
    font-size: 14px;
    margin-right: 42px;
  }
  .enterBox>div input {
    width: 180px;
    height: 30px;
    line-height: 30px;
    background: #fff;
    border-radius:2px;
    margin-left: 20px;
    padding: 0 16px;
    box-sizing: border-box;
  }
  .userList .top .addUser {
    position: absolute;
    right: 30px;
    top: 50%;
    transform: translateY(-50%);
    border: 1px solid #1AAD19;
    color: #1AAD19;
    padding: 5px 15px;
    border-radius: 3px;
    cursor: pointer;
  }
  .userList .list {
    border-radius:4px;
    min-height: 400px;
    background: #fff;
    position: relative;
    padding-bottom: 40px;
  }
  .userList .list .topTitle {
    height: 40px;
    line-height: 40px;
    background: #F4F4F4;
    text-align: center;
    display: flex;
    margin-top: 24px;
  }
  .userList .list .topTitle>div {
    flex: 1;
    font-size: 11px;
    color: #666;
  }
  .userList .list .item {
    display: flex;
    height: 70px;
    align-items: center;
    text-align: center;
    background: #fff;
  }
  .userList .list .item>div {
    flex: 1;
    font-size: 12px;
    color: #333;
  }
  .userList .list .item .operate span {
    color: #fff;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
  }
  .userList .operate .edit {
    background: #1AAD19;
    margin: 0 5px;
  }
  .userList .operate .delete {
    background: #E24949;
  }
  /*.userList.list.item.operate span:first-child{*/
  /*color: #fff;*/
  /*cursor: pointer;*/
  /*font-weight: 600;*/
  /*background: #1AAD19;*/
  /*padding: 5px 10px;*/
  /*border-radius: 3px*/
  /*}*/
  /*.userList.list.item.operate span:last-child{*/
  /*color: #fff;*/
  /*cursor: pointer;*/
  /*font-weight: 600;*/
  /*background: #E24949;*/
  /*padding: 5px 10px;*/
  /*border-radius: 3px*/
  /*}*/
  .userList .list .item>div img {
    width: 36px;
    height: 36px;
    border-radius: 36px;
  }
  .addPage .list {
    background: #fff;
    margin-top: 24px;
    padding: 20px 100px;
    color: #333;
  }
  .addPage .top .back {
    cursor: pointer;
  }
  .addPage .top img {
    width: 13px;
    vertical-align: middle;
  }
  .addPage .top .back span {
    vertical-align: middle;
    font-size: 12px;
    color: #1AAD19;
    font-weight: 400;
  }
  .addPage .top>div {
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    margin-right: 10px;
    font-weight: 600;
  }
  .addPage .list .item {
    margin-bottom: 20px;
  }
  .addPage .list .item input {
    width: 200px;
    height: 30px;
    border: 1px solid #eee;
    padding: 0 10px;
    font-size: 12px;
  }
  .addPage .list .item>span {
    display: inline-block;
    width: 100px;
    text-align: right;
    margin-right: 30px;
  }
  .addPage .list .item textarea {
    vertical-align: top;
    width: 400px;
    height: 100px;
    padding: 5px 10px;
    font-size: 12px;
  }
  .addPage .submit {
    font-size: 16px;
    color: #fff;
    font-weight: 600;
    margin-top: 50px;
    padding-left: 200px;
  }
  .addPage .submit span {
    cursor: pointer;
    display: inline-block;
    background: #1AAD19;
    width: 200px;
    height: 35px;
    line-height: 35px;
    text-align: center;
  }
  .enterBox .btn {
    margin-left: 16px;
    display: inline-block;
    /*vertical-align: middle;*/
  }
  .enterBox .btn div {
    display: inline-block;
    width: 64px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size:14px;
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:600;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .enterBox .btn div:first-child {
    background: #1AAD19;
  }
  .enterBox .btn div:last-child {
    background: #007AFF;
  }
</style>
