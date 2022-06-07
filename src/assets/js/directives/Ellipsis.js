/**
  @Description:

  import { ellipsis } from '@/assets/js/directives/Clamp'

  directives: {
    ellipsis
  },

  can be used as

  <p v-ellipsis></p>
**/

import $ from 'jquery'
import '@/assets/js/lib/jquery/ellipsis'

export const ellipsis = {
  inserted (e1, binding, vnode, value) {
    e1.classList.add('ellipsis')

    $('.ellipsis').ellipsis({
      lines: 1,
      ellipClass: 'ellipsis',
      responsive: true
    })
  }
}
