<template>
  <view class="privacy-container">
    <view class="privacy-header">
      <text class="privacy-title">51找找找隐私政策</text>
      <text class="privacy-date">生效日期：2025年4月20日</text>
    </view>
    <view class="privacy-content">
      <text class="section-title">一、信息收集</text>
      <text class="section-content">
        我们收集的信息包括但不限于：
        1. 账户信息：手机号码、微信账号信息
        2. 个人资料：昵称、头像
        3. 设备信息：设备型号、操作系统版本、设备标识符
        4. 位置信息：经您授权的地理位置信息
        5. 使用记录：浏览历史、搜索记录、发布记录
      </text>

      <text class="section-title">二、信息使用</text>
      <text class="section-content">
        我们使用收集的信息用于：
        1. 提供、维护和改进我们的服务
        2. 实现房源和招聘信息的精准推送
        3. 处理您的反馈和请求
        4. 预防和处理欺诈等违法行为
        5. 根据法律法规要求进行信息披露
      </text>

      <text class="section-title">三、信息共享</text>
      <text class="section-content">
        除以下情况外，我们不会与第三方共享您的个人信息：
        1. 获得您的明确同意
        2. 为完成合并、分立、收购或资产转让而转移
        3. 法律法规规定的其他情形
      </text>

      <text class="section-title">四、信息存储</text>
      <text class="section-content">
        1. 信息存储在中国境内的服务器上
        2. 采用业界标准的加密技术保护数据安全
        3. 定期进行安全评估和系统升级
      </text>

      <text class="section-title">五、信息安全</text>
      <text class="section-content">
        我们采取以下措施保护您的信息：
        1. 数据加密传输和存储
        2. 严格的访问权限控制
        3. 定期安全审计
        4. 应急响应机制
      </text>

      <text class="section-title">六、未成年人保护</text>
      <text class="section-content">
        1. 我们不会主动收集未成年人的个人信息
        2. 如发现误收集未成年人信息，我们会及时删除
      </text>

      <text class="section-title">七、隐私政策更新</text>
      <text class="section-content">
        1. 我们保留更新本隐私政策的权利
        2. 重大变更会通过平台公告或其他方式通知您
      </text>

      <text class="section-title">八、联系我们</text>
      <text class="section-content">
        如您对本隐私政策有任何疑问，可通过以下方式联系我们：
        1. 客服电话：177-2119-2050
        2. 电子邮箱：privacy@51mzp.com
      </text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Privacy',
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.privacy-container {
  padding: 30rpx;
  background-color: #fff;

  .privacy-header {
    text-align: center;
    margin-bottom: 40rpx;

    .privacy-title {
      display: block;
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }

    .privacy-date {
      display: block;
      font-size: 24rpx;
      color: #666;
    }
  }

  .privacy-content {
    .section-title {
      display: block;
      font-size: 32rpx;
      font-weight: bold;
      margin: 30rpx 0 20rpx;
      color: #333;
    }

    .section-content {
      display: block;
      font-size: 28rpx;
      line-height: 1.6;
      color: #666;
      margin-bottom: 20rpx;
    }
  }
}
</style>