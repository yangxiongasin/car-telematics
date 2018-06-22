/**
 * Created by summer on 2017/10/12.
 */
import './index.less'
import MToast from './toast'
import MDialog from './dialog'
import MButton from './button'
import Lazyload from 'vue-lazyload'
import MSwipe from './swipe'
import MSwipeItem from './swipe/swipe-item.vue'
import MActionSheet from './actionSheet'
import MCells from './cells'
import {scroll, scrollNew} from './scroll'
import MIcon from './icons'
import MPicker from './picker'
import MIndexList from './index-list'
import MVerificationCode from './verificationCode'
import MMediaDetail from './mediaDetail/mediaDetail.vue'
import MCircularProgress from './circularProgress'
let components = {
  MToast,
  MDialog,
  MButton,
  MSwipe,
  MSwipeItem,
  MActionSheet,
  MCells,
  MScroll: scroll,
  MScrollNew: scrollNew,
  MCell: MCells.Cell,
  MCellSwipe: MCells.CellSwipe,
  MIcon,
  MPicker,
  MIndexList,
  MVerificationCode,
  MCircularProgress,
  MMediaDetail
}

const install = function (Vue, opts = {}) {
  Object.keys(components).forEach((key) => {
    Vue.component(key, components[ key ])
  })
  Vue.use(Lazyload, {
    loading: require('@/assets/images/loading-spin.svg'),
    error: require('@/assets/images/imageErr-small.png'),
    attempt: 1
  })

  Vue.prototype.$Toast = MToast.makeToast
  Vue.prototype.Toast = MToast
  Vue.prototype.$Dialog = MDialog.getAnInstance
  Vue.prototype.Dialog = MDialog
}

export default Object.assign(components, {install})
