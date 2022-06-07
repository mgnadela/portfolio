<!--
  @USE AS:
  import AttachImage from '@/components/base/AttachImage'
  const AttachImage = () => import('@/components/base/AttachImage')

  components: { AttachImage }

  data () {
    return {
      attachImage: undefined
    }
  }

  <AttachImage
    v-model="attachImage"
    name="attach-image"
    ref="attach-image"
  />
-->

<template>
  <div
    class="attach-image"
    ref="attach-image"
  >
    <input
      ref="attach-image-file"
      :disabled="disabled"
      :multiple="multiple"
      :accept="accept"
      :name="name"
      :id="name"
      type="file"
      class="attach-image__file"
    />

    <label
      class="attach-image__lbl"
      :for="name"
      @dragover.prevent
      @drop.prevent.stop="handleFileDrop"
    >
      <img
        v-if="preview"
        :src="preview"
        class="attach-image__preview"
      />

      <template v-else>
        <i class="ico-no-image"></i>
        <span>
          {{ translate('attach image') }}
        </span>
      </template>
    </label>

    <button
      v-if="(preview || files) && showRemove"
      class="btn-delete"
      type="button"
      @click="clearImage"
    >
      <i class="ico-close"></i>
    </button>
  </div>
</template>

<script>
// translation
import translations from '@/assets/js/translations/base/attach-image'

const getImageURL = file => new Promise((resolve, reject) => {
  try {
    const fileReader = new FileReader()
    fileReader.onload = event => resolve(event.target.result)
    fileReader.readAsDataURL(file)
  } catch (error) {
    reject(error)
  }
})

export default {
  name: 'AttachImage',

  props: {
    value: {
      type: [String, File, FileList],
      default: null
    },

    multiple: {
      type: Boolean,
      default: false
    },

    accept: {
      type: String,
      default: 'image/*'
    },

    showRemove: {
      type: Boolean,
      default: true
    },

    name: {
      type: String,
      default: 'attach-image'
    },

    disabled: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      translations,
      inputElement: undefined,
      files: undefined,
      preview: undefined
    }
  },

  computed: {
    defaultPath () {
      return this.srcPrefix || this.$_basePath
    }
  },

  async mounted () {
    await this.$nextTick()

    const waitUntilRefIsLoaded = async ref => {
      while (!this.$refs[ref]) {
        await new Promise(resolve => requestAnimationFrame(resolve))
      }

      return this.$refs[ref]
    }

    this.inputElement = await waitUntilRefIsLoaded('attach-image-file')

    if (this.value) {
      this.preview = this.value
    }
  },

  methods: {
    async handleFileDrop (e) {
      this.files = e.dataTransfer.files

      console.log(this.files)

      await this.readFiles(this.files)

      e.target.value = null
    },

    async readFiles (files) {
      if (files.length) {
        this.preview = await getImageURL(files[0])
        this.$emit('input', this.multiple ? files : files[0])
      }
    },

    clearImage () {
      this.preview = null
      this.files = null

      if (this.preview) {
        this.fileImage = this.preview
      } else {
        this.fileImage = null
      }

      this.$emit('input', '')
    }
  }
}
</script>
