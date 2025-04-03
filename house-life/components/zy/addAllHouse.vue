<template>
	<view>
		<!-- <u-navbar :is-back="true" title="添加我的房子" :border-bottom="false"
			back-text="返回" :custom-back="goHome" ></u-navbar> -->
		<scroll-view scroll-y="true" class="scroll-wrapper">
			<view>
				<view class="wrap">
					<u-form ref="uForm">
						<u-form-item :label-position="labelPosition" label="户型" label-width="150" >
							<u-input :border="border" type="select" :select-open="selectShow" v-model="houseTypeVo" placeholder="请选择户型" @click="selectShow = true"></u-input>
						</u-form-item>
						<u-form-item label-width="150" :label-position="labelPosition" label="面积" >
							<u-input :border="border" placeholder="请输入面积" v-model="model.houseArea" type="number"></u-input>
						</u-form-item>
						<u-form-item label-width="150" :label-position="labelPosition" label="租金" >
							<u-input :border="border" placeholder="请输入租金" v-model="model.price" type="number"></u-input>
						</u-form-item>
						<u-form-item label-width="150" :label-position="labelPosition" label="起租日期">
							<view class="dateBtn" @click="dateClick">
								{{dateLabel}}<u-icon name="arrow-right"></u-icon>
							</view>
						</u-form-item>
						<view class="custom-gap"></view>
						<u-form-item :label-position="labelPosition" label="房源图片" label-width="150" >
						  <view class="upload-box">
						    <template v-if="trueFaceUrl && trueFaceUrl.length > 0">
						      <view class="preview-box" v-for="(url, index) in trueFaceUrl" :key="index">
						        <image :src="url" mode="aspectFill" class="preview-image"></image>
						        <view class="delete-icon" @click="deleteImage(index)">
						          <u-icon name="close" color="#ffffff" size="20"></u-icon>
						        </view>
						      </view>
						    </template>
						    <view class="upload-btn" v-if="!trueFaceUrl || trueFaceUrl.length < 2" @click="chooseImage">
						      <u-icon name="plus" size="40" color="#c0c4cc"></u-icon>
						      <view class="upload-text">上传图片</view>
						    </view>
						  </view>
						</u-form-item>
						<u-form-item label-width="150"  :label-position="labelPosition" label="房源描述">	
							<u-input type="textarea" :border="border" placeholder="请填写房屋描述" v-model="model.introduce" />
						</u-form-item>
						<u-form-item label-width="150"  :label-position="labelPosition" label="房源亮点" >
							<u-checkbox-group @change="checkboxGroupChange" :width="radioCheckWidth" :wrap="radioCheckWrap">
								<u-checkbox v-model="item.checked" v-for="(item, index) in checkboxList" :key="index" :name="item.name">{{ item.name }}</u-checkbox>
							</u-checkbox-group>
						</u-form-item>
					</u-form>
				</view>
			</view>
		</scroll-view>
		<u-select mode="mutil-column" :list="selectList" v-model="selectShow" @confirm="selectConfirm"></u-select>
		<u-action-sheet :list="actionSheetList" v-model="actionSheetShow" @click="actionSheetCallback"></u-action-sheet>
		<u-calendar v-model="show" :mode="mode" @change="changeDate" max-date="2100-01-01"></u-calendar>
		<view class="bottom-btn">
			<u-button type="primary" @click="submit">提交</u-button>
		</view>
	</view>
</template>

<script>
import config from "@/common/config.js" // 全局配置文件
export default {
	props:{
		model:Object
	},
	data() {
		return {
			houseTypeVo: '',
		    show: false,
		    mode: 'date',
			selectList: [
				[
					{
						value: '一室',
						label: '一室'
					},
					{
						value: '二室',
						label: '二室'
					},
					{
						value: '三室',
						label: '三室'
					},
					{
						value: '四室',
						label: '四室'
					}
				],
				[
					{
						value: '',
						label: ''
					},
					{
						value: '一厅',
						label: '一厅'
					},
					{
						value: '二厅',
						label: '二厅'
					},
					{
						value: '三厅',
						label: '三厅'
					}
				],
				[
					{
						value: '',
						label: ''
					},
					{
						value: '一卫',
						label: '一卫'
					},
					{
						value: '二卫',
						label: '二卫'
					}
				],
			],
			border: false,
			check: false,
			selectStatus: 'close',
			checkboxList: [
				{
					name: '看房方便',
					checked: true,
					disabled: false
				},
				{
					name: '独卫',
					checked: false,
					disabled: false
				},
				{
					name: '独立阳台',
					checked: false,
					disabled: false
				},
				{
					name: '智能锁',
					checked: false,
					disabled: false
				},
				{
					name: '可短租',
					checked: false,
					disabled: false
				},
				{
					name: '首次出租',
					checked: false,
					disabled: false
				},
				{
					name: '免物业费',
					checked: false,
					disabled: false
				},
				{
					name: '民用水电',
					checked: false,
					disabled: false
				}
			],
			actionSheetList: [
				{
					text: '电梯房'
				},
				{
					text: '楼梯房'
				}
			],
			selectShow: false,
			radioCheckWidth: 'auto',
			radioCheckWrap: false,
			labelPosition: 'left',
			errorType: ['toast'],
			actionSheetShow: false,
			dateLabel:'随时入住',
			trueFaceUrl: [],
			faceUrl:'',
			// 服务器地址
			action: config.staticUrl + '/common/upload',
			siteType:['compressed'],
		};
	},
	watch: {
	    model: {
	        handler(newName, oldName) {
	            if (newName) {
	                this.houseTypeVo = newName.houseType || ''
	                // 回显房源亮点
	                if(newName.featureList){
	                    this.checkboxList.forEach(item=>{
	                        newName.featureList.forEach(feature=>{
	                            if(feature.feature == item.name){
	                                item.checked=true
	                            }
	                        })
	                    })
	                }
	            }
	        },
	        immediate: true,
	        deep: true
	    }
	},
	methods: {
		submit() {
			if(this.$u.test.isEmpty(this.model.houseType)){
				this.model.houseType = 0
				// return this.$mytip.toast('请选择户型')
			}
			if(this.$u.test.isEmpty(this.model.houseArea)){
				this.model.houseArea = 0
				// return this.$mytip.toast('请输入面积')
			}
			if(this.$u.test.isEmpty(this.model.price)){
				this.model.price = 0
				// return this.$mytip.toast('请输入租金')
			}
			// let files = [];
			// 通过filter，筛选出上传进度为100的文件(因为某些上传失败的文件，进度值不为100，这个是可选的操作)
			// files = this.$refs.uUpload.lists.filter(val => {
			// 	return val.progress == 100;
			// })
			// if(this.$u.test.isEmpty(files)){
			// 	return this.$mytip.toast('请至少选择一张房源图片')
			// }
			// let imageList = files.map(val => {
			// 	if (!val.response) {
			// 		return {
			// 			imageName: '',
			// 			imagePath: '',
			// 			imgUrl: val.url || '', 
			// 			imageSize: val.file ? val.file.size : 0
			// 		}
			// 	}
			// 	return {
			// 		imageName: val.response.realName || '',
			// 		imagePath: val.response.fileName || '',
			// 		imgUrl: val.response.url || val.url || '', 
			// 		imageSize: val.file ? val.file.size : 0
			// 	}
			// })
			// this.model.imageList = imageList
			if(this.$u.test.isEmpty(this.model.featureList)){
				let featureList = [{feature: "看房方便"}]
				this.model.featureList = featureList
				// console.log(this.model.featureList)
				 // return this.$mytip.toast('请至少选择一个房源亮点')
			}
			let url = this.$u.http.config.static_urls.addHouse
			if(this.model.id){
				url = this.$u.http.config.static_urls.updateHouse
			}
			this.model.publishId = uni.getStorageSync('lifeData').vuex_user.user.userId;
			this.$u.post(url,this.model).then(data => {
				// uni.$emit('findIndexHouseList', {});
				// this.$u.route({
				// 	type: 'tab',url: '/pages/index/index'
				// })
				this.$u.route({
					url: 'pages/center/order',
				})
			});
		},
		// 选择类型回调
		selectConfirm(e) {
			this.model.houseType = ''
			e.map((val, index) => {
				if(index == 0){
					this.model.houseNum = val.label;
				}else if(index == 1){
					this.model.houseHall = val.label;
				}else if(index == 2){
					this.model.toiletNum = val.label;
				}
				this.model.houseType += val.label;
				this.houseTypeVo = this.model.houseType
			})
		},
		// 点击actionSheet回调
		actionSheetCallback(index) {
			uni.hideKeyboard();
			this.model.stepType = this.actionSheetList[index].text;
		},
		// checkbox选择发生变化
		checkboxGroupChange(e) {
			let featureList = e.map(val => {
				return {
					feature: val
				}
			})
			this.model.featureList = featureList
		},
		borderChange(index) {
			this.border = !index;
		},
		labelPositionChange(index) {
			this.labelPosition = index == 0 ? 'left' : 'top';
		},
		codeChange(text) {
			this.codeTips = text;
		},
		dateClick(){
			this.show = true
		},
		changeDate(e){
			this.model.startDate = e.result
			this.dateLabel = e.result
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
					if (this.faceUrl.length == 0) {
						this.faceUrl = result.message
					} else {
						this.faceUrl += "," + result.message
					}
					this.model.faceUrl = this.faceUrl
					this.trueFaceUrl.push(config.baseUrl + config.web_prefix + result.url)
					this.$u.toast('图片上传成功')
					console.log(this.trueFaceUrl)
				  } else {
					this.$u.toast(result.msg || '图片上传失败')
				  }
			  }
			  if (this.$u.http.config.static_urls.server === 'jeecgboot') {
				  console.log(result)
				  if (result.success) {
						if (this.faceUrl.length == 0) {
							this.faceUrl = result.message
						} else {
							this.faceUrl += "," + result.message
						}
						this.model.faceUrl = this.faceUrl
				  				
						const token = uni.getStorageSync('lifeData').vuex_token;
						this.trueFaceUrl.push(config.baseUrl + config.web_prefix + "/" + result.message + '?token=' + token)
						this.$u.toast('图片上传成功')
						console.log(this.model.faceUrl, this.trueFaceUrl)
				  } else {
						this.$u.toast(result.msg || '图片上传失败')
				  }
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
		deleteImage(index) {
		  this.trueFaceUrl.splice(index, 1);
		  if (this.trueFaceUrl.length === 0) {
		    this.faceUrl = '';
		  }
		},
	}
};
</script>

<style>
	page{
		background-color: #FFFFFF;
	}
</style>
<style scoped lang="scss">

.wrap {
	padding: 30rpx;
}

.scroll-wrapper{
	position: absolute;
	left: 0rpx;
	right: 0rpx;
	top: 0rpx;
	bottom: 120rpx;
}

.bottom-btn {
	position: fixed;
	bottom: 8rpx;
	width: 100%;
	padding: 30rpx;
	border-top: 1rpx solid #ccc;
	background-color: #FFFFFF;
}

.dateBtn{
	position: absolute;
	right: 0rpx;
	top:10rpx;
	color: #606266;
}

.slot-btn {
	width: 160rpx;
	height: 160rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	background: rgb(244, 245, 246);
	border-radius: 10rpx;
}

.slot-btn__hover {
	background-color: rgb(235, 236, 238);
}

.custom-gap{
	width: 1000rpx;
	height: 10rpx;
	margin: 0 -200rpx 0 -200rpx;
	background-color: rgb(235, 236, 238);
}

.upload-box {
  display: flex;
  flex-wrap: wrap;
  padding: 10rpx;
}

.preview-box {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  margin: 10rpx;
  border-radius: 8rpx;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-icon {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 4rpx;
  border-radius: 0 0 0 8rpx;
}

.upload-btn {
  width: 160rpx;
  height: 160rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f4f5f6;
  border-radius: 8rpx;
  margin: 10rpx;
}

.upload-text {
  font-size: 20rpx;
  color: #c0c4cc;
  margin-top: 6rpx;
}
</style>
.upload-box {
  padding: 20rpx;
}

.image-container {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  margin: 10rpx;
  border-radius: 8rpx;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-icon {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 4rpx;
  border-radius: 0 0 0 8rpx;
}

.hover-effect {
  opacity: 0.8;
}

.upload-btn {
  width: 160rpx;
  height: 160rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f4f5f6;
  border-radius: 8rpx;
  margin: 10rpx;
}

.upload-text {
  font-size: 24rpx;
  color: #c0c4cc;
  margin-top: 10rpx;
}
