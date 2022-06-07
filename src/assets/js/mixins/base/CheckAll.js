/**
  Description:
  still needs variables selectAll, and selected: [] in parent component

  data () {
    return {
      selectAll: false,
      selected: []
    }
  }

  import CheckAll from '@/assets/js/mixins/base/CheckAll'

  mixins: [ CheckAll ]
**/

// lib
import _set from 'lodash/set'
import _get from 'lodash/get'

// mixins
import { getKey } from '@/assets/js/common/Helpers'

export default {
  methods: {
    $_checkAll (data, uniqueIdentifier = 'id') {
      this.selectAll = !this.selectAll

      if (Array.isArray(data)) {
        const check = data ? this.selected.length = data.length : false

        if (check) {
          this.selected = this.selectAll ? data.map(d => d[uniqueIdentifier]) : []
        }
      }

      if (Object.prototype.toString.call(data) === '[object Object]') {
        this.selected = this.selectAll ? Object.values(data).map(x => x[uniqueIdentifier]) : []
      }
    },

    $_checkAllObj ({ data, uniqueIdentifier = 'id', key } = {}) {
      this.selectObj[key].status = !this.selectObj[key].status

      if (Array.isArray(data)) {
        const check = data ? this.selectObj[key].list.length = data.length : false

        if (check) {
          this.selectObj[key].list = this.selectObj[key].status ? data.map(d => d[uniqueIdentifier]) : []
        }
      }

      if (Object.prototype.toString.call(data) === '[object Object]') {
        this.selectObj[key].list = this.selectObj[key].status ? Object.values(data).map(x => x[uniqueIdentifier]) : []
      }
    },

    /**
     *
     * @param {Object|Array} data
     * @param {String|Number} uniq
     * @param {Array} selected
     * @param {Boolean} selectAll
     */
    $_checkRaw ({ data, uniq, selected, selectAll }) {
      const checkedAll = _get(this, selectAll)
      const checked = _get(this, selected)
      const isSelectAll = checked.length === data.length

      const newData = getKey((data).constructor.name, {
        Array: data.map(d => d[uniq]),
        Object: Object.values(data).map(x => x[uniq])
      })

      _set(this, selected, isSelectAll ? [] : newData)
      _set(this, selectAll, checkedAll)
    }
  }
}
