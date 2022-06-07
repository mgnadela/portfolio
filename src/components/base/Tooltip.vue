<!--
  @USE AS:
  import Tooltip from '@/components/base/Tooltip'
  const Tooltip  = () => import('@/components/base/Tooltip')

  components: {
    Tooltip
  }

  <tooltip :mode="mode">
    <span>
      {{ this.errMsg.confirmPassword }}
    </span>
  </tooltip>
-->

<template>
  <div
    class="tooltip"
    :class="`tooltip--${this.position} is-${this.mode}`"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Tooltip',

  props: {
    position: {
      type: String,
      default: 'right'
    },

    mode: {
      type: [String],
      default: 'page'
    }
  },

  watch: {
    async '$_device.width' () {
      await this.$nextTick()
      this.dimensions(this.parent)
    }
  },

  computed: {
    parent () {
      return this.$el.parentNode
    }
  },

  async mounted () {
    await this.$nextTick()
    this.dimensions(this.parent)
  },

  async beforeDestroy () {
    await this.$nextTick()
    this.$el.removeAttribute('style')
  },

  methods: {
    dimensions (el) {
      if (this.mode === 'page') {
        if (this.$_device.width > 992) {
          let di = el.getBoundingClientRect()
          let width = this.$el.clientWidth

          this.$el.style.top = (di.y + (di.height / 7)) + 'px'

          if (this.position === 'right') {
            this.$el.style.left = (di.left + di.width + 18) + 'px'
          }

          if (this.position === 'left') {
            this.$el.style.left = (di.left - width - 18) + 'px'
          }
        }
      }
    }
  }
}
</script>
