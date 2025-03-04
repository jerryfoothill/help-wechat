<template>
  <view class="container">
    <u-waterfall v-model="recruitList" ref="uWaterfall">
      <template v-slot:left="{leftList}">
        <view v-for="(item, index) in leftList" :key="index" class="item" @click="goToDetail(item.id)">
          <image v-if="item.jobImage" :src="item.jobImage" mode="widthFix" class="job-image"></image>
          <view class="position">{{ item.expectedPosition }}</view>
          <view class="salary">{{ item.expectedSalary }}</view>
          <view class="details">
            {{ item.expectedCity }} | {{ item.experience }} | {{item.education}}
          </view>
          <view class="introduction">{{ item.introduction }}</view>
        </view>
      </template>
      <template v-slot:right="{rightList}">
        <view v-for="(item, index) in rightList" :key="index" class="item" @click="goToDetail(item.id)">
          <image v-if="item.jobImage" :src="item.jobImage" mode="widthFix" class="job-image"></image>
          <view class="position">{{ item.expectedPosition }}</view>
          <view class="salary">{{ item.expectedSalary }}</view>
          <view class="details">
            {{ item.expectedCity }} | {{ item.experience }} | {{item.education}}
          </view>
          <view class="introduction">{{ item.introduction }}</view>
        </view>
      </template>
    </u-waterfall>
    
    <u-loadmore :status="loadStatus" @loadmore="loadMore" />

    <u-empty
      v-if="recruitList.length === 0 && loadStatus === 'nomore'"
      mode="search"
      :icon="emptyIcon"
    >
    </u-empty>
    
    <view class="add-btn">
      <u-button type="primary" @click="goToAdd">发布招聘</u-button>
    </view>
  </view>
</template>

<script>
import config from "@/common/config.js" // 全局配置文件	
export default {
  data() {
    return {
      recruitList: [],
      page: 1,
      pageSize: 10,
      loadStatus: 'loadmore', // loadmore, loading, nomore
      emptyIcon: "/static/empty/default.png"
    };
  },
  onLoad() {
    this.fetchRecruitList();
  },
  onReachBottom() {
    // 页面触底时触发加载更多
    if (this.loadStatus === 'loadmore') {
      this.loadMore();
    }
  },
  methods: {
    fetchRecruitList() {
      if (this.loadStatus === 'loading' || this.loadStatus === 'nomore') return;

      this.loadStatus = 'loading';
      uni.request({
        url: this.$u.http.config.baseUrl + '/api/jobApi/findJobRecruitmentList', // 使用新的招工信息API
        method: 'GET',
        data: {
          page: this.page,
          pageSize: this.pageSize,
        },
        header: {
          'Authorization': 'Bearer ' + uni.getStorageSync('token'), // 包含token
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.code === 200) { // 修改为正确的成功码
            const newList = res.data.rows.map(item => ({ // 修改为正确的数据字段
              id: item.id,
              expectedPosition: item.positionTitle,
              expectedSalary: item.salaryRange,
              expectedCity: item.workLocation,
              experience: item.experienceReq,
              education: item.educationReq,
              introduction: item.jobDescription,
              //jobImage: 'https://6b80e893.r19.cpolar.top' + item.jobImage,
			  jobImage: this.$u.http.config.baseUrl + this.$u.http.config.web_prefix + item.jobImage,
              jobFile: item.jobFile,
              jobFileName: item.jobFileName
            }));

            // 将新数据添加到瀑布流中
            this.recruitList = [...this.recruitList, ...newList];
            
            if (newList.length < this.pageSize) {
              this.loadStatus = 'nomore';
            } else {
              this.loadStatus = 'loadmore';
              this.page++;
            }
          } else {
            this.$u.toast(res.data.msg || '获取数据失败');
            this.loadStatus = 'loadmore';
          }
        },
        fail: (err) => {
          console.error(err);
          this.$u.toast('网络错误，请稍后重试');
          this.loadStatus = 'loadmore';
        }
      });
    },
    loadMore() {
      this.fetchRecruitList();
    },
    goToDetail(id) {
      uni.navigateTo({
        url: `/pages/job/recruitDetail?id=${id}`,
      });
    },
    goToAdd() {
      uni.navigateTo({
        url: '/pages/job/addRecruit',
      });
    },
    // 清除数据并重新加载
    refresh() {
      this.recruitList = [];
      this.page = 1;
      this.loadStatus = 'loadmore';
      this.fetchRecruitList();
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.refresh();
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1000);
  }
};
</script>

<style scoped>
.container {
  padding: 20rpx;
  padding-bottom: 120rpx;
}
.item {
  background-color: #ffffff;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}
.job-image {
  width: 100%;
  border-radius: 8rpx;
  margin-bottom: 10rpx;
}
.position {
  font-size: 32rpx;
  font-weight: bold;
}
.salary {
  color: #e67e22;
  margin-top: 10rpx;
}
.details {
  color: #999;
  margin-top: 10rpx;
}
.introduction {
  margin-top: 10rpx;
  color: #666;
  /* 文本溢出显示省略号 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 显示两行 */
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