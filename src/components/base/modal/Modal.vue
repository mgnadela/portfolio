<!--
  @USE AS:
  import '@/components/base/modal'

  data: () => ({
    modals: {
      test: new this.ModalData({
        name: undefined,
        value: undefined
      })
    }
  })

  <button @click="modal.test.$status = true">
    MODAL
  </button>

  <modal
    v-if="modals.test.$status"
    v-model="modals.test.$status"
    title="Modal"
    close-on-outside-click
    close-on-escape
    use-max-height
    :max-width="500"
    width="60%"
    @close="modals.test.$reset"
  >
    <template #toolbar>
      toolbar
    </template>

    asdasdasd

    <template #footer>
      footer
    </template>
  </modal>
-->

<template>
  <transition
    v-show="show"
    name="fade"
  >
    <div
      v-show="show"
      ref="modal"
      class="modal"
      @click.self="handleOutsideClick"
    >
      <div
        ref="modalInner"
        v-dragged="onDragged"
        v-bind="$attrs"
        class="modal-inner"
        :style="{
          maxWidth: `${maxWidth}`,
          width
        }"
      >
        <div class="modal-extra"></div>
        <div
          v-if="showHeader"
          ref="modalHeader"
          class="modal__header"
        >
          <div class="modal__header-inner">
            <p
              ref="modalTitle"
              class="modal__title"
              v-html="title"
            >
            </p>

            <div
              v-if="$slots.toolbar"
              ref="modalToolbar"
              class="modal__toolbar"
            >
              <slot name="toolbar"></slot>
            </div>

            <div
              v-if="showCloseButton"
              ref="modalButtons"
              class="modal__buttons"
            >
              <button
                v-if="!forceShow"
                class="btn-popup-close"
                @click="closeModal"
              >
                <i class="ico-popup-close"></i>
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="$slots.default"
          ref="modalBody"
          class="modal__body"
          :class="{ 'no-footer' : !$slots.footer }"
          :style="modalBodyStyles"
        >
          <div class="modal__body-inner">
            <slot></slot>
          </div>
        </div>

        <div
          v-if="$slots.footer"
          ref="modalFooter"
          class="modal__footer"
        >
          <div class="modal__footer-inner">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from 'vue'

// lib
import _get from 'lodash/get'

import VDragged from 'v-dragged'

// helpers
import { sleep } from '@/assets/js/common/Helpers'

Vue.use(VDragged)

export default {
  name: 'Modal',

  props: {
    value: {
      type: [Boolean, Number],
      default: false
    },

    title: {
      type: String,
      default: ''
    },

    draggable: {
      type: [Number, Boolean],
      default: false
    },

    bodyOverflow: {
      type: Boolean,
      default: false
    },

    showCloseButton: {
      type: Boolean,
      default: true
    },

    forceShow: {
      type: Boolean,
      default: false
    },

    maxWidth: {
      type: [String, Number]
    },

    width: {
      type: [String, Number]
    },

    useMaxHeight: {
      type: Boolean,
      default: true
    },

    showHeader: {
      type: Boolean,
      default: true
    },

    closeOnEscape: {
      type: Boolean,
      default: true
    },

    closeOnOutsideClick: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      canDrag: false,
      show: null,
      modalBody: 'auto'
    }
  },

  computed: {
    modalBodyStyles () {
      let height = null
      let type = this.useMaxHeight ? 'max-height' : 'height'
      const bodyHeight = this.modalBody - 80

      if (bodyHeight !== 'auto') {
        height = bodyHeight + 'px'
      }

      if (this.$_device.height > 799) {
        if (this.$_device.width > 991) {
          height = bodyHeight + 'px'
        }
      }

      return `${type}: ${height}`
    }
  },

  watch: {
    show (value) {
      const body = document.querySelector('body')

      if (value) {
        body.classList.add('modal--open')

        if (this.bodyOverflow === false) {
          body.style.overflow = 'hidden'
        }
      } else {
        this.$emit('close')
        body.classList.remove('modal--open')
        body.removeAttribute('style')
      }

      this.$emit('input', value)
    },

    value (value) {
      this.show = JSON.parse(JSON.stringify(value))
    }
  },

  async mounted () {
    await this.$nextTick()

    this.handleResize()
    window.addEventListener('keydown', this.handleEscape)
    window.addEventListener('resize', this.handleResize)

    this.show = JSON.parse(JSON.stringify(this.value))

    /*
     * checks if modal inner position
     */
    setTimeout(() => {
      const modalInner = this.$refs.modalInner
      const modalInnerHeight = modalInner.scrollHeight

      const modal = this.$refs.modal
      const modalHeight = modal.scrollHeight

      if (modalHeight < modalInnerHeight) {
        modal.classList.add('modal--top')
      }
    }, 0)
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('keydown', this.handleEscape)
    this.closeModal()
    this.resetDraggedContainer()
  },

  methods: {
    handleResize () {
      this.handleDraggable()
      this.getModalBodyHeight()
      this.getModalHeight()
    },

    handleEscape (e) {
      /*
       * close modal when escape is pressed
       */
       if (!this.closeOnEscape) {
         return
       }

      const key = e.key

      if (key === 'Escape') {
        this.closeModal()
      }
    },

    handleOutsideClick () {
      if (!this.closeOnOutsideClick) {
        return
      }

      this.closeModal()
    },

    async getModalHeight () {
      await this.$nextTick()

      const modal = this.$refs.modal

      if (!modal) {
        return
      }

      const modalInnerHeight = _get(this.$refs, 'modalInner.offsetHeight')

      if ((modalInnerHeight + 30) >= this.$_device.height) {
        if (modal.classList.contains('modal--center')) {
          modal.classList.remove('modal--center')
        }
      } else {
        modal.classList.add('modal--center')
      }
    },

    async getModalBodyHeight () {
      await this.$nextTick()

      const modalHeader = this.$refs.modalHeader ? this.$refs.modalHeader.offsetHeight : null
      const padding = 45

      if (this.$_device.height > 799 && this.$_device.width > 991) {
        if (this.$refs.modalFooter) {
          const modalFooter = this.$refs.modalFooter.offsetHeight
          this.modalBody = this.$_device.height - modalHeader - modalFooter - padding
        } else {
          this.modalBody = this.$_device.height - modalHeader - padding
        }
      }
    },

    closeModal () {
      if (this.forceShow) {
        return
      }

      this.show = false
    },

    onDragged ({ el, deltaX, deltaY }) {
      if (this.canDrag) {
        const style = window.getComputedStyle(el)
        const l = Number(style.left.slice(0, -2)) || 0
        const t = Number(style.top.slice(0, -2)) || 0

        el.style.left = l + deltaX + 'px'
        el.style.top = t + deltaY + 'px'
      }
    },

    handleDraggable () {
      const modalBody = this.$refs.modalBody

      if (modalBody) {
        this.setDraggable()

        modalBody.addEventListener('mouseover', () => this.canDrag = false)
        modalBody.addEventListener('mouseout', () => this.setDraggable())
      }
    },

    setDraggable () {
      const drag = this.draggable

      if (!drag) {
        this.canDrag = false
      } else {
        if (this.$_device.width > 991) {
          this.canDrag = true
        } else {
          this.canDrag = false
        }
      }
    },

    resetDraggedContainer () {
      const modalInner = document.querySelector('.modal-inner')

      if (modalInner) {
        modalInner.removeAttribute('style')
        modalInner.style.width = this.width
        modalInner.style.maxWidth = this.maxWidth
      }
    }
  }
}
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
