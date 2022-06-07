<!--
  @USE AS:
  import TextArea from '@/components/base/TextArea'
  const TextArea  = () => import('@/components/base/TextArea')

  components: {
    TextArea
  }

  <TextArea
    v-model="test.msg"
    placeholder="test"
  />
-->

<template>
  <div class="textarea-wrap">
    <textarea
      ref="textarea"
      v-bind="$attrs"
      v-on="$listeners"
      :value="value"
      rows="1"
      @input="$emit('update', $event.target.value)"
    >
    </textarea>
  </div>
</template>

<script>
export default {
  name: 'TextArea',

  inheritAttrs: false,

  model: {
    prop: 'value',
    event: 'update'
  },

  props: {
    value: {
      type: [
        String,
        Number
    ],
      default: null
    },

    type: {
      type: [
        String
      ],
      default: 'text'
    },

    icon: {
      type: [
        String
      ],
      default: null
    },

    minHeight: {
      type: [Number, String],
      default: 0
    }
  },

  watch: {
    value (data) {
      this.setHeight()
    }
  },

  methods: {
    setHeight () {
      const el = this.$refs.textarea

      setTimeout(() => {
        el.style.cssText = 'height: auto;'
        el.style.cssText = `height: ${el.scrollHeight}px; min-height: ${this.minHeight}px`
      }, 0)
    }
  }
}
</script>
