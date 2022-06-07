<template>
  <div
    id="app"
    class="main"
  >
    <div class="main-sidebar sidebar">
      <div
        ref="sidebar-head"
        class="sidebar__head"
      >
        <Hamburger
          v-if="$_device.width < 768"
          v-model="showNavigation"
          ref="hamburger"
          :count="3"
          type="lines"
        />

        <div class="sidebar__logo">
          <span>
            ADMIN
          </span>
        </div>
      </div>

      <TheNav
        ref="nav"
        :class="{ 'is-show': showNavigation }"
      />
    </div>

    <div class="main-body">
      <Router-view class="main-body-inner" />
    </div>

    <!-- <TheFooter /> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'

// components
const Hamburger = () => import('@/components/base/Hamburger')
const TheNav = () => import('@/components/layout/TheNav')
const TheFooter = () => import('@/components/layout/TheFooter')

export default {
  name: 'App',

  components: {
    Hamburger,
    TheNav,
    TheFooter
  },

  data () {
    return {
      showNavigation: false
    }
  }
}
</script>
