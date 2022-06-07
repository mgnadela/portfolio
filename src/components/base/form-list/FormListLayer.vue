<template>
  <div
    ref="form-list-layer"
    class="form-list-layer"
    :style="{ maxWidth }"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'FormListLayer',

  props: {
    maxWidth: {
      type: [String, Number]
    },

    position: {
      type: String,
      default: 'left'
    }
  },

  mounted () {
    if (this.position === 'right') {
      this.$refs['form-list-layer'].style.marginLeft = 'auto'
    }
  }
}
</script>
