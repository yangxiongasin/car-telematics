/**
 * Created by summer on 2017/11/9.
 */
// 获取cookie、
export function getCookie (key) {
  const cookie = document.cookie
  let reg = new RegExp(`(^| )${key}=([^;]*)(;|$)`)
  let arr = cookie.match(reg)
  if (arr) {
    return (arr[2])
  } else {
    return ''
  }
}

// 设置cookie,增加到vue实例方便全局调用
export function setCookie (cName, value, expiredays) {
  let exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = cName + '=' + escape(value) + ((expiredays == null) ? '' : 'expires=' + exdate.toGMTString())
}

// 删除cookie
export function delCookie (name) {
  let exp = new Date()
  exp.setTime(exp.getTime() - 1)
  let cval = getCookie(name)
  if (cval != null) {
    document.cookie = name + '=' + cval + 'expires=' + exp.toGMTString()
  }
}
