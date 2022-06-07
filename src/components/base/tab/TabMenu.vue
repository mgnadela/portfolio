<template>
  <div class="tab-head--inner" ref="wrap">
    <div
      class="tab-arrow -prev"
      v-if="$_device.width > 1025 && nextActive"
      @click="handleClick('prev')"
    >
      <i class="ico-arr-left"></i>
    </div>

    <div class="tab-menu tab-menu-sub">
      <div
        class="tab-menu--inner"
        ref="tabMenu"
      >
        <slot></slot>
      </div>
    </div>

    <div
      class="tab-arrow -next"
      v-if="$_device.width > 1025 && nextActive"
      @click="handleClick('next')"
    >
      <i class="ico-arr-right"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabMenu',

  data () {
    return {
      nextActive: false,
      prevActive: false,
      totalWidth: 0,
      movestyle: '',
      translateX: 0,
      translatePrev: 0,
      prevFlag: false
    }
  },

  async mounted () {
    await this.$nextTick()
    window.addEventListener('resize', () => this.getDimension)
    this.getDimension()
  },

  methods: {
    handleClick (type) {
      let tabMenu = this.$refs.tabMenu
      let wrap = this.$refs.wrap
      let total = this.totalWidth - wrap.offsetWidth
      let clickTotal = this.totalWidth / (wrap.offsetWidth / 1.3)
      let widthPerClick =  total / clickTotal
      let is = 0

      if(type === 'next') {
        this.prevActive = true
        tabMenu.scrollLeft += widthPerClick
      } else {
        tabMenu.scrollLeft -= widthPerClick
      }
    },

    getDimension () {
      let tabMenu = this.$refs.tabMenu
      let wrap = this.$refs.wrap
      let wrapWidth = 0, posX = 0

      if(tabMenu) {
        wrapWidth = wrap.offsetWidth

        for (let i = 0; i < tabMenu.children.length; i++) {
          this.totalWidth += tabMenu.children[i].offsetWidth
        }

        if(this.totalWidth > wrapWidth) {
          this.nextActive = true
        }

        if(posX > 0) {
          this.prevActive = true
        }
      }
    }
  }
}

</script>
