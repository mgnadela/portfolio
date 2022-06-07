<template>
  <div class="gamelist--inner">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'GamelistInner',

  inject: {
    gamelistConfig: {}
  }
}
</script>
