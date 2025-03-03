<template>
  <view class="container">
    <view v-if="jobSeeking" class="detail">
      <view class="section">
        <text class="label">期望职位:</text>
        <text>{{ jobSeeking.expectedPosition }}</text>
      </view>
      <view class="section">
        <text class="label">期望薪资:</text>
        <text>{{ jobSeeking.expectedSalary }}</text>
      </view>
      <view class="section">
        <text class="label">求职地点:</text>
        <text>{{ jobSeeking.expectedCity }}</text>
      </view>
      <view class="section">
        <text class="label">工作经验:</text>
        <text>{{ jobSeeking.experience }}</text>
      </view>
       <view class="section">
        <text class="label">学历:</text>
        <text>{{ jobSeeking.education }}</text>
      </view>
      <view class="section">
        <text class="label">个人简介:</text>
        <text>{{ jobSeeking.introduction }}</text>
      </view>
      <view class="section">
        <text class="label">联系电话:</text>
        <text>{{ jobSeeking.contactPhone }}</text>
      </view>
    </view>
    <u-empty v-else text="加载中..." mode="loading"></u-empty>
  </view>
</template>

<script>
	
import config from "@/common/config.js" // 全局配置文件
export default {
  data() {
    return {
      jobSeeking: null,
    };
  },
  onLoad(options) {
    this.fetchJobSeekingDetail(options.id);
  },
  methods: {
    fetchJobSeekingDetail(id) {
      uni.request({
		//url: this.$u.http.config.baseUrl + `/api/jobApi/findJobSeekingById/${id}`, // Replace with your actual API endpoint
        url: this.$u.http.config.baseUrl + `/api/jobApi/findJobSeekingById`, // Replace with your actual API endpoint
        method: 'GET',
		data: {
		        id: id
		    },
        header: {
          'Authorization': 'Bearer ' + uni.getStorageSync('token'), // Include token
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.code === 200) {
            this.jobSeeking = {
                expectedPosition: res.data.data.expectedPosition,
                expectedSalary: res.data.data.expectedSalary,
                expectedCity: res.data.data.expectedCity,
                experience: res.data.data.experience,
                education: res.data.data.education,
                introduction: res.data.data.introduction,
                contactPhone: res.data.data.contactPhone,
            };
          } else {
            this.$u.toast(res.data.msg || '获取详情失败');
          }
        },
        fail: (err) => {
          console.error(err);
          this.$u.toast('网络错误，请稍后重试');
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
.detail {
  display: flex;
  flex-direction: column;
}
.section {
  display: flex;
  margin-bottom: 10rpx;
  border-bottom: 1rpx solid #eee;
  padding-bottom: 10rpx;
}
.label {
  font-weight: bold;
  margin-right: 10rpx;
  width: 160rpx; /* Or any suitable width */
  color: #666;
}
</style> 