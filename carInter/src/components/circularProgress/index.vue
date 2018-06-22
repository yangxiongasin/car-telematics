<template>
  <div class="loop">
    <svg  version="1.1" xmlns="http://www.w3.org/2000/svg" ref="svg">
      <circle cx="50%" cy="50%" r="50%" :fill="circular_color" />
      <path ref="ring" :fill="fillColor" />
      <circle cx="50%" cy="50%" r="41%" :fill="bg_Color" />
      <!--首先在这里多加一个圆，设置好填充颜色，半径设为环形宽度的一半我这里是（100-82）/2 = 9-->
      <circle ref="cir" :fill="fillColor" />
    </svg>
  </div>
</template>

<script>
  export default {
    name: '',
    data () {
      return {
        ringR_2: 0 // 当前进度
      }
    },
    props: {
      // 初始化进度
      progress: {
        default: 0,
        type: Number
      },
      size: {
        default: 0,
        type: Number
      },
      // 填充的颜色
      fillColor: {
        type: String,
        default: '#ffffff'
      },
      circular_color: {
        type: String,
        default: 'rgba(91,96,173,0.3)'
      },
      // 填充的颜色
      bg_Color: {
        type: String,
        default: '#6392FF'
      }
    },
    computed: {
      ringR () {
        return document.body.clientWidth * this.size / 46.88
      }
    },
    watch: {
      // 如果传入的progress值发生变化，那么重画一下圆
      progress (val) {
        this.drawCircular(this.ringR, val, this.ringR_2)
      }
    },
    methods: {
      // 将svg的宽高设置为size的大小，根据屏幕宽度的大小，计算出path的半径大小1
      init () {
        let vm = this
        let progress = vm.progress
        vm.$refs.svg.style.width = vm.size + 'rem'
        vm.$refs.svg.style.height = vm.size + 'rem'
        vm.ringR_2 = vm.ringR * 0.82
        if (progress >= 99) {
          progress = 99
        }
        vm.drawCircular(vm.ringR, progress, vm.ringR_2)
      },
      drawCircular (ringR, progress, r2) {
        let ring = this.$refs.ring
        let cir = this.$refs.cir
        let cirR = (ringR - r2) / 2
        let cirCenter = cirR + r2
        let x, y, x2, y2
        // 将path平移到我们需要的坐标位置
        ring.setAttribute('transform', 'translate(' + ringR + ',' + ringR + ')')
        // 计算当前的进度对应的角度值
        let degrees = progress * (360 / 100)

        // 计算当前角度对应的弧度值
        let rad = degrees * (Math.PI / 180)

        // 极坐标转换成直角坐标
        x = (Math.sin(rad) * ringR).toFixed(2)
        y = -(Math.cos(rad) * ringR).toFixed(2)

        //      这里是通过计算设置该圆的圆心位置，91这个数值是（100-82）/2 + 82得到的
        // 当转动的角度大于一半的时候的处理
        if (rad > Math.PI / 2) {
          x2 = ringR + (Math.sin(rad) * cirCenter)
          y2 = ringR - (Math.cos(rad) * cirCenter)
        } else {
          // 当转动的角度小于一半的时候的处理
          x2 = (Math.sin(rad) * cirCenter) + ringR
          y2 = ringR - (Math.cos(rad) * cirCenter)
        }
        // 再将圆心位置通过设置属性设置给cx/cy
        cir.setAttribute('cx', x2)
        cir.setAttribute('cy', y2)
        cir.setAttribute('r', cirR)
        // 大于180度时候画大角度弧，小于180度的画小角度弧，(deg > 180) ? 1 : 0
        let lenghty = Number(degrees > 180)

        // path 属性
        let descriptions = ['M', 0, 0, 'v', -ringR, 'A', ringR, ringR, 0, lenghty, 1, x, y, 'z']

        // 给path 设置属性
        ring.setAttribute('d', descriptions.join(' '))
      }
    },
    mounted () {
      this.init()
    }
  }
</script>
