<template>
    <div>
      <!--<div class="latelyPhoto_cont_img" v-if="wkwebview === true" @click="setData">-->
        <!--<div v-if="imageShow" class="latelyPhoto_cont_img">-->
            <!--<img v-lazy="media.path" alt="">-->
        <!--</div>-->

        <!--&lt;!&ndash;<img v-lazy="media.snapshoot" alt="" v-if="!imageShow">&ndash;&gt;-->
        <!--&lt;!&ndash;<div class="videoModel flex_center" v-if="!imageShow">&ndash;&gt;-->
          <!--&lt;!&ndash;<i class="weui-icon-ai-play-circle-outline"></i>&ndash;&gt;-->
        <!--&lt;!&ndash;</div>&ndash;&gt;-->
        <!--<div v-if="!imageShow"  class="latelyPhoto_cont_img">-->
          <!--<img v-lazy="media.snapshoot" alt="">-->
          <!--<div class="videoModel flex_center">-->
            <!--<i class="weui-icon-ai-play-circle-outline"></i>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <div class="latelyPhoto_cont_img" @click="mediaDetail">
        <div class="latelyPhoto_cont_img" v-if="imageShow">
          <img v-lazy="media.path" alt="">
        </div>
        <img v-lazy="media.snapshoot" alt="" v-if="!imageShow">
        <div class="videoModel flex_center" v-if="!imageShow">
          <i class="weui-icon-ai-play-circle-outline"></i>
        </div>
      </div>
    </div>
</template>

<script>
  const uuid = require('uuid/v4')
  export default {
    name: '',
    data () {
      return {
//        wkwebview: window.__wxjs_is_wkwebview,
//        wkwebview: true,
        imageShow: true,
        j_type: 'image',
        type: ''
      }
    },
    props: {
      media: {
        type: Object
      }
    },
    watch: {
      media (val) {
        this.media = val
      }
    },
    methods: {
      //      setData () {
      //        let vm = this
      //        const index = location.href.indexOf('/views/')
      //        const host = location.href.substring(0, index)
      //        const serialCode = this.getUUID()
      //        this.clickNum()
      //        if (Number(vm.media.mideaType) === 0) {
      //          localStorage.setItem('currentImageDetail', JSON.stringify(vm.media))
      //          window.location.href = `${host}/share.html?serialeCode=${serialCode}&type=image`
      //        } else {
      //          localStorage.setItem('currentVideoDetail', JSON.stringify(vm.media))
      //          window.location.href = `${host}/share.html?serialeCode=${serialCode}&type=video`
      //        }
      //      },

      getUUID () {
        return uuid().replace(/-/g, '')
      },
      mediaDetail () {
        this.clickNum()
        if (Number(this.media.mideaType) === 0) {
          sessionStorage.setItem('currentImageDetail', JSON.stringify(this.media))
          this.$router.push({name: 'imageDetail'})
        } else if (Number(this.media.mideaType) === 1) {
          sessionStorage.setItem('currentVideoDetail', JSON.stringify(this.media))
          this.$router.push({name: 'videoDetail'})
        }
      },
      clickNum () {
        this.$http.post(this.$service.monitor.mediaCount, {
          imei: this.media.imei,
          functionCode: this.type
        }).then(data => {
          console.log('点击了一次')
        })
      }
    },
    created () {
      if (Number(this.media.mideaType) === 0) {
        this.imageShow = true
        this.type = 'MEDIA_PHOTO'
      } else if (Number(this.media.mideaType) === 1) {
        this.imageShow = false
        this.type = 'MEDIA_VIDEO'
      }
    }
  }
</script>
