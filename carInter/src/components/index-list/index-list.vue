<template>
  <div class="weui-indexlist" ref="content">
    <div class="weui-indexlist-content" ref="contentList" >
      <Cells :title="item.initial" v-for="(item, index) in list" :key="index" :id="'weui-indexlist-'+item.initial">
        <cell :title="cell.brandName" v-for="(cell, key) in item.cells" :key="index+'-'+key" @click.native="checkValue(index, key)"></cell>
      </Cells>
    </div>
    <div class="weui-indexlist-nav" ref="nav">
      <ul class="weui-indexlist-navlist">
        <li class="weui-indexlist-navitem" v-for="initial in initials" @touchend="scroll(initial)">
          {{ initial }}
        </li>
      </ul>
    </div>
    <!--<div class="weui-indexlist-navInitial">{{currentIndicator}}</div>-->
  </div>
</template>

<style lang="less">
  @cellTitleFont: .875rem;
  .weui-indexlist {
    width: 100%;
    position: relative;
    overflow: hidden;
  &-content {
  }
  .weui-cells__title {
    background: rgb(241,244,246);
    margin:0;
    padding-top: .77em;
    padding-bottom: .3em;
    color: #7B93A7;
    font-size: @cellTitleFont;
  }

  .weui-indexlist-nav {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    margin: 0;
    text-align: center;
    max-height: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    -webkit-flex-direction: column;
    justify-content: center;
    -webkit-justify-content: center;
  &list {
     padding: 0;
     margin: 0;
     list-style: none;
     max-height: 100%;
     display: flex;
     flex-direction: column;
   }
  &item {
     padding: 0 0.375rem;
     font-size: 0.8rem;
     user-select: none;
     -webkit-touch-callout: none;
     a {
       color: #2D3E53
     }
   }
  }
  }
  .weui-indexlist-navInitial:extend(.weui-indexlist .weui-cells__title){
     position: fixed;
     top:0;
     width: 100%;
     z-index: 1;
    padding-left: 15px;
    padding-right: 15px;
   }
</style>
<script>
  import Cells from '../cells/index'
  const Cell = Cells.Cell
  export default {
    name: 'm-index-list',
    components: {Cells, Cell},
    props: {
      list: Array,
      initials: Array
    },
    data () {
      return {
        currentHeight: 'auto',
        firstSection: null,
        currentIndicator: ''
      }
    },
    methods: { // methods
      setScrollTop (offset, time) {
        offset = offset || 0
        window.scrollTo(0, offset)
      },
      scroll (initial) {
        this.currentIndicator = initial
        let ref = this.$refs.content.querySelector(`#weui-indexlist-${initial}`)
        let top = ref.offsetTop
        this.setScrollTop(top, 0.3)
      },
      checkValue (index, index2) {
        let _value = this.list[index].cells[index2]
        this.$emit('on-check', _value)
        window.scrollTo(0, 0)
      }
    },
    created () {
      this.currentIndicator = this.initials[0] || ''
    },
    mounted () {
      if (this.currentHeight === 'auto') {
        this.currentHeight = document.documentElement.clientHeight - this.$refs.content.getBoundingClientRect().top
      }
    }
  }
</script>

