<!--
  @USE AS:
  const Hamburger = () => import('@/components/base/Hamburger')

  components: {
    Hamburger
  }

  data () {
    return {
      showNavigation: false
    }
  }

  <Hamburger
    v-model="showNavigation"
    ref="hamburger"
    :count="3"
    type="line"
  />

  <Hamburger
    ref="hamburger"
    :count="9"
    type="circle"
  />
-->

<template>
  <div
    ref="hamburger"
    class="hamburger"
    :class="{
      'is-active': status
    }"
    @click="handleActive($event)"
  >
    <div
      class="hamburger-inner"
      :class="[
        `hamburger-${type}`,
        `hamburger-${count}`
      ]"
    >
      <span
        v-for="(line, lineKey) in count"
        :key="lineKey"
        class="hamburger__item"
      >
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',

  inheritAttrs: false,

  props: {
    value: {
      type: [Boolean, Number],
      default: false
    },

    type: {
      type: String,
      default: 'circle'
    },

    count: {
      type: Number,
      default: 9
    },

    noClickEvents: {
      type: [Number, Boolean],
      default: false
    }
  },

  data () {
    return {
      status: false
    }
  },

  watch: {
    status (status) {
      const body = document.querySelector('body')

      if (status) {
        body.style.overflow = 'hidden'

        if (!body.classList.contains('hamburger-active')) {
          body.classList.add('hamburger-active')
        }
      } else {
        body.style.overflow = ''

        if (body.classList.contains('hamburger-active')) {
          body.classList.remove('hamburger-active')
        }
      }
    }
  },

  beforeDestroy () {
    this.status = false

    const header = this.$parent.$refs['sidebar-head']
    const nav = document.querySelector('.nav-wrap')
    const headerHeight = `${header.offsetHeight || header.clientHeight || 0}px`

    if (nav) {
      nav.style.top = headerHeight
    }
  },

  methods: {
    handleActive (e) {
      if (this.noClickEvents) {
        return
      }

      const hamburger = this.$refs.hamburger

      if (e.target === hamburger) {
        this.status = !this.status
      }

      this.$emit('input', this.status)

      /*
       * add the header height to
       * nav-wrap to prevent overlapping
       */
      const header = this.$parent.$refs['sidebar-head']
      const nav = document.querySelector('.nav-wrap')
      const headerHeight = `${header.offsetHeight || header.clientHeight || 0}px`

      if (nav) {
        nav.style.top = headerHeight
      }
    }
  }
}
</script>
