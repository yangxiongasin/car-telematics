<template>
  <div>
    <!--确保页面高度大于页面高度-->
    <m-scroll :on-refresh="onRefresh" :on-infinite="onInfinite">
      <ul>
        <li v-for="(item, index) in listdata" v-bind:key="index">
         {{index+1}} {{item.name}}<br><br>
        </li>
      </ul>
    </m-scroll>
  </div>
</template>
<script>
  export default{
    data () {
      return {
        counter: 1, // 默认已经显示出15条数据 count等于一是让从16条开始加载
        num: 10,  // 一次显示多少条
        pageStart: 0, // 开始页数
        pageEnd: 0, // 结束页数
        listdata: [], // 下拉更新数据存放数组
        downdata: []  // 上拉更多的数据存放数组
      }
    },
    mounted: function () {
      this.getList()
    },
    methods: {
      // 获取初始数据
      getList () {
        let vm = this
        vm.$http.get('/getScroll').then((response) => {
          vm.listdata = response.data.slice(0, vm.num)
        }, (response) => {
          console.log('error')
        })
      },
      // 下拉刷新
      onRefresh (done) {
        this.getList()
        done()
      },
      // 上滑刷新 目前为模拟数据，所以数据值值只能为一次性全部获取
      onInfinite (done) {
        let vm = this
        vm.$http.get('/getScroll').then((response) => {
          vm.counter++
          vm.pageEnd = vm.num * vm.counter
          vm.pageStart = vm.pageEnd - vm.num
          let arr = response.data
          let i = vm.pageStart
          let end = vm.pageEnd
          for (; i < end; i++) {
            vm.listdata.push(arr[i])
            // 当最后一条数据的length大于总数据条数时，更多加载消失
            if ((i + 1) >= response.math) {
              this.$el.querySelector('.load-more').style.display = 'none'
              return
            }
          }
          done()
        }, (response) => {
          console.log('error')
        })
      }
    }
  }
</script>
<style scoped lang="less">
  ul{
    height: 37.44rem;
  }
</style>
