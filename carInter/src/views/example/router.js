/**
 * Created by summer on 2017/10/17.
 */
import Example from './index.vue'
import Toast from './toast.vue'
import Swipe from './swipe.vue'
import LazyLoad from './lazyLoad.vue'
import Button from './button.vue'
import ActionSheet from './actionSheet.vue'
import Form from './form.vue'
import Picker from './picker.vue'
import Icon from './icon.vue'
import scroll from './scroll.vue'
import CellSwipe from './cell-swipe.vue'
import IndexList from './index-list.vue'
export default [
  {
    path: '/example',
    name: 'example',
    component: Example
  },
  {
    path: '/example/toast',
    name: 'example-toast',
    component: Toast
  },
  {
    path: '/example/swipe',
    name: 'example-swipe',
    component: Swipe
  },
  {
    path: '/example/lazyLoad',
    name: 'example-lazyLoad',
    component: LazyLoad
  },
  {
    path: '/example/button',
    name: 'example-button',
    component: Button
  },
  {
    path: '/example/actionSheet',
    name: 'example-actionSheet',
    component: ActionSheet
  },
  {
    path: '/example/form',
    name: 'example-form',
    component: Form
  },
  {
    path: '/example/picker',
    name: 'example-picker',
    component: Picker
  },
  {
    path: '/example/icons',
    name: 'example-icons',
    component: Icon
  },
  {
    path: '/example/scroll',
    name: 'example-scroll',
    component: scroll
  },
  {
    path: '/example/cell-swipe',
    name: 'example-cell-swipe',
    component: CellSwipe
  },
  {
    path: '/example/index-list',
    name: 'example-index-list',
    component: IndexList
  }
]
