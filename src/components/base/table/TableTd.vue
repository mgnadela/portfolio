<template>
  <div
    class="table__td"
    :class="[ name, { 'sorter-wrap' : sort } ]"
    ref="td"
    @click="triggerSort(name)"
  >
    <div
      v-if="sort"
      class="td__sort"
    >
      <div class="td__text">
        <slot></slot>
      </div>

      <div
        class="sort"
        ref="sort"
        v-if="sort"
      >
        <i
          class="ico-sort-asc"
          :class="{ 'is-active' : tblConfig.td_name === name && tblConfig.asc }"
        >
        </i>
        <i
          class="ico-sort-desc"
          :class="{ 'is-active' : tblConfig.td_name === name && !tblConfig.asc }"
        >
        </i>
      </div>
    </div>

    <template v-if="hasTdTx && !sort">
      <div
        class="td__text"
        ref="td-text-normal"
        v-if="!isHtml"
      >
        <slot></slot>
      </div>

      <div
        class="td__text td__text-ellipsis"
        ref="td-text-html"
        v-html="logsDisplay"
        v-else
      >
      </div>

      <slot
        name="inner"
        v-if="hasInner"
      >
      </slot>
    </template>

    <template v-if="!hasTdTx && !sort">
      <slot></slot>
    </template>
  </div>
</template>

<script>
export default {
  name: 'TblTd',

  props: {
    sort: {
      type: Boolean,
      default: false
    },

    hasTdTx: {
      type: Boolean,
      default: true
    },

    name: {
      type: [ String ]
    },

    isHtml: {
      type: Boolean,
      default: false
    },

    logs: {
      type: [ String ]
    }
  },

  computed: {
    hasInner () {
      return this.$slots['inner']
    },

    logsDisplay () {
      try {
        let logsStr = this.logs.replace(/<p><p>/g, '<p>').replace(/<\/p><\/p>/g, '</p>')
        return logsStr
      } catch (err) {
        return this.logs
      }
    }
  },

  methods: {
    triggerSort (name) {
      if (this.sort) {
        this.tblConfig.td_name = name

        if (this.tblConfig.td_name === name) {
          this.tblConfig.asc = !this.tblConfig.asc
        }
      }
    }
  }
}
</script>
