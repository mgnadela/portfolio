/**
 *
  import { getElement } from '@/assets/js/common/Helpers'
 *
**/

// lib
import moment from 'moment'

export const sleep = time => new Promise(resolve => setTimeout(resolve, time))
export const cloneObj = data => JSON.parse(JSON.stringify(data))

export const isArray = hit => Array.isArray(hit)
export const isObject = hit => !isArray(hit) && typeof hit === 'object'
export const safeLower = str => String(str).toLowerCase()

/*
 * replace {{ word }} in string
 */
export const render = (template, data) => template.replace(/{{(.+?)}}/g, (m, p1) => data[String(p1).trim()]) || ''

/*
 * generate count in table list
 */
export const generateNumber = (index, page, row, order, max) => {
  return order === 'desc' ? max - page * row + row - index
    : max - (max - index - 1) + row * (page - 1)
}

export const joinPath = (...paths) => {
  const trimSlash = str => String(str)
    .replace(/^\/+|\/+$/g, '') // trim start and end slashes

  return paths.map(trimSlash).join('/')
}

/*
 *  returns total number of zeroes
 */
export const numberOfZeros = num => {
  return num.toString().split('').length - 1
}

/*
 * generate to korean
 */
export const generateKoreanAmount = number => {
  const num = number.toString().split('')
  let temp = 0

  if (numberOfZeros(number) === 3) {
    temp = `${num[0]}천`
  }

  if (numberOfZeros(number) === 4) {
    temp = `${num[0]}만`
  }

  if (numberOfZeros(number) === 5) {
    temp = `${num[0]}${num[1]}만`
  }

  if (numberOfZeros(number) === 6) {
    temp = `${num[0]}${num[1]}${num[2]}만`
  }

  return temp
}

export const toAmount = data => {
  return Number(replaceChar(String(data), ',', ''))
}

/*
 * convert to camel case
 */
export const toCamelCase = data => {
  if (!data) {
    return ''
  }

  let temp = ''

  const tempType = replaceChar(data).split(' ')

  for (let i = 0; i < tempType.length; i++) {
    let item = tempType[i]

    if (i !== 0) {
      item = capitalize(tempType[i])
    }

    temp = temp + item
  }

  return temp
}

/*
 * convert to pascal case
 */
export const toPascalCase = data => {
  if (!data) {
    return ''
  }

  return replaceChar(capitalize(data), ' ', '')
}

/*
 * convert to kebab case
 */
export const toKebabCase = data => {
  if (!data) {
    return ''
  }

  data = data.toLowerCase()
  data = data.split(' ').join('-')

  return data
}

/*
 * convert to snake case
 */
export const toSnakeCase = data => {
  if (!data) {
    return ''
  }

  data = data.toLowerCase()
  data = data.split(' ').join('_')

  return data
}

/*
 * returns all first letter of word
 */
export const getInitials = data => {
  if (!data) {
    return ''
  }

  data = replaceChar(data).toLowerCase()
  data = data.split(' ')

  const result = []

  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    result.push(item[0])
  }

  return result.join('')
}

/*
 * covert data to array
 */
export const toArray = foo => Array.isArray(foo) ? foo : [foo]

/*
 * generate random number
 */
export const randomNum = (min, max) => {
  return Math.random() * (max - min + 1) + min
}

export const getElement = async selector => {
  while (!document.querySelector(selector)) {
    await new Promise(resolve => requestAnimationFrame(resolve))
  }

  return document.querySelector(selector)
}

/*
 * parse string
 */
export const parsify = (str, def, showError = true) => {
  if ([null, undefined, 'null', 'undefined'].includes(str)) {
    return def
  }

  const constructorName = str.constructor.name
  if (constructorName === 'Array' || constructorName === 'Object') {
    return JSON.parse(JSON.stringify(str))
  }

  try {
    return JSON.parse(str)
  } catch (error) {
    showError && console.log(new Error(`Invalid JSON Format. Received ${str}`).stack)
    return def
  }
}

/*
 * convert object to FormData
 */
export const objtoFormData = json => {
  const data = new FormData()

  for (const key in json) {
    if (!json.hasOwnProperty(key)) {
      continue
    }

    if (typeof json[key] === 'boolean') {
      json[key] = json[key] ? 1 : 0
    }

    if (typeof json[key] === 'object' && !(json[key] instanceof File)) {
      json[key] = JSON.stringify(json[key])
    }

    data.append(key, json[key])
  }

  return data
}

/*
 * returns offset of element
 */
export const getOffset = el => {
  let _x = 0
  let _y = 0
  const _bottom = 0

  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft
    _y += el.offsetTop - el.scrollTop
    el = el.offsetParent
  }

  return { top: _y, left: _x, bottom: _bottom }
}

/*
 * returns css styles
 */
export const getComputedStyles = (type, refs) => {
  const el = refs
  const style = getComputedStyle(el, null)

  return parseInt(style[type]) || 0
}

/*
 * returns css property values
 */
export const getPropertyValues = (type, refs) => {
  const el = refs
  const style = getComputedStyle(el, null).getPropertyValue(type)

  return style
}

/*
 * checks and accepts "Number" values
 */
export const isNumber = e => {
  e = (e) || window.event
  const target = e.target
  const charCode = (e.which) ? e.which : e.keyCode

  if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
    e.preventDefault()
  }

  const index = target.value.indexOf('.')
  if (index > 0 && charCode == 46) {
    e.preventDefault()
  }

  return true
}

/*
 * return capital string
 */
export const capitalize = str => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

/*
 * converts number to amount (1000 => 1,000)
 */
export const formatAmount = (value, format = 'whole') => {
  let amount = ''
  let decimal = []
  let result = 0

  if (value != null) {
    amount = value.toString()

    if (format === 'whole') {
      if (amount.indexOf('.') !== -1) {
        amount = amount.split('.')
        amount[0] = amount[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        result = amount[0]
      } else {
        result = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
    } else if (format === 'round') {
      amount = (Math.round(parseFloat(amount))).toString()
      result = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    } else {
      if (amount.indexOf('.') !== -1) {
        amount = amount.split('.')
        amount[0] = amount[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        decimal = amount[1].split('')

        if (decimal.length > 2) {
          amount[1] = amount[1].slice(0, 2)
        }

        if (decimal.length === 1) {
          amount[1] = amount[1] + '0'
        }

        result = amount.join('.')
      } else {
        amount = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        result = amount + '.00'
      }
    }
  }

  return result
}

/*
 * returns formatted date
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  return date ? moment(date).format(format) : '-'
}

export const parseDate = date => {
  date = date ? date.replace(/-/g, '/') : date

  return new Date(date)
}

export const tzDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  let result = '-'

  if (!(date === null)) {
    result = moment(date).tz('Asia/Seoul').format(format)
  }

  return result
}

/*
 * replace specific characters
 * @default: -_\/
 */
export const replaceChar = (str, find = '[-_\\/]', value = ' ') => {
  return str && str.replace(new RegExp(find, 'g'), value)
}

export const removeNonAlphaNum = str => {
  return str && str.replace(/[-_/,()]/g, ' ')
}

/**
  * getKey(this.lang, {
  *   en: payload[en],
  *   kr: payload[kr],
  *   jp: payload[jp],
  *   default: payload[en]
  * })
 */
export const getKey = (key, obj) => obj[key] === undefined ? obj.default : obj[key]

/*
 * translate data
 * accepts object and string
 */
export const translateData = data => {
  if (typeof data === 'string') {
    return data
  }

  if (typeof data === 'object') {
    return getKey(window.__themeName, data)
  }
}

/*
 * copy text on click
 */
export const copyText = ({ el, root }) => {
  if (!el) {
    return false
  }

  try {
    el.select()
    el.setSelectionRange(0, 99999)
    document.execCommand('copy')
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

/*
 * checks if element is still in viewport
 */
export const isInViewport = (elem) => {
  const bounding = elem.getBoundingClientRect()

  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}
