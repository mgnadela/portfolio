<!--
  @USE AS:
  import Accordion from '@/components/base/Accordion'
  const Accordion  = () => import('@/components/base/Accordion')

  components: { Accordion }

  <accordion>
    <template #title>
      Lorem ipsum
    </template>

    <template #body>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
  </accordion>
-->

<template>
  <div
    ref="accordion"
    class="accordion"
    :class="toggle"
    @click="toggleAccordion"
  >
    <div
      ref="accordion-title"
      class="accordion__head"
    >
      <div class="accordion-title">
        <slot name="title"></slot>
      </div>

      <div
        v-if="hasActions"
        class="accordion-action"
      >
        <slot name="action"></slot>
      </div>

      <div class="accordion-arr">
        <i class="ico-arrow-full-down"></i>
      </div>
    </div>

    <transition name="expand">
      <div
        v-show="active"
        ref="accordionBody"
        class="accordion__body"
      >
        <slot name="body"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Accordion',

  props: {
    title: {
      type: String,
      default: ''
    },

    isActive: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      active: false,
      toggle: ''
    }
  },

  computed: {
    hasActions () {
      return this.$slots.action
    },
  },

  watch: {
    active () {
      let toggle

      if (this.active === false) {
        toggle = ''
      } else {
        toggle = 'is-open'
      }

      this.toggle = toggle
    }
  },

  async mounted () {
    await this.$nextTick()
    this.active = this.isActive
  },

  methods: {
    toggleAccordion (e) {
      if (e.target === this.$refs['accordion-title']) {
        this.active = !this.active
      }

      this.$emit('activate', this.active)
    }
  }
}
</script>
