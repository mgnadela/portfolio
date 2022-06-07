
/**
 * USAGE
 * import { vueSessionStorage } from '@/assets/js/mixins/base/VueSessionStorage'
 *
 * vueSessionStorage.setItem(key, value)    - Set key to hold the string value. If key already holds a value, it is overwritten, regardless of its type
 * vueSessionStorage.getItem(key)           - Get the value of a key
 * vueSessionStorage.removeItem(key)        - Remove value using key
 * vueSessionStorage.clear()                - Clear all data
 * vueSessionStorage.has(key)               - Check if store the value of a key exists
 * vueSessionStorage.items()                - List down all items in the store
 */

/**
 * TODO: Move to class based
 * Helper function for sessionStorage
 * Requirements
 * @env {VUE_APP_NAME}
 * @env {VUE_APP_TYPE} Optional
 *
 * @param {string} key
 * @param {string} [value]
 * @param {object} [options]
 */

function cached (fn) {
  const cache = Object.create(null)
  return function cachedFn (str) {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

const isDef = cached(v => v !== undefined && v !== null)
const toUnderscore = cached(str => str.split(/ /).join('_').toLowerCase())

const storage = () => {
  const appName = process.env.VUE_APP_NAME ? toUnderscore(process.env.VUE_APP_NAME) : 'app'
  const generateKey = cached(x => {
    return process.env.VUE_APP_TYPE
      ? `${appName}:${toUnderscore(process.env.VUE_APP_TYPE)}:${toUnderscore(x)}`
      : `${appName}:${toUnderscore(x)}`
  })

  return {
    setItem (key, value) {
      if (!isDef(key) || !isDef(value)) {
        console.warn('Invalid value for key or value: ', { key, value })
        return false
      }

      const newKey = generateKey(key)
      return window.sessionStorage.setItem(newKey, value)
    },

    getItem (key) {
      if (!isDef(key)) {
        console.warn('Invalid value for key: ', { key })
        return false
      }

      const newKey = generateKey(key)
      return window.sessionStorage.getItem(newKey)
    },

    removeItem (key) {
      if (!isDef(key)) {
        console.warn('Invalid value for key: ', { key })
        return false
      }

      const newKey = generateKey(key)
      return window.sessionStorage.removeItem(newKey)
    },

    clear () {
      return window.sessionStorage.clear()
    },

    has (key) {
      const newKey = generateKey(key)
      const value = window.sessionStorage.getItem(newKey)

      return !!(value && value !== '')
    },

    get items () {
      return window.sessionStorage
    }
  }
}

export const vueSessionStorage = storage()
