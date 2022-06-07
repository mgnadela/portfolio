<template>
  <div
    class="nav-wrap"
    @click="closeNav"
  >
    <ul class="nav">
      <li
        v-for="(nav, navKey) in navList"
        :key="navKey"
        class="nav__item"
        :class="generateNavClasses(navKey)"
      >
        <div class="nav__main">
          <RouterLink
            v-if="nav.path"
            :to="nav.path"
          />

          <i
            v-if="nav.icon"
            :class="`ico-${nav.icon}`"
          >
          </i>

          <span v-if="nav.name">
            {{ nav.name }}
          </span>
        </div>

        <ul
          v-if="nav.subNav"
          class="nav-sub"
        >
          <li
            v-for="(sub, subKey) in nav.subNav"
            :key="subKey"
            class="nav-sub__item"
            :class="{
              'is-active': sub.active
            }"
          >
            <div class="nav__main">
              <RouterLink :to="sub.path" />
              <span>
                {{ sub.name }}
              </span>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

import _isEmpty from 'lodash/isEmpty'

// mixins
import { toArray } from '@/assets/js/common/Helpers'

export default {
  name: 'Navigation',

  computed: {
    navList () {
      const currPath = this.$route.path
      const list = [
        {
          name: 'home',
          icon: 'default',
          path: '/',
          active: false,
          defaultPath: ['/'],
          subNav: []
        },
        {
          name: 'page1',
          icon: 'default',
          path: '/sample/page1',
          active: false,
          defaultPath: ['/sample/page1'],
          subNav: []
        },
        {
          name: 'page2',
          icon: 'default',
          path: '/sample/page2/page2a',
          defaultPath: ['/sample/page2'],
          active: false,
          subNav: [
            {
              name: 'page2a',
              icon: 'default',
              path: '/sample/page2/page2a',
              defaultPath: ['/sample/page2/page2a'],
              active: false
            },
            {
              name: 'page2b',
              icon: 'default',
              path: '/sample/page2/page2b',
              defaultPath: ['/sample/page2/page2b'],
              active: false
            }
          ]
        }
      ]

      for (let i = 0; i < list.length; i++) {
        const nav = list[i]
        const mainPath = nav.defaultPath || toArray(currPath)
        const subnavList = nav.subNav

        nav.active = false

        if (!_isEmpty(subnavList) && !nav?.path) {
          nav.path =  subnavList?.[0]?.path
        }

        for (let j = 0; j < mainPath.length; j++) {
          const path = mainPath[j]

          if (path === currPath) {
            if (currPath.indexOf(path) > -1) {
              nav.active = true
            }
          }
        }

        for (let j = 0; j < subnavList.length; j++) {
          const subnav = subnavList[j]
          const subPath = subnav.defaultPath || toArray(currPath)
          subnav.active = false

          for (let k = 0; k < subPath.length; k++) {
            const path = subPath[k]

            if (path && currPath.indexOf(path) > -1) {
              subnav.active = true
              nav.active = true
            }
          }
        }
      }

      return list
    }
  },

  mounted () {
    window.addEventListener('keydown', this.handleEscape)
  },

  beforeDestroy () {
    window.removeEventListener('keydown', this.handleEscape)
  },

  methods: {
    closeNav () {
      const parent = this.$parent
      const hamburger = parent.$refs.hamburger

      if (hamburger) {
        hamburger.status = false
      }

      if (parent) {
        parent.showNavigation = false
      }
    },

    generateNavClasses (navKey) {
      const list = this.navList
      const findKey = list.findIndex(e => e.active)

      return {
        'is-active': navKey === findKey
      }
    },

    handleEscape () {
      const key = event.key

      if (key === 'Escape') {
        this.closeNav()
      }
    }
  }
}
</script>
