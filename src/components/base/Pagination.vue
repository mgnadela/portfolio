<!--
  @USE AS:
  import Pagination from '@/components/base/Pagination'
  const Pagination  = () => import('@/components/base/Pagination')

  components: { Pagination }

  <Pagination
    v-model="params.page"
    :total="total"
    :rows="params.rows"
    @page="trigger"
  />
-->

<template>
  <div class="pagination">
    <ul v-show="total > 0">
      <li
        v-show="max > 1"
        class="arrow"
        @click="change(1)"
      >
        &laquo;
      </li>

      <li
        class="arrow"
        v-show="max > 1"
        @click="prev"
      >
        &lsaquo;
      </li>

      <li
        v-for="i in pages"
        :key="i"
        :class="{ 'is-active' : i === currentPage }"
        @click="change(i)"
      >
        {{ i }}
      </li>

      <li
        v-show="max > 1"
        class="arrow"
        @click="next"
      >
        &rsaquo;
      </li>

      <li
        v-show="max > 1"
        class="arrow"
        @click="change(max)"
      >
        &raquo;
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Pagination',

  props: {
    value: {
      type: [String, Number]
    },

    total: {
      type: [String, Number],
      required: true
    },

    page: {
      type: [String, Number],
      required: false,
      default: 1
    },

    rows: {
      type: [String, Number],
      required: false,
      default: 50
    }
  },

  computed: {
    max () {
      return Math.ceil(parseInt(this.total) / parseInt(this.rows))
    },

    currentPage () {
      return parseInt(this.value)
    },

    pages () {
      let pages = []

      let i = Math.floor(this.value / this.cap) * this.cap || 1
      let max = this.max < (i + this.cap) ? this.max : i + this.cap

      if (max === i && max > this.cap) {
        i -= this.cap
      }

      for (; i <= max; i++) {
        pages.push(i)
      }

      return pages
    },

    cap () {
      const cap = this.$_device.width < 641 ? 4 : 9

      return cap
    }
  },

  methods: {
    prev () {
      if (this.value > 1) {
        this.change(this.value - 1)
      }
    },

    next () {
      if (Math.ceil(this.total / this.rows) > this.value) {
        this.change(this.value + 1)
      }
    },

    change (page) {
      this.$emit('input', page)
      this.$emit('page')
    }
  }
}
</script>
