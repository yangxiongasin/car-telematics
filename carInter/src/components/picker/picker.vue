<template>
  <div v-show="ishow">
    <transition leave-active-class="weui-animate-fade-out">
      <div class="weui-mask weui-animate-fade-in" v-show="currentValue" @click="currentValue=false"></div>
    </transition>
    <transition leave-active-class="weui-animate-slide-down"
                @after-leave="ishow=false">
      <div class="weui-picker weui-animate-slide-up" v-show="currentValue">
        <div class="weui-picker__hd">
          <a class="weui-picker__action" @click="cancel" v-text="cancelText"></a>
          <a class="weui-picker__action" @click="confirm" v-text="confirmText"></a>
        </div>
        <div class="weui-picker__bd">
          <picker-slot  :is-show="currentValue" v-for="(slot, index) in items" :key="index"
                        :values="slot.values || []"
                        :valueKey="slot.valueKey"
                        :default-index="slot.defaultIndex"
                        :bind-index="index"></picker-slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import PickerSlot from './picker-slot.vue'
  export default {
    name: 'MPicker',
    components: {
      PickerSlot
    },
    data: function () {  // store data
      return {
        ishow: this.value,
        currentValue: this.value,
        values: this.items || []
      }
    },
    props: { // props data
      confirmText: {
        type: String,
        default: '确定'
      },
      cancelText: {
        type: String,
        default: '取消'
      },
      items: {
        type: Array,
        required: true
      },
      valueKey: String,
      value: Boolean
    },
    methods: { // methods
      slotValueChange (value, index) {
        // index = index || 0
        this.values[index] = value
        this.$emit('change', value, index)
      },
      cancel () {
        this.$emit('cancel', this.values)
        this.currentValue = false
      },
      confirm () {
        this.$emit('confirm', this.values)
        this.currentValue = false
      },
      setValues (items) {
        let values = []
        for (let i = 0; i < items.length; i++) {
          let slot = items[i]
          values[i] = (slot.values || [])[slot.defaultIndex || 0] || ''
        }
        this.values = values
      }
    },
    watch: {
      value (val) {
        this.currentValue = val
        if (val) {
          this.ishow = true
        }
      },
      currentValue (val) {
        this.$emit('input', val)
      }
    },
    created () {
      this.setValues(this.items)
    }
  }
</script>

