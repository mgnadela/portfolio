<!--
  @USE AS:
  import TagInput from '@/components/base/TagInput'
  const TagInput  = () => import('@/components/base/TagInput')

  components: {
    TagInput
  }

  <TagInput
    v-model="tagsArr"
    :default-tags="['a', 'b']"
  />
-->

<template>
  <div class="tag-input">
    <span
      v-for="(tagItem, tagIndex) in tagArr"
      :key="tagIndex"
      class="tag-input-item"
    >
      {{ tagItem }}

      <i
        class="ico-close"
        @click="removeTag(tagIndex)"
      >
      </i>
    </span>

    <input
      type="text"
      v-model="tag"
      @keydown.enter="addTag('enter')"
      @keydown.tab="addTag('tab')"
    />
  </div>
</template>

<script>
export default {
  name: 'TagInput',

  props: {
    value: {
      type: Array,
      default: []
    },

    defaultTags: {
      type: Array,
      default: []
    }
  },

  data () {
    return {
      tag: '',
      tagArr: []
    }
  },

  async mounted () {
    await this.$nextTick()

    this.tagArr = [...this.defaultTags, ...this.value]
  },

  methods: {
    removeTag (index) {
      this.tagArr.splice(index, 1)
    },

    addTag (type) {
      const tag = this.tag
      const tagArr = this.tagArr

      if (!tag || tagArr.indexOf(tag) !== -1) {
        return
      }

      tagArr.push(tag)

      this.tag = ''

      this.$emit('input', this.tagArr)
    }
  }
}
</script>
