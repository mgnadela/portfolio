<template>
  <div class="gamelist--footer">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'GamelistFooter',

  inject: {
    gamelistConfig: {}
  },
}
</script>
