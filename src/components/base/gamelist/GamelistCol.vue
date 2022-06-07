<template>
  <div
    class="gamelist-col"
    :class="[ name, { 'sorter-wrap' : sort } ]"
    @click="triggerSort"
  >
    <div class="gamelist-col--inner">
      <slot></slot>

      <div
        class="sort"
        ref="sort"
        v-if="sort"
      >
        <i
          class="ico-sort-asc"
          :class="{ 'is-active' : gamelistConfig.col_name === name && gamelistConfig.asc}"
        >
        </i>
        <i
          :class="{ 'is-active' : gamelistConfig.col_name === name  && !gamelistConfig.asc}"
          class="ico-sort-desc"
        >
        </i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GamelistCol',

  props: {
    name: {
      type: [ String ]
    },

    sort: {
      type: Boolean,
      default: false
    },
    sortType: {
      type: [ String ]
    }
  },

  inject: {
    gamelistConfig: {}
  },

  methods: {
    triggerSort () {
      let name = this.name
      if (this.sort) {
        this.gamelistConfig.col_name = name

        if (this.gamelistConfig.col_name === name) {

          if(this.sortType === 'asc') {
            this.gamelistConfig.asc = true
          } else {
            this.gamelistConfig.asc = false
          }
        }
      }
    }
  }
}
</script>
