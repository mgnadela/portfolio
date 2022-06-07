<!--
  @USE AS:
  import BlinkText from '@/components/base/BlinkText'
  const BlinkText  = () => import('@/components/base/BlinkText')

  components: { BlinkText }

  <blink-text
    tag="span"
    val="data"
  />
-->

<template lang="html">
  <component
    :class="[
      test,
      { 'is-change is-arrow-anim' : valChanged }
    ]"
    :is="tag"
  >
    {{ val }}

    <template v-if="showArrow">
      <i
        v-if="icon && !valChanged"
        :class="[
          icon,
          `${icon === 'ico-over-under' ? `is-${odd && odd.N.toLowerCase()}` : ''}`
        ]"
      >
      </i>

      <i
        v-if="valChanged && animationDelay"
        class="ico-arrow-anim"
        :class="arrowDirection"
      >
      </i>
    </template>
  </component>
</template>

<script>
export default {
  name: 'BlinkText',

  props: {
    val: [Number, String, Array, Object, Number],
    tag: {
      type: String,
      default: 'span'
    },

    isTest: {
      type: Boolean,
      default: false
    },

    showArrow: {
      type: Boolean,
      default: false
    },

    icon: {
      type: String,
      default: null
    },

    odd: {
      type: [Number, String, Array, Object, Number],
      default: null
    },

    isMiddle: {
      type: Boolean,
      default: false
    },

    animationDelay: {
      type: [Number, String],
      default: 2
    }
  },

  data () {
    return {
      valChanged: false,
      originalValue: null,
      oldValue: null,
      arrowDirection: null,
      test: 'no-change'
    }
  },

  computed: {
    arrowClass () {
      if (this.valChanged) {
        return this.arrowDirection
      }
    }
  },

  watch: {
    animationDelay (data) {
      this.animationDelay(Number(data))
    },

    val (newVal, oldVal) {
      this.oldValue = oldVal

      if (oldVal === '-' || oldVal === 'undefined' || oldVal === undefined || oldVal === 0) {
        return
      }

      if (newVal !== oldVal) {
        this.valChanged = true

        if (newVal > oldVal) {
          this.arrowDirection = 'is-up'

          if (this.isTest) {
            this.test = 'is-higher'
          }
        } else {
          this.arrowDirection = 'is-down'

          if (this.isTest) {
            this.test = 'is-lower'
          }
        }

        const delay = this.animationDelay ? this.animationDelay * 1000 : 0

        setTimeout(() => {
          this.valChanged = false
        }, delay)

        if (this.isTest) {
          setTimeout(() => {
            this.test = null
          }, 10000)
        }
      } else {
        this.valChanged = false
      }
    }
  },

  created () {
    this.originalValue = this.val
  }
}
</script>
