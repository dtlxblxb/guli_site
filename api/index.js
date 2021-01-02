import request from '~/utils/request'
export default {

  // 轮播图
  getTopBannerAdList() {
    return request({
      // baseURL: 'http://localhost:8140',
      url: '/api/cms/ad/list/1',
      method: 'get'
    })
  },
  // 首页课程和讲师数据
  getIndexData() {
    return request({
      url: '/api/edu/index',
      method: 'get'
    })
  }
}
