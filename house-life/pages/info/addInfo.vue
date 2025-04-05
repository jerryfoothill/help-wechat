<template>
  <view class="container">
	  <view class="warning"> 警告：禁止发布不合法的信息，违者自负 </view>
    <u-form :model="model" :rules="rules" ref="uForm">
      <u-form-item label="信息类型" prop="infoType" 
	  label-width="180" :label-position="labelPosition" left-icon="list" :leftIconStyle="{color:'#d5d5d5'}">
        <u-input :border="border" type="select" :select-open="typeShow" v-model="typeLabel" placeholder="请选择信息类型" @click="typeShow = true"/>
      </u-form-item>

      <u-select v-model="typeShow" :list="typeList" @confirm="typeConfirm"></u-select>

      <u-form-item label="标题" prop="title"
	  label-width="180" :label-position="labelPosition" left-icon="edit-pen" :leftIconStyle="{color:'#d5d5d5'}">
        <u-input v-model="model.title" placeholder="请输入标题" />
      </u-form-item>

      <u-form-item label="地点" prop="location"
	  label-width="180" :label-position="labelPosition" left-icon="map" :leftIconStyle="{color:'#d5d5d5'}">
        <u-input v-model="model.location" placeholder="请输入地点" />
      </u-form-item>

      <!-- <u-form-item label="时间" prop="infoDate"
	  label-width="180" :label-position="labelPosition" left-icon="calendar" :leftIconStyle="{color:'#d5d5d5'}">
        <u-input v-model="model.infoDate" type="select" :border="border" placeholder="请选择时间" @click="dateClick" disabled/>
      </u-form-item>

      <u-calendar 
        :show="show"
        v-model="show"
        mode="datetime"
        @confirm="changeDate"
        @close="show = false"
        :formatter="formatter"
      ></u-calendar> -->

      <u-form-item label="联系人" prop="contactName"
	  label-width="180" :label-position="labelPosition" left-icon="account" :leftIconStyle="{color:'#d5d5d5'}">
        <u-input v-model="model.contactName" placeholder="请输入联系人姓名" />
      </u-form-item>

      <u-form-item label="联系电话" prop="contactPhone"
	  label-width="180" :label-position="labelPosition" left-icon="phone" :leftIconStyle="{color:'#d5d5d5'}">
        <u-input v-model="model.contactPhone" placeholder="请输入联系电话" type="number" />
      </u-form-item>

      <u-form-item label="详细内容" prop="content"
	  label-width="180" :label-position="labelPosition" left-icon="file-text" :leftIconStyle="{color:'#d5d5d5'}">
        <textarea v-model="model.content" :maxlength="500" placeholder="请输入详细内容"/>
      </u-form-item>
      
      <u-form-item label="图片" label-width="180" :label-position="labelPosition" left-icon="photo" :leftIconStyle="{color:'#d5d5d5'}">
        <view class="upload-box">
          <view class="preview-box" v-if="model.trueInfoImage">
            <image :src="model.trueInfoImage" mode="aspectFill" class="preview-image"></image>
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

      <u-form-item>
        <u-button type="primary" @click="submit">发布</u-button>
      </u-form-item>
    </u-form>
  </view>
</template>

<script>
import config from "@/common/config.js"
export default {
  data() {
    return {
      labelPosition: 'left',
      border: false,
      typeShow: false,
      typeLabel: '',
      show: false,
      mode: 'datetime',
      formatter: (type, value) => {
        if (type === 'year') {
          return `${value}年`
        }
        if (type === 'month') {
          return `${value}月`
        }
        if (type === 'day') {
          return `${value}日`
        }
        if (type === 'hour') {
          return `${value}时`
        }
        if (type === 'minute') {
          return `${value}分`
        }
        return value
      },
      model: {
        infoType: '',
        title: '',
        location: '',
        infoDate: '',
        contactName: '',
        contactPhone: '',
        content: '',
        infoImage: '',
        trueInfoImage: '',
        userId: uni.getStorageSync('lifeData').vuex_user.userId,
      },
      typeList: [],
      rules: {
        // infoType: [{ required: true, message: '请选择信息类型', trigger: ['change','blur'] }],
        title: [{ required: true, message: '请输入标题', trigger: ['change','blur'] }],
        location: [{ required: true, message: '请输入地点', trigger: ['change','blur'] }],
        contactName: [{ required: true, message: '请输入联系人姓名', trigger: ['change','blur'] }],
        contactPhone: [{ required: true, message: '请输入联系电话', trigger: ['change','blur'] }],
        content: [{ required: true, message: '请输入详细内容', trigger: ['change','blur'] }],
      },
    }
  },
  onLoad() {
    this.getInfoTypes()
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules)
  },
  methods: {
    // 获取信息类型列表
    getInfoTypes() {
	  let lifeData = uni.getStorageSync('lifeData');
	  let loginUser = lifeData.vuex_user
	  console.log(lifeData, loginUser, loginUser.user)
      uni.request({
        url: this.$u.http.config.baseUrl + this.$u.http.config.static_urls.infoType_list,
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + lifeData.vuex_token,
		  'X-Access-Token': lifeData.vuex_token,
		  'X-Tenant-Id': loginUser.user ? loginUser.user.tenantId : ""
        },
        success: (res) => {
			//console.log(res)
          if (res.statusCode === 200 && res.data.code === 200) {
			if (this.$u.http.config.static_urls.server === 'source-vue') {
				this.typeList = res.data.data
			}
			if (this.$u.http.config.static_urls.server === 'jeecgboot') {
				this.typeList = res.data.result.records			
				this.typeList.forEach((item) => {
					item.label = item.name
				})
			}
			
			//console.log(this.typeList, res.data.result.records)
          }
        }
      })
    },
    // 选择信息类型
    typeConfirm(e) {
      this.model.infoType = e[0].value
      this.typeLabel = e[0].label
	  //console.log(e, this.model.infoType, this.typeLabel)
    },
    // 选择时间
    dateClick() {
      this.show = true
    },
    changeDate(e) {
      const { year, month, day, hour, minute } = e
      // 格式化月份和日期，保证是两位数
      const formatMonth = month < 10 ? `0${month}` : month
      const formatDay = day < 10 ? `0${day}` : day
      const formatHour = hour < 10 ? `0${hour}` : hour
      const formatMinute = minute < 10 ? `0${minute}` : minute
      
      // 组合成完整的日期时间字符串
      const dateTimeStr = `${year}-${formatMonth}-${formatDay} ${formatHour}:${formatMinute}`
      this.model.infoDate = dateTimeStr
      this.show = false
	  console.log("infodata: ",this.model.infoDate)
    },
    // 选择图片
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.uploadImage(res.tempFilePaths[0])
        }
      })
    },
    // 上传图片
    uploadImage(filePath) {
      uni.showLoading({
        title: '上传中...'
      })
      let lifeData = uni.getStorageSync('lifeData');
      let loginUser = lifeData.vuex_user
      uni.uploadFile({
        url: this.$u.http.config.baseUrl + this.$u.http.config.static_urls.uploadInfoImage,
        filePath: filePath,
        name: 'file',
        header: {
          'Authorization': 'Bearer ' + uni.getStorageSync('token'),
		  'X-Access-Token': lifeData.vuex_token,
		  'X-Tenant-Id': loginUser.user ? loginUser.user.tenantId : ""
        },
        success: (uploadRes) => {
          const result = JSON.parse(uploadRes.data)
		  //console.log(result)
		  if (this.$u.http.config.static_urls.server === 'source-vue') {
			  if (result.code === 200) {
				this.model.infoImage = result.url
				this.model.trueInfoImage = config.baseUrl + config.web_prefix + result.url
				this.$u.toast('图片上传成功')
				console.log(this.model.trueInfoImage)
			  } else {
				this.$u.toast(result.msg || '图片上传失败')
			  }
		  }
		  if (this.$u.http.config.static_urls.server === 'jeecgboot') {
			  //console.log(result.success)
			  // if (result.success === 'true') {
			  				this.model.infoImage = result.message
							const token = uni.getStorageSync('lifeData').vuex_token;
			  				this.model.trueInfoImage = config.baseUrl + config.web_prefix + "/" + result.message + '?token=' + token
			  				this.$u.toast('图片上传成功')
			  				console.log(this.model.trueInfoImage)
			  // } else {
			  // 				this.$u.toast(result.msg || '图片上传失败')
			  // }
		  }
        },
        fail: (err) => {
          console.error(err)
          this.$u.toast('图片上传失败')
        },
        complete: () => {
          uni.hideLoading()
        }
      })
    },
    // 删除图片
    deleteImage() {
      this.model.infoImage = ''
      this.model.trueInfoImage = ''
    },
    // 提交表单
    submit() {
      this.$refs.uForm.validate(valid => {
        if (valid) {
          if(!this.$u.test.mobile(this.model.contactPhone)){
            return this.$mytip.toast('请输入正确的手机号码')
          }
          let lifeData = uni.getStorageSync('lifeData');
          let loginUser = lifeData.vuex_user
          uni.request({
            url: this.$u.http.config.baseUrl + this.$u.http.config.static_urls.info_add,
            method: 'POST',
            data: this.model,
            header: {
              'Authorization': 'Bearer ' + uni.getStorageSync('token'),
			  'X-Access-Token': lifeData.vuex_token,
			  'X-Tenant-Id': loginUser.user ? loginUser.user.tenantId : ""
            },
            success: (res) => {
              if (res.statusCode === 200 && res.data.code === 200) {
                this.$u.toast('发布成功')
                uni.navigateTo({
                  url: '/pages/info/infoList',
                })
              } else {
                this.$u.toast(res.data.msg || '发布失败')
              }
            },
            fail: (err) => {
              console.error(err)
              this.$u.toast('网络错误，请稍后重试')
            }
          })
        }
      })
    },
  }
}
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
.dateBtn {
  position: absolute;
  right: 0rpx;
  top: 10rpx;
  color: #606266;
}
</style> 