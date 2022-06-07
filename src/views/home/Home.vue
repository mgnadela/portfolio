<template>
  <div class="home-inner">
    <div class="main__toolbar">
      <InputWrap
        placeholder="test"
        v-model="amount"
        isAmount
      />

      <search-bar
        v-model="searchParams.main"
        :translations="translations"
        :config="searchbarConfig"
        @search="handleSearch($event)"
      >
        <template #actions>
          <button
            class="btn-default"
            @click="modals.test.$status = 1"
          >
            <span>
              MODAL
            </span>
          </button>
        </template>
      </search-bar>
    </div>

    <div class="main__contents">
      <accordion>
        <template #title>
          Lorem ipsum
        </template>

        <template #body>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </template>
      </accordion>

      <br />
      <br />
      <br />

      <form-list @submit.prevent="">
        <template #header>
          <form-list-layer
            max-width="300px"
            position="right"
          >
            <form-list-item label="created date">
              <DateTimePicker
                mode="date"
                type="datetime"
              />
            </form-list-item>

            <form-list-item label="deleted date">
              <DateTimePicker
                mode="date"
                type="datetime"
              />
            </form-list-item>

            <form-list-item
              label="can't edit data"
              is-display
            >
              lorem
            </form-list-item>

            <tooltip position="left">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqu.
            </tooltip>
          </form-list-layer>
        </template>

        <template #body>
          <form-list-layer>
            <form-list-item
              class="is-title"
              label="title"
            >
              <Quill
                ref="title"
                v-model="test"
                type="title"
                :value="test"
              />
            </form-list-item>

            <form-list-item label="content">
              <TagInput
                v-model="tagsArr"
                :default-tags="['a', 'b']"
              />
            </form-list-item>
          </form-list-layer>
        </template>

        <template #footer>
          <button class="btn-default">
            <span>
              asdas
            </span>
          </button>
        </template>
      </form-list>
    </div>

    <modal
      v-if="modals.test.$status"
      v-model="modals.test.$status"
      title="Modal"
      close-on-outside-click
      close-on-escape
      use-max-height
      :max-width="500"
      width="60%"
      @close="modals.test.$reset"
    >
      <p v-for="a in 1">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </modal>
  </div>
</template>

<script>
// vuex || sockets

// lib

// translations || dictionary

// components
import Accordion from '@/components/base/Accordion'
import { FormList, FormListLayer, FormListItem } from '@/components/base/form-list'

const SearchBar = () => import('@/components/base/SearchBar')
const TextArea  = () => import('@/components/base/TextArea')
const DateTimePicker  = () => import('@/components/base/DateTimePicker')
const TagInput  = () => import('@/components/base/TagInput')
const Quill  = () => import('@/components/base/Quill')
const AttachImage = () => import('@/components/base/AttachImage')
const Tooltip = () => import('@/components/base/Tooltip')

export default {
  name: 'Home',

  components: {
    SearchBar,
    TextArea,
    DateTimePicker,
    Quill,
    FormList,
    FormListLayer,
    FormListItem,
    TagInput,
    AttachImage,
    Accordion,
    Tooltip
  },

  data () {
    return {
      translations: {},
      modals: {
        test: new this.ModalData({name: 'asd'})
      },

      amount: 0,

      attachImage: {
        // image: require('@/assets/images/favicon/default.png'),
        image: null,
        existing: null
      },

      test: 'asd',
      tagsArr: [],

      searchParams: {
        main: this.$_defaultSearchParams()
      },

      searchbarConfig: {
        hasRefresh: true,
        hasClear: true,
        dateConfig: {
          dateBy: [
            {
              value: 'created_at',
              display: 'created date'
            },
            {
              value: 'updated_at',
              display: 'updated date'
            },
            {
              value: 'deleted_at',
              display: 'deleted date'
            }
          ],
          dateType: 'datetime',
          dateRange: true
        },
        filterBy: [
          {
            value: 'login_id',
            display: 'login id'
          },
          {
            value: 'login_name',
            display: 'login name'
          }
        ]
      }
    }
  },

  created () {},

  methods: {
    async handleSearch (data) {
      const path = '/'
      const query = data ? data.query : this.searchParams

      this.$router.push({ path, query: query })

      if (data && data.type === 'clear') {
        await this.$nextTick()
        this.$router.push({ path })
      }
    }
  }
}
</script>
