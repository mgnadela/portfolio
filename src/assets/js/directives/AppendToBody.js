/**
  @Description:

  import { appendToBody } from '@/assets/js/directives/AppendToBody'

  directives: {
    appendToBody
  }
**/

export const appendToBody = {
  inserted (el, bindings, { context }) {
    if (context.appendToBody) {
      const { height, top, left, width } = context.$refs['chart-menu-sub'].getBoundingClientRect()
      const scrollX = window.scrollX || window.pageXOffset
      const scrollY = window.scrollY || window.pageYOffset
      el.unbindPosition = context.calculatePosition(el, context, {
        width: width + 'px',
        left: (scrollX + left) + 'px',
        top: (scrollY + top + height) + 'px'
      })

      document.body.appendChild(el)
    }
  },

  unbind (el, bindings, { context }) {
    if (context.appendToBody) {
      if (el.unbindPosition && typeof el.unbindPosition === 'function') {
        el.unbindPosition()
      }
      if (el.parentNode) {
        el.parentNode.removeChild(el)
      }
    }
  }
}
