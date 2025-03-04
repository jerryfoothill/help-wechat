<template>
  <view class="container">
	  <view class="warning">警告：禁止发布不合法的信息，违者自负 </view>
    <u-form :model="model" :rules="rules" ref="uForm">
      <u-form-item label="招聘职位" prop="expectedPosition" 
	  label-width="180" :label-position="labelPosition" left-icon="account" :leftIconStyle="{color:'#d5d5d5'}">
        <u-input v-model="model.expectedPosition" placeholder="请输入招聘职位" />
      </u-form-item>

      <u-form-item label="薪资范围" prop="expectedSalary"
	  label-width="180" :label-position="labelPosition" left-icon="account" :leftIconStyle="{color:'#d5d5d5'}">
        <u-input v-model="model.expectedSalary" placeholder="请输入薪资范围，如 8k-12k" />
      </u-form-item>

      <u-form-item label="工作地点" prop="expectedCity"
	  label-width="180" :label-position="labelPosition" left-icon="account" :leftIconStyle="{color:'#d5d5d5'}">
        <u-input v-model="model.expectedCity" placeholder="请输入工作地点" />
      </u-form-item>

      <u-form-item label="工作经验" prop="experience"
	  label-width="180" :label-position="labelPosition" left-icon="account" :leftIconStyle="{color:'#d5d5d5'}">
        <u-input v-model="model.experience" placeholder="请输入工作经验要求，如 3-5年" />
      </u-form-item>

      <u-form-item label="学历要求" prop="education"
	  label-width="180" :label-position="labelPosition" left-icon="account" :leftIconStyle="{color:'#d5d5d5'}">
         <u-input v-model="model.education" placeholder="请输入学历要求" />
      </u-form-item>

      <u-form-item label="职位描述" prop="introduction"
	  label-width="180" :label-position="labelPosition" left-icon="account" :leftIconStyle="{color:'#d5d5d5'}">
		  <textarea v-model="model.introduction" :maxlength="500" />
      </u-form-item>

      <u-form-item label="联系电话" prop="contactPhone"
	  label-width="180" :label-position="labelPosition" left-icon="account" :leftIconStyle="{color:'#d5d5d5'}">
        <u-input v-model="model.contactPhone" placeholder="请输入联系电话" type="number" />
      </u-form-item>
      
      <u-form-item label="招聘图片" label-width="180" :label-position="labelPosition" left-icon="photo" :leftIconStyle="{color:'#d5d5d5'}">
        <view class="upload-box">
          <view class="preview-box" v-if="model.trueJobImage">
            <image :src="model.trueJobImage" mode="aspectFill" class="preview-image"></image>
            <view class="delete-icon" @click="deleteImage">
              <u-icon name="close" color="#ffffff" size="20"></u-icon>
            </view>
          </view>
          <view class="upload-btn" v-else @click="chooseImage">
            <u-icon name="plus" size="40" color="#c0c4cc"></u-icon>
            <view class="upload-text">上传图片</view>
          </view>
        </view>
      </u-form-item>
      
      <!-- <u-form-item label="招聘附件" label-width="180" :label-position="labelPosition" left-icon="file-text" :leftIconStyle="{color:'#d5d5d5'}">
        <view class="upload-box">
          <view class="file-box" v-if="model.jobFile">
            <view class="file-name">{{ model.jobFileName }}</view>
            <view class="delete-icon" @click="deleteFile">
              <u-icon name="close" color="#ffffff" size="20"></u-icon>
            </view>
          </view>
          <view class="upload-btn" v-else @click="chooseFile">
            <u-icon name="plus" size="40" color="#c0c4cc"></u-icon>
            <view class="upload-text">上传附件</view>
          </view>
        </view>
      </u-form-item> -->

      <u-form-item>
        <u-button type="primary" @click="submit">发布</u-button>
      </u-form-item>
    </u-form>
  </view>
</template>

<script>
import config from "@/common/config.js" // 全局配置文件
export default {
  data() {
    return {
      labelPosition: 'left',
      model: {
        expectedPosition: '',
        expectedSalary: '',
        expectedCity: '',
        experience: '',
        education: '',
        introduction: '',
        contactPhone: '',
        jobImage: '',
		trueJobImage: '',
        jobFile: '',
        jobFileName: '',
        userId: uni.getStorageSync('lifeData').vuex_user.userId, // 获取用户ID
      },
      rules: {
        expectedPosition: [{ required: true, message: '请输入招聘职位', trigger: ['change','blur'] }],
        expectedSalary: [{ required: true, message: '请输入薪资范围', trigger: ['change','blur'] }],
        expectedCity: [{ required: true, message: '请输入工作地点', trigger: ['change','blur'] }],
        experience: [{ required: true, message: '请输入工作经验要求', trigger: ['change','blur'] }],
        education: [{required: true, message: '请输入学历要求', trigger: ['change','blur']}],
        introduction: [{ required: true, message: '请输入职位描述', trigger: ['change','blur'] }],
        contactPhone: [{ required: true, message: '请输入联系电话', trigger: ['change','blur'] }],
      },
    };
  },
  onReady() {
  	this.$refs.uForm.setRules(this.rules);
  },
  methods: {
    // 选择图片
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.uploadImage(res.tempFilePaths[0]);
        }
      });
    },
    
    // 上传图片
    uploadImage(filePath) {
      uni.showLoading({
        title: '上传中...'
      });
      
      uni.uploadFile({
        url: this.$u.http.config.baseUrl + '/api/jobApi/uploadJobImage',
        filePath: filePath,
        name: 'file',
        header: {
          'Authorization': 'Bearer ' + uni.getStorageSync('token')
        },
        success: (uploadRes) => {
          const result = JSON.parse(uploadRes.data);
          if (result.code === 200) {
            this.model.jobImage = result.url;
			this.model.trueJobImage = config.baseUrl + config.web_prefix + result.url;
            this.$u.toast('图片上传成功');
          } else {
            this.$u.toast(result.msg || '图片上传失败');
          }
        },
        fail: (err) => {
          console.error(err);
          this.$u.toast('图片上传失败');
        },
        complete: () => {
          uni.hideLoading();
        }
      });
    },
    
    // 删除图片
    deleteImage() {
      this.model.jobImage = '';
	  this.model.truJobImage = '';
    },
    
    // 选择文件
    chooseFile() {
      // #ifdef APP-PLUS
      uni.chooseFile({
        count: 1,
        extension: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'],
        success: (res) => {
          this.uploadFile(res.tempFilePaths[0]);
        }
      });
      // #endif
      
      // #ifdef H5 || MP-WEIXIN
      uni.chooseMessageFile({
        count: 1,
        type: 'file',
        success: (res) => {
          this.uploadFile(res.tempFiles[0].path);
        }
      });
      // #endif
    },
    
    // 上传文件
    uploadFile(filePath) {
      uni.showLoading({
        title: '上传中...'
      });
      
      uni.uploadFile({
        url: this.$u.http.config.baseUrl + '/api/jobApi/uploadJobFile',
        filePath: filePath,
        name: 'file',
        header: {
          'Authorization': 'Bearer ' + uni.getStorageSync('token')
        },
        success: (uploadRes) => {
          const result = JSON.parse(uploadRes.data);
          if (result.code === 200) {
            this.model.jobFile = result.url;
            this.model.jobFileName = result.realName;
            this.$u.toast('文件上传成功');
          } else {
            this.$u.toast(result.msg || '文件上传失败');
          }
        },
        fail: (err) => {
          console.error(err);
          this.$u.toast('文件上传失败');
        },
        complete: () => {
          uni.hideLoading();
        }
      });
    },
    
    // 删除文件
    deleteFile() {
      this.model.jobFile = '';
      this.model.jobFileName = '';
    },
    
    // 提交表单
    submit() {
      this.$refs.uForm.validate(valid => {
        if (valid) {
			if(!this.$u.test.mobile(this.model.contactPhone)){
				return this.$mytip.toast('请输入正确的手机号码')
			}
          // 转换字段名称以适配新的API
          const jobRecruitment = {
            positionTitle: this.model.expectedPosition,
            salaryRange: this.model.expectedSalary,
            workLocation: this.model.expectedCity,
            experienceReq: this.model.experience,
            educationReq: this.model.education,
            jobDescription: this.model.introduction,
            contactPhone: this.model.contactPhone,
            jobImage: this.model.jobImage,
            jobFile: this.model.jobFile,
            jobFileName: this.model.jobFileName,
            userId: this.model.userId
          };
          
          // 发送数据到后端API
          uni.request({
            url: this.$u.http.config.baseUrl + '/api/jobApi/addJobRecruitment', // 使用新的招工信息API
            method: 'POST',
            data: jobRecruitment,
            header: {
              'Authorization': 'Bearer ' + uni.getStorageSync('token'), // 包含token
            },
            success: (res) => {
              if (res.statusCode === 200 && res.data.code === 200) { //检查正确的状态码和响应码
                this.$u.toast('发布成功');
                // 重定向到招聘列表页面
                uni.navigateTo({
                  url: '/pages/job/recruitList',
                });
              } else {
                this.$u.toast(res.data.msg || '发布失败'); //显示来自服务器的错误消息
              }
            },
            fail: (err) => {
              console.error(err);
              this.$u.toast('网络错误，请稍后重试');
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.container {
  padding: 20rpx;
}
.warning {
	color: red;
}

textarea {
  width: 100%;
  height: 200rpx;
  background-color: #f8f8f8;
  padding: 20rpx;
  border-radius: 8rpx;
}
.upload-box {
  display: flex;
  flex-direction: column;
}
.upload-btn {
  width: 200rpx;
  height: 200rpx;
  background-color: #f8f8f8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8rpx;
}
.upload-text {
  margin-top: 10rpx;
  color: #c0c4cc;
  font-size: 24rpx;
}
.preview-box {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
  overflow: hidden;
}
.preview-image {
  width: 100%;
  height: 100%;
}
.file-box {
  position: relative;
  width: 100%;
  height: 80rpx;
  background-color: #f8f8f8;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
}
.file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.delete-icon {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  width: 40rpx;
  height: 40rpx;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style> 