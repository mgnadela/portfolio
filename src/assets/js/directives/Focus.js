/*
  import { focus } from '@/assets/js/directives/Focus'

  directives: { focus }
*/

export const focus = {
  inserted: function (el) {
    el.focus()
  }
}
