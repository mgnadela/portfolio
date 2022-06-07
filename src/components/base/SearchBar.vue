<!--
  @USE AS:
  import SearchBar from '@/components/base/SearchBar'
  const SearchBar  = () => import('@/components/base/SearchBar')

  components: {
    SearchBar
  },

  data () {
    return {
      searchParams: {
        main: this.defaultSearchParams()
      },

      searchbarConfig: {
        hasRefresh: true,
        hasClear: true,
        dateConfig: {
          dateBy: [
            {
              value: 'created_at',
              display: 'created date'
            },
            {
              value: 'updated_at',
              display: 'updated date'
            },
            {
              value: 'deleted_at',
              display: 'deleted date'
            }
          ],
          dateType: 'datetime',
          dateRange: true
        },
        filterBy: [
          {
            value: 'login_id',
            display: 'login id'
          },
          {
            value: 'login_name',
            display: 'login name'
          }
        ]
      }
    }
  },

  watch: {
    $route (to) {
      this.fetchData({ query: this.generate(to.query) })
    }
  },

  created () {
    this.fetchData()
  },

  methods: {
    async handleSearch (data) {
      const path = 'faq'
      const query = data ? data.query : this.searchParams

      this.$router.push({ path: `/${path}`, query: query })

      if (data && data.type === 'clear') {
        await this.$nextTick()
        this.$router.push({ path: `/${path}` })
      }

      this.fetchData({
        query: query
      })
    },

    async fetchData (data) {
      const query = data && data.query ? data.query : this.searchParams

      this.dataStatus.empty = false

      if (!this.dataStatus.showLoading) {
        this.dataStatus.loading = true
      }

      await this.getFaqs(query)

      this.dataStatus.loading = false
      this.dataStatus.showLoading = false

      if (this.faqsData.length === 0 || !this.faqsData.length) {
        this.dataStatus.empty = true
      }
    }
  }

  <search-bar
    v-model="searchParams.main"
    :translations="translations"
    :config="searchbarConfig"
    @search="handleSearch($event)"
  >
    <template #actions>
      <button
        class="btn-default"
        @click="modal.test.$status = 1"
      >
        <span>
          MODAL
        </span>
      </button>
    </template>
  </search-bar>
-->

<template>
  <div class="searchbar-wrap">
    <form
      v-if="tempConfig"
      class="searchbar"
      @submit.prevent="handleSearch"
    >
      <div
        v-if="tempConfig.hasRefresh"
        class="searchbar__item"
      >
        <button
          type="button"
          class="btn-refresh"
          @click="refershSearch()"
        >
          <i class="ico-refresh"></i>
        </button>
      </div>

      <template v-if="tempConfig && tempConfig.filterBy">
        <div class="searchbar__item searchbar__item--filterby">
          <select-list
            ref="filter-by"
            v-model="searchParams.filterBy"
          >
            <select-option
              v-for="(item, i) in tempConfig.filterBy"
              :key="i"
              :value="item.value"
              :selected="item.value === searchParams.filterBy"
            >
              {{ translate(item.display) }}
            </select-option>
          </select-list>
        </div>

        <div class="searchbar__item">
          <InputWrap
            v-model="searchParams.q"
          />
        </div>
      </template>

      <template v-if="tempConfig && tempConfig.dateConfig && tempConfig.dateConfig.dateBy">
        <div class="searchbar__item searchbar__item--dateBy">
          <select-list
            ref="date-by"
            v-model="searchParams.dateBy"
          >
            <select-option
              v-for="(item, i) in tempConfig.dateConfig.dateBy"
              :key="i"
              :value="item.value"
              :selected="item.value === searchParams.dateBy"
            >
              {{ translate(item.display) }}
            </select-option>
          </select-list>
        </div>

        <div class="searchbar__item">
          <DateTimePicker
            ref="datetimepicker-to"
            v-model="searchParams.dateFrom"
            mode="from"
            :placeholder="tempConfig.dateConfig.dateRange ? translate('from') : translate('date')"
            :type="tempConfig.dateConfig.dateType"
            :range="tempConfig.dateConfig.dateRange"
            :set-max="searchParams.dateTo || ''"
          />
        </div>

        <div class="searchbar__item">
          <DateTimePicker
            ref="datetimepicker-from"
            v-model="searchParams.dateTo"
            mode="to"
            :placeholder="tempConfig.dateConfig.dateRange ? translate('to') : translate('date')"
            :type="tempConfig.dateConfig.dateType"
            :range="tempConfig.dateConfig.dateRange"
            :set-min="searchParams.dateFrom || ''"
          />
        </div>
      </template>

      <div class="searchbar__item searchbar--actions">
        <button class="btn-search">
          <i class="ico-search"></i>
        </button>

        <button
          v-if="tempConfig.hasClear"
          type="button"
          class="btn-search-clear"
          @click="clearSearch"
        >
          <i class="ico-search-clear"></i>
        </button>

        <slot name="actions"></slot>
      </div>
    </form>
  </div>
</template>

<script>
import Vue from 'vue'

// lib
import _pickBy from 'lodash/pickBy'

// components
import DateTimePicker from '@/components/base/DateTimePicker'

export default {
  name: 'SearchBar',

  components: {
    DateTimePicker
  },

  props: {
    config: {
      type: [Object, Array],
      default: null,
      required: true
    },

    translations: {
      type: [Object, Array],
      default: null,
      required: true
    },

    value: {
      type: [Object, Array],
      required: true
    }
  },

  data () {
    return {
      searchParams: {}
    }
  },

  computed: {
    tempConfig () {
      const tempConfig = JSON.parse(JSON.stringify(this.config))

      if (tempConfig?.hasRefresh) {
        tempConfig.hasRefresh = true
      }

      if (tempConfig?.hasClear) {
        tempConfig.hasClear = true
      }

      if (tempConfig.dateConfig?.dateRange) {
        tempConfig.dateConfig.dateRange = true
      }

      if (tempConfig.dateConfig?.dateType) {
        tempConfig.dateConfig.dateType = 'datetime'
      }

      return tempConfig
    }
  },

  async mounted () {
    await this.$nextTick()

    this.searchParams = this.value

    if (this.tempConfig) {
      if (this.tempConfig?.filterBy) {
        this.searchParams.filterBy = this.tempConfig.filterBy[0].value
      }

      if (this.tempConfig.dateConfig?.dateBy) {
        this.searchParams.dateBy = this.tempConfig.dateConfig.dateBy[0].value
      }
    }
  },

  methods: {
    handleSearch () {
      this.$emit('search', { type: 'search', query: _pickBy(this.searchParams, Boolean) })
    },

    clearData () {
      if (this.tempConfig.dateConfig?.dateBy.length > 0) {
        this.$refs['datetimepicker-from'].reset = true
        this.$refs['datetimepicker-to'].reset = true
      }

      if (this.$refs['filter-by']) {
        this.$refs['filter-by'].reset = true
      }

      if (this.$refs['date-by']) {
        this.$refs['date-by'].reset = true
      }

      this.reset = false
    },

    clearSearch () {
      const params = this.searchParams

      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          if (['dateFrom', 'dateTo', 'q'].indexOf(key) !== -1) {
            params[key] = ''
          }

          if (key === 'filterBy') {
            params[key] = this.tempConfig.filterBy[0].value
          }

          if (key === 'dateBy') {
            params[key] = this.tempConfig.dateConfig.dateBy[0].value
          }

          if (key === 'sortBy') {
            params[key] = 'id'
          }

          if (key === 'sort') {
            params[key] = 'desc'
          }
        }
      }

      this.clearData()
      this.$emit('search', { type: 'clear', query: _pickBy(this.searchParams, Boolean) })
    },

    refershSearch () {
      this.$emit('search', { type: 'refresh' })
    }
  }
}
</script>
