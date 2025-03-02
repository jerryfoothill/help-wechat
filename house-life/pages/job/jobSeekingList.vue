<template>
  <view class="container">
    <!-- <u-list @scrolltolower="loadMore">
      <u-list-item v-for="(item, index) in jobSeekings" :key="index" @click="goToDetail(item.id)">
        <view class="item">
          <view class="position">{{ item.expectedPosition }}</view>
          <view class="salary">{{ item.expectedSalary }}</view>
          <view class="details">
            {{ item.city }} | {{ item.experience }} | {{item.education}}
          </view>
          <view class="introduction">{{ item.introduction }}</view>
        </view>
      </u-list-item>
      <u-loadmore :status="loadStatus" />
    </u-list> -->

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
      emptyIcon: "/static/empty/data.png"
    };
  },
  onLoad() {
    this.fetchJobSeekings();
  },
  methods: {
    fetchJobSeekings() {
      if (this.loadStatus === 'loading' || this.loadStatus === 'nomore') return;

      this.loadStatus = 'loading';
      uni.request({
        url: '/api/jobApi/getJobSeekings', // Replace with your actual API endpoint
        method: 'GET',
        data: {
          page: this.page,
          pageSize: this.pageSize,
        },
        header: {
          'Authorization': 'Bearer ' + uni.getStorageSync('token'), // Include token
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data.code === 200) {
            const newList = res.data.data.map(item => ({
                id: item.id,
                expectedPosition: item.expectedPosition,
                expectedSalary: item.expectedSalary,
                city: item.city,
                experience: item.experience,
                education: item.education,
                introduction: item.introduction,
            }));

            this.jobSeekings = this.jobSeekings.concat(newList);
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
  },
};
</script>

<style scoped>
.container {
  padding: 20rpx;
}
.item {
  border-bottom: 1px solid #eee;
  padding: 20rpx 0;
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