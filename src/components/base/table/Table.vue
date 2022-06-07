<!--
  @USE AS:
  import '@/components/base/table/Table'

  <tbl>
    <template slot="head">
      <tbl-row>
        <tbl-td name="checkbox">
          checkbox
        </tbl-td>
      </tbl-row>
    </template>

    <template slot="body">
      <tbl-row>
        <tbl-td name="checkbox">
          checkbox
        </tbl-td>
      </tbl-row>
    </template>

    <template slot="footer">
      footer
    </template>
  </tbl>

  // V-HTML
    <tbl-td
      :isHtml="true"
      :logs="logs"
    >
    </tbl-td>
-->

<template>
  <div
    ref="table-wrap"
    class="table-wrap"
    :class="{
      'is-scrolled': scrolled,
      'has-scrollbar': hasScrollbar
    }"
  >
    <div
      ref="table"
      class="table"
    >
      <div class="table__inner">
        <div class="table__head">
          <slot name="head"></slot>
        </div>

        <div class="table__body">
          <slot name="body"></slot>
        </div>
      </div>
    </div>

    <div
      v-if="hasFooter"
      class="table__footer"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
// mixins
import CheckScrollbar from '@/assets/js/mixins/base/CheckScrollbar'

export default {
  name: 'Tbl',

  mixins: [
    CheckScrollbar
  ],

  data () {
    return {
      tblConfig: {
        asc: false
      },
      scrolled: false,
      hasScrollbar: ''
    }
  },

  watch: {
    '$_device.width' () {
      this.hasScrollbar = this.checkScrollbar('table-wrap')
    }
  },

  computed: {
    hasFooter () {
      return this.$slots['footer']
    }
  },

  mounted () {
    const table = this.$refs['table']

    table.addEventListener('scroll', (e) => {
      if (e.target.scrollTop > 0) {
        this.scrolled = true
      } else {
        this.scrolled = false
      }
    })

    this.hasScrollbar = this.checkScrollbar('table-wrap')
  }
}
</script>
