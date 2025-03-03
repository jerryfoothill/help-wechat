<template>
  <view class="container">
    <u-waterfall v-model="jobSeekings" ref="uWaterfall">
      <template v-slot:left="{leftList}">
        <view v-for="(item, index) in leftList" :key="index" class="item" @click="goToDetail(item.id)">
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
      v-if="jobSeekings.length === 0 && loadStatus === 'nomore'"
      mode="search"
      :icon="emptyIcon"
    >
    </u-empty>
  </view>
</template>

<script>
	
export default {
  data() {
    return {
      jobSeekings: [],
      page: 1,
      pageSize: 10,
      loadStatus: 'loadmore', // loadmore, loading, nomore
      emptyIcon: "/static/empty/default.png"
    };
  },
  onLoad() {
    this.fetchJobSeekings();
  },
  onReachBottom() {
    // 页面触底时触发加载更多
    if (this.loadStatus === 'loadmore') {
      this.loadMore();
    }
  },
  methods: {
    fetchJobSeekings() {
      if (this.loadStatus === 'loading' || this.loadStatus === 'nomore') return;

      this.loadStatus = 'loading';
      uni.request({
        url: this.$u.http.config.baseUrl + '/api/jobApi/findJobSeekingList', // 使用完整URL
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
              expectedPosition: item.expectedPosition,
              expectedSalary: item.expectedSalary,
              expectedCity: item.expectedCity,
              experience: item.experience,
              education: item.education,
              introduction: item.introduction,
            }));

            // 将新数据添加到瀑布流中
            this.jobSeekings = [...this.jobSeekings, ...newList];
            
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
      this.fetchJobSeekings();
    },
    goToDetail(id) {
      uni.navigateTo({
        url: `/pages/job/jobSeekingDetail?id=${id}`,
      });
    },
    // 清除数据并重新加载
    refresh() {
      this.jobSeekings = [];
      this.page = 1;
      this.loadStatus = 'loadmore';
      this.fetchJobSeekings();
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
}
.item {
  background-color: #ffffff;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
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
</style> 