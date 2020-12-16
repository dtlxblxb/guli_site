<template>
  <!-- 页面渲染时执行 -->
  <div>
    <link rel="stylesheet" href="https://g.alicdn.com/de/prismplayer/2.8.2/skins/default/aliplayer-min.css" > <!-- 阿里云视频播放器样式 -->
    <script charset="utf-8" src="https://g.alicdn.com/de/prismplayer/2.8.2/aliplayer-min.js"/> <!-- 阿里云视频播放器脚本 -->
    <script charset="utf-8" src="https://player.alicdn.com/aliplayer/presentation/js/aliplayercomponents.min.js"/> <!-- 阿里云视频播放器组件 -->
    <!-- 播放器 -->
    <div id="J_prismPlayer" class="prism-player"/>
  </div>
</template>

<script>
import courseApi from '~/api/course'

export default {
  async asyncData(page) {
    // 得到视频ID(videoSourceId)
    const vid = page.route.params.vid // page.route.params.vid和pages/palyer/_vid.vue中的两个'vid'必须一致
    // console.log(vid)
    // 根据视频ID获取播放凭证
    const response = await courseApi.getPlayAuth(vid)
    return {
      vid: vid,
      playAuth: response.data.playAuth
    }
  },
  // 页面渲染之后执行
  mounted() {
    /* eslint-disable no-undef */
    new Aliplayer({
      id: 'J_prismPlayer',
      width: '100%',
      vid: this.vid,
      playauth: this.playAuth,
      encryptType: 1 // 当播放私有加密流时需要设置。
    }, function(player) {
      console.log('播放器创建好了。')
    })
  }
  // // 页面渲染之前执行
  // created() {
  //   /* eslint-disable no-undef */ // 忽略 no-undef 检测, 任然会报Aliplayer is not defined错误
  //   new Aliplayer({ // 这里没有用模块化的方式引Aliplayer即import方式(aliyun没提供export),只能按照传统方式引js和css,而created()在<template>前执行,所以eslint报错,添加注解可解决
  //     id: 'J_prismPlayer',
  //     width: '100%'
  //     // vid : 'b5147b3586ea4bb6a3fe4cf8de54e6cb',
  //     // playauth : 'eyJTZWN1cml0eVRva2VuIjoiQ0FJU2h3TjFxNkZ0NUIyeWZTaklyNVdFRHRqZ3VPNXp4YUNBU2hmYnMxSTJaTUo4aFpmOWpUejJJSDlJZEhWb0FPOGZ2dlUwbTJ0WTdQc1psck1xRXNVVkhSMmVNWlFoc01zTXJWMzhKcExGc3QySjZyOEpqc1VkdHJ4MHZGaXBzdlhKYXNEVkVmbDJFNVhFTWlJUi8wMGU2TC8rY2lyWXBUWEhWYlNDbFo5Z2FQa09Rd0M4ZGtBb0xkeEtKd3hrMnQxNFVtWFdPYVNDUHdMU2htUEJMVXhtdldnR2wyUnp1NHV5M3ZPZDVoZlpwMXI4eE80YXhlTDBQb1AyVjgxbExacGxlc3FwM0k0U2M3YmFnaFpVNGdscjhxbHg3c3BCNVN5Vmt0eVdHVWhKL3phTElvaXQ3TnBqZmlCMGVvUUFQb3BGcC9YNmp2QWF3UExVbTliWXhncGhCOFIrWGo3RFpZYXV4N0d6ZW9XVE84MCthS3p3TmxuVXo5bUxMZU9WaVE0L1ptOEJQdzQ0RUxoSWFGMElVRTF5R21DQ2QvWDRvZ3VSUDF6N0VwTG9pdjltamNCSHFIeno1c2VQS2xTMVJMR1U3RDBWSUpkVWJUbHphRUpHZ1RTNExmWldJbGNUS0FNOVd1MlBNYXgzYlFGRHI1M3ZzVGJiWHpaYjBtcHR1UG56ZDE0Sk9CS2cxMUtVR29BQlBCc3dMdHNxZTFwZit1Vm9OMVpMK1FIWkdPSTNBRk91UDhkT2xZZzVYcXJLM1hTZlUxc2ROdE5BbnM4R1JKQnN6UWFzdC9yTFBMRk03RUhjRUlmcVZQdHRxN3dhcmVxN1hVOG9ITHNkTndodklXNjlqdy9leGlYbGtGa2thSFpuUXRQTy81VkxYWmQvZXFzTHc0anh5YlNtNG5KOFBRT04zTHc2L2tCUlhzWT0iLCJBdXRoSW5mbyI6IntcIkNJXCI6XCJHYnV4RHpqbnNvb3FkRWgxVWJnM1JNelNOaEV2Z1lxTi8xWlVnSjFLdGJGVmltRDNOVnJiOGZhYmZDMTJ0Tlk1QjluZ2R2TmE0SktOR1k4c1RrbHV3VDlyYTl3RkdVUW41dFJMT2FnMm9rYz1cIixcIkNhbGxlclwiOlwieldmSDd6NWxSK0tQS1QvWnZIcENMTzE3c1ZTWkNlQXFUaW1hNU5xTmlFQT1cIixcIkV4cGlyZVRpbWVcIjpcIjIwMjAtMTEtMjJUMjE6MDE6MzlaXCIsXCJNZWRpYUlkXCI6XCJiNTE0N2IzNTg2ZWE0YmI2YTNmZTRjZjhkZTU0ZTZjYlwiLFwiU2lnbmF0dXJlXCI6XCJYLzBTdzBaY2RwclFKMEd3d0VwZWY4a1E5T0k9XCJ9IiwiVmlkZW9NZXRhIjp7IlN0YXR1cyI6Ik5vcm1hbCIsIlZpZGVvSWQiOiJiNTE0N2IzNTg2ZWE0YmI2YTNmZTRjZjhkZTU0ZTZjYiIsIlRpdGxlIjoi56ys5YWt6ZuGIiwiQ292ZXJVUkwiOiJodHRwOi8vb3V0aW4tZDJiYzgxNmQyY2E0MTFlYjhhNGEwMDE2M2UxYzM1ZDUub3NzLWNuLXNoYW5naGFpLmFsaXl1bmNzLmNvbS9iNTE0N2IzNTg2ZWE0YmI2YTNmZTRjZjhkZTU0ZTZjYi9zbmFwc2hvdHMvNjQxZGNhYTUyMGQ3NGE2N2E4ZjcwYTdmZDE5MTNjMzAtMDAwMDEuanBnP0V4cGlyZXM9MTYwNjA4MjI5OSZPU1NBY2Nlc3NLZXlJZD1MVEFJcmt3YjIxS3lHakpsJlNpZ25hdHVyZT0zN21jS09DZ3Z3U3FBaEZSb284JTJGcWg5S0lNdyUzRCIsIkR1cmF0aW9uIjoxNi4yNzY3fSwiQWNjZXNzS2V5SWQiOiJTVFMuTlYxRWJUVTFScmJrSDFqV1JjaE1QalJWbyIsIkFjY2Vzc0tleVNlY3JldCI6IkhIUVpyV2JGVUpuZVpkU05LNHc0ZHFLMTRYeU5IUTk4MWprVHZ5R2UyNmR4IiwiUmVnaW9uIjoiY24tc2hhbmdoYWkiLCJDdXN0b21lcklkIjoxMTI4MDkyNDc5NjczNDY1fQ==',
  //     // encryptType:1, //当播放私有加密流时需要设置。
  //   }, function(player) {
  //     console.log('播放器创建好了。')
  //   })
  // }
}
</script>
