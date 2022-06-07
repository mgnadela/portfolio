<template>
  <div class="form-list__item">
    <div class="form-list__lbl">
      {{ label }}
    </div>

    <div
      v-if="!isDisplay"
      class="form-list__data"
    >
      <slot></slot>
    </div>

    <div
      v-else
      class="form-list__data"
    >
      <div class="form-list__display">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormListItem',

  props: {
    label: {
      type: [String, Number],
      default: '',
      required: true
    },

    isDisplay: {
      type: [Boolean],
      default: false
    }
  }
}
</script>
