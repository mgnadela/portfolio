<template>
  <option :value="value">
    <slot></slot>
  </option>
</template>

<script>
export default {
  name: 'SelectOption',

  props: {
    value: {
      type: [String, Number, Object, Array, Boolean],
      default: null
    },
    name: {
      type: [String, Number, Boolean],
      default: null
    }
  }
}
</script>
