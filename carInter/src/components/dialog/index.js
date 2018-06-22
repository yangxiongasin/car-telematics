/**
 * Created by summer on 2017/11/9.
 */
/**
 * Created by summer on 2017/10/12.
 */
import Vue from 'vue'
import {camelcaseToHyphen} from '@/utils/assist.js'
import MDialog from './dialog.vue'

let dialogInstance = null

MDialog.newInstance = properties => {
  const _props = properties || {}
  let props = ''
  Object.keys(_props).forEach(prop => {
    // 构造出适合vue写法的属性实现初始化组件
    props += ' :' + camelcaseToHyphen(prop) + '=' + prop
  })
  const div = document.createElement('div')
  div.innerHTML = `<m-dialog${props}></m-dialog>`
  document.body.appendChild(div)
  // 获取初始化的组件实例
  const instance = new Vue({
    el: div,
    data: _props,
    components: {MDialog}
  }).$children[ 0 ]
  return instance
}
export default {
  getAnInstance (option) {
    dialogInstance = MDialog.newInstance(option)
    return dialogInstance
  },
  destroy () {
    // 在销毁时判断是否有对象，有则获取，没有则创建一个空的notification对象
    if (dialogInstance) {
      dialogInstance.destroy()
      dialogInstance = null
    }
  }
}
