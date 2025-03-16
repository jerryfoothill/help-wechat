<template>
  <view class="container">
    <view v-if="jobSeeking" class="detail">
      <view class="header">
        <view class="position">{{ jobSeeking.expectedPosition }}</view>
        <view class="salary">{{ jobSeeking.expectedSalary }}</view>
      </view>
      
      <view class="info-section">
        <view class="info-item">
          <text class="label">工作地点:</text>
          <text>{{ jobSeeking.expectedCity }}</text>
        </view>
        <view class="info-item">
          <text class="label">工作经验:</text>
          <text>{{ jobSeeking.experience }}</text>
        </view>
        <view class="info-item">
          <text class="label">学历要求:</text>
          <text>{{ jobSeeking.education }}</text>
        </view>
      </view>
      <view class="section">
        <view class="section-title">个人简介</view>
        <view class="section-content">{{ jobSeeking.introduction }}</view>
      </view>
      <view class="section">
        <view class="section-title">联系方式</view>
        <view class="contact-box">
          <view class="contact-item">
            <u-icon name="phone" size="30" color="#2979ff"></u-icon>
            <text class="contact-text">{{ jobSeeking.contactPhone }}</text>
          </view>
          <u-button type="primary" @click="makePhoneCall">拨打电话</u-button>
        </view>
      </view>
      <!--
      <view class="publisher-info" v-if="recruit.userName">
        <image :src="recruit.userAvatar || '/static/avatar/default.png'" class="avatar"></image>
        <text class="publisher-name">{{ recruit.userName }}</text>
      </view> -->
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
    
    // 拨打电话
    makePhoneCall() {
      if (this.jobSeeking && this.jobSeeking.contactPhone) {
        uni.makePhoneCall({
          phoneNumber: this.jobSeeking.contactPhone,
          fail: () => {
            this.$u.toast('拨打电话失败');
          }
        });
      }
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
  background-color: #ffffff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}
.header {
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}
.position {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}
.salary {
  font-size: 32rpx;
  color: #e67e22;
  font-weight: bold;
}
.info-section {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #eee;
  background-color: #f9f9f9;
}
.info-item {
  display: flex;
  align-items: center;
  margin-right: 30rpx;
  margin-bottom: 10rpx;
}
.label {
  color: #666;
  margin-right: 10rpx;
}
.section {
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}
.section-title {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333;
}
.section-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}
.job-image {
  width: 100%;
  border-radius: 8rpx;
}
.file-box {
  display: flex;
  align-items: center;
  background-color: #f8f8f8;
  padding: 20rpx;
  border-radius: 8rpx;
}
.file-name {
  flex: 1;
  margin: 0 20rpx;
  font-size: 28rpx;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.contact-box {
  display: flex;
  flex-direction: column;
}
.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}
.contact-text {
  margin-left: 20rpx;
  font-size: 28rpx;
  color: #333;
}
.publisher-info {
  display: flex;
  align-items: center;
  padding: 30rpx;
  background-color: #f9f9f9;
}
.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}
.publisher-name {
  font-size: 28rpx;
  color: #333;
}
</style> 