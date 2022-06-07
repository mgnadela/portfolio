export default {
  name: 'slide',
  data () {
    return {
      transition: 2000, //deafult transition duration
      duration: 3000, //deafult sliding duration
      direction: 'h',

      timeouts: [],

      cnt: 0,
      val: 0,
      direction: -1,

      tick: 0,
      reqs: null
    }
  },

  async mounted () {
    await this.$nextTick()
    this.clear()
    this.init()
    this.animate()

    window.addEventListener('resize', () => {
      this.clear()
      this.init()
      this.animate()
    })
  },

  methods: {
    getItems () {
      let itemOffset = 0
      let parentOffset = 0
      if (this.$refs.parent !== undefined && this.$refs.parent.children && this.$refs.parent.children.length) {
        itemOffset = this.direction === 'h' ?  this.$refs.parent.children[0].offsetWidth : this.$refs.parent.children[0].offsetHeight
        parentOffset = this.direction === 'h' ? this.$refs.parent.offsetWidth : this.$refs.parent.offsetHeight
      }
      return  {
        parentOffset,
        itemOffset,
        children: this.$refs.parent !== undefined ? this.$refs.parent.children : []
      }
    },


    init () {
      this.cnt = 0
      let chilren = this.getItems().children
      for (let i = 0; i < chilren.length; i++) {
        chilren[i].val = 0
        chilren[i].classList.remove('with-animation')
        this.set(chilren[i])
      }
    },

    animate () {
      if (this.tick >= (this.duration / 10)) { //run script if within duration
        this.tick = 0
        if (this.cnt === this.getItems().children.length) this.cnt = 0
        if (this.getItems().children.length <=  this.getItems().parentOffset / this.getItems().itemOffset) return

        let parent = this.getItems().parentOffset
        let item = this.getItems().itemOffset
        let chilren = this.getItems().children

        for (let i = 0; i < chilren.length; i++) {
          chilren[i].classList.add('with-animation')
          chilren[i].val +=  item * -1
          this.set(chilren[i])
        }

        this.timeouts.push(setTimeout(() => {
          if (!chilren[this.cnt]) return
          chilren[this.cnt].classList.remove('with-animation')
          chilren[this.cnt].val = item * (chilren.length - (this.cnt+1))
          this.set(chilren[this.cnt])

          this.cnt+= 1
        }, this.transition * 1000))
      }

      this.tick++
      this.reqs = requestAnimationFrame(this.animate)
    },

    set (child) {
      child.style.transform = this.direction === 'h' ? `translateX(${child.val}px)` : `translateY(${child.val}px)`
    },

    clear () {
      for (let i = 0;  i < this.timeouts.length; i++) {
        clearTimeout(this.timeouts[i])
      }
      cancelAnimationFrame(this.reqs)
    }
  }
}
