<template>
  <div
    class="gamelist-head"
    ref="gamelistHead"
  >
    <div
      class="gamelist-row"
      ref="gamelistRow"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GamelistHead',

  inject: {
    gamelistConfig: {}
  },

  data () {
    return {
      gamelistHead_w: null
    }
  },

  computed: {
    getDataLoading () {
      return this.$parent.$parent.dataLoading
    },

    setWidth () {
      let width = this.gamelistConfig.gamelist_body_w

      if (this.gamelistConfig.gamelist_body_w === 0) {
        width = 'width: 100%'
      } else {
        width = `width: ${width}px`
      }

      return width
    }
  }
}
</script>
