<template>
  <view class="container">
    <view v-if="recruit" class="detail">
      <view class="header">
        <view class="position">{{ recruit.expectedPosition }}</view>
        <view class="salary">{{ recruit.expectedSalary }}</view>
      </view>
      
      <view class="info-section">
        <view class="info-item">
          <text class="label">工作地点:</text>
          <text>{{ recruit.expectedCity }}</text>
        </view>
        <view class="info-item">
          <text class="label">工作经验:</text>
          <text>{{ recruit.experience }}</text>
        </view>
        <view class="info-item">
          <text class="label">学历要求:</text>
          <text>{{ recruit.education }}</text>
        </view>
      </view>
      
      <view class="section">
        <view class="section-title">职位描述</view>
        <view class="section-content">{{ recruit.introduction }}</view>
      </view>
      
      <view class="section" v-if="recruit.trueJobImage">
        <view class="section-title">招聘图片</view>
        <image :src="recruit.trueJobImage" mode="widthFix" class="job-image"></image>
      </view>
      
      <view class="section" v-if="recruit.jobFile">
        <view class="section-title">招聘附件</view>
        <view class="file-box" @click="downloadFile">
          <u-icon name="file-text" size="30" color="#2979ff"></u-icon>
          <text class="file-name">{{ recruit.jobFileName }}</text>
          <u-icon name="download" size="30" color="#2979ff"></u-icon>
        </view>
      </view>
      
      <view class="section">
        <view class="section-title">联系方式</view>
        <view class="contact-box">
          <view class="contact-item">
            <u-icon name="phone" size="30" color="#2979ff"></u-icon>
            <text class="contact-text">{{ recruit.contactPhone }}</text>
          </view>
          <u-button type="primary" @click="makePhoneCall">拨打电话</u-button>
        </view>
      </view>
      
      <view class="publisher-info" v-if="recruit.userName">
        <image :src="recruit.userAvatar || '/static/avatar/default.png'" class="avatar"></image>
        <text class="publisher-name">{{ recruit.userName }}</text>
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
      recruit: null,
    };
  },
  onLoad(options) {
    this.fetchRecruitDetail(options.id);
  },
  methods: {
    fetchRecruitDetail(id) {
      uni.request({
        url: this.$u.http.config.baseUrl + `/api/jobApi/findJobRecruitmentById`, // 使用新的招工信息API
        method: 'GET',
		data: {
		    id: id
		},
        header: {
          'Authorization': 'Bearer ' + uni.getStorageSync('token'), // 包含token
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.code === 200) {
            // 转换字段名称以适配现有UI
            const data = res.data.data;
            this.recruit = {
              id: data.id,
              expectedPosition: data.positionTitle,
              expectedSalary: data.salaryRange,
              expectedCity: data.workLocation,
              experience: data.experienceReq,
              education: data.educationReq,
              introduction: data.jobDescription,
              contactPhone: data.contactPhone,
              userId: data.userId,
              userName: data.userName,
              userAvatar: data.userAvatar,
              state: data.state,
              viewCount: data.viewCount,
              jobImage: data.jobImage,
			  trueJobImage: config.baseUrl + config.web_prefix + data.jobImage,
              jobFile: data.jobFile,
              jobFileName: data.jobFileName
            };
			console.log(this.recruit)
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
      if (this.recruit && this.recruit.contactPhone) {
        uni.makePhoneCall({
          phoneNumber: this.recruit.contactPhone,
          fail: () => {
            this.$u.toast('拨打电话失败');
          }
        });
      }
    },
    
    // 下载文件
    downloadFile() {
      if (!this.recruit || !this.recruit.jobFile) return;
      
      uni.showLoading({
        title: '下载中...'
      });
      
      // #ifdef APP-PLUS || H5
      uni.downloadFile({
        url: this.$u.http.config.baseUrl + config.web_prefix + this.recruit.jobFile,
        success: (res) => {
          if (res.statusCode === 200) {
            uni.saveFile({
              tempFilePath: res.tempFilePath,
              success: (saveRes) => {
                this.$u.toast('文件已保存');
                // 打开文件
                uni.openDocument({
                  filePath: saveRes.savedFilePath,
                  fail: () => {
                    this.$u.toast('无法打开此文件');
                  }
                });
              },
              fail: () => {
                this.$u.toast('保存文件失败');
              }
            });
          } else {
            this.$u.toast('下载失败');
          }
        },
        fail: () => {
          this.$u.toast('下载失败');
        },
        complete: () => {
          uni.hideLoading();
        }
      });
      // #endif
      
      // #ifdef MP-WEIXIN
      uni.showModal({
        title: '提示',
        content: '小程序暂不支持文件下载，请在浏览器中打开',
        showCancel: false
      });
      uni.hideLoading();
      // #endif
    }
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