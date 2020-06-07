<template>
  <div id="container" v-if="goodsDetail[0]">
    <div class="back">
       <el-button type="primary" icon="el-icon-arrow-left" @click="back()">返回</el-button>
    </div>
    <div class="pro_detail">
      <div class="pro_img">
        <div class="tb_booth" >
          <!--<img :src="goodsDetail[0].image_url" class="pro_middle_img"/>-->
          <img :src="goodsDetail[0].imgurl" class="pro_middle_img"/>
        </div>
      </div>
      <div class="pro_meg">
        <div class="pro_meg_hd">
          <h1>
            订单详情
          </h1>
        </div>
        <div class="pro_meg_price">
          <dl>
            <dt>订单价格</dt>
            <dd>
              <div class="promo_price">
                <span class="tm-price">￥{{goodsDetail[0].orderprice}}</span>
              </div>
            </dd>
          </dl>
          <dl>
            <dt>订单数量</dt>
            <dd >{{goodsDetail[0].month}}个月</dd>
          </dl>
          <dl>
            <dt>房源名称</dt>
            <dd >{{goodsDetail[0].housename}}</dd>
          </dl>
          <dl>
            <dt>房源地址</dt>
            <dd >{{goodsDetail[0].address}}</dd>
          </dl>
          <dl>
            <dt>房源面积</dt>
            <dd>{{goodsDetail[0].size}}平</dd>
          </dl>
          <dl>
            <dt>订单号</dt>
            <dd>{{goodsDetail[0].orderNo}}</dd>
          </dl>
          <dl>
            <dt>订单状态</dt>
            <dd v-if="goodsDetail[0].orderstatus==0">待支付</dd>
            <dd v-if="goodsDetail[0].orderstatus==1">已支付</dd>
            <dd v-if="goodsDetail[0].orderstatus==2">已取消</dd>
          </dl>
          <dl>
            <dt class="sale_tip"></dt>
          </dl>
        </div>
        <div class="pro_meg_deliver">
          <dl>
            <dt>下单时间</dt>
            <dd>{{goodsDetail[0].createtime}}</dd>
          </dl>
        </div>
        <div class="pro_meg_console"> 
          <div class="shopping_car">
            <el-button v-if="goodsDetail[0].orderstatus==0" type="primary" round @click.prevent="surePay(goodsDetail[0].oid)">立即支付</el-button>
            <el-button v-if="goodsDetail[0].orderstatus==0" type="success" round @click.prevent="cancelPay(goodsDetail[0].oid)">取消订单</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: "orderInfo",
    data() {
      return {
        textarea: '',
        rating: 0,
        colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
        currentGoodsId: 0,
        shopNum: 1,
        goodsDetail:[],
        // goodsComment:[],
        // userInfo:{}
      }
    },
    created(){
      this.getData();
    },
    methods:{
      getData(){
        this.$axios.get('/getOederByid?id='+this.$parent.value)
          .then(res=>{
            if (res.data.code==0) {
              this.goodsDetail = res.data.R;
            } else {
              this.$message(res.data.msg);
            }
          })
          .catch(error=>{
            this.$message.error('error');
          })
      },
      //点击确认支付
      surePay(id){
        this.$confirm('确认支付？')
          .then(()=>{
            this.$axios.get('/payOrder?oid='+id)
              .then(res=>{
                if (res.data.code==0) {
                  this.$message.success('支付成功');
                  this.getData();
                } else {
                  this.$message(res.data.msg);
                }
              })
              .catch(error=>{
                this.$message.error('error');
              })
          })
          .catch(()=>{})
      },
      cancelPay(id) {
        this.$confirm('确认取消支付？')
          .then(()=>{
            this.$axios.get('/cancelOrder?oid='+id)
              .then(res=>{
                if (res.data.code==0) {
                  this.$message.success('取消成功');
                  this.getData();
                } else {
                  this.$message(res.data.msg);
                }
              })
              .catch(error=>{
                this.$message.error('error');
              })
          })
          .catch(()=>{})
      },
      back(){
        this.$parent.choosedRouter('MyOrder')
      },
    }
  }
</script>

<style scoped>
  #container>.pro_detail{
    width: 990px;
    position: relative;
    z-index: 100;
    margin: 20px auto;
  }
  /*#container>.pro_comment{*/
    /*width: 73%;*/
    /*position: relative;*/
    /*margin: 40px auto 0;*/
    /*padding: 20px;*/
    /*border: 1px solid #ccc;*/
    /*border-bottom: none;*/
  /*}*/
  #container>.pro_judge{
    width: 73%;
    position: relative;
    margin: 0 auto 60px;
    padding: 20px;
    border-top: none;
    border: 1px solid #ccc;
  }
  .pro_judge>span{
    font-size: 12px;
    color: #ccc;
  }
  .pro_judge>.el-rate{
    display: inline-block;
  }
  .pro_judge .el-textarea{
    width: 50%;
    display: block;
    margin: 20px 0;
  }
  /*.pro_comment>h3{*/
    /*font-weight: bold;*/
    /*margin-bottom: 20px;*/
  /*}*/
  /*.pro_comment .media{*/
    /*border-top: 1px dashed #ccc;*/
    /*padding: 10px 0;*/
  /*}*/
  /*.pro_comment .media .media-heading{*/
    /*margin-bottom: 10px;*/
    /*font-weight: bolder;*/
  /*}*/
  /*.pro_comment .media .media-body{*/
    /*font-size: 14px;*/
  /*}*/
  /*.pro_comment .media .media-body span{*/
    /*font-weight: bolder;*/
  /*}*/
  /*.pro_comment .el-rate{*/
    /*display: inline-block;*/
    /*margin-left: 20px;*/
  /*}*/
  .pro_judge>h3{
    font-weight: bold;
    margin-bottom: 20px;
  }
  .pro_judge .judge_erro_tip{
    font-size: 15px;
    font-weight: bolder;
    color: #000;
  }
  .pro_detail>.pro_img{
    float: left;
    position: relative;
    padding: 10px 0;
    width:441px;
    
  }
  .pro_img>.tb_booth{
    position: relative;
    z-index: 2;
  }
  .tb_booth>.pro_middle_img{
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
  .pro_detail>.pro_meg{
    margin: 0 0 0 520px;
    color: #666;
    padding: 0 0 3px;
  }
  .pro_meg>.pro_meg_hd{
    padding: 0 10px 12px;
    color: #000;
  }
  .pro_meg_hd>h1{
    font-size: 16px;
    font-weight: 700;
    color: #000;
  }
  .pro_meg>.pro_meg_price{
    padding: 5px 20px;
    height: 200px;
    background-color:rgba(247, 244, 244, 0.6);

    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .pro_meg_price dl{
    display: flex;
    align-items: center;

    margin-bottom: 0 !important;
    cursor: pointer;
  }
  .pro_meg_price dl dt{
    width: 70px;
    color: #999;
    font-size: 12px;
  }
  .pro_meg_price dl dd{
    margin-bottom: 0 !important;
    font-family: Arial;
  }
  .pro_meg_price dl dd div{
    display: flex;
    align-items: center;
  }
  .pro_meg_price dl:last-child dd{
    color: #FF0036;
    font-weight: bold;
    font-size: 12px;
  }
  .promo_price{
    line-height: 24px;
    vertical-align: middle;
    color: #FF0036;
    font-size: 18px;
    font-family: Arial;
    -webkit-font-smoothing: antialiased;
  }
  .promo_price b{
    display: inline-block;
    font-weight: normal;
  }
  .promo_price b:last-child{
    font-size: 12px;
    background: #f47a86;
    color: white;
    padding: 0 6px;
  }
  .promo_price>.tm-price{
    font-size: 20px;
    display: inline-block;
    margin-right: 12px;
    font-weight: bold;
  }
  .nor_price{
    text-decoration: line-through;
  }
  .sale_tip{
    color: #FF0036 !important;
    font-weight: bolder;
    width: 80px  !important;
  }
  .pro_meg_deliver{
    margin: 5px 20px -15px 0;
    padding: 5px;
  }
  .pro_meg_deliver dl{
    padding: 5px;
    font-size: 14px;
    color: black;
    cursor: pointer;
  }
  .pro_meg_deliver dl dt{
    color: #999;
    font-size: 14px;
    text-align: left;
    width: 69px;
    margin: 0 0 0 8px;
    float: left;
  }
  .pro_meg_deliver dd{
    font-size: 13px;
    float: left;
  }
  .pro_meg_console{
    margin: 5px 20px 5px 0;
    padding: 5px;
  }
  .tb-sku{
    padding: 5px;
    font-size: 14px;
    color: black;
    cursor: pointer;
  }
  .tb-sku dt{
    color: #999;
    font-size: 14px;
    text-align: left;
    width: 69px;
    margin: 0 0 0 8px;
    float: left;
  }
  .tb-sku dd{
    font-size: 13px;
  }
  .tb-sku dd div{
    display: inline-block;
    margin-right: 20px;
  }
  .item-amout{
    height: 25px;
  }
  .item-amout a{
    display: inline-block;
    height: 23px;
    width: 17px;
    border: 1px solid #e5e5e5;
    background: #f0f0f0;
    text-align: center;
    line-height: 23px;
    color: #444;
    cursor: pointer;
  }
  .item-amout a:hover{
    color: #f50;
    border-color: #f60;
  }
  .item-amout>.text_amount{
    width: 40px;
    height: 20px;
    text-align: center;
    display: inline-block;
  }
  .shopping_car{
    margin: 20px auto 0;

    display: flex;
    justify-content: center;
  }
  .shopping_car button{
    outline: none;
  }
  .back {
    cursor: pointer;
  }
  .imgs {
    width: 2px;
    vertical-align: middle;
  }
  .back span {
    vertical-align: middle;
    font-size: 12px;
    color: #1AAD19;
    font-weight: 400;
  }
</style>
