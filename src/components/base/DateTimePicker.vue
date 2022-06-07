<!--
  @USE AS:
  import DateTimePicker from '@/components/base/DateTimePicker'
  const DateTimePicker  = () => import('@/components/base/DateTimePicker')

  components: { DateTimePicker }

  data () {
    return {
      dateParams: {
        from: '',
        to: ''
      }
    }
  }

  <DateTimePicker
    v-model="dateEnd"
    mode="date"
    placeholder="sample"
    type="datetime"
  />

  <DateTimePicker
    ref="datetimepicker-to"
    v-model="dateFrom"
    mode="from"
    placeholder="sample"
    type="datetime"
    :range="true"
    :set-max="dateTo || ''"
  />

  <DateTimePicker
    ref="datetimepicker-to"
    v-model="dateTo"
    mode="to"
    placeholder="sample"
    type="datetime"
    :range="true"
    :set-min="dateFrom || ''"
  />

  type
    - date = Y/m/d
    - datetime = Y/m/d H:i:s
    - month - Y/m
    - time - H:i:s
-->

<template>
  <div class="input-wrap input-wrap--date">
    <i class="ico-calendar"></i>

    <input
      :ref="mode"
      type="text"
      v-bind="$attrs"
      :value="value"
      v-on="$listeners"
      @input="$emit('update', $event.target.value)"
    />

    <!-- <i
      v-if="value && withReset"
      class="ico-reset-data"
    >
    </i> -->
  </div>
</template>

<script>
import Vue from 'vue'
import $ from 'jquery'
import datetimepickerFactory from 'jquery-datetimepicker'
import datepickerFactory from 'jquery-datepicker'
import moment from 'moment'
Vue.use(datetimepickerFactory)
datepickerFactory($)

export default {
  name: 'DateTimePicker',

  inheritAttrs: false,

  model: {
    prop: 'value',
    event: 'update'
  },

  props: {
    value: {
      type: [String, Number],
      default: null
    },

    type: {
      type: [String],
      default: 'datetime'
    },

    mode: {
      type: [String],
      default: null
    },

    withReset: {
      type: [
        Boolean,
        String
      ],
      default: true
    },

    range: {
      type: Boolean,
      default: false
    },

    setMin: {
      type: [String, Number],
      default: null
    },

    setMax: {
      type: [String, Number],
      default: null
    }
  },

  data () {
    return {
      reset: false
    }
  },

  watch: {
    lang (val) {
      this.changeLanguage(this.type)
    },

    reset () {
      this.resetValue()
      this.reset = false
    }
  },

  mounted () {
    this.setDatepicker()
  },

  beforeDestroy () {
    if (this.type === 'month') {
      $(this.$refs[this.mode]).datepicker('destroy')
    } else {
      $(this.$refs[this.mode]).datetimepicker('destroy')
    }
  },

  methods: {
    changeLanguage (type) {
      if (type === 'datetime') {
        $.datetimepicker.setLocale(this.lang)
      }

      if (type === 'date') {
        // eslint-disable-next-line no-unused-expressions
        $.datepicker.regional[this.lang]
      }
    },

    resetValue () {
      this.$emit('update', '')
    },

    reInitializeDatepicker () {
      if (this.type === 'month') {
        $(this.$refs[this.mode]).datepicker('destroy')
      } else {
        $(this.$refs[this.mode]).datetimepicker('destroy')
      }

      this.setDatepicker()
    },

    setDatepicker () {
      const settings = {
        changeMonth: true,
        changeYear: true,
        yearRange: 'c-80:c+5'
      }

      if (this.range === true) {
        if (this.type === 'month') {
          $(this.$refs.from).datetimepicker('destroy')
          $(this.$refs.to).datetimepicker('destroy')
        } else {
          $(this.$refs.from).datepicker('destroy')
          $(this.$refs.to).datepicker('destroy')
        }
      } else {
        if (this.type === 'month') {
          $(this.$refs[this.mode]).datetimepicker('destroy')
        } else {
          $(this.$refs[this.mode]).datepicker('destroy')
        }
      }

      this.getPicker(settings)
    },

    getPicker (settings) {
      switch (this.type) {
      case 'datetime':
        this.dateTimePicker(settings)
        break

      case 'date':
        this.datePicker(settings)
        break

      case 'time':
        this.timePicker(settings)
        break

      case 'month':
        this.monthPicker(settings)
        break

      default:
        this.dateTimePicker(settings)
      }
    },

    dateTimePicker (settings) {
      if (this.range === true) {
        $(this.$refs.from).datetimepicker({
          format: 'Y/m/d H:i:s',
          settings,
          defaultTime: '00:00',

          onShow: ct => {
            if (this.setMax) {
              $(this.$refs.from).datetimepicker('setOptions', { maxDate: this.setMax })
            }
          },

          onChangeDateTime: date => {
            if (date) {
              this.setChangeDateTime('from')
            }
          },

          onClose: (currentTime, $input) => {
            this.setOnClose('from')
          }
        }) // this.$refs.from

        $(this.$refs.to).datetimepicker({
          format: 'Y/m/d H:i:59',
          settings,
          defaultTime: '23:59',

          onShow: ct => {
            if (this.setMin) {
              $(this.$refs.to).datetimepicker('setOptions', { minDate: this.setMin })
            }
          },

          onChangeDateTime: date => {
            if (date) {
              this.setChangeDateTime('to')
            }
          },
          onClose: (currentTime, $input) => { this.setOnClose('to') }
        }) // this.$refs.to
      } else {
        $(this.$refs[this.mode]).datetimepicker({
          format: 'Y/m/d H:i:s',
          settings,
          defaultTime: '00:00',

          onChangeDateTime: date => {
            if (date) {
              this.setChangeDateTime()
            }
          },
          onClose: (currentTime, $input) => { this.setOnClose() }
        }, this.value ? new Date(this.value) : undefined)

        if (this.value) {
          // this.date = moment.utc(new Date(this.value))
          this.date = moment(new Date(this.value)).format('YYYY/MM/DD HH:mm:ss')
        }
      }
    },

    datePicker (settings) {
      if (this.range === true) {
        $(this.$refs.from).datetimepicker({
          format: 'Y/m/d',
          timepicker: false,
          settings,

          onShow: ct => {
            if (this.setMax) {
              $(this.$refs.from).datetimepicker('setOptions', { maxDate: this.setMax })
            }
          },

          onChangeDateTime: date => {
            if (date) {
              this.setChangeDateTime('from')
            }
          },

          onClose: (currentTime, $input) => {
            this.setOnClose('from')
          }
        })

        $(this.$refs.to).datetimepicker({
          format: 'Y/m/d',
          timepicker: false,
          settings,

          onShow: ct => {
            if (this.setMin) {
              $(this.$refs.to).datetimepicker('setOptions', { minDate: this.setMin })
            }
          },

          onChangeDateTime: date => {
            if (date) {
              this.setChangeDateTime('to')
            }
          },
          onClose: (currentTime, $input) => { this.setOnClose('to') }
        })
      } else {
        $(this.$refs[this.mode]).datetimepicker({
          format: 'Y/m/d',
          timepicker: false,
          settings,

          onChangeDateTime: date => {
            if (date) {
              this.setChangeDateTime()
            }
          },
          onClose: (currentTime, $input) => { this.setOnClose() }
        })
      }
    },

    timePicker (settings) {
      if (this.range === true) {
        $(this.$refs.from).datetimepicker({
          format: 'H:i',
          settings,
          datepicker: false,

          onShow: ct => {
            if (this.setMax) {
              $(this.$refs.from).datetimepicker('setOptions', { maxDate: this.setMax })
            }
          },

          onChangeDateTime: date => {
            if (date) {
              this.setChangeDateTime('from')
            }
          },
          onClose: (currentTime, $input) => { this.setOnClose('from') }
        })

        $(this.$refs.to).datetimepicker({
          format: 'H:i',
          settings,
          datepicker: false,

          onShow: ct => {
            if (this.setMin) {
              $(this.$refs.to).datetimepicker('setOptions', { minDate: this.setMin })
            }
          },

          onChangeDateTime: date => {
            if (date) {
              this.setChangeDateTime('to')
            }
          },
          onClose: (currentTime, $input) => { this.setOnClose('to') }
        })
      } else {
        $(this.$refs[this.mode]).datetimepicker({
          format: 'H:i',
          datepicker: false,
          settings,

          onChangeDateTime: date => { if (date) { this.setChangeDateTime() } },
          onClose: (currentTime, $input) => { this.setOnClose() }
        })
      }
    },

    monthPicker (settings) {
      const format = 'YYYY/MM'

      if (this.range === true) {
        $(this.$refs.from).datepicker({
          dateFormat: format,
          changeMonth: true,
          changeYear: true,
          yearRange: 'c-80:c+5',
          showButtonPanel: true,
          onClose: (dateText, inst) => {
            const selectedVal = inst.selectedYear + '/' + (inst.selectedMonth + 1)
            $(this.$refs.from).val(moment(new Date(selectedVal)).format(format))
            this.setOnClose('from')
          }
        })

        $(this.$refs.from).focus(function () {
          $('.ui-datepicker-calendar').hide()
        })

        $(this.$refs.to).datepicker({
          dateFormat: format,
          changeMonth: true,
          changeYear: true,
          yearRange: 'c-80:c+5',
          showButtonPanel: true,

          onClose: (dateText, inst) => {
            const selectedVal = inst.selectedYear + '/' + (inst.selectedMonth + 1)
            $(this.$refs.to).val(moment(new Date(selectedVal)).format(format))
            this.setOnClose('to')
          }
        })

        $(this.$refs.to).focus(function () {
          $('.ui-datepicker-calendar').hide()
        })
      } else {
        $(this.$refs[this.mode]).datepicker({
          dateFormat: format,
          changeMonth: true,
          changeYear: true,
          yearRange: 'c-80:c+5',
          showButtonPanel: true,

          onClose: (dateText, inst) => {
            const selectedVal = inst.selectedYear + '/' + (inst.selectedMonth + 1)
            $(this.$refs[this.mode]).val(moment(new Date(selectedVal)).format(format))
            this.setOnClose()
          }
        }, this.val)

        $(this.$refs[this.mode]).focus(function () {
          $('.ui-datepicker-calendar').hide()
        })
      }
    },

    setOnClose (type) {
      const self = this
      let dateText = ''

      switch (type) {
      case 'from':
        dateText = $(this.$refs.from).val()
        self.$emit('minDate', dateText)
        break

      case 'to':
        dateText = $(this.$refs.to).val()
        self.$emit('maxDate', dateText)
        break

      default:
        dateText = $(this.$refs[this.mode]).val()
      }

      this.reInitializeDatepicker()
      self.$emit('update', dateText)
    },

    setChangeDateTime (type, value) {
      const self = this
      let dateText

      switch (type) {
      case 'from':
        dateText = $(this.$refs.from).val()
        break

      case 'to':
        dateText = $(this.$refs.to).val()
        break

      default:
        dateText = $(this.$refs[this.mode]).val()
      }

      this.reInitializeDatepicker()
      self.$emit('update', dateText)
    }
  }
}
</script>
