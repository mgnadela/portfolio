/**
  @Description:

  import DetectDevice from '@/assets/js/mixins/base/DetectDevice'

  mixins: [ DetectDevice ]

  ==> shows div if [window width] is greater than 100
  <div v-if="$_device.width > 100"></div>

  ==> shows div if [window height] is greater than 100
  <div v-if="$_device.height > 100"></div>

  ==> shows div if operating system used is IOS
  <div v-if="$_device.os.name === 'macintosh'"></div>
**/
import Vue from 'vue'

const data = Vue.observable({
  width: 0,
  height: 0,
  hoverable: false
})

function setHoverable () {
  const html = document.querySelector('html')
  const canHover = !(matchMedia('(hover: none)').matches)
  data.hoverable = canHover

  if (html) {
    if (data.hoverable) {
      html.classList.add('hoverable')
    } else {
      html.classList.remove('hoverable')
    }
  }
}

function getWindowDimensions () {
  data.width = window.innerWidth || document.documentElement.clientWidth
  data.height = window.innerHeight || document.documentElement.clientHeight

  setHoverable()
}

function handleDeviceInfo (header, list) {
  let regex = null
  let match = null
  let regexv = null
  let matches = null
  let version = ''

  for (const item of list) {
    regex = new RegExp(item.value, 'i')
    match = regex.test(header)

    if (match) {
      regexv = new RegExp(item.version + '[- /:;]([\\d._]+)', 'i')
      matches = header.match(regexv)

      if (matches && matches[1]) {
        matches = matches[1]
      }

      if (matches) {
        matches = matches.split(/[._]+/)

        for (const [index, value] of matches.entries()) {
          version += !index ? value + '.' : value
        }
      } else {
        version = 0
      }

      return {
        name: item.name.toLowerCase(),
        version: Number(version)
      }
    }
  }

  return {
    name: '',
    version: 0
  }
}

export default {
  computed: {
    $_device () {
      const html = document.querySelector('html')
      const header = [ navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor, window.opera]
      const dataOs = [
        { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
        { name: 'Windows', value: 'Win', version: 'NT' },
        { name: 'iPhone', value: 'iPhone', version: 'OS' },
        { name: 'iPad', value: 'iPad', version: 'OS' },
        { name: 'Kindle', value: 'Silk', version: 'Silk' },
        { name: 'Android', value: 'Android', version: 'Android' },
        { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
        { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
        { name: 'Macintosh', value: 'Mac', version: 'OS X' },
        { name: 'Linux', value: 'Linux', version: 'rv' },
        { name: 'Palm', value: 'Palm', version: 'PalmOS' }
      ]
      const dataBrowser = [
        { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
        { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
        { name: 'Safari', value: 'Safari', version: 'Version' },
        { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
        { name: 'Opera', value: 'Opera', version: 'Opera' },
        { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
        { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
      ]

      const os = handleDeviceInfo(header.join(' '), dataOs)
      const browser = handleDeviceInfo(header.join(' '), dataBrowser)

      if (browser.name !== 'MSIE') {
        html.classList.add('browser-not-ie')
      }

      html.classList.add(`browser-${browser?.name.toLowerCase()}`)
      html.classList.add(`os-${os?.name.toLowerCase()}`)

      const deviceType = () => {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
          return 'tab';
        } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
          return 'mb';
        }
        return 'pc'
      }

      return {
        os,
        browser,
        width: data.width,
        height: data.height,
        hoverable: data.hoverable,
        type: deviceType()
      }
    }
  },

  created () {
    window.addEventListener('resize', getWindowDimensions)
    getWindowDimensions()
  }
}
