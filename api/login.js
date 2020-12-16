import request from '~/utils/request'
// import cookie from 'js-cookie'

export default {
  submitLogin(user) {
    return request({
      // baseURL: 'http://localhost:8160',
      url: '/api/ucenter/member/login',
      method: 'post',
      data: user
    })
  },

  getLoginInfo() {
    return request({
      // baseURL: 'http://localhost:8160',
      url: '/api/ucenter/member/get-login-info',
      method: 'get'
      // 通过请求头发送token
      // headers: { 'token': cookie.get('guli_jwt_token') } // 修改request.js,使得在请求拦截器中让所有请求都自动在header中携带token
    })
  }
}
