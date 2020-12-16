<template>
  <div>
    <div v-for="(teacher, index) in items" :key="index">
      <a href="#">{{ teacher.name }}</a>
    </div>
  </div>
</template>

<script>
import teacherApi from '~/api/teacher'
export default {
  // 异步数据获取--服务器端渲染方案
  asyncData() { // 在前端服务器执行,浏览器端不会看到Ajax请求,而在查看页面源代码时,能看到渲染好的页面,因为已经在前端服务器渲染好了,函数内不能用this,因为它是在vue对象初始化前执行
    return teacherApi.getList().then(response => {
      return {
        items: response.data.items // 在utils/request.js有return response.data,所以少写一个data
      }
    })
  }

  // 这是以前的写法--客户端渲染方案
  // data() {
  //   return {
  //     items: []
  //   }
  // },
  // created() { // 在浏览器端执行,浏览器端会看到Ajax请求,而在查看页面源代码时,看不到渲染好的页面,只有没渲染的页面和请求返回的数据,所以要在浏览器端渲染,函数内可以用this,因为它是在vue对象初始化后执行
  //   this.fetchData()
  // },
  // methods: {
  //   fetchData() {
  //     teacherApi.getList().then(response => {
  //       this.items = response.data.items
  //     })
  //   }
  // }
}
</script>
