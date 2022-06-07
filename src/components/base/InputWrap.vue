<!--
  @USE AS:
  import InputWrap from '@/components/base/InputWrap'
  const InputWrap  = () => import('@/components/base/InputWrap')

  components: { InputWrap }

  <InputWrap
    placeholder="test"
    v-model="data"
  />

  <InputWrap
    placeholder="test"
    v-model="data"
    isAmount
  />

  <InputWrap
    placeholder="test"
    v-model="amount"
    label="asjklj"
    isAmount
    ticker
  />

  <InputWrap
    v-model="test1"
    isAmount
    showArrows
  />
-->

<template>
  <div
    class="input-wrap"
    :class="{
      'has-extra': extra,
      'has-reset': hasReset,
      'input-wrap--edit': dbEdit,
      'is-edit-active': flags.edit,
      'is-read-only': readOnly,
      'is-ticker': ticker,
      'text-right': textRight
    }"
  >
    <template v-if="ticker">
      <div class="input-ticker-lbl">
        {{ label }}
      </div>

      <div
        v-if="currency"
        class="input-ticker-currency"
        :style="`height: ${inputHeight}`"
      >
        {{ currency }}
      </div>
    </template>

    <div
      v-if="dbEdit && !flags.edit"
      class="input-wrap-data"
      @dblclick="flags.edit = 1"
    >
      <span>
        {{ value }}
      </span>

      <i class="ico-edit"></i>
    </div>

    <input
      ref="input"
      v-if="flags.edit || !dbEdit"
      :type="type"
      :value="newValue"
      :readonly="readOnly"
      v-bind="$attrs"
      v-on="$listeners"
      @input="handleInput"
      @keydown.esc="handleEscape"
      @keydown.enter="handleSave"
      @keypress="validate($event, type)"
      @focus:dbEdit="dbEdit"
      @focus="handleEmptyOnFocus('focus')"
      @blur="handleEmptyOnFocus('blur')"
    />

    <span
      v-if="extra"
      class="input--extra"
    >
      {{ extra }}
    </span>

    <i
      v-if="icon"
      :class="`ico-${icon}`"
    >
    </i>

    <div
      v-if="showArrows"
      class="input-arrows"
    >
      <div
        class="ico-triangle-up"
        @click="action('increment')"
      >
      </div>

      <div
        class="ico-triangle-down"
        @click="action('decrement')"
      >
      </div>
    </div>

    <div
      v-if="ticker"
      class="input-ticker-actions"
    >
      <div
        class="input-ticker__item"
        @click="action('increment')"
      >
        +
      </div>

      <div
        class="input-ticker__item"
        @click="action('decrement')"
      >
        -
      </div>
    </div>

    <i
      v-if="dbEdit && flags.edit"
      class="ico-save"
      @click="handleSave"
    >
    </i>
  </div>
</template>

<script>
// library
import _size from 'lodash/size'

// mixins
import { isNumber } from '@/assets/js/common/Helpers'

export default {
  name: 'InputWrap',

  inheritAttrs: false,

  model: {
    prop: 'value',
    event: 'update'
  },

  props: {
    value: {
      type: [String, Number],
      default: null
    },

    type: {
      type: [String],
      default: 'text'
    },

    hasReset: {
      type: Boolean,
      default: false
    },

    icon: {
      type: [String],
      default: null
    },

    extra: {
      type: [String],
      default: null
    },

    dbEdit: {
      type: [Boolean],
      default: false
    },

    isAmount: {
      type: [Boolean, Number],
      default: false
    },

    readOnly: {
      type: Boolean,
      default: false
    },

    textRight: {
      type: Boolean,
      default: false
    },

    ticker: {
      type: [Boolean, String, Number],
      default: false
    },

    currency: {
      type: [String],
      default: '$'
    },

    showArrows: {
      type: [Boolean, String, Number],
      default: false
    },

    label: {
      type: [String],
      default: ''
    },

    max: {
      type: [String, Number],
      default: null
    },

    emptyOnFocus: {
      type: Boolean,
      default: true
    }
  },

  directives: {
    focus: {
      inserted (el, binding) {
        const dbEdit = binding.value

        if (dbEdit) {
          el.focus()
        }
      }
    }
  },

  data () {
    return {
      originalValue: null,
      newValue: null,
      oldValue: null,
      flags: {
        edit: 0
      },
      inputHeight: 0
    }
  },

  watch: {
    value (data) {
      if (data !== '') {
        this.newValue = this.isAmount ? this.formatNumber(data) : data
      } else {
        this.newValue = data
      }
    }
  },

  mounted () {
    this.originalValue = this.value
    this.newValue = this.value
    this.inputHeight = this.handleInputHeight()
  },

  methods: {
    handleEmptyOnFocus (type) {
      if (!this.emptyOnFocus) {
        return
      }

      if (type === 'focus') {
        this.oldValue = this.value
        this.$emit('update', '')
      } else if (type === 'blur') {
        if (this.value !== this.oldValue && this.value !== '') {
          this.oldValue = this.value
        }

        this.$emit('update', this.oldValue)
      }
    },

    validate (event, type) {
      if (this.isAmount) {
        return isNumber(event, type)
      }
    },

    action (type) {
      let value = this.value

      if (type === 'increment') {
        value++
      }

      if (type === 'decrement') {
        value--
      }

      if (value <= 0) {
        value = 0
      }

      if (this.max) {
        if (Number(value) > Number(this.max)) {
          value = Number(this.max)
        }
      }

      this.newValue = this.formatNumber(value)
      this.$emit('update', value)
    },

    formatNumber (data) {
      if (!this.isAmount) {
        return
      }

      const emitValue = (value) => {
        let temp = typeof value === 'string' ? value.replace(/[,]/g, '') : value
        temp = Number(temp)

        this.$emit('update', temp)

        return value
      }

      let number = data
      number = typeof number === 'string' ? number : number.toString()
      number = number.replace(/[,]/g, '')

      let amount = number.toString().split('.')
      amount[0] = amount[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

      number = amount.join('.')

      return emitValue(number)
    },

    handleInput ($event) {
      if (!this.isAmount) {
        return this.$emit('update', $event.target.value)
      }

      let number = $event.target.value
      $event = ($event) || window.event
      number = number.toString()

      if (number[0] === '.') {
        e.target.value = '0.'
        number = '0.'
      }

      /*
       * returns only 1 zero
       */
      if (Number(number[0]) === 0 && Number(number[1]) === 0) {
        $event.target.value = 0
        number = 0
      }

      /*
       * removes 0 if the next number is greater than 0
       */
      if (Number(number[0]) === 0 && Number(number[1]) > 0) {
        let temp = number.split('')

        number = temp.pop()
        $event.target.value = number
      }

      this.newValue = this.formatNumber(number)
    },

    handleInputHeight () {
      const input = this.$refs.input
      let height = 0

      if (input) {
        height = input.clientHeight
      }

      return height ? `${height}px` : height
    },

    handleSave () {
      if (!this.dbEdit) {
        return
      }

      this.originalValue = this.value
      this.flags.edit = 0
    },

    handleEscape () {
      if (!this.dbEdit) {
        return
      }

      const key = event.key

      if (key === 'Escape') {
        this.$emit('update', this.originalValue)
        this.flags.edit = 0
      }
    }
  }
}
</script>
