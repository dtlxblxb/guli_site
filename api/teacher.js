import request from '~/utils/request' // ~ : 表示当前项目的目录(admin项目用@表示src目录)

export default{

  getList() {
    return request({
      url: '/api/edu/teacher/list',
      method: 'get'
    })
  },
  getById(id) {
    return request({
      url: `/api/edu/teacher/get/${id}`,
      method: 'get'
    })
  }
}
