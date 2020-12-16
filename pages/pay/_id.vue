<template>
  <div class="cart py-container">
    <!--主内容-->
    <div class="checkout py-container  pay">
      <div class="checkout-tit" style="width: 1050px; margin: 0 auto; padding: 10px 0;">
        <h4 class="fl tit-txt"><span class="success-info">支付申请提交成功，请您及时付款！订单号：{{ payObj.out_trade_no }}</span>
        </h4>
        <span class="fr"><em class="sui-lead">应付金额：</em><em class="orange money">￥{{ payObj.total_fee/100 }}</em></span>
        <div class="clearfix"/>
      </div>
      <div class="checkout-steps">
        <div class="fl weixin">微信支付</div>
        <div class="fl sao">
          <div class="fl code">
            <!-- <img id="qrious" src="~/assets/img/erweima.png" alt=""> -->
            <qriously :value="payObj.code_url" :size="338"/>
            <!-- 二维码: {{ payObj.code_url }} -->
          </div>
          <div style="color: red; text-align:center;">请使用微信扫一扫</div>
        </div>
        <div class="clearfix"/>
        <!-- <p><a href="pay.html" target="_blank"> 其他支付方式</a></p> -->
      </div>
    </div>

  </div>
</template>

<script>
import payApi from '~/api/pay'
import orderApi from '~/api/order'

export default {
  // 在服务端获取二维码URL
  async asyncData(page) {
    const response = await payApi.createNative(page.route.params.id)
    return {
      payObj: response.data
    }
  },

  /*
  data() {
    return {
      payObj: {}
    }
  },
  // 在created中获取数据, 报告=>Invalid prop: type check failed for prop "value".  二维码<qriously>试图在create()执行前渲染, 由于payObj.code_url中没有数据, 所以报错, 解决办法就是服务器端渲染
  created() {
    payApi.createNative(this.$route.params.id).then(response => {
      this.payObj = response.data
    })
  }
  */
  // created的时候就查询支付状态，没有必要，因为二维码页面尚未渲染，不可能支付成功
  // 用户看到二维码之后(页面渲染后),开始轮询调用后端是否支付接口

  data() {
    return {
      timer: null // 定时器
    }
  },
  mounted() {
    // 启动定时器
    this.timer = setInterval(() => { // 每隔三秒执行一次
      this.queryPayStatus()
    }, 3000)
  },
  methods: {
    // 查询订单状态
    queryPayStatus() {
      orderApi.queryPayStatus(this.payObj.out_trade_no).then(response => {
        console.log('查询订单状态：' + response.code) // 20000或25000
        // 支付成功后的页面跳转
        if (response.success) { // 20000=true,非20000=false
          this.$message.success(response.message) // 支付成功
          console.log('清除定时器')
          clearInterval(this.timer) // 清除定时器
          // 三秒后跳转到课程详情页面观看视频
          setTimeout(() => { // 3秒后只执行一次
            this.$router.push({ path: '/course/' + this.payObj.course_id })
          }, 3000)
        }
      })
    }
  }
}
</script>
