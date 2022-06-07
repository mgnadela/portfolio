<template>
  <div
    class="gamelist-row"
    :class="name"
    ref="gamelistrow"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'GamelistRow',

  props: {
    name: {
      type: [ String ]
    },
  },

  inject: {
    gamelistConfig: {}
  }
}
</script>
