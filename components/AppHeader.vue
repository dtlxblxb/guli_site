<template>
  <!-- 公共头 -->
  <header id="header">
    <section class="container">
      <h1 id="logo">
        <a href="#" title="谷粒学院">
          <img src="~/assets/img/logo.png" width="100%" alt="谷粒学院">
        </a>
      </h1>
      <div class="h-r-nsl">
        <ul class="nav">
          <!-- tag属性表示使router-link渲染成li标签,同时它还能监听点击，触发导航。active-class属性表示链接激活时使用的 CSS 类名。 -->
          <!-- exact类型boolean, 默认值:false, exact出现在to="/"路由中(true), 表示精确匹配, 否则(false)<router-link to="/"> 将会使以下各个路由都显示链接激活的CSS样式-->
          <router-link to="/" tag="li" active-class="current" exact>
            <a>首页</a>
          </router-link>
          <router-link to="/course" tag="li" active-class="current">
            <a>课程</a>
          </router-link>
          <router-link to="/teacher" tag="li" active-class="current">
            <a>名师</a>
          </router-link>
          <router-link to="/article" tag="li" active-class="current">
            <a>文章</a>
          </router-link>
          <router-link to="/question" tag="li" active-class="current">
            <a>问答</a>
          </router-link>
        </ul>
        <!-- / nav -->
        <ul class="h-r-login">
          <li v-if="!userInfo" id="no-login"> <!-- 用户没登录,显示的<li>标签 -->
            <a href="/login" title="登录">
              <em class="icon18 login-icon">&nbsp;</em> <!-- 登录图标 -->
              <span class="vam ml5">登录</span>
            </a>
            |
            <a href="/register" title="注册">
              <span class="vam ml5">注册</span>
            </a>
          </li>
          <!-- 注意undis(display:none)的css类型将当前li节点隐藏了(这里去掉了class="mr10 undis"的undis) -->
          <li v-if="userInfo" id="is-login-one" class="mr10"> <!-- 用户登录成功,显示的<li>标签 -->
            <a id="headerMsgCountId" href="#" title="消息">
              <em class="icon18 news-icon">&nbsp;</em> <!-- 消息图标 -->
            </a>
            <q class="red-point">&nbsp;</q> <!-- 红点 -->
          </li>
          <!-- 注意undis(display:none)的css类型将当前li节点隐藏了(这里去掉了class="h-r-user undis"的undis) -->
          <li v-if="userInfo" id="is-login-two" class="h-r-user"> <!-- 用户登录成功,显示的<li>标签 -->
            <a href="/ucenter" title>
              <img :src="userInfo.avatar" width="30" height="30" class="vam picImg" alt> <!-- 头像 -->
              <span id="userName" class="vam disIb">{{ userInfo.nickname }}</span> <!-- 昵称 -->
            </a>
            <a href="javascript:void(0)" title="退出" class="ml5" @click="logout()">退出</a> <!-- 退出按钮 -->
          </li>
          <!-- /未登录显示第1 li；登录后显示第2，3 li -->
        </ul>
        <aside class="h-r-search">
          <form action="#" method="post">
            <label class="h-r-s-box">
              <input type="text" placeholder="搜索课程" name="queryCourse.courseName" value>
              <button type="submit" class="s-btn">
                <em class="icon18">&nbsp;</em> <!-- 搜索图标 -->
              </button>
            </label>
          </form>
        </aside>
      </div>
      <aside class="mw-nav-btn">
        <div class="mw-nav-icon"/>
      </aside>
      <div class="clear"/>
    </section>
  </header>
  <!-- /公共头 -->
</template>

<script>
import loginApi from '~/api/login'
import cookie from 'js-cookie'

export default {
  data() {
    return {
      userInfo: null, // 和后端JwtInfo对应
      token: null
    }
  },
  // 页面渲染之前执行, 尚未有window对象
  created() { // 这里没必要服务端渲染,客户端渲染就可以
    this.getUserInfo()
  },
  // 页面渲染之后执行, 有window对象
  mounted() {
    // 由微信登录的url, 获取token
    /*
    // 第一次进这个页面, 先执行created,由于cookie中没有guli_jwt_token,所以getUserInfo直接退出,然后执行mounted,由于url有token(后端callback带回前端的),所以设置cookie的guli_jwt_token值
    // 第二次进这个页面(由于跳转了页面), 执行created, 由于此时cookie中有guli_jwt_token, 接着给userInfo赋值, 然后显示出用户信息
    */
    this.token = this.$route.query.token // this.$route.params从/后面拿参数,this.$route.query.token从?后面拿参数
    if (this.token) {
      // 将token存在cookie中
      cookie.set('guli_jwt_token', this.token, { domain: 'localhost' })
      // 跳转页面：擦除url中的token
      window.location.href = '/' // 注意：window对象在created方法中无法被访问，因此要写在mounted中
    }
  },
  methods: {
    getUserInfo() {
      // 如果cookie不存在(没登录或cookie已被清除)，则保持userInfo还是null, 这样就显示登录和注册两个按钮而不显示用户信息
      if (!cookie.get('guli_jwt_token')) {
        return
      }
      // 如果token存在，则1.根据token解析用户登录信息(token验证正确), 给userinfo赋值, 显示用户信息
      // 2.由request.js的response拦截器进行清除cookie操作(token出错包括cookie过期), userinfo没有赋值, 显示登录和注册两个按钮
      loginApi.getLoginInfo().then(response => {
        this.userInfo = response.data.userInfo // 只有在解析token正常时才给userinfo赋值(显示用户信息),其它没登录或解析token异常情况都不给userinfo赋值(显示登录和注册两个按钮)
      })
      // 这里cookie(guli_jwt_token)存在4种情况:1.没登录(没key)2.已被清除3.错误4.正常
    },
    logout() {
      cookie.set('guli_jwt_token', '', { domain: 'localhost' }) // 清除cookie, 服务器端不用处理, 因为服务器端不保留用户信息(无状态)
      window.location.href = '/' // 跳转到首页
    }
  }
}
</script>
