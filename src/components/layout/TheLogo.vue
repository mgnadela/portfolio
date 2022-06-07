<template>
  <div :class="`logo--${name.toLowerCase()}`">
    <div class="logo__inner">
      <router-link
        v-if="redirect"
        to="/"
      />

      <img
        v-if="hasLogo"
        :src="this.url"
        :alt="`${name.toLowerCase()}`"
      />

      <template v-else>
        {{ name }}
      </template>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Logo',

  props: {
    name: {
      type: String,
      default: ''
    },

    location: {
      type: String,
      default: ''
    },

    redirect: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      url: '',
      hasLogo: false
    }
  },

  watch: {
    img () {
      this.getImg()
    }
  },

  mounted () {
    this.getImg()
  },

  methods: {
    getImg () {
      try {
        let img_url = new Image()
        let siteName = this.name.split(' ').join('-')

        if (this.location) {
          siteName = `${siteName}_${this.location}`
        }

        this.hasLogo = true
        this.url = require(`@/assets/images/logo/${siteName.toLowerCase()}.png`)
      } catch (e) {
        this.hasLogo = false
      }
    }
  }
}
</script>
