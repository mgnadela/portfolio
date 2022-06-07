import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/modules'

// polyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'array-flat-polyfill'
import '@/assets/js/polyfill/ObjectValues.js'

// lib
import VueSanitize from 'vue-sanitize'
import VueMeta from 'vue-meta'

import axios from 'axios'

import _debounce from 'lodash/debounce'
import _includes from 'lodash/includes'

import { quillEditor } from 'vue-quill-editor'

// components
import '@/components/base/select'
import '@/components/base/table'
import '@/components/base/gamelist'
import '@/components/base/modal'
import InputWrap from '@/components/base/InputWrap'

// mixins
import Sweetalert2 from 'sweetalert2/dist/sweetalert2.js'
import Swal from '@/assets/js/mixins/base/Swal'
import SiteDefaults from '@/assets/js/mixins/common/SiteDefaults'
import Translate from '@/assets/js/translations/Translate'
import DetectDevice from '@/assets/js/mixins/base/DetectDevice'
import { vueLocalStorage } from '@/assets/js/mixins/base/VueLocalStorage'
import { vueSessionStorage } from '@/assets/js/mixins/base/VueSessionStorage'

// helpers
import {
  formatDate,
  formatAmount
} from '@/assets/js/common/Helpers'

// style
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

const themes = [
  {
    name: 'logo',
    theme: 'theme-1'
  }
]

let theme = process.env.VUE_APP_THEME || 'theme-1'
let themeName = process.env.VUE_APP_NAME.toLowerCase() || 'LOGO'

if (process.env.VUE_APP_FORCE_THEME === '1') {
  const curr = themes.find(e => e.theme === 'theme-1')

  theme = curr.theme
  themeName = curr.name

  console.log(`force theme ===> ${theme}`)
}

import(/* webpackPreload: true */ `@/assets/sass/themes/${theme}/styles.scss`) // eslint-disable-line

window.__theme = theme
window.__themeName = themeName.toLowerCase()
window.__path = process.env.VUE_APP_AWS_URL || process.env.VUE_APP_STATIC_ASSET_PATH || '/'

/*
 * axios default configurations
 */
axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:4000'
axios.defaults.headers.common.Authorization = `Bearer ${vueLocalStorage.getItem('token')}`

/*
 * request interceptor,
 * if the resource responds with 401,
 * then redirect
 */
axios.interceptors.response.use(config => config, err => {
  const { name } = router.currentRoute

  const swalMessageList = {
    kr: '아무 동작 없이 일정시간이 경과하여 로그아웃 되었습니다. 다시 로그인 하십시오.',
    en: 'Your session has expired. Please login again.',
    jp: '一定時間、何の動作も行われなかった為、ログアウトされました。もう一度ログインしてください'
  }

  const errorMessage = swalMessageList[vueLocalStorage.getItem('lang') || 'kr']

  const expireAlert = () => Sweetalert2.fire({
    customClass: 'swal--warning',
    text: null,
    type: null,
    html: `
      <div class="swal__header">
        <div class="swal__title"></div>
      </div>
      <div class="swal__body">
        <p>${errorMessage}</p>
      </div>
    `
  })

  if (err.response && err.response.status === 418) {
    if (router.currentRoute.name !== 'login' || parseInt(router.currentRoute.query.r) !== 418) {
      router.push('/login?r=418')
      vueLocalStorage.clear()
      vueSessionStorage.clear()
      window.location.reload()
    }
    return
  }

  if (err.response && err.response.status === 401) {
    vueLocalStorage.clear()
    vueSessionStorage.clear()

    if (name !== 'login' && name !== 'register') {
      vueLocalStorage.removeItem('userId')
      vueSessionStorage.clear()
      router.push('/logout')

      if (name !== 'logout') {
        expireAlert()
      }
      return router.push(`/login?r=401&f=${router.currentRoute.name !== 'logout' ? router.currentRoute.name : ''}`)
    }

    // window.location.reload()
  }

  return Promise.reject(err)
})

/*
 * default params for quill
 */
const defaultOptions = {
  allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'hr', 'br', 'div', 'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'font'],
  disallowedTagsMode: 'escape',
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    img: ['src', 'id', 'class', 'width', 'height'],
    iframe: ['src', 'id', 'class', 'width', 'height'],
    h1: ['style'],
    h2: ['style'],
    h3: ['style'],
    h4: ['style'],
    h5: ['style'],
    h6: ['style'],
    blockquote: ['style'],
    p: ['style'],
    b: ['style'],
    i: ['style'],
    strong: ['style'],
    em: ['style'],
    strike: ['style'],
    hr: ['style'],
    br: ['style'],
    div: ['style'],
    span: ['style'],
    li: ['class'],
    font: ['class', 'style', 'color', 'size', 'face']
  },
  // Lots of these won't come up by default because we don't allow them
  selfClosing: ['img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'],
  // URL schemes we permit
  allowedSchemes: ['http', 'https', 'ftp', 'mailto'],
  allowedSchemesByTag: {},
  allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
  allowProtocolRelative: true
}

Vue.config.productionTip = false
Vue.config.devtools = process.env.VUE_APP_ENV === 'development'

Vue.use(VueSanitize, defaultOptions)
Vue.use(VueMeta)

Vue.component(InputWrap.name, InputWrap)

Vue.filter('date', formatDate)
Vue.filter('formatAmount', formatAmount)

Vue.mixin(SiteDefaults)
Vue.mixin(Swal)
Vue.mixin(Translate)
Vue.mixin(DetectDevice)

if (location.protocol !== 'http:') {
  location.protocol = 'http:'
}

new Vue({
  router,
  store,

  components: {
    quillEditor
  },

  render: h => h(App)
}).$mount('#app')
