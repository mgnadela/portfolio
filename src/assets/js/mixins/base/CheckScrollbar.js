/**
  import CheckScrollbar from '@/assets/js/mixins/base/CheckScrollbar'

  mixins: [
    CheckScrollbar
  ]
**/

export default {
  methods: {
    $_checkScrollbar (parent, mode = 'child') {
      let hasScrollbar

      if (parent) {
        let clientWidth, offsetWidth, result, wrap

        if (mode === 'parent') {
          wrap = this.$refs[parent] ? this.$refs[parent] : null
        }

        if (mode === 'child') {
          wrap = this.$refs[parent] ? this.$refs[parent].children[0] : null
        }

        if (wrap && clientWidth && offsetWidth) {
          clientWidth = wrap.clientWidth
          offsetWidth = wrap.offsetWidth

          hasScrollbar = clientWidth !== offsetWidth ? 'has-scrollbar' : ''
        }

        return hasScrollbar
      }
    }
  }
}
