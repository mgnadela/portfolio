<!--
  @USE AS:
  import InputSuggestion from '@/components/base/InputSuggestion'

  components: {
    InputSuggestion
  },

  data: {
    return () {
      dataStatusCodes: {
        loading: false
      }
    }
  },

  methods: {
    async inputSuggestionSearchCodes (data) {
      const q = data && data.q ? data.q : null
      const type = data && data.type ? data.type : null

      const params = {
        rows: 30,
        sort_by: 'id', // eslint-disable-line camelcase
        sort: 'desc'
      }

      if (q) {
        params.filter_by = 'code' // eslint-disable-line camelcase
        params.q = q
        params.sort = 'asc'
      }

      if (type) {
        this.dataStatusCodes.loading = true
      }

      await this.getCodes({
        status: 'active',
        params
      })

      if (type) {
        this.dataStatusCodes.loading = false
      }
    }
  }

  <InputSuggestion
    v-model="item.code_id"
    display-name="name" <!- i.e: codes.name -> name ->
    display-value="id" <!- i.e: codes.id -> id ->
    return-object
    :list="codeList"
    :is-loading="dataStatusCodes.loading"
    @search="inputSuggestionSearchCodes"
  />
-->

<template>
  <div
    ref="input-suggestion"
    class="input-suggestion"
    :class="{ 'has-reset' : hasReset }"
    :data-placement="placement"
    @keydown.up="handleActions('up')"
    @keydown.down="handleActions('down')"
    @keydown.enter="handleActions('enter')"
    @keydown.tab="showList = false"
  >
    <InputWrap
      ref="input-suggestion-input"
      v-model="searchVal"
      v-bind="$attrs"
      v-on="$listeners"
      @focus="initialSearch"
      @input="searchData"
    />

    <i
      v-if="searchVal && !isLoading"
      class="ico-close"
      @click="clearValue"
    >
    </i>

    <div
      v-if="isLoading"
      class="loader-wrap"
    >
    </div>

    <ul
      v-show="showList && placement && list.length > 0"
      ref="input-suggestion-list"
      class="input-suggestion-list"
    >
      <li
        v-for="(item, i) in list"
        :key="i"
        class="input-suggestion-list__item"
        :class="{
          'is-active': i === config.arrowPos
        }"
        @click="selectItem(item)"
      >
        <div class="input-suggestion-list__inner">
          <template v-for="(displayItem, displayItemKey) in displayNameArr">
            <template v-if="!_isEmpty(displayNameExtra)">
              <span
                v-if="item[displayItem]"
                v-html="modifyText({
                  value: item[displayItem],
                  extra: displayNameExtra[displayItem]
                })"
              >
              </span>
            </template>

            <template v-else>
              {{ item[displayItem] }}
            </template>
          </template>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
//= lib
import debounce from 'lodash/debounce'
import _isEmpty from 'lodash/isEmpty'
import _get from 'lodash/get'

//= mixins
import { toArray } from '@/assets/js/common/Helpers'

export default {
  name: 'InputSuggestion',

  inheritAttrs: false,

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    value: {
      type: [String, Number, InputEvent, Array, Object],
      default: null
    },

    list: {
      type: [Array, String, Object],
      default: null
    },

    displayName: {
      type: [String, Array],
      default: null
    },

    displaySelected: {
      type: String,
      default: null
    },

    displayNameExtra: {
      type: [String, Array, Object],
      default: null
    },

    displayValue: {
      type: [String],
      default: null
    },

    returnObject: {
      type: [String, Boolean],
      default: false
    },

    hasReset: {
      type: [Boolean],
      default: true
    },

    isLoading: {
      type: [Boolean],
      default: false
    }
  },

  data () {
    return {
      showList: false,
      searchVal: null,
      placement: '',

      config: {
        arrowPos: 0
      }
    }
  },

  computed: {
    hasItem () {
      return this.$slots.item
    },

    displayNameArr () {
      return toArray(this.displayName)
    },

    firstDisplayName () {
      return toArray(this.displayName)[0]
    }
  },

  watch: {
    list (val) {
      if (val) {
        this.checkPosition()
        this.modifyPosition()
      }
    },

    placement (val) {
      if (val) {
        this.checkPosition()
        this.modifyPosition()
      }
    }
  },

  mounted () {
    window.addEventListener('click', e => this.checkTargets(e))
    window.addEventListener('scroll', e => this.checkPosition(e))

    this.$nextTick(() => {
      if (this.value) {
        if (this.returnObject) {
          this.searchVal = this.value[this.displaySelected]
        } else {
          const getName = this.list.find(e => e[this.displayValue] === this.value)

          if (typeof this.value === 'object') {
            this.searchVal = this.value[this.displaySelected]
          } else {
            this.searchVal = getName?.[this.displaySelected] ?? ''
          }
        }
      }
    })
  },

  beforeDestroy () {
    window.removeEventListener('scroll', (e) => this.checkTargets(e))
    window.removeEventListener('click', (e) => this.checkPosition(e))
  },

  methods: {
    ...{ _isEmpty },

    modifyText ({ value, extra }) {
      if (!this.displayNameExtra) {
        return
      }

      let result = value

      if (extra) {
        result = `${extra}${value}`
      }

      if (extra === ' ' && value) {
        result = ` ${value}&nbsp;`
      }

      if (extra === '()' && value) {
        result = ` (${value}) `
      }

      if (extra === '[]' && value) {
        result = `[${value}]`
      }

      // checks if first letter/item is a space
      const space = result.split('')[0]

      if (space === '') {
        result = result.replace(/^\s/, '')
      }

      return result
    },

    checkTargets (e) {
      if (e.target && !e.target.parentNode) {
        return
      }

      const target = e.target.parentNode.parentNode
      const InputSuggestionWrap = this.$refs['input-suggestion']

      if (target !== InputSuggestionWrap) {
        this.showList = false
      }
    },

    async checkPosition () {
      await this.$nextTick()

      const list = this.$refs['input-suggestion-list']
      const listDim = list.getBoundingClientRect()
      const tableInner = this.$el.parentNode.parentNode.parentNode.parentNode.parentNode

      if (tableInner.classList.contains('table__inner')) {
        if ((listDim.bottom + 80) >= this.deviceHeight) {
          this.placement = 'top-start'
        } else {
          this.placement = 'bottom-start'
        }
      } else {
        if ((listDim.bottom) >= this.deviceHeight) {
          this.placement = 'top-start'
        } else {
          this.placement = 'bottom-start'
        }
      }
    },

    modifyPosition () {
      const wrap = this.$refs['input-suggestion']
      const wrapDim = wrap.getBoundingClientRect()
      const list = this.$refs['input-suggestion-list']
      const listDim = list.getBoundingClientRect()

      list.style.width = wrapDim.width + 'px'
      list.style.maxWidth = wrapDim.width + 'px'
      list.style.minWidth = wrapDim.width + 'px'

      if (this.placement === 'top-start') {
        const attr = listDim ? (wrapDim.top - listDim.height - 1) + 'px' : null
        list.style.top = attr
      }

      if (this.placement === 'bottom-start') {
        const attr = wrap ? (wrapDim.top + wrapDim.height + 1) + 'px' : null
        list.style.top = attr
      }
    },

    initialSearch () {
      this.$emit('search', {
        q: this.searchVal,
        type: 'initial'
      })
      this.showList = true
    },

    searchData: debounce(function (e) {
      this.showList = true
      this.$emit('search', {
        q: e.target.value,
        type: 'search'
      })
    }, 100),

    selectItem (e) {
      try {
        if (this.returnObject === true || this.returnObject === 'true') {
          this.$emit('input', e)
        } else {
          this.$emit('input', _get(e, this.displayValue))
          this.$emit('search', {
            item: e,
            type: 'object'
          })
        }

        this.searchVal = e[this.displaySelected]
        this.showList = false
      } catch (err) {
        console.error('item does not exist')
        this.searchVal = ''
      }
    },

    clearValue () {
      this.searchVal = ''
      this.$emit('input', '')
      this.$emit('clear', true)
      this.showList = false
    },

    handleActions (action) {
      if (action === 'up') {
        if (this.config.arrowPos > 0) {
          this.config.arrowPos = this.config.arrowPos - 1
        }
      }

      if (action === 'down') {
        if (this.config.arrowPos < this.list.length - 1) {
          this.config.arrowPos = this.config.arrowPos + 1
        }
      }

      if (action === 'enter') {
        const list = this.list
        const item = this.list[this.config.arrowPos]

        this.selectItem(item)
      }
    }
  }
}
</script>
