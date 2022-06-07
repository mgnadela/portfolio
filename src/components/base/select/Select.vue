<!--
  @Description:
  import '@/components/base/select/Select'

  <select-list
    v-model="test"
  >
    <select-option
      value="kr"
      name="kr"
      :selected="test === 'kr'"
    >
      kr
    </select-option>
  </select-list>
-->

<template>
  <div
    ref="select-list"
    class="select-list"
    :class="[ setClass, {'-with-reset' : withReset } ]"
    @click.stop="setDropdown"
  >
    <span>
      {{ selected.label || initial.label }}
    </span>

    <select
      ref="select"
      v-bind="$attrs"
      @change="setHandleSelected($event)"
    >
      <slot></slot>
    </select>

    <i
      v-if="canReset"
      class="ico-close"
      @click.stop="resetData()"
    >
    </i>

    <i class="ico-arrow-line"></i>
  </div>
</template>

<script>
export default {
  name: 'SelectList',

  inheritAttrs: false,

  props: {
    value: {
      type: [String, Number, Object, Array, Boolean],
      default: ''
    },

    selectType: {
      type: [Boolean, String],
      default: true
    },

    withReset: {
      type: [Boolean, String],
      default: false
    }
  },

  provide () {
    const handleSelected = this.selected
    return { handleSelected }
  },

  data () {
    return {
      selected: {
        value: null,
        label: null,
        index: null
      },

      initial: {
        label: null,
        value: null,
        index: null
      },

      options: {},

      reset: false,
      dropdown: false,
      active: false
    }
  },

  computed: {
    setClass () {
      return this.active
    },

    canReset () {
      let resetData = false

      if (!this.reset) {
        if (this.withReset && this.selectType) {
          if (this.selected.value) {
            if (this.initial.value !== this.selected.value) {
              resetData = true
            }
          }
        }
      }

      return resetData
    }
  },

  watch: {
    async reset () {
      if (this.reset) {
        const select = this.$refs.select

        this.selected.value = this.initial.value
        this.selected.label = this.initial.label
        this.selected.index = this.initial.index
        select.selectedIndex = this.initial.index

        this.$emit('input', this.initial.value)
        this.$emit('reset', true)

        await this.$nextTick()
        this.reset = false
      }
    },

    dropdown () {
      let type = this.selected.name
      const active = ''
      let setClass

      setClass = ''

      if (typeof type === 'undefined') {
        type = ''
      } else {
        type = type.split(' ').join('-')
      }

      // if (!this.dropdown) {
      //   // $('body').removeClass('dp--open')
      //   active = ''
      // } else {
      //   // $('body').addClass('dp--open')
      //   active = 'is-open '
      // }

      if (this.bindClass) {
        setClass = active + type
      } else {
        setClass = active
      }

      this.active = setClass

      return this.active
    },

    async 'config.lang' () {
      await this.$nextTick()

      try {
        if (this.selected) {
          this.selected.value = JSON.parse(JSON.stringify(this.value))
          this.selected.label = JSON.parse(JSON.stringify(this.setLabel().label))
          this.selected.index = JSON.parse(JSON.stringify(this.setLabel().index))
        }

        if (this.initial) {
          this.initial.value = JSON.parse(JSON.stringify(this.value))
          this.initial.label = JSON.parse(JSON.stringify(this.setLabel().label))
          this.initial.index = JSON.parse(JSON.stringify(this.setLabel().index))
        }
      } catch (err) {
        // console.log(err)
      }
    }
  },

  async mounted () {
    await this.$nextTick()

    window.addEventListener('click', e => this.setDropdown(e))

    window.addEventListener('mouseup', e => {
      if (e.target !== this.$refs.select) {
        this.dropdown = false
      }
    })

    this.initialize()

    setTimeout(() => {
      this.initialize()
    }, 0)
  },

  methods: {
    initialize () {
      if (this.$refs.select) {
        try {
          this.initial.value = JSON.parse(JSON.stringify(this.value))
          this.initial.label = JSON.parse(JSON.stringify(this.setLabel().label))
          this.initial.index = JSON.parse(JSON.stringify(this.setLabel().index))
        } catch (err) {
          // console.log(err)
        }

        this.options.label = this.setLabel().label
        this.options.index = this.setLabel().index
      }
    },

    setDropdown (e) {
      if (e.target === this.$refs.select) {
        this.dropdown = !this.dropdown
      } else {
        this.dropdown = false
      }
    },

    setLabel () {
      const select = this.$refs.select
      let label, index

      if (select.options.selectedIndex > -1) {
        label = select.options[this.$refs.select.options.selectedIndex].text
        index = this.$refs.select.options.selectedIndex
      }

      return { label, index }
    },

    resetData () {
      this.reset = true
    },

    setHandleSelected (e) {
      const select = this.$refs.select
      // let selectList = this.$refs['select-list']
      //
      // if (selectList.classList.contains('is-open')) {
      //   selectList.classList.remove('is-open')
      // }

      this.selected.value = select.options[this.$refs.select.options.selectedIndex].value
      this.selected.label = this.setLabel().label
      this.selected.index = this.setLabel().index

      this.$emit('input', this.selected.value)
    }
  }
}
</script>
