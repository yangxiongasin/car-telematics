// const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g
const SPECIAL_CHARS_REGEXP = /([:\-_]+(.))/g
const MOZ_HACK_REGEXP = /^moz([A-Z])/
function camelCase (name) {
  return name.replace(SPECIAL_CHARS_REGEXP,
    function (_, separator, letter, offset) {
      return offset ? letter.toUpperCase() : letter
    }).replace(MOZ_HACK_REGEXP, 'Moz$1')
}

export function camelcaseToHyphen (str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

// getStyle
export function getStyle (element, styleName) {
  if (!element || !styleName) return null
  styleName = camelCase(styleName)
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    const computed = document.defaultView.getComputedStyle(element, '')
    return element.style[ styleName ] || computed
      ? computed[ styleName ]
      : null
  } catch (e) {
    return element.style[ styleName ]
  }
}
// firstUpperCase
function firstUpperCase (str) {
  return str.toString()[ 0 ].toUpperCase() + str.toString().slice(1)
}
export { firstUpperCase }

function typeOf (obj) {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[ toString.call(obj) ]
}
// deepCopy
function deepCopy (data) {
  const t = typeOf(data)
  let o
  if (t === 'array') {
    o = []
  } else if (t === 'object') {
    o = {}
  } else {
    return data
  }
  if (t === 'array') {
    for (let i = 0; i < data.length; i++) {
      o.push(deepCopy(data[ i ]))
    }
  } else if (t === 'object') {
    for (let i in data) {
      o[ i ] = deepCopy(data[ i ])
    }
  }
  return o
}
export { deepCopy }

// Find components upward
function findComponentUpward (context, componentName, componentNames) {
  if (typeof componentName === 'string') {
    componentNames = [ componentName ]
  } else {
    componentNames = componentName
  }
  let parent = context.$parent
  let name = parent.$options.name
  while (parent && (!name || componentNames.indexOf(name) < 0)) {
    parent = parent.$parent
    if (parent) name = parent.$options.name
  }
  return parent
}
export { findComponentUpward }
// Find component downward
function findComponentDownward (context, componentName) {
  const childrens = context.$children
  let children = null
  if (childrens.length) {
    childrens.forEach(child => {
      const name = child.$options.name
      if (name === componentName) {
        children = child
      }
    })
    for (let i = 0; i < childrens.length; i++) {
      const child = childrens[ i ]
      const name = child.$options.name
      if (name === componentName) {
        children = child
        break
      } else {
        children = findComponentDownward(child, componentName)
        if (children) break
      }
    }
  }
  return children
}
export { findComponentDownward }
// Find components downward
function findComponentsDownward (context, componentName, components = []) {
  const childrens = context.$children
  if (childrens.length) {
    childrens.forEach(child => {
      const name = child.$options.name
      const childs = child.$children
      if (name === componentName) components.push(child)
      if (childs.length) {
        const findChilds = findComponentsDownward(child, componentName,
          components)
        if (findChilds) components.concat(findChilds)
      }
    })
  }
  return components
}
export { findComponentsDownward }

/* istanbul ignore next */
const trim = function (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

/* istanbul ignore next */
export function hasClass (el, cls) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

/* istanbul ignore next */
export function addClass (el, cls) {
  if (!el) return
  var curClass = el.className
  var classes = (cls || '').split(' ')

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName
      }
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

/* istanbul ignore next */
export function removeClass (el, cls) {
  if (!el || !cls) return
  var classes = cls.split(' ')
  var curClass = ' ' + el.className + ' '

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ')
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}

/* istanbul ignore next */
export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/* istanbul ignore next */
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

/* istanbul ignore next */
export const once = function (el, event, fn) {
  var listener = function () {
    if (fn) {
      fn.apply(this, arguments)
    }
    off(el, event, listener)
  }
  on(el, event, listener)
}

export function getElement (expr) {
  return (typeof expr === 'string') ? document.querySelector(expr) : expr
}

export function getComputedStyle (el, key) {
  var computedStyle = window.getComputedStyle(el)
  return computedStyle[key] || ''
}

export function getDeviceHight () {
  return window.innerHeight
}

export function getPlatform () {
  let ua = navigator.userAgent
  if (ua.indexOf('Android') > -1) {
    return 'android'
  } else if (/iPhone|iPad|iPod|iOS/.test(ua)) {
    return 'ios'
  } else if (/Windows Phone|WPDesktop/.test(ua)) {
    return 'winphone'
  } else {
    return 'pc'
  }
}

export function isWX () {
  let ua = navigator.userAgent.toLowerCase()
  let result = ua.match(/MicroMessenger/i)
  if (result && result[0] === 'micromessenger') {
    return true
  } else {
    return false
  }
}

export function createTimestamp () {
  return parseInt(new Date().getTime() / 1000) + ''
}

const zeroize = (value, length) => {
  if (!length) length = 2
  value += ''
  let zeros = ''
  for (let i = 0; i < (length - value.length); i++) {
    zeros += '0'
  }
  return zeros + value
}

export function getChangeDate (time) {
  if (time === undefined) {
    time = new Date().getTime()
  }
  let date = new Date(time)
  let year = date.getFullYear()
  let mouth = zeroize(date.getMonth() + 1)
  let day = zeroize(date.getDate())
  let hh = zeroize(date.getHours())
  let mm = zeroize(date.getMinutes())
  let ss = zeroize(date.getSeconds())
  date = year + '-' + mouth + '-' + day + ' ' + hh + ':' + mm + ':' + ss
  return date
}

export function getToday (time) {
  if (time === undefined) {
    time = new Date().getTime()
  }
  let date = new Date(time)
  let year = date.getFullYear()
  let mouth = zeroize(date.getMonth() + 1)
  let day = zeroize(date.getDate())
  date = year + '-' + mouth + '-' + day
  return date
}
