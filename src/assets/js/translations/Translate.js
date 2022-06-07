/**
  Description:
  import Translate from '@/assets/js/translations/Translate'

  mixins: [ Translate ]
**/

import _toLower from 'lodash/toLower'

import {
  getKey,
  translateData,
  render
} from '@/assets/js/common/Helpers'

export default {
  methods: {
    translateDB (payload, { en, kr, jp }) {
      return getKey(this.lang, {
        en: payload[en],
        kr: payload[kr] || payload[en],
        jp: payload[jp] || payload[en],
        default: payload[en]
      })
    },

    translate (name, { translations, filterType, dictionary } = {}) {
      try {
        const location = translations || this.translations
        const lang = this.lang
        let data
        let newName

        if (!name) {
          return name
        }

        name = name.replace(/[(_]/g, ' ')
        name = name.replace(/[)]/g, '')
        name = _toLower(name)

        const oldName = name

        if (lang) {
          if (filterType) {
            name = this.$root.$options.filters[filterType](name)
            name = location[lang][name]
          }

          newName = oldName.split(' ').join('_')

          try {
            data = translateData(location[lang][newName])
          } catch (err) {
            data = name
          }

          if (typeof data === 'undefined') {
            data = name
          }
        } else {
          data = name
        }

        return render(data, dictionary)
      } catch (error) {
        console.error({
          stack: error.stack,
          name
        })
      }
    }
  }
}
