import axios from 'axios'
import { Message } from 'element-ui'
import cookie from 'js-cookie'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://localhost:9110', // 'http://localhost:8110' 由于引入网关,所以注释掉
  timeout: 12000 // 请求超时时间
})

// http request 拦截器
service.interceptors.request.use(
  config => {
    // 当cookie中有guli_jwt_token信息,则将guli_jwt_token放到header中的token随请求一起发送给服务端接口
    if (cookie.get('guli_jwt_token')) { // 其它情况1.没登录--没有guli_jwt_token这个key)。2.cookie已被清除都不会在请求头中携带cookie
      // 则所有发送后端api请求的时候header都携带token(jwt), 但token正确与否,需不需要用户信息都由后端校验(最终由网关进行校验)和决定来处理
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
    } else if (res.code === 23004) { // 获取用户信息失败出现的异常(token出错包括cookie过期)
      cookie.set('guli_jwt_token', '', { domain: 'localhost' }) // 清除cookie
      return response.data // 没有提示错误信息
    } else if (res.code === 25000) { // 支付中
      return response.data // 没有提示错误信息
    } else if (res.code === 28004) { // 鉴权失败
      window.location.href = '/login' // 跳转到登录页
      return // 没有提示错误信息
    } else {
      Message({ // 其它错误继续提示错误信息
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
