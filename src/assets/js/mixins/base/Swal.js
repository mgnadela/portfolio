/**
  @Description:
  import Swal from '@/assets/js/mixins/base/Swal'

  mixins: [ Swal ]

  types: error, success, prompt, warning

  this.$_swal({
    type: 'error',
    message: '',
    title: '',
    options: {},
    callback: {
      success: () => {},
      cancel: () => {}
    }
  })
**/

import Vue from 'vue'

// lib
import $ from 'jquery'
import sweetalert2 from 'sweetalert2/dist/sweetalert2.js'

import _merge from 'lodash/merge'
import _toLower from 'lodash/toLower'

// translations
import translations from '@/assets/js/translations/base/alerts'

const swalPlugin = {}
swalPlugin.install = vue => { vue.prototype.$sweetalert2 = sweetalert2 }
Vue.use(swalPlugin)

export default {
  methods: {
    $_swal ({ type, message = '', title = '', options = {}, callback = {} }) {
      title = _toLower(title)
      type = _toLower(type)

      if (!title && (type === 'success' || type === 'error')) {
        title = type
      }

      if (!message) {
        if (type === 'prompt') {
          message = this.translate('proceed', { translations })
        }

        if (title.indexOf('error') > -1) {
          message = this.translate('try again', { translations })
        }
      }

      title = this.translate(title)

      let swalOption = {
        customClass: 'swal--' + type,
        text: null,
        type: null,
        confirmButtonText: this.translate('confirm', { translations }),
        cancelButtonText: this.translate('cancel', { translations }),
        showCancelButton: false,
        reverseButtons: false,
        allowOutsideClick: false,
        html: `
        <div class="swal__header">
          <div class="swal__header--inner">
            <div class="swal__title">
              <h2>
                ${title}
              </h2>
            </div>
          </div>
        </div>

        <div class="swal__body">
          <p>
            ${message}
          </p>
        </div>
        `
      }

      if (type === 'error') {
        const additionalOptions = { showCancelButton: false }

        swalOption = _merge(swalOption, additionalOptions)
      } else if (type === 'prompt') {
        const additionalOptions = { showCancelButton: true }

        swalOption = _merge(swalOption, additionalOptions)

        if (Object.keys(options).length > 0) {
          swalOption = _merge(swalOption, options)
        }
      }

      if (!callback) {
          this.$sweetalert2(swalOption)
      } else {
          this.$sweetalert2(swalOption).then(result => {
          if (result.value) {
            if (typeof callback === 'function') {
              callback()
            }
            if (typeof callback.success === 'function') {
              callback.success()
            }
          }

          if (!result.value) {
            if (typeof callback.cancel === 'function') {
              callback.cancel()
            }
          }
        })
      }

      const swalBody = document.querySelector('.swal__body')

      if (!message) {
        swalBody.style.display = 'none'
      }

      if (type !== 'prompt') {
        $('.swal2-confirm').html('<span>' + this.translate('confirm') + '</span>')
      } else {
        $('.swal2-confirm').html('<span>' + this.translate('yes') + '</span>')
      }

      $('.swal2-cancel').html('<span>' + this.translate('cancel') + '</span>')
    }
  }
}
