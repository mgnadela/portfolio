/**
  @Description:

  import { clamp } from '@/assets/js/directives/Clamp'

  directives: {
    clamp
  },

  can be used as

  <p v-clamp="2"></p>
**/

import '@/assets/js/lib/clamp'

export const clamp = {
  update (e1, binding, vnode, value) {
    let lines
    let browser

    try {
      const e
      const f = e.width
    } catch (e) {
      const err = e.toString()

      if (err.indexOf('not an object') !== -1) {
        browser = 'safari'
      } else if (err.indexOf('Cannot read') !== -1) {
        browser = 'chrome'
      } else if (err.indexOf('e is undefined') !== -1) {
        browser = 'firefox'
      } else if (err.indexOf("Unable to get property 'width' of undefined or null reference") !== -1) {
        if (!(false || !!document.documentMode) && !!window.StyleMedia) {
          browser = 'edge'
        } else {
          browser = 'ie'
        }
      } else if (err.indexOf('cannot convert e into object') !== -1) {
        browser = 'opera'
      } else {
        browser = undefined
      }
    }

    if (binding.value) {
      if (browser !== 'chrome') {
        lines = parseInt(binding.value.lines) + 1
      } else {
        lines = binding.value.lines
      }
    } else {
      lines = 1
    }

    $clamp(e1, { clamp: lines })
  }
}
