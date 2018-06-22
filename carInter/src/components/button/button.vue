<template>
  <button :class="btnClass" :type="nativeType" :disabled="disabled"  @click="handleClick">
    <slot name="icon">
      <i v-if="icon" :class="'weui-' + icon"></i>
    </slot>
    <slot></slot>
  </button>
</template>

<script>
  /**
   * @desc 按钮
   * @param {string} [type=default] - 显示类型，接受 'primary', 'default', 'success', 'warn', 'error', 'info'
   * @param {boolean} [disabled=false] - 禁用
   * @param {boolean} [plain=false] - 幽灵按钮
   * @param {string} [size=normal] - 尺寸，接受 normal, small, large
   * @param {string} [native-type] - 原生 type 属性
   * @param {string} [icon] - 图标，提供 more, back，或者自定义的图标（传入不带前缀的图标类名，最后拼接成 .mintui-xxx）
   * @param {slot} - 显示文本
   * @param {slot} [icon] 显示图标
   *
   * @example
   * <m-button size="large" icon="back" type="primary">按钮</m-button>
   */
  const PREFIX_BUTTON_CLASS = 'weui-btn'
  export default {
    name: 'm-button',
    data: function () {  // store data
      return {
      }
    },
    props: { // props data
      disabled: Boolean,
      nativeType: String,
      icon: String,
      size: {
        type: String,
        default: 'normal',
        validator (value) {
          return ['small', 'normal', 'large'].includes(value)
        }
      },
      type: {
        type: String,
        defalut: 'default',
        validator (value) {
          return ['primary', 'default', 'success', 'warn', 'error', 'info'].includes(value)
        }
      },
      plain: Boolean
    },
    computed: {
      typeClass () {
        const type = this.type || 'default'
        if (this.plain) {
          return `plain-${type}`
        }
        return `${type}`
      },
      btnClass () {
        return [
          `${PREFIX_BUTTON_CLASS}`,
          {
            [`${PREFIX_BUTTON_CLASS}_${this.typeClass}`]: !!this.typeClass,
            [`${PREFIX_BUTTON_CLASS}_disabled`]: !!this.disabled,
            [`${PREFIX_BUTTON_CLASS}_mini`]: this.size === 'small',
            [`${PREFIX_BUTTON_CLASS}_block`]: this.size === 'large'
          }
        ]
      }
    },
    methods: { // methods
      handleClick (evt) {
        this.$emit('click', evt)
      }
    }
  }
</script>

