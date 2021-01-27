<template>
  <div class="main">
    <div class="title">
      <a class="active" href="/login">登录</a>
      <span>·</span>
      <a href="/register">注册</a>
    </div>

    <div class="sign-up-container">
      <form action="register">
        <div class="input-prepend restyle">
          <input v-model="user.mobile" type="text" placeholder="手机号">
          <i class="iconfont icon-phone"/>
        </div>
        <div class="input-prepend">
          <input v-model="user.password" type="password" placeholder="密码">
          <i class="iconfont icon-password"/>
        </div>
        <div class="btn">
          <input type="button" class="sign-in-button" value="登录" @click="submitLogin()">
        </div>
      </form>
      <!-- 更多登录方式 -->
      <div class="more-sign">
        <h6>社交帐号登录</h6>
        <ul>
          <!-- 这里只能硬编码9110, 因为此项目没有定义像guli_admin项目中的配置文件中定义的全局变量(process.env.BASE_API) -->
          <li><a id="weixin" class="weixin" href="http://localhost:9110/api/ucenter/wx/login"><i class="iconfont icon-weixin"/></a></li>
          <li><a id="qq" class="qq" target="_blank" href="#"><i class="iconfont icon-qq"/></a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import '~/assets/css/sign.css'
import '~/assets/css/iconfont.css'
import cookie from 'js-cookie'
import loginApi from '~/api/login'

export default {
  layout: 'sign',

  data() {
    return {
      user: {
        mobile: '',
        password: ''
      }
    }
  },

  methods: {
    // 登录
    submitLogin() {
      loginApi.submitLogin(this.user).then(response => { // 调用后端登录接口
        /*
          这里的domain表示在localhost主机名下可以跨域(目前项目由于是用端口区分前端项目和后端的各微服务,所以cookie无法跨域)
          对于用域名区分前端项目和后端的各微服务的项目(端口都是80), domain可以设置为顶级域名, 这样二级、三级等域名就可以访问这个cookie.
        */
        /*
          Cookie的路径直接决定浏览器加载那些cookie到request对象中。
          如果不设置cookie的path，Cookie的路径就是创建这个cookie时访问的地址中相对于域domain的地址。
          例如请求路径：http://localhost/dtjsblxb/jhk/login时创建一个cookie，则此cookie的路径：/dtjsblxb/jhk/。(在domain: 'localhost'情况下)
          如果我们设置path，cookie的路径就是设置的路径。
        */
        /*
          加载cookie到request的规则是：如果当前访问的路径包含了cookie的路径,cookie就会加载到request对象之中, 当然要在符合domain域和跨域要求的前提下进行加载cookie。
        */
        cookie.set('guli_jwt_token', response.data.token, { domain: 'localhost' }) // cookie.set默认设置path为:/, 并设置域为:localhost
        // window.location.href = '/' // 跳转到首页(~/pages/index.vue):看~/.nuxt/router.js的自动路由
        console.log(document.referrer)
        // 如果上一页是注册页,则跳转到首页(因为注册成功则跳转到登录页已经实现), document.referrer代表上一页的url地址, 为什么不能只用document.referrer.indexOf('register') !== -1判断?
        if (document.referrer === 'http://localhost:3000/' || document.referrer.indexOf('login') !== -1 || document.referrer.indexOf('register') !== -1) {
          window.location.href = '/'
        } else {
          history.go(-1) // 如果上一页不是注册页, 则跳转到上一个刚刚访问的页面(例如课程详情页)
        }
      })
    }
  }
}
</script>
