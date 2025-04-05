<template>
  <view class="container">
    <u-form >
      <u-form-item label="信息类型" prop="infoType" 
      label-width="180" :label-position="labelPosition" left-icon="list" :leftIconStyle="{color:'#d5d5d5'}">
      <u-input
        v-model="typeLabel"
        type="select"
        :border="border"
        placeholder="请选择信息类型"
        @click="typeShow = true"
      />
    </u-form-item>
    
    <u-select v-model="typeShow" :list="typeList" @confirm="typeConfirm"></u-select>
	</u-form>
    
    <view class="waterfall-container">
      <view class="waterfall-column">
        <view v-for="(item, index) in leftList" :key="index" class="item" @click="goToDetail(item.id)">
          <image v-if="item.infoImage" :src="item.trueInfoImage" mode="widthFix" class="info-image"></image>
          <view class="title">{{ item.title }}</view>
          <view class="type">{{ getTypeLabel(item.infoType) }}</view>
          <view class="details">
            {{ item.location }} | {{ item.infoDate }}
          </view>
          <view class="content">{{ item.content }}</view>
        </view>
      </view>
      <view class="waterfall-column">
        <view v-for="(item, index) in rightList" :key="index" class="item" @click="goToDetail(item.id)">
          <image v-if="item.infoImage" :src="item.trueInfoImage" mode="widthFix" class="info-image"></image>
          <view class="title">{{ item.title }}</view>
          <view class="type">{{ getTypeLabel(item.infoType) }}</view>
          <view class="details">
            {{ item.location }} | {{ item.infoDate }}
          </view>
          <view class="content">{{ item.content }}</view>
        </view>
      </view>
    </view>
    
    <u-loadmore :status="loadStatus" @loadmore="loadMore" />

    <u-empty
      v-if="leftList.length === 0 && rightList.length === 0 && loadStatus === 'nomore'"
      mode="list"
      :icon="emptyIcon"
    >
    </u-empty>
    
    <view class="add-btn">
      <u-button type="primary" @click="goToAdd">发布信息</u-button>
    </view>
  </view>
</template>

<script>
import config from "@/common/config.js"
export default {
  data() {
    return {
      typeShow: false,
      border: false,
      typeLabel: '全部',
      current: 0,
      typeList: [
        { value: '0', label: '全部' }
      ],
      infoList: [],
      leftList: [],
      rightList: [],
      page: 1,
      pageSize: 10,
      loadStatus: 'loadmore',
      emptyIcon: "/static/empty/default.png",
      typeMap: {}
    }
  },
  onLoad() {
    this.getInfoTypes()
  },
  onReachBottom() {
    if (this.loadStatus === 'loadmore') {
      this.loadMore()
    }
  },
  methods: {
    getTypeLabel(type) {
      return this.typeMap[type] || '未知类型'
    },
    typeConfirm(e) {
      this.current = parseInt(e[0].value)
      this.typeLabel = e[0].label
      this.leftList = []
      this.rightList = []
      this.page = 1
      this.loadStatus = 'loadmore'
      this.fetchInfoList()
    },
    getInfoTypes() {
		let lifeData = uni.getStorageSync('lifeData');
		let loginUser = lifeData.vuex_user
		//console.log(lifeData, loginUser, loginUser.user)
      uni.request({
        url: this.$u.http.config.baseUrl + this.$u.http.config.static_urls.infoType_list,
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + uni.getStorageSync('token'),
		  'X-Access-Token': lifeData.vuex_token,
		  'X-Tenant-Id': loginUser.user ? loginUser.user.tenantId : ""
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.code === 200) {
			  this.typeMap = {}
			  
			  if (this.$u.http.config.static_urls.server === 'source-vue') {
			    this.typeList = [
				  { value: '0', label: '全部' },
				  ...res.data.data
				]            
				
				res.data.data.forEach(item => {
				  this.typeMap[item.value] = item.label
				})
			  }
            
			if (this.$u.http.config.static_urls.server === 'jeecgboot') {
				this.typeList = res.data.result.records
				this.typeList.forEach((item) => {
					item.label = item.name
					this.typeMap[item.value] = item.label
				})
				this.typeList = [
				  { value: '0', label: '全部' },
				  ...this.typeList
				]
			}
            
            this.fetchInfoList()
          }
        }
      })
    },
    fetchInfoList() {
      if (this.loadStatus === 'loading' || this.loadStatus === 'nomore') return

      this.loadStatus = 'loading'
	  let lifeData = uni.getStorageSync('lifeData');
	  let loginUser = lifeData.vuex_user
	  //console.log(lifeData, loginUser, loginUser.user)
	  // let header_token = {
	  // 	  'X-Access-Token': lifeData.vuex_token,
	  // 	  'X-Tenant-Id': loginUser.user ? loginUser.user.tenantId : ""
	  // }
      uni.request({
        url: this.$u.http.config.baseUrl + this.$u.http.config.static_urls.info_list,
        method: 'GET',
        data: {
          page: this.page,
          pageSize: this.pageSize,
          infoType: this.current === 0 ? '' : this.current.toString()
        },
        header: {
          'Authorization': 'Bearer ' + uni.getStorageSync('token'),
		  'X-Access-Token': lifeData.vuex_token,
		  'X-Tenant-Id': loginUser.user ? loginUser.user.tenantId : ""
        },
        success: (res) => {
			//console.log(res)
          if (res.statusCode === 200 && res.data.code === 200) {
			  let newList = {}
			  if (this.$u.http.config.static_urls.server === 'source-vue') {
					newList = res.data.rows.map(item => ({
					  ...item,
					  trueInfoImage: item.infoImage ? config.baseUrl + config.web_prefix + item.infoImage : ''
					}))
			  }
			  
			  if (this.$u.http.config.static_urls.server === 'jeecgboot') {
				  const token = uni.getStorageSync('lifeData').vuex_token;
				  newList = res.data.result.records.map(item => ({
				    ...item,
				    trueInfoImage: item.infoImage ? config.baseUrl + config.web_prefix + "/" + item.infoImage + '?token=' + token : ''
				  }))
			  }

            // 将新数据分配到左右两列
            newList.forEach((item, index) => {
              if (index % 2 === 0) {
                this.leftList.push(item)
              } else {
                this.rightList.push(item)
              }
            })
            
            if (newList.length < this.pageSize) {
              this.loadStatus = 'nomore'
            } else {
              this.loadStatus = 'loadmore'
              this.page++
            }
          } else {
            this.$u.toast(res.data.msg || '获取数据失败')
            this.loadStatus = 'loadmore'
          }
        },
        fail: (err) => {
          console.error(err)
          this.$u.toast('网络错误，请稍后重试')
          this.loadStatus = 'loadmore'
        }
      })
    },
    loadMore() {
      this.fetchInfoList()
    },
    goToDetail(id) {
      uni.navigateTo({
        url: `/pages/info/infoDetail?id=${id}`,
      })
    },
    goToAdd() {
      uni.navigateTo({
        url: '/pages/info/addInfo',
      })
    },
    refresh() {
      this.leftList = []
      this.rightList = []
      this.page = 1
      this.loadStatus = 'loadmore'
      this.fetchInfoList()
    }
  },
  onPullDownRefresh() {
    this.refresh()
    setTimeout(() => {
      uni.stopPullDownRefresh()
    }, 1000)
  }
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  padding-bottom: 120rpx;
}
.select-container {
  margin-bottom: 20rpx;
  background-color: #ffffff;
  border-radius: 8rpx;
  padding: 10rpx 20rpx;
}
.waterfall-container {
  display: flex;
  justify-content: space-between;
}
.waterfall-column {
  width: 48%;
}
.item {
  background-color: #ffffff;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}
.info-image {
  width: 100%;
  border-radius: 8rpx;
  margin-bottom: 10rpx;
}
.title {
  font-size: 32rpx;
  font-weight: bold;
}
.type {
  display: inline-block;
  color: #ffffff;
  background-color: #2979ff;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
  font-size: 24rpx;
  margin-top: 10rpx;
}
.details {
  color: #999;
  margin-top: 10rpx;
  font-size: 26rpx;
}
.content {
  margin-top: 10rpx;
  color: #666;
  font-size: 28rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}
.add-btn {
  position: fixed;
  bottom: 30rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  padding: 0 30rpx;
}
</style> 
 