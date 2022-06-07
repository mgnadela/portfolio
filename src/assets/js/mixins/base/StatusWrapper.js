/**
  Description:

  Automatically set the loading and empty flags by
  wrapping your functions inside a higher order function

  Usage:
  import { statusWrapper } from '@/assets/js/mixins/base/StatusWrapper'

  mixins: [
   statusWrapper
  ],

  data () {
    dataStatus: {
      data: {
        loading: true,
        showLoading: false,
        empty: false
      }
    },
  },

  methods: {
    someMethod () {
      const config = {
        data: 'list',
        loading: 'dataStatus.data.loading',
        showLoading: 'dataStatus.data.showLoading',
        empty: 'dataStatus.data.empty'
      }

       await this.statusWrapper(async () => {
        await this.fetchHelloWorld()
      }, config)
    }
  }
*/

import _set from 'lodash/set'
import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'

export const statusWrapper = {
  methods: {
    async $_statusWrapper (fn, { data, empty = 'isEmpty', loading = 'isLoading', showLoading = 'showLoading' }) {
      if (!_get(this, showLoading)) {
        _set(this, loading, true)
      }
      _set(this, empty, false)

      await fn()

      _set(this, loading, false)
      _set(this, showLoading, false)

      const dataList = Array.isArray(data) ? data.every(x => _isEmpty(_get(this, x))) : _isEmpty(_get(this, data))

      _set(this, empty, dataList)
    }
  }
}
