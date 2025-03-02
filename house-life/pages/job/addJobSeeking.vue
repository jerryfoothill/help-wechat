<template>
  <view class="container">
    <u-form :model="model" :rules="rules" ref="uForm">
      <u-form-item  label="期望职位" prop="expectedPosition" 
	  label-width="180" :label-position="labelPosition" left-icon="account" :leftIconStyle="{color:'#d5d5d5'}">
        <u-input v-model="model.expectedPosition" placeholder="请输入期望职位" />
      </u-form-item>

      <u-form-item label="期望薪资" prop="expectedSalary"
	  label-width="180" :label-position="labelPosition" left-icon="account" :leftIconStyle="{color:'#d5d5d5'}">
        <u-input v-model="model.expectedSalary" placeholder="请输入期望薪资，如 8k-12k" />
      </u-form-item>

      <u-form-item label="所在城市" prop="city"
	  label-width="180" :label-position="labelPosition" left-icon="account" :leftIconStyle="{color:'#d5d5d5'}">
        <u-input v-model="model.city" placeholder="请输入所在城市" />
      </u-form-item>

      <u-form-item label="工作经验" prop="experience"
	  label-width="180" :label-position="labelPosition" left-icon="account" :leftIconStyle="{color:'#d5d5d5'}">
        <u-input v-model="model.experience" placeholder="请输入工作经验，如 3-5年" />
      </u-form-item>

      <u-form-item label="学历" prop="education"
	  label-width="180" :label-position="labelPosition" left-icon="account" :leftIconStyle="{color:'#d5d5d5'}">
         <u-input v-model="model.education" placeholder="请输入学历" />
      </u-form-item>

      <u-form-item label="个人简介" prop="introduction"
	  label-width="180" :label-position="labelPosition" left-icon="account" :leftIconStyle="{color:'#d5d5d5'}">
		  <textarea v-model="model.introduction" :maxlength="500" />
      </u-form-item>

      <u-form-item label="联系电话" prop="contactPhone"
	  label-width="180" :label-position="labelPosition" left-icon="account" :leftIconStyle="{color:'#d5d5d5'}">
        <u-input v-model="model.contactPhone" placeholder="请输入联系电话" type="number" />
      </u-form-item>

      <u-form-item>
        <u-button type="primary" @click="submit">发布</u-button>
      </u-form-item>
    </u-form>
  </view>
</template>

<script>
export default {
  data() {
    return {
      model: {
        expectedPosition: '',
        expectedSalary: '',
        city: '',
        experience: '',
        education: '',
        introduction: '',
        contactPhone: '',
        userId: uni.getStorageSync('lifeData').vuex_user.userId, // Get user ID
      },
      rules: {
        expectedPosition: [{ required: true, message: '请输入期望职位', trigger: 'blur' }],
        expectedSalary: [{ required: true, message: '请输入期望薪资', trigger: 'blur' }],
        city: [{ required: true, message: '请输入所在城市', trigger: 'blur' }],
        experience: [{ required: true, message: '请输入工作经验', trigger: 'blur' }],
        education: [{required: true, message: '请输入学历', trigger: 'blur'}],
        introduction: [{ required: true, message: '请输入个人简介', trigger: 'blur' }],
        contactPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    submit() {
      this.$refs.uForm.validate(valid => {
        if (valid) {
          // Send data to backend API
          uni.request({
            url: '/api/jobApi/addJobSeeking', // Replace with your actual API endpoint
            method: 'POST',
            data: this.model,
            header: {
              'Authorization': 'Bearer ' + uni.getStorageSync('token'), // Include token
            },
            success: (res) => {
              if (res.statusCode === 200 && res.data.code === 200) { //check for correct status code and response code
                this.$u.toast('发布成功');
                // Redirect to job seeking list page
                uni.navigateTo({
                  url: '/pages/job/jobSeekingList',
                });
              } else {
                this.$u.toast(res.data.msg || '发布失败'); //show error message from server
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
</style> 