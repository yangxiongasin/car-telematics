/**
 * Created by summer on 2017/10/12.
 */
import Mock from 'mockjs'
import config from '../config/http-config'
import service from '../config/service-api'

const Random = Mock.Random
Random.name()
Random.color()

function getUrl (url) {
  return `${config.baseURL}${service.userInfo.getUserInfo}`
}
Mock.mock(getUrl(service.userInfo.getUserInfo), {
  'name': '@name',
  'age|1-100': 100,
  'color': '@color'
})
Mock.mock('http://localhost:8080/getConfigParam', {
  data: {
    debug: true,
    appId: 'wx51d791df89696bfa',
    nonceStr: 'm3gfa8kj8p1b04s',
    timestamp: '1509351134',
    signature: '68b105c633d94c1ea232da5a6cf76b42c2875c43'
  }
})

function getFacilityUrl (url) {
  return `${config.baseURL}${service.selFacility.getFacilityInfo}`
}
Mock.mock(getFacilityUrl(service.selFacility.getFacilityInfo), {
  'array|6': [
    {
      'faci_id|1000-9999': 1,
      'name|1': [
        'V121',
        'V122',
        'V123'
      ],
      'src|1': [
        '../../../src/assets/images/shebei1.png',
        '../../../src/assets/images/shebei2.png',
        '../../../src/assets/images/shebei3.png'
      ]
    }
  ]
})

function getScroll (url) {
  return `${config.baseURL}${service.scroll.getScroll}`
}
Mock.mock(getScroll(service.scroll.getScroll), {
  'data|99': [
    {
      'name|1': [
        '这是一个demo',
        '用来测试的demo',
        '没什么卵用'
      ]
    }
  ],
  'math': 60
})

function getStoreData (url) {
  return `${config.baseURL}${service.service.freeInstall.getStoreData}`
}
Mock.mock(getStoreData(service.service.freeInstall.getStoreData), {
  'data|4': [
    {
      'dotCode|1': [
        '卡拉力授权店1111', '卡拉力授权店1111', '卡拉力授权店3333'
      ],
      'dotName|1': [
        '同道乐授权店111',
        '同道乐授权店222',
        '同道乐授权店333'
      ],
      'storeId|1': [
        '10001', '20002', '30003', '40004'
      ],
      'dotAddr|1': [
        '北京市北京市朝阳区王四营乡五方天雅汽配城C8-57-63',
        '北京市北京市朝阳区王四营乡五方天雅汽配城C8-57-63',
        '北京市北京市朝阳区王四营乡五方天雅汽配城C8-57-63',
        '北京市北京市朝阳区王四营乡五方天雅汽配城C8-57-63'
      ]
    }
  ]
})

function getISDData (url) {
  return `${config.baseURL}${service.service.installServiceDetails.getISDData}`
}
Mock.mock(getISDData(service.service.installServiceDetails.getISDData), {
  'data': {
    'name|1': [
      '卡拉力授权店1111', '卡拉力授权店1111', '卡拉力授权店3333'
    ],
    'phoneNum|1': [
      '18507317777', '18507318888', '18507319999'
    ],
    'carType|1': [
      '比亚迪e5', '比亚迪e4', '比亚迪e3'
    ],
    'address|1': [
      '北京市北京市海淀区知春路7号',
      '北京市北京市海淀区知春路7777号',
      '北京市北京市海淀区知春路1111号'
    ],
    'selStore|1': [
      '中国恒通汽车装饰美容111', '中国恒通汽车装饰美容222', '中国恒通汽车装饰美容333'
    ],
    'orderNum|1': [
      'C179322431111', 'C179322432222', 'C179322433333'
    ],
    'orderStatus|1': [
      '已接收', '已安装', '已拒绝'
    ],
    'installDian|1': [
      '中国恒通汽车装饰美容111', '中国恒通汽车装饰美容222', '中国恒通汽车装饰美容333'
    ],
    'installAddr|1': [
      '北京市北京市海淀区清河小营东方美都汽配美容装饰区1号',
      '北京市北京市海淀区清河小营东方美都汽配美容装饰区2号',
      '北京市北京市海淀区清河小营东方美都汽配美容装饰区3号'
    ],
    'storeNum|1': [
      '136011897111',
      '136011897222',
      '136011897333'
    ],
    'yanzNum|1': [
      '111111', '222222', '333333'
    ]
  }
})

function getMobileSendSms (url) {
  return `${config.baseURL}${service.mobileSendSms}`
}

Mock.mock(getMobileSendSms(service.mobileSendSms), {
  'resultCode': '000000',
  'resultDesc': '请求不成功',
  'data': '{}'
})

function GetPhoneVerificationCode (url) {
  return `${config.baseURL}${service.GetPhoneVerificationCode}`
}
Mock.mock(GetPhoneVerificationCode(service.GetPhoneVerificationCode), {
  'resultCode': '000000',
  'resultDesc': '数据请求成功'
})
