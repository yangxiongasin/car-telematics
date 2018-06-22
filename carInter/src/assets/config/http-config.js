/**
* Created by summer on 2017/10/12.
* 此文件用于配置Axios
*/
export default {
  // `baseURL` will be prepended to `url` unless `url` is absolute.
  baseURL: '/openApi/', // 'http://localhost:8088/',
  // `timeout` specifies the number of milliseconds before the request times out.
  // If the request takes longer than `timeout`, the request will be aborted.
  timeout: 5000,
  retry: 1, // 超时失败时重连一次
  retryDelay: 1000,
  withCredentials: true, // default
  // `headers` are custom headers to be sent
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    requestSource: 1 // 表示微信调用
  }
}
