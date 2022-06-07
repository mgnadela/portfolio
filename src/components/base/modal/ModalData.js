export default {
  install: (Vue, options) => {
    Vue.prototype.ModalData = function (payload) {
      const frozenData = Object.freeze(JSON.parse(JSON.stringify(payload)))

      this.data = payload

      let _status = false
      Object.defineProperty(this, '$status', {
        enumerable: false,
        get: () => _status,
        set: val => {
          _status = val
          this.__ob__.dep.notify()
        }
      })

      Object.defineProperty(this, '$reset', {
        value: () => {
          this.$status = false
          this.data = Object.assign({}, frozenData)
        }
      })

      return this
    }
  }
}
