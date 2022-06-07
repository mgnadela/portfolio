<!--
  @USE AS:
  import CheckDataList from '@/components/base/CheckDataList'
  const CheckDataList = () => import('@/components/base/CheckDataList')

  dataStatus: {
    data: {
      loading: true,
      showLoading: false,
      empty: false
    }
  },

  components: {
    CheckDataList
  }

  <CheckDataList
    v-if="dataStatus.data.loading || dataStatus.data.empty"
    :is-loading="dataStatus.data.loading"
    :is-empty="dataStatus.data.empty"
  />
-->

<template>
  <div :class="setClass">
    <div
      v-if="isEmpty"
      class="empty-list__inner"
    >
      <i class="ico-empty-data"></i>
      <p
        v-if="label"
        v-html="label"
      >
      </p>

      <slot
        v-if="hasData"
        name="data"
      >
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckDataList',

  props: {
    label: {
      type: [String],
      default: null
    },

    isLoading: {
      type: [String, Boolean, Number],
      default: null
    },

    isEmpty: {
      type: [String, Boolean, Number],
      default: null
    }
  },

  computed: {
    setClass () {
      let classList = ''

      if (this.isLoading) {
        classList = 'loader-wrap'
      }

      if (this.isEmpty) {
        classList = 'empty-list'
      }

      return classList
    },

    hasData () {
      return this.$slots.data
    }
  }
}
</script>
