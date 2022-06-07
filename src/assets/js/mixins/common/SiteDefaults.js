/**
  import SiteDefaults from '@/assets/js/mixins/common/SiteDefaults'

  mixins: [
    SiteDefaults
  ]
**/

import { mapState, mapMutations } from 'vuex'

// mixins
import { vueLocalStorage } from '@/assets/js/mixins/base/VueLocalStorage'
import { vueSessionStorage } from '@/assets/js/mixins/base/VueSessionStorage'
import {
  capitalize,
  joinPath
} from '@/assets/js/common/Helpers'

export default {
  computed: {
    ...mapState('config', [
      'lang'
    ]),

    $_basePath () {
      return window.__path
    },

    $_siteConfig () {
      return {
        name: window.__themeName,
        kor: process.env.VUE_APP_NAME_KR || null,
        theme: window.__theme
      }
    },

    $_hasToken () {
      return Number(this.$route.query.r)
        ? null
        : vueLocalStorage.has('token') || vueSessionStorage.has('token')
    },

    $_env () {
      const env = process.env
      const newEnv = {}

      for (const key in env) {
        const newKey = key.replace('VUE_APP_', '')

        newEnv[newKey] = isNaN(env[key]) ? env[key] : Number(env[key])
      }

      return newEnv
    }
  },

  methods: {
    ...mapMutations('config', [
      'TRIGGER_COUNT'
    ]),

    $_joinPath (path) {
      return joinPath(this.$_basePath, path)
    },

    $_defaultSearchParams () {
      return {
        dateBy: '',
        dateFrom: '',
        dateTo: '',
        filterBy: '',
        page: 1,
        q: '',
        rows: 50,
        sort: 'desc',
        sortBy: 'id'
      }
    },

    $_scrollToTop () {
      const body = document.getElementsByTagName('body')[0]

      body && body.scrollIntoView()
    },

    $_joinPath (path) {
      return joinPath(this.$_basePath, path)
    },

    $_sort (sortBy) {
      const params = JSON.parse(JSON.stringify(this.$route.query))

      params.sort = params.sort === 'asc' ? 'desc' : 'asc'
      params.sort_by = sortBy

      this.$router.push({ query: _pickBy(params, Boolean) })
    },

    $_trigger (e) {
      if (e && e.clear) {
        return this.$router.push({ query: {} })
      }

      const query = _pickBy({ ...this.$route.query, ...e }, Boolean)

      return this.$router.push({ query })
    },

    $_showNumber (key, total) {
      const query = _pickBy(this.$route.query, Boolean)
      const params = _pickBy(this.params, Boolean)
      const obj = { ...params, ...query }
      const page = obj.page || 1
      const row = obj.row || 50

      return obj.sort === 'desc'
        ? total - ((page - 1) * row) - key
        : total - (total - key - 1) + row * (page - 1)
    },

    $_generateModalName (type) {
      if (!type) {
        return ''
      }

      let temp = ''

      const tempType = type.split(' ')

      for (let i = 0; i < tempType.length; i++) {
        let item = tempType[i]

        if (i !== 0) {
          item = capitalize(tempType[i])
        }

        temp = temp + item
      }

      return temp
    }
  }
}
