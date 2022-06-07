/**
@Description:

import sanitize from '@/assets/js/mixins/base/Sanitize'

mixins: [
  sanitize
]
**/

const sanitize = {
  computed: {
    $_sanitizeConfig () {
      const allowedAttributes = {
        img: ['src', 'id', 'class', 'width', 'height'],
        iframe: ['src', 'id', 'class', 'width', 'height'],
        li: ['style', 'class'],
        span: ['style', 'class'],
        strong: ['style', 'class'],
        u: ['style', 'class'],
        p: ['style', 'class'],
        s: ['style', 'class'],
        b: ['style', 'class'],
        i: ['style', 'class'],
        em: ['style', 'class'],
        a: ['href'],
        font: ['class', 'style', 'color', 'size', 'face']
      }

      return {
        title: {
          allowedTags: ['ol', 'ul', 'li', 'u', 'span', 'p', 's', 'u', 'b', 'i', 'strong', 'em', 'strike', 'p', 'a', 'br', 'strong', 'font'],
          allowedAttributes: allowedAttributes,
          disallowedTagsMode: 'escape'
        },

        quill: {
          allowedTags: ['ol', 'ul', 'li', 'u', 'span', 'p', 's', 'u', 'b', 'i', 'strong', 'em', 'strike', 'p', 'a', 'br', 'strong', 'font'],
          allowedAttributes: allowedAttributes,
          disallowedTagsMode: 'escape'
        },

        table: {
          allowedTags: ['ol', 'ul', 'li', 'u', 'span', 'p', 's', 'u', 'b', 'i', 'strong', 'em', 'strike', 'p', 'a', 'br', 'strong', 'font'],
          allowedAttributes: allowedAttributes,
          disallowedTagsMode: 'escape'
        },

        contentDefault: {
          allowedTags: ['ol', 'ul', 'li', 'u', 'span', 'p', 's', 'u', 'b', 'i', 'strong', 'em', 'strike', 'p', 'a', 'br', 'strong', 'font'],
          allowedAttributes: allowedAttributes,
          disallowedTagsMode: 'escape'
        }
      }
    }
  },

  methods: {
    $_sanitizeTitle (text, postHtml = false, location = null) {
      let newText

      if (!text) {
        return text
      }

      text = text.replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')

      if (postHtml) {
        newText = this.$sanitize(
          text,
          this.$_sanitizeConfig.title
        )
      } else {
        if (location === 'quill') {
          return this.$sanitize(
            text,
            this.$_sanitizeConfig.quill
          )
        }

        newText = this.$sanitize(
          text,
          this.$_sanitizeConfig.contentDefault
        )
      }

      return newText
    },

    $_sanitizeContent (text, postHtml, location = null) {
      let newText

      if (!text) {
        return text
      }

      text = text.replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')

      if (postHtml) {
        if (location === 'table') {
          text = text.replace(/<p><br><\/p>/g, '')

          return this.$sanitize(
            text,
            this.$_sanitizeConfig.table
          )
        } else {
          return this.$sanitize(
            text,
            this.$_sanitizeConfig.quill
          )
        }
      } else {
        if (location === 'quill') {
          return this.$sanitize(
            text,
            this.$_sanitizeConfig.quill
          )
        }

        newText = this.$sanitize(
          text,
          this.$_sanitizeConfig.contentDefault
        )
      }

      return newText
    }
  }
}

export default sanitize
