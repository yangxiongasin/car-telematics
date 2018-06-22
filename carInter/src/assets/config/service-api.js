/**
 * Created by summer on 2017/10/12.
 * 此文件用来配置接口服务地址
 */
const SERVICE = {
  monitor: {
    getMobileSendSms: '/mobile/sendSms', // 获取手机验证码
    getTakePhoto: '/mobile/command/takePhoto', // 通过平台向指定设备发送拍摄照片指令
    getTakeVideo: '/mobile/command/takeVideo', // 通过平台向指定设备发送拍摄视频指令
    getMobileAds: '/mobile/ads', // 获取广告图片
    getMedia: '/mobile/media', // 图片视频查询接口
    delMedia: '/mobile/delMedia', // 删除图片视频
    takeLac: '/mobile/command/takeLac', // 实时定位接口getOnlineStore
    getRoute: '/mobile/route', // 行车轨迹查询接口
    getDelRoute: '/mobile/delRoute', // 删除行车轨迹查询接口
    routeDetail: '/mobile/routeDetail', // 行车轨迹查询接口详情
    mediaCount: '/mobile/functionClick' // 照片、视频点击查询次数
  },
  service: {
    installList: '/mobile/installList', // 查询用户设备安装列表
    getNavi: '/mobile/command/navi', // 一键接人接口
    savePickUp: 'mobile/savePickUp', // 保存接人记录
    checkPickUp: 'mobile/checkPickUp', // 检查记录
    getBrands: '/mobile/brands', // 车系品牌查询接口(404)
    getAreas: '/mobile/areas', // 省份地市区县查询接口(404)
    getStore: '/mobile/store', // 门店信息查询接口(404)
    getOrderInfo: '/mobile/orderInfo', // 安装服务详情查询接口(404)
    getOnlineStore: '/mobile/onlineStore', // 服务网点查询接口
    install: '/mobile/install', // 申请给指定设备安装服务
    packageFlow: '/mobile/packageFlow', // 流量实时查询接口
    balance: '/mobile/balance', // 余额查询接口
    installService: {
      getListData: 'getListData'
    },
    freeInstall: {
      getStoreData: 'getStoreData'
    },
    installServiceDetails: {
      getISDData: 'getISDData'
    }
  },
  // 用户信息
  userInfo: {
    getImgData: 'mobile/sendSms',
    getChangeBindPhone: '/mobile/changeBindPhone', // 绑定手机号修改接口
    setEquNick: '/mobile/setEquNick', // 绑定手机号修改接口
    equBind: '/mobile/common/equBind',
    changeDefaultEqu: '/mobile/changeDefaultEqu', // 设置默认设备号码
    unBindEqu: '/mobile/unBindEqu', // 设备解绑接口
    bindEqu: '/mobile/bindEqu' // 设备绑定接口
  },
  // 帮助
  helpful: {
    QA: 'mobile/common/qa', // 设备如何绑定公众号
    userGuideBindWx: 'mobile/common/userGuideBindWx', // 设备如何绑定公众号
    userGuideVoice: '/mobile/common/userGuideVoice', // 语音助手语义表
    userGuideWxConnect: '/mobile/common/userGuideWxConnect', // 微信互联功能详解
    feedback: '/mobile/feedback'
  },
  selFacility: {
    getFacilityInfo: 'getFacilityInfo'
  },
  bindPhone: '/mobile/bindPhone', // 绑定手机号接口
  scroll: {
    getScroll: 'getScroll'
  },
  GetPhoneVerificationCode: 'GetPhoneVerificationCode', // 获取手机验证码
  weixin: {
    jsAuth: '/mobile/jsApiConfig'
  },
  equOnlinStatus: '/mobile/equOnlinStatus',
  inputEquPwdFalg: '/mobile/inputEquPwdFalg', // 判断设备是否输入密码接口
  checkEquPwd: '/mobile/checkEquPwd', // 判断设备密码是否正确接口
  getEquBind: '/mobile/common/equBind', // 设备绑定介绍查询接口
  getEquModels: '/mobile/equModels', // 获取设备型号信息接口
  getBindEquList: '/mobile/bindEquList', // 查询用户已经绑定的设备
  getEquModelRoute: '/mobile/equModelRoute', // 传入IMEI号，判断产品型号新旧
  getPwdGuide: '/mobile/getPwdGuide', // 传入IMEI号，判断产品型号新旧
  userInfoo: '/mobile/userInfo', // 获取用户信息
  queryEquMoreInfo: '/mobile/queryEquMoreInfo', // 查询更多设备信息接口
  urlEntryption: 'mobile/urlEntryption', // 在线客服
  newsDetail: '/mobile/newsDetail' // 获取用户信息
}

export default SERVICE
