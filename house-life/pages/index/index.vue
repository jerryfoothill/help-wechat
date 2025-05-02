<template>
	<view class="u-p-l-10 u-p-r-10">
		<u-navbar :is-back="false">
			<view style="display: flex;justify-content: center;align-items: center;">
				<view class="u-p-20"  @click="location">
					{{vuex_city==''?'选择':vuex_city}}
					<u-icon name="arrow-down-fill" class="u-p-l-10" color="#515356"></u-icon>
				</view>
				<!-- #ifdef MP-WEIXIN -->  
				<u-search placeholder="我要找房" v-model="keyword" input-align="center"  :show-action="false" :clearabled="true"
:disabled="true" style="width: 380rpx;" @click="search"></u-search>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN --> 
				<u-search placeholder="我要找房" v-model="keyword" input-align="center"  :show-action="false" :clearabled="true"
				:disabled="true" style="width: 580rpx;" @click="search"></u-search>
				<!-- #endif -->
			</view>
		</u-navbar>
		<view>
			<!-- 流量主-腾讯banner广告 -->
			<!-- <ad unit-id="adunit-fcfdcc4d7095b6b1" ad-intervals="30"></ad> -->
			<!-- 轮播图 -->
			<!-- #ifndef MP-WEIXIN --> 
				<!-- <u-swiper :list="swiperList" height="350"></u-swiper> -->
			<!-- #endif -->
			<u-swiper :list="swiperList" height="350" ></u-swiper>
			<!-- <u-swiper :list="swiperList" height="350" @click="moreInfo"></u-swiper> -->
		</view>
		<view>
			<view class="rowClass">
				<u-row>
					<u-col span="3" text-align="center" v-for="(item,index) in navList" :key="index">
						<view class="u-padding-20" @tap="clickNav(item)" hover-class="hoverClass">
							<image :src="item.src" style="width: 90rpx;height: 90rpx;" mode="widthFix"></image>
							<view class="tabName">{{item.name}}</view>
						</view>
					</u-col>
				</u-row>
			</view>
			<u-gap height="10"></u-gap>
			<view @click="notice">
				<u-notice-bar mode="vertical" :list="noticeList" type="primary" more-icon
				bg-color="#fff" :duration="5000" border-radius="15"></u-notice-bar>
			</view>
			<u-gap height="5"></u-gap>
			<scroll-view scroll-x class="type-list" show-scrollbar="false">
				<view class="type-list-content">
					<view v-for="(item, index) in typeList" :key="index" 
						class="type-item" 
						:class="{ active: current === item.value }" 
						@click="switchType(item.value)">
						{{ item.label }}
					</view>
				</view>
			</scroll-view>
			<view class="single-column">
			    <view class="demo-warter" v-for="(item, index) in flowList" :key="index">
					
			       <u-lazy-load v-if="item.image && item.image.length > 0" threshold="750" border-radius="12" :image="item.image" :index="index" @click="clickImage(item.id)"></u-lazy-load>
			       <u-lazy-load v-else threshold="750" border-radius="12" :image="swiperList[1].image" :index="index" @click="clickImage(item.id)"></u-lazy-load>
					<!-- <u-lazy-load threshold="750" border-radius="12" :image="item.image" :index="index" @click="clickImage(item.id)"></u-lazy-load> -->
					<view class="item-title" v-if="current === 'house'">{{item.villageName}} {{item.type == '整租' ? item.houseNum + item.houseHall + item.toiletNum : item.roomType}}</view>
			        <view class="item-title" v-else>{{item.title}}</view>
					<view class="item-price" v-if="current === 'house'">¥{{item.price}}</view>
					<view class="item-type" v-else>{{item.type}}</view>
			         <view class="item-desc" v-if="current === 'house' && item.type == '整租' && item.houseArea">{{item.houseArea}} 平方</view>
			         <view class="item-desc" v-else-if="current === 'house' && item.roomArea">{{item.roomArea}} 平方</view>
			         <view class="item-desc" v-if="current === 'house' && item.decoration">{{item.decoration}}</view>
			         <view class="item-desc" v-else-if="current != 'house' && item.location">{{item.location}}</view>
			         <view class="item-desc" v-else-if="current != 'house' && item.infoDate">{{item.infoDate}}</view>
			         <view class="item-content" v-if="current == 'house' && item.introduce">{{item.introduce}}</view>
					 <view class="item-content" v-else-if="item.content">{{item.content}}</view>
					 <!-- <view class="item-title" >电话: {{item.agentPhone}}</view> -->
			    </view>
			</view>
		</view>
		<u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="findHouseList" style="height: 80rpx;line-height: 80rpx;"></u-loadmore>
		<u-back-top :scroll-top="scrollTop" top="1000"></u-back-top>
		<u-no-network></u-no-network>
		<view class="buttom">
			<view class="loginType">
				<view class="wechat item">
					<view class="icon"><u-icon size="60" name="server-man" color="#999" @click="server"></u-icon></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import config from "@/common/config.js" // 全局配置文件
	export default {
		data() {
			return {
				keyword: '',
				pageNum: 1,
				pageSize: 10,
				scrollTop: 0,
				houseList: [],
				current: 'house',
				typeList: [
					{ value: 'house', label: '租房' },
					{ value: 'info1', label: '店面厂房' },
					{ value: 'info2', label: '出售信息' },
					{ value: 'info3', label: '招工信息' },
					{ value: 'info4', label: '其他信息' }
				],
				infoType: '',
				infoList: [],
				swiperList: [
					{
						image: 'https://www.51mzp.com/jeecgboot/swiper2.png'+ '?token=' +uni.getStorageSync('lifeData').vuex_token,
					    title: '身无彩凤双飞翼，心有灵犀一点通'
					},
					{
						image: 'https://www.51mzp.com/jeecgboot/swiper.png'+ '?token=' +uni.getStorageSync('lifeData').vuex_token,
					    title: '身无彩凤双飞翼，心有灵犀一点通'
					},
                ],
				noticeList: [],
				navList:[
				   {name:"整租",src:"/static/img/index/cover_2022/index_cover1.png",type:"0"},
				   {name:"合租",src:"/static/img/index/cover_2022/index_cover2.png",type:"1"},
				   {name:"租房指南",src:"/static/img/index/cover_2022/index_cover3.png",url:"/pages/center/tips"},
				   {name:"我要出租",src:"/static/img/index/cover_2022/index_cover4.png",type:"2"},
				   // {name:"找工作",src:"/static/img/index/cover_2022/seek.png",type:"3"},
				   // {name:"求职信息",src:"/static/img/index/cover_2022/jobs.png",url:"/pages/job/jobSeekingList"},
				   // {name:"招聘员工",src:"/static/img/index/cover_2022/recruit.png",type:"5"},
				   // {name:"招聘信息",src:"/static/img/index/cover_2022/rlist.png",url:"pages/job/recruitList"},
				   {name:"发布信息",src:"/static/img/index/cover_2022/info.png",type:"6"},
				   {name:"信息列表",src:"/static/img/index/cover_2022/rlist.png",url:"pages/info/infoList"},
				],
				loadStatus: 'loadmore',
				flowList: [],
				uvCode: uni.getStorageSync('uvCode')
			}
		},
		onLoad() {
			// 检查是否已选择城市，如果未选择，跳转到选择城市页面
			this.checkCity();
			// 获取数据
			this.findHouseList();
			this.getNoticecList();
			// 获取信息类型
			this.getInfoTypes();
			// 流量统计
			// this.appSysFlowInfo();
			uni.$on('findIndexHouseList', (obj) => {
				// 获取数据
				this.findHouseList(1);
			})
		},
		onUnload() {
			// 移除监听事件  
			uni.$off('findIndexHouseList');
		},
		onPageScroll(e) {
		    this.scrollTop = e.scrollTop;
		},
		onReachBottom() {
		    this.loadStatus = 'loading';
		    // 获取数据
			if (this.current === 'house') {
				this.findHouseList();
			} else {
				this.findInfoList();
			}
		},
		// 下拉刷新
		onPullDownRefresh() {
			// 获取数据
			if (this.current === 'house') {
				this.findHouseList(1);
			} else {
				this.findInfoList(1);
			}
			// 关闭刷新
			uni.stopPullDownRefresh();
		},
		methods: {
			checkCity(){
				// 检查是否已选择城市，如果未选择，跳转到选择城市页面
				let lifeData = uni.getStorageSync('lifeData');
				let vuex_city = lifeData.vuex_city
				// console.log(vuex_city.length);
				if(!vuex_city || vuex_city.length == 0){
					// 没有token 则跳转到登录
					return this.$u.route('/pages/location/location');
				}
			},
			location(){
				  this.$u.route({
					url: 'pages/location/location',
				  })
			},
			search(){
				this.$u.route({
					url: 'pages/search/search',
				})
			},
			notice(){
				this.$u.route({
					url: 'pages/notice/notice'
				})
			},
			switchType(type) {
				this.current = type;
				this.pageNum = 1;
				this.flowList = [];
				if (type === 'house') {
					this.findHouseList();
				} else {
					if (type == 'info1'){
						this.infoType = '8';
					}else if (type == 'info2'){
						this.infoType = '7';
					}else if (type == 'info3'){
						this.infoType = '4';
					}else{
						this.infoType = '';
					}
					this.findInfoList();
				}
			},
			findHouseList(type = 0) {
				if(type == 111){
					this.pageNum = 1
					this.flowList = []
					this.$refs.uWaterfall.clear();
				}
				let url = this.$u.http.config.static_urls.findHouseRoomList
				this.$u.get(url, {
					state:1,
					// villageCity:uni.getStorageSync('lifeData').vuex_city,
					pageNo: this.pageNum,
					pageSize: this.pageSize,
					orderByColumn: 'update_time,create_time',
					isAsc: 'desc'
				}).then(result => {
					//console.log(result)
					let data = "";
					if (this.$u.http.config.static_urls.server === 'source-vue') {
						data = result.rows;
					}
					if (this.$u.http.config.static_urls.server === 'jeecgboot') {
						data = result.result.records
					}
					this.houseList = data;
					for (let i = 0; i < this.houseList.length; i++) {
					    // 先转成字符串再转成对象，避免数组对象引用导致数据混乱
					    let item = this.houseList[i]
						// console.log(item)
						if(item.price == 0){
							item.price = '面议'
						}
						//console.log(item.roomArea, item.houseArea)
						if(!item.roomArea || item.roomArea == 0) {
							item.roomArea = ''
						}
						if(!item.houseArea || item.houseArea == 0) {
							item.houseArea = ''
						}
						if(item.faceUrl && !item.faceUrl.includes(config.staticUrl)){
							if (this.$u.http.config.static_urls.server === 'source-vue') {
								item.image = config.staticUrl+config.web_prefix+item.faceUrl
							}
							if (this.$u.http.config.static_urls.server === 'jeecgboot') {
								var arr = item.faceUrl.split(",");
								const token = uni.getStorageSync('lifeData').vuex_token;
								item.image = config.staticUrl+config.web_prefix+"/" + arr[0] + '?token=' + token
							}
						}else{
							item.image = item.faceUrl
						}
						if(item.type == 0){
							item.type = '整租'
						}else if(item.type == 1){
							item.type = '合租'
						}
						if(item.roomType == 1){
							item.roomType = '主卧'
						}else if(item.roomType == 2){
							item.roomType = '次卧'
						}else{
							item.roomType = '未知'
						}
						if(this.$u.test.isEmpty(item.houseNum)){
							item.houseNum = ''
						}
						if(this.$u.test.isEmpty(item.houseHall)){
							item.houseHall = ''
						}
						if(this.$u.test.isEmpty(item.toiletNum)){
							item.toiletNum = ''
						}
					    this.flowList.push(item);
					}
					++ this.pageNum 
					this.loadStatus = 'loadmore';
					if(this.houseList.length < this.pageSize){
						return this.loadStatus = 'nomore';
					}
				});
			},
			clickSearch() {
			    this.$u.route('/pages/search/search');
			},
			clickImage(id) {
				if (this.current === 'house') {
					this.$u.route({
						url: '/pages/detail/detail',
						params: {
							houseId: id
						}
					})
				} else {
					this.$u.route({
						url: '/pages/info/infoDetail',
						params: {
							id: id
						}
					})
				}
			},
			clickNav(item){
				//console.log("come to here", item.type)
				if(item.url){
					return this.$u.route(item.url);
				}
				if(item.type === "2" || item.type === "3" || item.type === "5" || item.type === "6"){
					// 判断是否有token
					let lifeData = uni.getStorageSync('lifeData');
					let token = lifeData.vuex_token
					if(!token){
						// 没有token 则跳转到登录
						return uni.reLaunch({
							url:'../login/login'
						})
					}else{
						// 判断Token是否有效
						if (this.$u.http.config.static_urls.server === 'source-vue') {
							let url = "/api/profile/isExpiration";
							return this.$u.get(url,{
								token:token
							}).then(obj => {
								if(obj.data){
									// 没有token过期则跳转到登录
									return uni.reLaunch({
										url:'../login/login'
									})
								}else{
									console.log(item.type)
									if (item.type === "2") {
										return this.$u.route('/pages/detail/preHouse');
									} else if (item.type === "3") {
										return this.$u.route('/pages/job/addJobSeeking')
									} else if (item.type === "5") {
										return this.$u.route('/pages/job/addRecruit')
									} else if (item.type === "6") {
										return this.$u.route('/pages/info/addInfo')
									}
										
								}
							});
						}
						if (this.$u.http.config.static_urls.server === 'jeecgboot') {
							if (item.type === "2") {
								return this.$u.route('/pages/detail/preHouse');
							} else if (item.type === "3") {
								return this.$u.route('/pages/job/addJobSeeking')
							} else if (item.type === "5") {
								return this.$u.route('/pages/job/addRecruit')
							} else if (item.type === "6") {
								return this.$u.route('/pages/info/addInfo')
							}
						}
					}
				}else if(item.type){
					// return this.$u.route('/pages/search/searchList');
					return this.$u.route({
						url: '/pages/search/searchList',
						params: {
							type: item.type
						}
					})
				}
			},
			code(){
				this.$mytip.toast('我要咨询')
			},
			appSysFlowInfo(){
				// 流量统计
				let uvCode = uni.getStorageSync("uvCode");
				let url = "https://sourcebyte.cn/api/flow/upFlow?type=MINI&uvCode=" + uvCode;
				uni.request({
				  url: url,
				  method: "POST",
				  success: (res) => {
					uni.setStorageSync("uvCode", res.data.data);
				  },
				});
			},
			server(){
				// window.open ('https://sourcebyte.cn')
				uni.makePhoneCall({
				  phoneNumber: "17721192050",
				});
			},
			getInfoTypes() {
			uni.request({
				url: this.$u.http.config.baseUrl + this.$u.http.config.static_urls.infoType_list,
				method: 'GET',
				success: (res) => {
					if (res.statusCode === 200 && res.data.code === 200) {
						if (this.$u.http.config.static_urls.server === 'source-vue') {
							this.infoTypeMap = {}
							res.data.data.forEach(item => {
								this.infoTypeMap[item.value] = item.label
							})
						}
						if (this.$u.http.config.static_urls.server === 'jeecgboot') {
							this.infoTypeMap = {}
							res.data.result.records.forEach((item) => {
								this.infoTypeMap[item.value] = item.name
							})
						}
					}
				}
			})
		},
			findInfoList(type = 0) {
				if(type == 1){
					this.pageNum = 1
					this.flowList = []
					this.$refs.uWaterfall.clear();
				}
				uni.request({
					url: this.$u.http.config.baseUrl + this.$u.http.config.static_urls.info_list,
					method: 'GET',
					data: {
						pageNo: this.pageNum,
						pageSize: this.pageSize,
						infoType: this.infoType
					},
					success: (res) => {
						if (res.statusCode === 200 && res.data.code === 200) {
							let newList = {}
							if (this.$u.http.config.static_urls.server === 'source-vue') {
								newList = res.data.rows.map(item => ({
									...item,
									image: item.infoImage ? config.baseUrl + config.web_prefix + item.infoImage : '',
									villageName: item.title,
									type: this.infoTypeMap[item.infoType] || '未知类型'
								}))
							}
							if (this.$u.http.config.static_urls.server === 'jeecgboot') {
								const token = uni.getStorageSync('lifeData').vuex_token;
								newList = res.data.result.records.map(item => ({
									...item,
									image: item.infoImage ? config.baseUrl + config.web_prefix + "/" + item.infoImage + '?token=' + token : '',
									villageName: item.title,
									type: this.infoTypeMap[item.infoType] || '未知类型'
								}))
							}
							newList.forEach((item, index) => {
								if (index % 2 === 0) {
									this.flowList.push(item)
								} else {
									this.flowList.push(item)
								}
							})
							++ this.pageNum
							this.loadStatus = 'loadmore';
							if(newList.length < this.pageSize){
								return this.loadStatus = 'nomore';
							}
						}
					}
				})
			},
			getNoticecList(){
				// TODO:
				// let url = "/api/notice/findNoticeList";
				// this.$u.get(url,{
				// 	pageNum:1,
				// 	pageSize:50,
				// 	orderByColumn:'create_time',
				// 	isAsc:'desc'
				// }).then(obj => {
				// 	let data = obj.rows
				// 	data.filter(item=>{
				// 		this.noticeList.push(item.noticeTitle)
				// 	})
				// });
			},
			moreInfo(){
				uni.navigateToMiniProgram({
					appId:'wxbca64173e772915e',// 此为开源字节appid
					path:'/pages/index/index',// 此为开源字节首页路径
					envVersion:"release",
					success: res => {
						 // 打开成功
						 console.log("打开成功", res);
					},
					fail: err => {
						 console.log(err);
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.nomore {
		background-color: $u-bg-color;
	}
	
	.search{
		width: 54px;
		height: 44px;
		
		&:active{
			background-color: $u-bg-color;
		}
	}

	.type-list {
		width: 100%;
		white-space: nowrap;
		margin-bottom: 20rpx;
	}
	
	.type-list-content {
		display: inline-flex;
		padding: 20rpx;
	}
	
	.type-item {
		display: inline-block;
		padding: 10rpx 30rpx;
		margin-right: 20rpx;
		background-color: #f5f5f5;
		border-radius: 30rpx;
		font-size: 28rpx;
		color: #666;
	}
	
	.type-item.active {
		background-color: #2979ff;
		color: #ffffff;
	}
	
	.rowClass{
		border-radius: 8px;
		background-color: rgb(255, 255, 255);
		margin-top: 10rpx;
	}
	
	.hoverClass{
		background-color: #E4E7ED;
	}
	
	.tabName{
		font-size: 28rpx;
		color: $u-main-color;
	}
	
	.single-column {
	    padding: 0 20rpx;
	}

	.demo-warter {
	    border-radius: 8px;
	    margin-bottom: 20rpx;
	    background-color: #ffffff;
	    padding: 20rpx;
	    position: relative;
	    width: 100%;
	}
	
	.u-close {
	    position: absolute;
	    top: 20rpx;
	    right: 20rpx;
	}
	
	.item-cover {
	    font-size: 55rpx;
	    color: $u-type-warning;
	}
	
	.item-title {
	    font-size: 28rpx;
	    color: $u-main-color;
	    font-weight: bold;
		padding-top: 5rpx;
		padding-left: 10rpx;
	}
	
	.item-price {
	    font-weight: normal;
	    font-size: 32rpx;
	    color: $u-type-warning;
	}
	
	.item-desc {
	    font-weight: normal;
	    font-size: 26rpx;
	    color: $u-tips-color;
		padding-bottom: 5rpx;
		padding-left: 10rpx;
	}

	.item-type {
		display: inline-block;
		color: #2979ff;
		background-color: rgba(41, 121, 255, 0.1);
		padding: 4rpx 12rpx;
		border-radius: 6rpx;
		font-size: 24rpx;
		margin-top: 8rpx;
	}

	.item-content {
		margin-top: 12rpx;
		color: #666;
		font-size: 28rpx;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.item-tag {
	    font-size: 24rpx;
	    color: $u-tips-color;
	    margin-top: 3px;
	}
	
	.buttom {
		.loginType {
			font-size: 14px;
			position: fixed;
			right: 30rpx;
			bottom: 300rpx;
			width: 60px;
			height: 60px;
			padding: 4px;
			cursor: pointer;
			background: #FFF;
			text-align: center;
			line-height: 60px;
			border-radius: 100%;
			-webkit-box-shadow: 0px 1px 20px 0px rgba(0,0,0,0.1),inset 0px -1px 0px 0px rgba(0,0,0,0.1);
			box-shadow: 0px 1px 20px 0px rgba(0,0,0,0.1),inset 0px -1px 0px 0px rgba(0,0,0,0.1);
		}
	}
</style>
