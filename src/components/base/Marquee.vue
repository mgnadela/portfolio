<!--
  @USE AS:
  import Marquee from '@/components/base/Marquee'
  const Marquee  = () => import('@/components/base/Marquee')

  components: { Marquee }

  <marquee>
    <span v-html="marquee.marquee"></span>
  </marquee>
-->

<template>
  <div
    ref="marquee"
    class="marquee"
    @mouseenter="isPaused = !isPaused"
    @mouseleave="isPaused = false"
  >
    <marquee-text
      :duration="50 * listCount"
      :paused="isPaused"
      class="py-2 bg-dark text-white mt-2"
    >
      <div class="marquee__item">
        <span
          v-for="(item, itemKey) in list"
          :key="itemKey"
          :style="`margin-right: ${marqueeDetails.wrap} `"
          v-html="item.marquee.replace(/<\/?p[^>]*>/g, '')"
        >
        </span>
      </div>
    </marquee-text>
  </div>
</template>

<script>
// components
import MarqueeText from 'vue-marquee-text-component'

export default {
  name: 'Marquee',

  props: {
    list: [String, Array, Object],
    default: null
  },

  components: {
    MarqueeText
  },

  data () {
    return {
      isPaused: false,

      marqueeDetails: {
        wrap: null
      }
    }
  },

  computed: {
    listCount () {
      return this.list.length
    }
  },

  async mounted () {
    await this.$nextTick()
    const wrap = this.$refs.marquee

    this.marqueeDetails.wrap = wrap.clientWidth ? wrap.clientWidth + 'px' : null
  }
}
</script>
