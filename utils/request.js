import axios from 'axios'
import { Message } from 'element-ui'
import cookie from 'js-cookie'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:9110', // baseURL: 'http://localhost:8110' 由于引入网关
  timeout: 12000 // 请求超时时间
})

// http request 拦截器
service.interceptors.request.use(
  config => {
    // 当cookie中有guli_jwt_token信息,则将guli_jwt_token放到header中的token随请求一起发送给服务端接口
    if (cookie.get('guli_jwt_token')) { // 如果cookie中包含guli_jwt_token
      // 则发送后端api请求的时候header携带token:jwt
      config.headers['token'] = cookie.get('guli_jwt_token')
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
       * code为非20000是抛错 可结合自己业务进行修改
       */
    const res = response.data
    if (res.code === 20000) {
      return response.data // 正常返回
    } else if (res.code === 23004) { // 获取用户信息失败-进入首页会出现的异常,有两种情况:1.请求头没有token,2.cookie过时
      cookie.set('guli_jwt_token', '', { domain: 'localhost' }) // 清除cookie
      return response.data // 这里不要提示错误信息
    } else if (res.code === 25000) { // 支付中
      return response.data // 不显示错误信息
    } else if (res.code === 28004) { // 鉴权失败
      window.location.href = '/login' // 跳转到登录页
      return
    } else {
      Message({ // 其它错误继续提示错误
        message: res.message || 'error',
        type: 'error',
        duration: 5 * 1000 // 持续时间
      })
      return Promise.reject('error') // 非20000错误
    }
  },
  /**
    if (res.code !== 20000) {
      Message({
        message: res.message || 'error',
        type: 'error',
        duration: 5 * 1000 // 持续时间
      })

      return Promise.reject('error') // 非20000错误
    } else {
      return response.data // 正常返回
    }
  },
  */
  error => {
    console.log('err：' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error) // http错误
  }
)

export default service
