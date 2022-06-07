/**
  import { documentHidden } from '@/assets/js/mixins/base/DocumentHidden'

  mixins: [
    documentHidden
  ]
**/

import onVisibilityChange from 'visibility-change-ponyfill'

export const documentHidden = {
  data () {
    return {
      documentHidden: false
    }
  },

  created () {
    onVisibilityChange(() => {
      if (document.hidden) {
        this.documentHidden = true
      } else {
        this.documentHidden = false
      }
    })
  }
}
