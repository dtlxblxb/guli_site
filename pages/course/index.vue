<template>
  <div id="aCoursesList" class="bg-fa of">
    <!-- 课程列表 开始 -->
    <section class="container">
      <header class="comm-title">
        <h2 class="fl tac">
          <span class="c-333">全部课程</span>
        </h2>
      </header>
      <section class="c-sort-box">
        <section class="c-s-dl">
          <dl>
            <dt>
              <span class="c-999 fsize14">课程类别</span>
            </dt>
            <dd class="c-s-dl-li">
              <!-- 一级类别 开始-->
              <ul class="clearfix">
                <li :class="{current: !$route.query.subjectParentId}"> <!-- 无论subjectParentId是undefined,null,''哪一个,这个属性起作用(true,因为!).如果有值,这个属性不起作用(false,因为!) -->
                  <a title="全部" href="javascript:void(0);" @click="searchSubjectLevelOne('')">全部</a>
                </li>
                <!-- 可以传给:class 一个对象，以动态地切换 class, current 这个 class 存在与否将取决于数据值的真与假 -->
                <li v-for="item in subjectNestedList" :key="item.id" :class="{current: $route.query.subjectParentId === item.id}">
                  <!-- javascript:void(0),没启实质上的作用，它仅仅是一个死链接，执行的函数是searchSubjectLevelOne() -->
                  <a :title="item.title" href="javascript:void(0);" @click="searchSubjectLevelOne(item.id)">{{ item.title }}</a>
                </li>
              </ul>
              <!-- /一级类别 结束-->
            </dd>
          </dl>
          <dl>
            <dt>
              <span class="c-999 fsize14"/>
            </dt>
            <dd class="c-s-dl-li">
              <!-- 二级类别 开始-->
              <ul v-if="$route.query.subjectParentId" class="clearfix">
                <li :class="{current: !$route.query.subjectId}">
                  <a title="全部" href="javascript:void(0);" @click="searchSubjectLevelTwo('')">全部</a>
                </li>
                <!-- 点一级分类的时候, 会执行searchSubjectLevelOne(), url发生变化, 所以会执行asyncData(),由于searchObj.subjectParentId发生了变化, 引起subSubjectList发生了变化, 所以a标签内容会变化-->
                <li v-for="item in subSubjectList" :key="item.id" :class="{current: $route.query.subjectId === item.id}">
                  <a :title="item.title" href="javascript:void(0);" @click="searchSubjectLevelTwo(item.id)">{{ item.title }}</a>
                </li>
              </ul>
              <!-- /二级类别 结束-->
            </dd>
          </dl>
          <div class="clear"/>
        </section>
        <div class="js-wrap">
          <section class="fr">
            <span class="c-ccc">
              <i class="c-master f-fM">1</i>/
              <i class="c-666 f-fM">1</i>
            </span>
          </section>
          <section class="fl">
            <!-- 排序 开始-->
            <ol class="js-tap clearfix">
              <li :class="{'current bg-green': searchObj.buyCountSort}">
                <a title="销量" href="javascript:void(0);" @click="searchBuyCount()">销量
                  <i>↓</i>
                </a>
              </li>
              <li :class="{'current bg-green': searchObj.gmtCreateSort}">
                <a title="最新" href="javascript:void(0);" @click="searchGmtCreate()">最新
                  <i>↓</i>
                </a>
              </li>
              <li :class="{'current bg-green': searchObj.priceSort}">
                <a v-if="!$route.query.type || $route.query.type == 2" title="价格" href="javascript:void(0);" @click="searchPrice(1)">价格
                  <i>↑</i>
                </a>
                <a v-if="$route.query.type == 1" title="价格" href="javascript:void(0);" @click="searchPrice(2)">价格
                  <i>↓</i>
                </a>
              </li>
            </ol>
            <!-- /排序 结束-->
          </section>
        </div>
        <div class="mt40">
          <!-- /无数据提示 开始-->
          <section v-if="courseList.length===0" class="no-data-wrap">
            <em class="icon30 no-data-ico">&nbsp;</em>
            <span class="c-666 fsize14 ml10 vam">没有相关数据，小编正在努力整理中...</span>
          </section>
          <!-- /无数据提示 结束-->

          <!-- 数据列表 开始-->
          <article v-if="courseList.length>0" class="comm-course-list">
            <ul id="bna" class="of">
              <li v-for="item in courseList" :key="item.id">
                <div class="cc-l-wrap">
                  <section class="course-img">
                    <img :src="item.cover" :alt="item.title" class="img-responsive">
                    <div class="cc-mask">
                      <a :href="'/course/'+item.id" title="开始学习" class="comm-btn c-btn-1">开始学习</a>
                    </div>
                  </section>
                  <h3 class="hLh30 txtOf mt10">
                    <a :href="'/course/'+item.id" :title="item.title" class="course-title fsize18 c-333">{{ item.title }}</a>
                  </h3>
                  <section class="mt10 hLh20 of">
                    <span v-if="Number(item.price) === 0" class="fr jgTag bg-green">
                      <i class="c-fff fsize12 f-fA">免费</i>
                    </span>
                    <span v-else class="fr jgTag ">
                      <i class="c-orange fsize12 f-fA"> ￥{{ item.price }}</i>
                    </span>
                    <span class="fl jgAttr c-ccc f-fA">
                      <i class="c-999 f-fA">{{ item.viewCount }}人学习</i>
                      |
                      <i class="c-999 f-fA">{{ item.buyCount }}人购买</i>
                    </span>
                  </section>
                </div>
              </li>
            </ul>
            <div class="clear"/>
          </article>
          <!-- /数据列表 结束-->
        </div>
      </section>
    </section>
    <!-- /课程列表 结束 -->
  </div>
</template>

<script>
import courseApi from '~/api/course'
import queryString from 'querystring' // url参数拼接工具

export default {
  async asyncData(page) {
    // 组装查询对象
    // 当点击查询条件的时候,在url地址栏中组装查询参数
    // 从url地址栏中获取查询参数,对页面中相应部分进行高亮显示
    const searchObj = {} // 要求键和后台WebCourseQueryVo的字段一致

    // 从url地址栏中获取查询参数
    const query = page.route.query // page.route.query取得url中?后的键值对(叫查询字符串queryString),page.route.params.id取得url中最后一个"/"后的值
    searchObj.subjectParentId = query.subjectParentId || '' // 如果query.subjectParentId=undefined 统一用空串代替,注意undefined,null,''的区别:undefined,null,''都是false,后台isEmpty('')是true
    searchObj.subjectId = query.subjectId || '' // searchObj.subjectId的subjectId是后台WebCourseQueryVo的字段的名字, query.subjectId的subjectId是url出现的名字
    searchObj.buyCountSort = query.buyCountSort || ''
    searchObj.gmtCreateSort = query.gmtCreateSort || ''
    searchObj.priceSort = query.priceSort || ''
    searchObj.type = query.type || '' // 1：价格正序，2：价格倒序

    // 课程列表的查询
    const courseListResponse = await courseApi.getList(searchObj)
    const courseList = courseListResponse.data.courseList
    // console.log(courseList) // 由于在浏览器看不到Ajax请求, 所以观察数据可以采用这种方法, 最好用Vue插件观察

    // 课程分类列表的查询
    const subjectNestedListResponse = await courseApi.getSubjectNestedList()
    const subjectNestedList = subjectNestedListResponse.data.items

    // 定义二级分类列表
    let subSubjectList = []
    // 遍历一级列表
    for (let i = 0; i < subjectNestedList.length; i++) {
      // 如果查询参数中的一级分类id和当前一级分类id一致
      if (searchObj.subjectParentId === subjectNestedList[i].id) {
        // 则获取二级分类列表
        subSubjectList = subjectNestedList[i].children
      }
    }
    return { // 这里返回的数据,可以在其他位置通过this获取
      // courseList 是 courseList: courseList 的简写
      courseList, // 课程列表
      subjectNestedList, // 课程分类嵌套列表--一级分类列表
      subSubjectList, // 二级分类列表
      searchObj // 查询对象
    }
  },

  methods: {
    // 选择一级分类
    searchSubjectLevelOne(subjectParentId) {
      // 如果这样写,前面的<a>@click="searchSubjectLevelOne()">全部</a>中searchSubjectLevelOne函数就不用传参, 这样subjectParentId得到undefind
      // if (subjectParentId) {
      //   window.location = 'course?subjectParentId=' + subjectParentId // window.location 对象代表当前页面的地址 (URL), 它的变化会让整个页面刷新, 从而引起asyncData()的执行
      // } else {
      //   window.location = 'course'
      // }
      window.location = 'course?subjectParentId=' + subjectParentId // 前面的<a>@click="searchSubjectLevelOne()">全部</a>中searchSubjectLevelOne函数需要传空串参数
    },

    // 选择二级分类
    searchSubjectLevelTwo(subjectId) {
      // console.log(this.searchObj) // 一跳转这个就显示不出了
      // window.location = 'course?subjectParentId=' + this.searchObj.subjectParentId + '&subjectId=' + subjectId

      // 自动组装queryString
      const queryObj = {
        subjectParentId: this.searchObj.subjectParentId,
        subjectId: subjectId
      }
      const querys = queryString.stringify(queryObj) // queryString.stringify(queryObj):把对象转换为url查询字符串的形式---JSON.stringify(queryObj):把对象转换为JSON字符串:{'name':'zangsan','age':18}
      // console.log(querys) // subjectId=1329048072228716545&subjectParentId=1329048072190967809
      window.location = 'course?' + querys
    },

    // 选择按销量倒序排序
    searchBuyCount() {
      // window.location = 'course?subjectParentId=' + this.searchObj.subjectParentId + '&subjectId=' + this.searchObj.subjectId + '&buyCountSort=1'
      // 自动组装queryString
      const queryObj = {
        subjectParentId: this.searchObj.subjectParentId,
        subjectId: this.searchObj.subjectId,
        buyCountSort: 1
      }
      const querys = queryString.stringify(queryObj)
      window.location = 'course?' + querys
    },

    // 选择按创建时间排序
    searchGmtCreate() {
      const queryObj = {
        subjectParentId: this.searchObj.subjectParentId,
        subjectId: this.searchObj.subjectId,
        gmtCreateSort: 1
      }
      const querys = queryString.stringify(queryObj)
      window.location = 'course?' + querys
    },

    // 选择按价格倒序
    searchPrice(type) {
      const queryObj = {
        subjectParentId: this.searchObj.subjectParentId,
        subjectId: this.searchObj.subjectId,
        priceSort: 1,
        type: type
      }
      const querys = queryString.stringify(queryObj)
      window.location = 'course?' + querys
    }
  }
}
</script>
