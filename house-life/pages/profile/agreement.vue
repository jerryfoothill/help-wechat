<template>
  <view class="agreement-container">
    <view class="agreement-header">
      <text class="agreement-title">51找找找使用协议</text>
      <text class="agreement-date">生效日期：2025年4月20日</text>
    </view>
    <view class="agreement-content">
      <text class="section-title">一、协议的范围</text>
      <text class="section-content">
        欢迎您使用51找找找平台服务！为明确用户在接受和使用本平台服务时的权利义务，特制定本协议。在您注册、登录、使用本平台服务时，均视为您已充分阅读、理解并接受本协议的全部条款。
      </text>

      <text class="section-title">二、服务内容</text>
      <text class="section-content">
        51找找找平台为用户提供以下服务：
        1. 房屋租赁信息发布与查询
        2. 求职招聘信息发布与查询
        3. 社交互动功能
        4. 其他相关配套服务
      </text>

      <text class="section-title">三、用户行为规范</text>
      <text class="section-content">
        1. 用户在使用本平台服务时必须遵守中华人民共和国相关法律法规。
        2. 用户发布的信息必须真实、准确，不得含有虚假、误导性内容。
        3. 用户不得利用本平台从事违法违规活动。
        4. 用户应当尊重其他用户的合法权益。
      </text>

      <text class="section-title">四、信息发布规则</text>
      <text class="section-content">
        1. 房屋租赁信息发布要求：
           - 房源信息必须真实有效
           - 图片必须为实拍图片
           - 价格信息必须准确
        2. 招聘信息发布要求：
           - 岗位信息必须真实
           - 薪资待遇描述必须准确
           - 不得含有歧视性要求
      </text>

      <text class="section-title">五、账户安全</text>
      <text class="section-content">
        1. 用户应妥善保管账户信息，因用户主观原因导致的账户被盗用的损失由用户自行承担。
        2. 平台有权对违规账户采取限制或关闭等措施。
      </text>

      <text class="section-title">六、知识产权</text>
      <text class="section-content">
        1. 平台所有内容的知识产权归本平台所有。
        2. 用户发布的原创内容的知识产权归用户所有。
      </text>

      <text class="section-title">七、免责声明</text>
      <text class="section-content">
        1. 平台不对用户发布信息的真实性承担责任。
        2. 因不可抗力导致的服务中断，平台不承担责任。
      </text>

      <text class="section-title">八、协议修改</text>
      <text class="section-content">
        平台保留随时修改本协议的权利，修改后的协议将在平台上公布。
      </text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Agreement',
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.agreement-container {
  padding: 30rpx;
  background-color: #fff;

  .agreement-header {
    text-align: center;
    margin-bottom: 40rpx;

    .agreement-title {
      display: block;
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }

    .agreement-date {
      display: block;
      font-size: 24rpx;
      color: #666;
    }
  }

  .agreement-content {
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