<!--
  @USE AS:
  import Checkbox from '@/components/base/Checkbox'

  components: { Checkbox }

  <checkbox>
    <input type="checkbox" />
  </checkbox>

  <checkbox
    type="toggle"
    toggle-a="show"
    toggle-b="hidden"
    inverted
    @click.stop="test"
  >
    <input
      v-model="item.isHide"
      type="checkbox"
    />
  </checkbox>

<Checkbox
  v-model="modal.modifyGame.data.status"
  type="[toggle|checkbox]"
  toggle-a="active"
  toggle-b="inactive"
  inverted
/>
-->

<template>
  <label
    :class="setType"
    @click.stop
  >
    <div
      v-if="type === 'checkbox'"
      class="check-inner"
    >
      <slot>
        <input
          v-model="componentValue"
          type="checkbox"
          @click="handleInputChange"
        >
      </slot>

      <span
        class="check-box"
        aria-hidden="true"
      >
      </span>

      <span
        v-if="label"
        class="check-lbl"
      >
        {{ label }}
      </span>
    </div>

    <div
      v-if="type === 'toggle'"
      class="toggle-inner"
    >
      <slot>
        <input
          v-model="componentValue"
          type="checkbox"
          @click="handleInputChange"
        >
      </slot>

      <div
        class="check-box"
        aria-hidden="true"
      >
        <div class="toggle-a">
          <span>{{ toggleA }}</span>
        </div>

        <div
          v-if="!removeCircle"
          class="toggle-circle"
        >
        </div>

        <div class="toggle-b">
          <span>{{ toggleB }}</span>
        </div>
      </div>
    </div>
  </label>
</template>

<script>
export default {
  name: 'Checkbox',

  props: {
    label: {
      type: [String],
      default: ''
    },

    type: {
      type: [String],
      default: 'checkbox'
    },

    toggleA: {
      type: [String, Number, Boolean],
      default: null
    },

    toggleB: {
      type: [String, Number, Boolean],
      default: null
    },

    removeCircle: {
      type: [String, Boolean],
      default: false
    },

    inverted: {
      type: Boolean,
      default: false
    },

    value: {
      type: [String, Boolean, Number, Array],
      default: false
    }
  },

  data () {
    return {
      componentValue: null
    }
  },

  computed: {
    setType () {
      const classes = []

      if (this.type === 'checkbox') {
        classes.push('check-wrap')
      }

      if (this.type === 'toggle') {
        classes.push(this.removeCircle ? 'toggle-wrap is-disabled' : 'toggle-wrap')
      }

      if (this.inverted) {
        classes.push('toggle--inverted')
      }

      return classes.join(' ')
    }
  },

  created () {
    this.componentValue = JSON.parse(JSON.stringify(this.value))
  },

  methods: {
    async handleInputChange (e) {
      await this.$nextTick()

      const value = !this.componentValue

      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
</script>
