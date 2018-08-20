/**
 * Created by summer on 2017/10/12.
 * 此文件封装Axios
 * 配置通用项
 * 统一处理请求错误，进行提示
 */
import axios from 'axios'
import axiosConfig from '../assets/config/http-config'
import Toast from '@/components/toast'
import {getCookie} from './Cookie'

let loading = null
// 设置全局默认值
axios.defaults.timeout = axiosConfig.timeout
axios.defaults.headers = Object.assign(axios.defaults.headers, axiosConfig.headers)
axios.defaults.baseURL = axiosConfig.baseURL
axios.defaults.retry = axiosConfig.retry
axios.defaults.retryDelay = axiosConfig.retryDelay
const checkStatus = (response) => {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  return {
    status: -404,
    msg: '网络异常'
  }
}

const checkCode = (response) => {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (response.status === -404) {
    showError(response.msg)
  }
  if (response.data.resultCode) { // 业务接口错误
    if (response.data.resultCode !== '000000') { // 接口错误
      if (response.data.resultCode === '999998') { // 需要访问密码
        const origin = location.origin
        const basePath = process.env.NODE_ENV === 'production' ? '/weChat/' : '/'
        location.href = `${origin}${basePath}/views/myEqui`
      } else {
        showError(response.data.resultDesc)
        response.data = null
      }
    }
  }
  return response
}
const showError = (errorMsg, alwaysDisplay) => {
  errorMsg = errorMsg || '服务调用出错'
  if (alwaysDisplay === true) {
    Toast.error(errorMsg, 0)
  } else {
    Toast.error(errorMsg)
  }
}

const dealError = (error) => {
  if (error.response) {
    console.log(error.response.headers)
  } else if (error.request) {
    console.log(error.request)
  }
  showError(error.message)
}

const closeLoading = () => {
  if (loading) {
    loading.close()
  }
}
const requestInterceptor = (config) => {
  let _token = getCookie('sessionToken') || '1BCC1E6652C34EC7B89D25FC35F32FCA'
  config.headers['sessionToken'] = _token
  return config
}

const requestError = (error) => {
  dealError(error)
  return Promise.reject(error)
}

const responseInterceptor = (response) => {
  closeLoading()
  response = checkStatus(response)
  response = checkCode(response)
  return response.data
}

const responseError = (error) => {
  closeLoading()
  if (/timeout of (\d*)ms exceeded/i.test(error.message) === true) {
    // error.message += `;url=${error.config.url}`
    timeOutErr(error)
  } else {
    dealError(error)
  }
  return Promise.resolve(error.response)
}

// 超时重发
const timeOutErr = (err) => {
  let config = err.config
  if (!config || !config.retry) return Promise.reject(err)
  config.__retryCount = config.__retryCount || 0
  if (config.__retryCount >= config.retry) {
    err.message = `服务超时,请稍后再试`
    dealError(err)
    return Promise.reject(err)
  }
  config.__retryCount += 1
  var backoff = new Promise(function (resolve) {
    setTimeout(function () {
      resolve()
    }, config.retryDelay || 1)
  })
  return backoff.then(function () {
    config.url = config.url.replace(axios.defaults.baseURL, '')
    return axios(config)
  })
}

const instance = axios.create(axiosConfig)
/**
 * request 拦截器
 */
axios.interceptors.request.use(requestInterceptor, requestError)
instance.interceptors.request.use(requestInterceptor, requestError)

/**
 * response 拦截器
 */
axios.interceptors.response.use(responseInterceptor, responseError)
instance.interceptors.response.use(responseInterceptor, responseError)

const install = function (Vue, opts) {
  Vue.prototype.$http = instance
  Vue.prototype.http = axios
  Vue.$http = instance
  Vue.http = axios
}

export default Object.assign(axios, {install})
