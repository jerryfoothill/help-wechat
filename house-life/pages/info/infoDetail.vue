<template>
  <view class="container">
    <view v-if="info" class="detail">
      <view class="header">
        <view class="title">{{ info.title }}</view>
        <view class="type">{{ getTypeLabel(info.infoType) }}</view>
      </view>
      
      <view class="info-section">
        <view class="info-item">
          <text class="label">地点:</text>
          <text>{{ info.location }}</text>
        </view>
        <view class="info-item">
          <text class="label">时间:</text>
          <text>{{ info.infoDate }}</text>
        </view>
      </view>
      
      <view class="section">
        <view class="section-title">详细内容</view>
        <view class="section-content">{{ info.content }}</view>
      </view>
      
      <view class="section" v-if="info.trueInfoImage">
        <view class="section-title">图片</view>
        <view class="image-list">
          <image v-for="(image, index) in info.trueInfoImage.split(',')" 
                 :key="index" 
                 :src="image" 
                 mode="widthFix" 
                 class="info-image"
                 @click="previewImage(image, info.trueInfoImage.split(','))"></image>
        </view>
      </view>
      
      <view class="section">
        <view class="section-title">联系方式</view>
        <view class="contact-box">
          <view class="contact-item">
            <u-icon name="account" size="30" color="#2979ff"></u-icon>
            <text class="contact-text">{{ info.contactName }}</text>
          </view>
          <view class="contact-item">
            <u-icon name="phone" size="30" color="#2979ff"></u-icon>
            <text class="contact-text">{{ info.contactPhone }}</text>
          </view>
          <u-button type="primary" @click="makePhoneCall">拨打电话</u-button>
        </view>
      </view>
      
      <!-- <view class="publisher-info" v-if="info.userName">
        <image :src="info.userAvatar || '/static/avatar/default.png'" class="avatar"></image>
        <text class="publisher-name">{{ info.userName }}</text>
      </view> -->
    </view>
    <u-empty v-else text="加载中..." mode="loading"></u-empty>
  </view>
</template>

<script>
import config from "@/common/config.js"
export default {
  data() {
    return {
      info: null,
      typeMap: {
        '1': '寻人启事',
        '2': '寻物启事',
        '3': '失物招领',
        '4': '招工信息',
        '5': '求职信息',
        '6': '求购信息',
        '7': '出售信息',
      }
    }
  },
  onLoad(options) {
    this.fetchInfoDetail(options.id)
  },
  methods: {
    getTypeLabel(type) {
      return this.typeMap[type] || '未知类型'
    },
    fetchInfoDetail(id) {
		// let lifeData = uni.getStorageSync('lifeData');
		// let loginUser = lifeData.vuex_user
      uni.request({
        url: this.$u.http.config.baseUrl + this.$u.http.config.static_urls.info_findInfoById,
        method: 'GET',
        data: {
          id: id
        },
    //     header: {
    //       'Authorization': 'Bearer ' + uni.getStorageSync('token'),
		  // 'X-Access-Token': lifeData.vuex_token,
		  // 'X-Tenant-Id': loginUser.user ? loginUser.user.tenantId : ""
    //     },
        success: (res) => {
          if (res.statusCode === 200 && res.data.code === 200) {
			  // console.log(res)
			    if (this.$u.http.config.static_urls.server === 'source-vue') {
					this.info = {
					  ...res.data.data,
					  trueInfoImage: res.data.data.infoImage ? res.data.data.infoImage.split(',').map(img => config.baseUrl + config.web_prefix + img).join(',') : ''
					}
			    }
				if (this.$u.http.config.static_urls.server === 'jeecgboot') {
					const token = uni.getStorageSync('lifeData').vuex_token;
					this.info = {
					  ...res.data.result,
					  trueInfoImage: res.data.result.infoImage ? res.data.result.infoImage.split(',').map(img => config.baseUrl + config.web_prefix + "/" + img + '?token=' + token).join(',') : ''
					}
				}
          } else {
            this.$u.toast(res.data.msg || '获取详情失败')
          }
        },
        fail: (err) => {
          console.error(err)
          this.$u.toast('网络错误，请稍后重试')
        }
      })
    },
    
    makePhoneCall() {
      if (this.info && this.info.contactPhone) {
        uni.makePhoneCall({
          phoneNumber: this.info.contactPhone,
          fail: () => {
            this.$u.toast('拨打电话失败')
          }
        })
      }
    },
    previewImage(current, urls) {
      uni.previewImage({
        current,
        urls,
        fail: () => {
          this.$u.toast('预览图片失败')
        }
      })
    }
  }
}
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
.title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}
.type {
  display: inline-block;
  color: #ffffff;
  background-color: #2979ff;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  font-size: 24rpx;
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
.image-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.info-image {
  width: 100%;
  border-radius: 8rpx;
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