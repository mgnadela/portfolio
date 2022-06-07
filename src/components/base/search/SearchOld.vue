<!-- <template>
  <section
    class="search-bar-wrap"
    ref="searchBarWrap"
  >
    <div
      v-if="$_device.width < 768"
      class="search-bar-title"
    >
      <span>
        {{ translate(search, 'search') }}
      </span>

      <button
        class="btn-popup-close btn-search-close"
        @click="SET_SHOWSEARCH(false)"
      >
        <i class="ico-close"></i>
      </button>
    </div>

    <form
      class="search-bar"
      @submit.prevent="trigger"
    >
      <button
        type="button"
        class="btn-refresh"
        @click="refresh"
      >
        <i class="ico-refresh"></i>
      </button>

      <slot></slot>

      <div
        class="search-bar__items -filterby-dp"
        v-if="filterBy && filterBy.length"
      >
        <select2
          class="select-list--filter"
          ref="filter"
          id="filter-by"
          :withReset="true"
          v-model="temp.filter_by"
        >
          <option2
            v-for="col in filterBy"
            :key="col.value"
            :value="col.value"
            :selected="col.value === ($route.query.filter_by || '')"
          >
            {{ translate(col.display) }}
          </option2>
        </select2>
      </div>

      <div
        class="search-bar__items -filterby-input"
        v-if="showSearchbox"
      >
        <div class="input-wrap">
          <input
            id="q"
            type="text"
            v-model="temp.q"
            @focus="inputFocus($event)"
            @blur="inputBlur($event)"
          />
        </div>
      </div>

      <div
        class="search-bar__items -dateby-dp"
        v-if="dateBy.length"
      >
        <select2
          class="select-list--filter"
          ref="filter-by-date"
          id="filter-by"
          :withReset="true"
          v-model="temp.date_by"
        >
          <option2
            :key="col.value"
            v-for="col in dateBy"
            :value="col.value"
          >
            {{ translate(col.display) }}
          </option2>
        </select2>
      </div>

      <div
        class="search-bar__items -dateby-input"
        v-if="dateBy.length"
      >
        <date-time-picker
          ref="datetimepickerFrom"
          v-model='temp.date_from'
          mode='from'
          :placeholder="dateRange ? translate('from') : translate('date')"
          :type='dateType'
          :range="dateRange"
          :setMax='temp.date_to'
        />

        <date-time-picker
          ref="datetimepickerTo"
          v-model='temp.date_to'
          v-if="dateRange"
          mode='to'
          :placeholder="translate('to')"
          :type='dateType'
          :range='dateRange'
          :setMin='temp.date_from'
        />
      </div>

      <button class="btn-search">
        <i class="ico-search"></i>
      </button>

      <button
        class="btn-clear"
        @click="clear"
      >
        <i class="ico-clear"></i>
      </button>
    </form>
  </section>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

// components
import DateTimePicker from '@/components/base/DateTimePicker'

// translations
// import { search } from '@/assets/js/translations/Search'

export default {
  name: 'Search',

  components: {
    DateTimePicker
  },

  props: {
    showSearchbox: {
      type: Boolean,
      default: true
    },
    filterBy: {
      type: Array,
      default: () => []
    },

    dateBy: {
      type: Array,
      required: false,
      default: () => []
    },

    dateRange: {
      type: Boolean,
      default: true
    },

    dateType: {
      type: String,
      default: 'datetime'
    },

    sortBy: {
      type: String,
      required: false
    },

    sort: {
      type: String,
      required: false
    },

    disabled: {
      type: Boolean,
      required: false
    },

    rows: {
      type: [Number, String],
      required: false
    },

    translations: [Array, Object, String]
  },

  data () {
    const temp = this.generate(this.$route.query)

    if (this.dateBy.length) {
      temp.date_by = this.dateBy[0].value
    }

    if (this.filterBy.length) {
      temp.filter_by = this.filterBy[0].value
    }

    return {
      search,
      temp
    }
  },

  computed: {
    ...mapState(['showSearch']),

    dateTitle () {
      if (this.dateBy.length) {
        return this.dateBy[0].display
      }
      return 'Filter Date'
    },

    filterTitle () {
      if (this.filterBy.length) {
        return this.filterBy[0].display
      }
      return 'Filter By'
    }
  },

  watch: {
    showSearch () {
      const body = this.$root.$el.parentElement

      if (this.showSearch) {
        const el = document.createElement('div')
        el.classList.add('search-backdrop')
        body.appendChild(el)
      } else {
        const element = document.getElementsByClassName('search-backdrop')[0]
        this.$root.$el.parentNode.removeChild(element)
      }
    },

    '$_device.width' () {
      if (this.$_device.width > 767) {
        const element = document.getElementsByClassName('search-backdrop')[0]

        if (element) {
          this.$root.$el.parentNode.removeChild(element)
        }
      }
    }
  },

  methods: {
    ...mapMutations(['SET_SHOWSEARCH']),

    clear () {
      if (this.disabled) {
        return
      }

      this.temp = {
        rows: this.rows || 50,
        page: 1,
        filter_by: '',
        q: '',
        date_by: '',
        sort_by: 'id',
        sort: 'desc',
        date_from: '',
        date_to: ''
      }

      if (this.dateBy.length > 0) {
        this.$refs.datetimepickerFrom.reset = true
        this.$refs.datetimepickerTo.reset = true
      }

      if (this.$refs.datetimepickerFrom) {
        this.$refs.datetimepickerFrom.resetData()
      }

      if (this.$refs.datetimepickerTo) {
        this.$refs.datetimepickerTo.resetData()
      }

      // this.$refs.filter.reset = true

      if (this.$refs['filter-by-date']) {
        this.$refs['filter-by-date'].reset = true
      }

      this.$emit('trigger', this.generate(this.temp))
      this.$emit('clear', true)
    },

    trigger () {
      if (this.disabled) {
        return
      }

      this.$emit('trigger', this.generate(this.temp))
    },

    refresh () {
      if (this.disabled) {
        return
      }

      this.$emit('refresh')
    },

    inputFocus (e) {
      e.path[1].classList.add('is-focused')
    },

    inputBlur (e) {
      e.path[1].classList.remove('is-focused')
    }
  }
}
</script> -->
