<template>
  <div class="user-detail">
    <div class="user-detail-top">基本信息</div>
    <div class="user-detail-group">
      <div class="user-icon">
        <span>头像</span>
        <el-upload
          class="avatar-uploader"
          action=""
          :auto-upload="false"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :on-change="handleAvatarChange">
          <img v-if="user_avatar" :src="user_avatar_imgUrl" class="avatar">
          <img v-else src="../../assets/img/head.jpg" class="avatar">
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div class="user-item">
        <span>账号/用户名</span>
        <span>{{ userInfo.username || "暂未设置" }}</span>
      </div>
      <div class="user-item">
        <span>手机</span>
        <el-input
          type="text"
          placeholder="请输入内容"
          v-model="user_phone"
          maxlength="11"
          show-word-limit
          clearable
          style="width:216px"
        >
        </el-input>
      </div>
      <div class="user-item">
        <span>邮箱</span>
        <el-input
          type="text"
          placeholder="请输入内容"
          v-model="user_email"
          maxlength="20"
          show-word-limit
          clearable
          style="width:216px"
        >
        </el-input>
      </div>
      <div class="user-item">
        <span>性别</span>
        <el-select v-model="user_sex" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="user-item">
        <span>真实姓名</span>
        <el-input
          type="text"
          placeholder="请输入内容"
          v-model="user_realname"
          maxlength="3"
          show-word-limit
          clearable
          style="width:216px"
        >
        </el-input>
      </div>
      <div class="user-item">
        <span>身份证号</span>
        <el-input
          type="text"
          placeholder="请输入内容"
          v-model="user_idcard"
          maxlength="18"
          show-word-limit
          clearable
          style="width:216px"
        >
        </el-input>
      </div>
      <div style="margin-left:90%;margin-top:30px">
        <el-button type="danger" @click="saveUserInfo()" icon="el-icon-edit">编辑</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {changeUserInfo} from '../../api/index'
  export default {
    data() {
      return {
        user_idcard: '',
        user_realname: '',
        user_email: '',
        user_sex: '',
        user_phone: '',
        user_avatar_imgUrl: '',
        user_avatar: '',
        userInfo:{},
        options: [{
          value: '男',
          label: '男'
        }, {
          value: '女',
          label: '女'
        }],
      }
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        this.$axios.get('/users/getUserByid')
          .then(res => {
            if (res.data.code == 0) {
              let data=res.data.R
              this.userInfo = data;
              this.user_phone = data.mobile;
              this.user_email = data.email;
              this.user_avatar_imgUrl = data.avatar;
              this.user_avatar = data.avatar;
              this.user_sex = data.sex;
              this.user_idcard = data.id_card;
              this.user_realname = data.realname;

            } else if (res.data.code = 10000) {
              this.$message(res.data.msg);
              this.$router.push('/')
            } else {
              this.$message(res.data.msg);
            }
          })
          .catch(error => {
            this.$message.error('error');
          })
      },
        beforeAvatarUpload(file) {
          const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
          const isLt2M = file.size / 1024 / 1024 < 1;

          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 1MB!');
          }
          return isJPG && isLt2M;
        },
        handleAvatarChange(file, fileList){
          this.user_avatar_imgUrl = URL.createObjectURL(file.raw);
          this.user_avatar = file.raw;
        },
        // 修改用户信息
        async saveUserInfo() {
          // if()
          let formData = new FormData();
          formData.append('id', this.userInfo.id);
          formData.append('mobile', this.user_phone);
          formData.append('email', this.user_email);
          formData.append('sex', this.user_sex);
          formData.append('realname', this.user_realname);
          formData.append('id_card', this.user_idcard);
          if (this.user_avatar) {
            formData.append('avatar', this.user_avatar);
          }
          let result = await changeUserInfo(formData);
          // 3.3 返回主界面
          if(result.code === 0){
            // 3.2 提示用户
            this.$message.success(result.msg);
            this.getData()
          }else{
            this.$message(result.msg);
          }
        },
    },
  }
</script>

<style scoped>
  .user-detail{
    width: 70%;
    height: 100%;
    margin: 20px auto;
  }
  .user-detail-top{
    width: 100%;
    height: 60px;
    line-height: 60px;
    padding-left: 10px;
    font-weight: bold;
  }
  .user-detail-group .user-icon{
    height: 60px;
    padding: 0 10px;
    background-color: #fff;
    border-bottom: 1px solid #e0e0e0;

    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .user-detail-group .user-item{
    height: 50px;
    padding: 0 10px;
    background-color: #fff;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .user-detail-group input{
    border: 1px solid #ccc;
    outline: none;
    text-align: right;
    width: 200px;
  }
  .right-title-color{
    color: #999;
    font-size: 14px;
  }
  .avatar-uploader{
    position: relative;
    width: 56px;
    height: 56px;
  }
  .avatar-uploader /deep/ .el-upload.el-upload--text {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    cursor: pointer;
    overflow: hidden;
  }
  .avatar-uploader-icon {
    position: absolute;
    left: 0;
    top: 0;
    font-size: 28px;
    color: #8c939d;
    width: 100%;;
    height: 100%;
    line-height: 56px;
    text-align: center;
    opacity: 0;
  }
  .avatar-uploader-icon:hover{
    opacity: 1;
  }
  .avatar {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
</style>

