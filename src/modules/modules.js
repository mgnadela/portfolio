import camelCase from 'lodash/camelCase'

const items = require.context('./items', false, /\.js$/)
const modules = {}
const keys = items.keys()

for (let i = 0; i < keys.length; i++) {
  const fileName = keys[i]
  const moduleName = camelCase(fileName.replace(/(\.\/|\.js)/g, ''))
  modules[moduleName] = items(fileName).default
}

export default modules
