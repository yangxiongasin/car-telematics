/**
 * Created by summer on 2017/10/9.
 */
import examples from '@/views/example/router.js'

export default [
  {
    path: '/hello',
    name: 'Hello',
    meta: {isSinger: true},
    component: () => import('@/views/HelloWorld')
  },
  {
    path: '*',
    component: () => import('@/views/404')
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import('@/views/error')
  },
  {
    path: '/',
    component: () => import('@/views/index')
  },
  {
    path: '/initPage',
    component: () => import('@/views/index')
  },
  ...examples,
  {
    path: '/views/selFacility',
    name: 'selFacility',
    meta: {title: '选择设备'},
    component: () => import('@/views/selFacility/index')
  },
  {
    path: '/views/monitoring/boundEquiries',
    name: 'boundEquiries',
    meta: {level: 2},
    component: () => import('@/views/monitoring/boundEquiries')
  },
  {
    path: '/views/bindingPhone',
    name: 'bindingPhone',
    meta: {title: '绑定手机'},
    component: () => import('@/views/bindingPhone/index')
  },
  {
    path: '/views/monitoring',
    name: 'monitoring',
    component: () => import('@/views/monitoring/index'),
    children: [
      {
        path: '/views/monitoring/monitor',
        name: 'monitorCar',
        meta: {level: 1},
        component: () => import('@/views/monitoring/monitor/index')
      },
      {
        path: '/views/monitoring/service',
        name: 'serviceCar',
        meta: {level: 1},
        component: () => import('@/views/monitoring/service/index')
      },
      {
        path: '/views/monitoring/helpful',
        name: 'helpfulCar',
        meta: {level: 1, isSinger: true, title: '帮助'},
        component: () => import('@/views/monitoring/helpful/index')
      },
      {
        path: '/views/monitoring/userInfo',
        name: 'userinfoCar',
        meta: {level: 1},
        component: () => import('@/views/monitoring/userInfo/index')
      },

      // 监控页面
      {
        path: '/views/monitoring/monitor/photo/photoGallery',
        name: 'photoGallery',
        meta: {level: 3, requiresAuth: true, title: '照片库'},
        component: () => import('@/views/monitoring/monitor/photoGallery/index')
      },
      {
        path: '/views/monitoring/monitor/video/videoGallery',
        name: 'videoGallery',
        meta: {level: 3, requiresAuth: true, title: '视频库'},
        component: () => import('@/views/monitoring/monitor/videoGallery/index')
      },
      {
        path: '/views/monitoring/monitor/video/IllegallyGallery',
        name: 'IllegallyGallery',
        meta: {level: 3, requiresAuth: true, title: '违章视频库'},
        component: () => import('@/views/monitoring/monitor/IllegallyGallery/index')
      },
      {
        path: '/views/monitoring/monitor/wheelpath',
        name: 'wheelpath',
        meta: {level: 2, requiresAuth: true, title: '行车轨迹'},
        component: () => import('@/views/monitoring/monitor/wheelpath/index')
      },
      {
        path: '/views/monitoring/monitor/drivingBehaviorDetails',
        name: 'drivingBehaviorDetails',
        meta: {level: 3, title: '驾驶得分详情'},
        component: () => import('@/views/monitoring/monitor/drivingBehaviorDetails/index')
      },
      // 服务页面
      {
        path: '/views/monitoring/service/InstallationServices',
        name: 'InstallationServices',
        meta: {level: 2, title: '安装服务'},
        component: () => import('@/views/monitoring/service/InstallationServices/index')
      },
      {
        path: '/views/monitoring/service/InstallationServices/freeInstall',
        name: 'freeInstall',
        meta: {level: 3, title: '免费安装'},
        component: () => import('@/views/monitoring/service/InstallationServices/freeInstall/index')
      },
      {
        path: '/views/monitoring/service/InstallationServices/installServiceDetails',
        name: 'installServiceDetails',
        meta: {level: 3, title: '安装服务详情'},
        component: () => import('@/views/monitoring/service/InstallationServices/installServiceDetails/index')
      },
      {
        path: '/views/monitoring/service/trafficQuery',
        name: 'trafficQuery',
        meta: {level: 2, requiresAuth: true, title: '流量查询'},
        component: () => import('@/views/monitoring/service/trafficQuery/index')
      },
      {
        path: '/views/monitoring/service/serviceOutlets',
        name: 'serviceOutlets',
        meta: {level: 2, title: '服务网点'},
        component: () => import('@/views/monitoring/service/serviceOutlets/index')
      },
      {
        path: '/views/monitoring/service/serviceOutlets/outletOnlineStore',
        name: 'outletOnlineStore',
        meta: {level: 3, title: '服务网点列表'},
        component: () => import('@/views/monitoring/service/serviceOutlets/outletOnlineStore')
      },
      {
        path: '/views/monitoring/service/serviceOutlets/outerOnlineStoreMap',
        name: 'outerOnlineStoreMap',
        meta: {level: 3, title: '服务网点地图'},
        component: () => import('@/views/monitoring/service/serviceOutlets/outerOnlineStoreMap')
      },
      // 帮助页面usehelpful
      {
        path: '/views/monitoring/helpful/userHelpful',
        name: 'userHelpful',
        meta: {level: 2, isSinger: true, title: '使用指南'},
        component: () => import('@/views/monitoring/helpful/userHelpful/index')
      },
      {
        path: '/views/monitoring/helpful/useHelpful/feedBack',
        name: 'feedBack',
        meta: {level: 3, isSinger: true, title: '意见反馈'},
        component: () => import('@/views/monitoring/helpful/userHelpful/feedBack')
      },
      {
        path: '/views/monitoring/helpful/userHelpful/details',
        name: 'userDetail',
        meta: {level: 3, isSinger: true, title: '微信互联功能详解'},
        component: () => import('@/views/monitoring/helpful/userHelpful/details/index')
      },
      // 用户页面 ChangeDeviceNickname
      {
        path: '/views/monitoring/userInfo/ChangeDeviceNickname',
        name: 'ChangeDeviceNickname',
        meta: {level: 3, title: '设备昵称'},
        component: () => import('@/views/monitoring/userInfo/ChangeDeviceNickname')
      },
      {
        path: '/views/monitoring/userInfo/changePhoneNum',
        name: 'changePhoneNum',
        meta: {level: 2, title: '更改手机号'},
        component: () => import('@/views/monitoring/userInfo/changePhoneNum')
      },
      {
        path: '/views/monitoring/userInfo/myEquipment',
        name: 'myEquipment',
        meta: {level: 2, title: '我的设备'},
        component: () => import('@/views/monitoring/userInfo/myEquipment')
      },
      {
        path: '/views/monitoring/userInfo/currentEquipment',
        name: 'currentEquipment',
        meta: {level: 2, title: '设备列表'},
        component: () => import('@/views/monitoring/userInfo/currentEquipment')
      }
    ]
  },
  {
    path: '/views/monitoring/monitor/photo/mediaReal',
    name: 'mediaReal',
    meta: {title: '111'},
    component: () => import('@/views/monitoring/monitor/mediaReal/index'),
    children: [
      {
        path: '/views/monitoring/monitor/mediaReal/realPhoto',
        name: 'realPhoto',
        meta: {level: 2, requiresAuth: true},
        component: () => import('@/views/monitoring/monitor/mediaReal/realPhoto/index')
      },
      {
        path: '/views/monitoring/monitor/mediaReal/realVideo',
        name: 'realVideo',
        meta: {level: 2, requiresAuth: true},
        component: () => import('@/views/monitoring/monitor/mediaReal/realVideo/index')
      }
    ]
  },
  {
    path: '/views/monitoring/service/keyedPeople',
    name: 'keyedPeople',
    meta: {level: 2, requiresAuth: true, wxShare: true, title: '一键接人'},
    component: () => import('@/views/monitoring/service/keyedPeople/index')
  },
  {
    path: '/views/monitoring/service/pickFriend',
    name: 'pickFriend',
    meta: {isSinger: true, isCheckPassword: false},
    component: () => import('@/views/monitoring/service/keyedPeople/pickFriend')
  },
  {
    path: '/views/monitoring/alarmInfo',
    name: 'alarmInfo',
    meta: {isSinger: true, isCheckPassword: false},
    component: () => import('@/views/monitoring/alarmInfo/index')
  },
  {
    path: '/views/myEqui',
    name: 'myEqui',
    meta: {requiresAuth: true},
    component: () => import('@/views/myEqui/index')
  },
  {
    path: '/views/myEqui/getPassword',
    name: 'getPassword',
    meta: {isSinger: true},
    component: () => import('@/views/myEqui/getPassword')
  },
  {
    path: '/views/monitoring/monitor/realLocation',
    name: 'realLocation',
    meta: {level: 2, requiresAuth: true, title: '实时定位', isCheckPassword: false},
    component: () => import('@/views/monitoring/monitor/realLocation/index')
  },
  {
    path: '/views/monitoring/monitor/wheelpath/pathMap',
    name: 'pathMap',
    meta: {level: 3, title: '轨迹地图', isCheckPassword: false},
    component: () => import('@/views/monitoring/monitor/wheelpath/pathMap')
  },
  {
    path: '/views/monitoring/monitor/imageDetail',
    name: 'imageDetail',
    meta: {isSinger: true, title: '查看', isCheckPassword: false},
    component: () => import('@/views/monitoring/monitor/imageDetail/index')
  },
  {
    path: '/views/monitoring/monitor/video/videoDetail',
    name: 'videoDetail',
    meta: {level: 4, isSinger: true, title: '查看', isCheckPassword: false},
    component: () => import('@/views/monitoring/monitor/videoDetail/index')
  },
  {
    path: '/views/monitoring/monitor/video/IllegallyDetail',
    name: 'IllegallyDetail',
    meta: {level: 4, title: '查看'},
    component: () => import('@/views/monitoring/monitor/IllegallyDetail/index')
  },
  {
    path: '/views/monitoring/monitor/video/IllegallyReport',
    name: 'IllegallyReport',
    meta: {level: 4, title: '信息填写'},
    component: () => import('@/views/monitoring/monitor/IllegallyDetail/reportIllegal')
  }
]
