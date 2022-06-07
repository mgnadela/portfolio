<template>
  <div
    class="gamelist-wrap"
    ref="gamelist"
    :class="`${this.scrolled ? 'is-scrolled' : ''}${this.hasScrollbar ? ' ' + this.hasScrollbar : ''}`"
  >
    <slot></slot>
  </div>
</template>

<script>
// mixins
import CheckScrollbar from '@/assets/js/mixins/base/CheckScrollbar'

export default {
  name: 'Gamelist',

  props: {
    scrollable: {
      type: [String, Boolean],
      default: false
    },

    dataLoading: {
      type: [Boolean],
      default: true
    }
  },

  mixins: [
    CheckScrollbar
  ],

  provide () {
    const gamelistConfig = this.gamelistConfig
    return { gamelistConfig }
  },

  data () {
    return {
      gamelistConfig: {
        asc: false
      },
      scrolled: false,
      hasScrollbar: ''
    }
  },

  watch: {
    dataLoading () {
      this.gamelistConfig.loading = this.dataLoading
      this.hasScrollbar = this.checkScrollbar('gamelist')
    },

    '$_device.width' () {
      this.hasScrollbar = this.checkScrollbar('gamelist')
    }
  },

  mounted () {
    let gamelist = document.querySelector('.gamelist--inner')

    gamelist.addEventListener('scroll', (e) => {
      if (e.target.scrollTop > 0) {
        this.scrolled = true
      } else {
        this.scrolled = false
      }
    })

    gamelist.addEventListener('click', (e) => {
      let targetClass = e.target.classList
      if (targetClass.contains('subnav__item') || (targetClass.contains('gamelist-col') && targetClass.contains('arrow'))) {
        this.hasScrollbar = this.checkScrollbar('gamelist')
      }
    })

    this.hasScrollbar = this.checkScrollbar('gamelist')
  }
}
</script>
