<template>
	<view>
		<!-- <u-navbar :is-back="false" title="我的" :border-bottom="false"></u-navbar> -->
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-t-30 u-p-b-30">
			<view class="u-flex" @click="profile" v-if="vuex_user.user.userName">
				<view class="u-m-r-20">
					<u-avatar :src="avatar" size="140"></u-avatar>
				</view>
				<view class="u-flex-1" >
					<view class="u-font-18 u-p-b-20">{{vuex_user.user.userName}}</view>
					<view class="u-font-14 u-tips-color">昵称:{{vuex_user.user.nickName}}</view>
				</view>
				
			</view>
			<view class="buttom" v-else>
				<button @tap="wxLogin()" class="clearBtn">
					<view class="loginType">
						<view class="item">
							<view class="icon"><u-icon size="100" name="weixin-fill" color="rgb(83,194,64)"></u-icon></view>
							<view>微信登录</view>
						</view>
						
					</view>
				</button>
				<!-- <view class="hint">
					登录代表同意
					<text class="link">开源字节用户协议、隐私政策，</text>
					并授权使用您的账号信息（如昵称、头像、收获地址）以便您统一管理
				</view> -->
			</view>
		</view>
		
		<view class="center-nav">
			<u-row>
				<u-col span="3" text-align="center" v-for="(item,index) in navList" :key="index">
					<!-- <view v-if="item.name=='问题反馈'">
						<button type="default" open-type="feedback"  class="clearBtn" hover-class="none" style="background-color: #FFFFFF;">
							<u-icon :name="item.icon" color="#909399" size="50"></u-icon>
							<view class="tabName" style="padding-top: 15rpx;">{{item.name}}</view>
						</button>
					</view>
					<view @click="clickNav(item.url)" v-else> -->
					<view @click="clickNav(item.url)" >
						<u-icon :name="item.icon" color="#909399" size="50"></u-icon>
						<view >{{item.name}}</view>
					</view>
				</u-col>
			</u-row>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<!-- <u-cell-item icon="integral" title="实名认证" @click="setting"></u-cell-item> -->
				<u-cell-item icon="setting" title="个人中心" @click="setting"></u-cell-item>
			</u-cell-group>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<!-- <u-cell-item icon="level" :arrow="false" title="技术支持" value="18720989281"  @click="callPhoneNumber"></u-cell-item>
				-->
				<u-cell-item icon="question-circle" title="常见问题" @click="problem"></u-cell-item>
				<u-cell-item icon="star" title="关于我们" @click="aboutMe"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	import config from "@/common/config.js" // 全局配置文件
	export default {
		data() {
			return {
				//avatar:uni.getStorageSync('lifeData').vuex_user.user.avatar.includes(config.staticUrl)?uni.getStorageSync('lifeData').vuex_user.user.avatar:config.staticUrl+uni.getStorageSync('lifeData').vuex_user.user.avatar,
				show:true,
				navList:[
				   {name:"浏览记录",icon:"checkmark-circle",url:"pages/center/history"},
				   {name:"我的收藏",icon:"heart",url:"pages/center/heart"},
				   {name:"我的委托",icon:"order",url:"pages/center/order"},
				   {name:"问题反馈",icon:"info-circle"}
				],
			}
		},
		onLoad() {
			uni.$on('updateAvatar', (obj) => {
				// 获取数据
				this.updateAvatar();
			})
		},
		onUnload() {
			// 移除监听事件  
			uni.$off('updateAvatar');
		},
		onShow(){
			// 检查token
			this.checkToken();
		},
		methods: {
			logout() {
				// 登录成功修改token与用户信息
				this.$u.vuex('vuex_token', '');
				this.$u.vuex('vuex_user', {});
				this.$u.route('/pages/login/login')
			},
			profile(){
				this.$u.route('/pages/profile/profile')
			},
			setting(){
				this.$u.route('/pages/profile/setting')
			},
			//拨打固定电话
			callPhoneNumber() {
				uni.makePhoneCall({
					phoneNumber: "18720989281",
				});
			},
			problem(){
				this.$u.route({
					url: 'pages/login/problem'
				})
			},
			// 关于作者
			aboutMe() {
				this.$u.route('/pages/profile/aboutMe')
			},
			checkToken(){
				// 判断是否有token
				let lifeData = uni.getStorageSync('lifeData');
				let token = lifeData.vuex_token
				if(!token){
					console.log("no token")
					// 没有token 则跳转到登录
					// return uni.reLaunch({
					// 	url:'../login/login'
					// })
				}else{
					// 判断Token是否有效
					let url = "/api/profile/isExpiration";
					this.$u.get(url,{
						token:token
					}).then(obj => {
						if(obj.data){
							console.log(obj)
							// 没有token过期则跳转到登录
							// return uni.reLaunch({
							// 	url:'../login/login'
							// })
						}
					});
				}
			},
			code(){
				this.$mytip.toast('敬请期待')
			},
			clickNav(url){
				if(url){
					this.$u.route(url);
				}else{
					this.$mytip.toast('敬请期待')
				}
			},
			updateAvatar(){
				this.avatar = uni.getStorageSync('lifeData').vuex_user.user.avatar.includes(config.staticUrl)?uni.getStorageSync('lifeData').vuex_user.user.avatar:config.staticUrl+uni.getStorageSync('lifeData').vuex_user.user.avatar
			},
			async wxLogin(e){
				const {
					code
				} = await wx.login();			
			
				if (code) {
					uni.showLoading({title:"登录中....",mask:true})
					let url = "/api/miniWxApi/getOpenId?code="+ code;
					console.log(url)
					this.$u.get(url).then(res => {
						console.log(res)
						let openId = res.openId
						console.log(openId)
						let weChatUrl = "/api/wxLogin";
						this.$u.post(weChatUrl,{
							username: openId,
							code: code
						}).then(data => {
							console.log(data)
							uni.hideLoading();
							// 登录成功初始化token与用户信息
							this.$u.vuex('vuex_token', data.token);
							this.$u.vuex('vuex_user', data.loginUser);
							uni.switchTab({
								url: '/pages/index/index'
							})
						});
					});
				}else{
					this.$mytip.toast('登录失败')
				}
			
			},
		}
	}
</script>

<style lang="scss">
.user-box{
	background-color: #fff;
	justify-content: space-between;
}

.center-nav{
	background-color: #FFFFFF;
	margin-top: 30rpx;
	padding: 30rpx 0;
	border-radius: 8px;
	.tabName{
		color: #606266;
		font-size: 26rpx;
		padding-top: 10rpx;
	}
}

.qiandao{
	color: #606266;
	font-size: 24rpx;
	margin-right: 24rpx;
	margin-top: 54rpx;
	justify-content:center;
	align-items: center;
}

.clearBtn{
		margin:0;
		padding: 0;
		line-height: 1;
		background-color: #FFFFFF;
}

.clearBtn::after{
	position: unset !important;
	border: unset;
}
</style>