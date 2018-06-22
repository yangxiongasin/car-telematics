/**
 * Created by summer on 2017/10/12.
 */
import Vue from 'vue'
import {camelcaseToHyphen} from '@/utils/assist.js'
import Toast from './toast.vue'

let toastInstance = null

Toast.newInstance = properties => {
  const _props = properties || {}
  let props = ''
  Object.keys(_props).forEach(prop => {
    // 构造出适合vue写法的属性实现初始化组件
    props += ' :' + camelcaseToHyphen(prop) + '=' + prop
  })
  const div = document.createElement('div')
  div.innerHTML = `<toast${props}></toast>`
  document.body.appendChild(div)
  // 获取初始化的组件实例
  const instance = new Vue({
    el: div,
    data: _props,
    components: {Toast}
  }).$children[ 0 ]
  return instance
}
const getAnInstance = (option) => {
  toastInstance = Toast.newInstance(option)
  return toastInstance
}

const successToast = (message) => {
  let _option = {
    message: message || '',
    iconClass: 'weui-icon-success'
  }
  return getAnInstance(_option)
}
const loadingToast = (message) => {
  let _option = {
    message: message || '',
    iconClass: 'weui-loading',
    duration: 0
  }
  return getAnInstance(_option)
}

const errorToast = (message, duration) => {
  let _option = {
    message: message || '',
    iconClass: 'weui-icon-error'
  }
  if (duration !== undefined) {
    _option.duration = duration
  }
  return getAnInstance(_option)
}
const warnToast = (message, duration) => {
  let _option = {
    message: message || '',
    iconClass: 'weui-icon-warn'
  }
  if (duration !== undefined) {
    _option.duration = duration
  }
  return getAnInstance(_option)
}

const destroy = () => {
  // 在销毁时判断是否有对象，有则获取，没有则创建一个空的notification对象
  if (toastInstance) {
    toastInstance.destroy()
    toastInstance = null
  }
}

export default {
  makeToast: getAnInstance,
  success: successToast,
  loading: loadingToast,
  error: errorToast,
  warn: warnToast,
  destroy: destroy
}
