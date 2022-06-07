<!--
  @USE AS:
  import { FormList, FormListLayer, FormListItem } from '@/components/base/form-list'

  components: {
    FormList,
    FormListLayer,
    FormListItem
  }

  <form-list
    tag="div" <!- or form ->
    @submit.prevent=""
  >
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
          <Quill
            ref="title"
            v-model="test"
            type="title"
            :value="test"
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
-->

<template>
  <component
    :is="tag"
    class="form-list"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <div
      v-if="$slots.header"
      class="form-list__head"
    >
      <slot name="header"></slot>
    </div>

    <div
      v-if="$slots.body"
      class="form-list__body"
    >
      <slot name="body"></slot>
    </div>

    <div
      v-if="$slots.footer"
      class="form-list__footer"
    >
      <slot name="footer"></slot>
    </div>
  </component>
</template>

<script>
// vuex || sockets

// lib

// translations || dictionary

// mixins

// components

export default {
  name: 'FormList',

  props: {
    tag: {
      type: String,
      default: 'div',
      validator: value => {
        return ['div', 'form'].indexOf(value) !== -1
      }
    }
  }
}
</script>
