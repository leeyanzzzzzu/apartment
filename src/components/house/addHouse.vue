<template>
  <div id="addHouse">
    <h3>房源信息</h3>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="房源名称" prop="housename" style="width:500px">
        <el-input v-model="ruleForm.housename"></el-input>
      </el-form-item>
      <el-form-item label="房源图片" style="width:500px">
        <el-upload
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-change="handleChange"
          :auto-upload="false"
          :multiple="false"
          limit:1
          action="http://localhost:3000">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="房源价格/月" prop="price" style="width:250px">
        <el-input v-model="ruleForm.price" type="number"></el-input>
      </el-form-item>
      <el-form-item label="房源面积" prop="size" style="width:250px">
        <el-input v-model="ruleForm.size" type="number"></el-input>
      </el-form-item>
      <el-form-item label="房源地址" prop="address" style="width:500px">
        <el-input v-model="ruleForm.address"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {addGoodsToRecom} from './../../api/index';
  export default {
    name: "addHouse",
    data() {
      return {
        fileList: [],
        dialogImageUrl: '',
        dialogVisible: false,
        ruleForm: {
          housename: '',
          price: null,
          address: '',
          size: '',
        },
        rules: {
          housename: [
            { required: true, message: '请输入房源名称', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '请输入房源价格', trigger: 'blur' }
          ],
          size: [
            { required: true, message: '请输入房源面积', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请输入房源地址', trigger: 'blur' }
          ],
        },
      };
    },
    created() {
      this.getData();
    },
    methods: {
      getData(){
        let id =this.$parent.value;
        if(id){
          this.$axios.get('/getHouseInfo?id='+id)
            .then(res=>{
              if (res.data.code==0) {
                let data= res.data.R[0];
                this.ruleForm.housename = data.housename
                this.ruleForm.address = data.address
                this.ruleForm.size = data.size
                this.ruleForm.price = data.price
                this.dialogImageUrl = data.imgurl
              }
            })
            .catch(error=>{
              console.log(error);
              this.$message.error('error');
            })
        }
      },
      handleChange(file, fileList) {
        if(fileList.length > 1){
          fileList = fileList.slice(-1)
        }
        this.fileList = fileList;
        console.log(this.fileList);
      },
      handlePictureCardPreview(file) {
        console.log(file.url);
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      async submitForm(formName) {
        let flag = false;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$refs[formName].model.size = Number(this.$refs[formName].model.size);
            this.$refs[formName].model.price = Number(this.$refs[formName].model.price);
            flag = true;
          }
        });
        if(!this.fileList.length){
          flag = false;
        }
        if(flag){
          let formData = new FormData();
          let id =this.$parent.value;
          if(id){
            formData.append('id', id);
          }
          let user =localStorage.getItem('adminInfo');
          user = JSON.parse(user);
          formData.append('housename', this.$refs[formName].model.housename);
          formData.append('size', this.$refs[formName].model.size);
          formData.append('price', this.$refs[formName].model.price);
          formData.append('address', this.$refs[formName].model.address);
          formData.append('imgurl', this.fileList[0].raw);
          formData.append('uid',user.uid);

          let result = await addGoodsToRecom(formData);
          if(result.code === 0){
            this.$message.success(result.msg);
          }else{
            this.$message({
              type: 'error',
              message: '添加失败'
            });
          }
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>
  #addHouse{
    padding-top: 20px;
  }
  #addHouse>h3{
    font-weight: bolder;
    margin: 10px 10px 30px 10px;
  }
</style>

