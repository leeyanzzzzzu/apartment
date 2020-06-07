<template>
  <div class="serviceCentre">
    <div class="enterBox">
      <div>
        <span>房源名称</span>
        <input type="" name="" placeholder="房源名称" v-model="userName">
      </div>
      <div>
        <span>地址</span>
        <input type="" name="" placeholder="地址" v-model="phone">
      </div>
      <div class="btn">
        <!-- <div @click="getData">查询</div>
        <div @click="init">重置</div> -->
         <el-button type="primary" round @click="getData">查询</el-button>
         <el-button type="success" round @click="init">重置</el-button>
      </div>
    </div>

    <div class="list">
      <div class="top">
        <div class="title">服务中心</div>
        <!--<div class="addHouse">添加房源</div>-->
      </div>
      <div class="topTitle">
        <div>序号</div>
        <div>房源名</div>
        <div>地址</div>
        <div>房源大小/平</div>
        <div>价格</div>
        <div>图片</div>
        <div>状态</div>
        <div>创建时间</div>
        <div>操作</div>
      </div>
      <div class="item" v-for="(item,index) in dataList" :key="index">
        <div>{{index+1}}</div>
        <div>{{item.housename}}</div>
        <div>{{item.address}}</div>
        <div>{{item.size}}</div>
        <div>{{item.price}}/元</div>
        <div><img :src="item.imgurl"></div>
        <div>{{item.statusname}}</div>
        <div>{{item.create_at}}</div>
        <div class="operate">
          <!--<span class="edit" @click="editRole(item)">下单</span>-->
          <!-- <span v-if="item.clloectstatus ==0" class="edit" @click="clloect(item.id)">收藏</span> -->
          <!-- <span class="delete" @click="comment(item.id)">详情</span> -->
             <el-button type="primary" icon="el-icon-tickets" circle @click="comment(item.id)"></el-button>
             <el-button type="warning" icon="el-icon-star-off" circle v-if="item.clloectstatus ==0" @click="clloect(item.id)"></el-button>
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
</template>
<script>
  export default {
    name: 'serviceCentre',
    data() {
      return {
        date: [new Date(new Date().getTime()-1000*60*60*24*90), new Date()],
        userName: '',  // 昵称
        phone: '',  // 电话
        dataList: [],
        pageSize: 5,  // 默认一页展示条数
        total: 0,  // 总条数
        page: 1,  // 当前页
      }
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.$axios.get('/getHouseListBystatus?housename='+this.userName+'&address='+this.phone+'&page='+this.page+'&pagesize='+this.pageSize)
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
      clloect(id){
        this.$axios.get('/addCollect?homeid='+id)
          .then(res=>{
            if (res.data.code==0) {
              this.$message.success("收藏成功");
              this.getData();
            } else {
              this.$message(res.data.msg);
            }
          })
          .catch(error=>{
            this.$message.error('error');
          })
      },
      comment(id){
        this.$parent.choosedRouter('HouseInfo',id)
      },
      // 改变当前页
      handleCurrentChange(page) {
        this.page = page;
        this.getData();
      },
      // 重置
      init() {
        this.page = 1;
        this.userName = '';
        this.phone = '';
        this.date = [new Date(new Date().getTime()-1000*60*60*24*90), new Date()];
        this.getData();
      },
    }
  }
</script>
<style scoped>
  .list .top {
    position: relative;
  }
  .list .title {
    font-size:18px;
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:500;
    color: #333;
    font-weight: 600;
  }
  .list .top .addHouse {
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
  .list {
    min-height: 400px;
    background: #fff;
    position: relative;
    border-radius:4px;
    padding-bottom: 30px;
  }
  .list .topTitle {
    height: 40px;
    line-height: 40px;
    background: #F4F4F4;
    text-align: center;
    display: flex;
    margin-top: 24px;
  }
  .list .topTitle>div {
    flex: 1;
    font-size: 11px;
    color: #666;
  }
  .list .item {
    display: flex;
    height: 70px;
    align-items: center;
    text-align: center;
    background: #fff;
  }
  .list .item>div {
    flex: 1;
    font-size: 12px;
    color: #333;
  }
  .list .item .operate {
    color: #1AAD19;
    cursor: pointer;
    font-weight: 600;
  }
  .list>div>div:first-child {
    flex: 0.5;
  }
  .list .item>div img {
    width: 36px;
    height: 36px;
    border-radius: 36px;
  }
  .list .operate>span {
    color: #fff;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
  }
  /*.list .operate .power {*/
  /*background: #007AFF;*/
  /*}*/
  /* .list .operate .edit {
    background: #1AAD19;
    margin: 0 5px;
  }
  .list .operate .delete {
    background: #E24949;
  } */
  .enterBox>div {
    display: inline-block;
    margin-bottom: 19px;
    color: #333;
    font-size: 14px;
    margin-right: 22px;
  }
  .enterBox>div input {
    width: 110px;
    height: 30px;
    line-height: 30px;
    background: #fff;
    border-radius:2px;
    margin-left: 20px;
    padding: 0 16px;
    box-sizing: border-box;
  }
  .enterBox>div input::-webkit-input-placeholder {
    color: #999;
    font-size: 12px;
  }
  .timePicker .head {
    display: inline-block;
    margin-right: 16px;
    color: #333;
    font-size: 14px;
  }
  .timePicker .btn {
    margin-left: 16px;
    display: inline-block;
    vertical-align: middle;
  }
  .timePicker .btn div {
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
  .timePicker .btn div:first-child {
    background: #1AAD19;
  }
  .timePicker .btn div:last-child {
    background: #007AFF;
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
