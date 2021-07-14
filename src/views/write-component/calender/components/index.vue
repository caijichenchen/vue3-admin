<template>
  <div>
    <input
      :value="normalizeDate"
      type="text"
      @focus="visible = true"
      @blur="visible = false"
    />
    <date-panel
      :visible="visible"
      :date-list="dateList.list"
      @change="changeDateRange"
      @select="selectDay"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, reactive } from 'vue'
import datePanel from './date-panel.vue'
import { getYearMonthDay, getMonthStartDay } from '@/utils/time'

export interface CalenderDateItem {
  year: number
  month: number
  day: number
  date: Date
}

export default defineComponent({
  components: { datePanel },
  props: {
    modelValue: {
      type: Date,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const visible = ref(false)
    const dateList = reactive({
      list: [] as Array<CalenderDateItem>,
    })
    const normalizeDate = computed({
      get() {
        if (props.modelValue) {
          const { year, month, day } = getYearMonthDay(props.modelValue)
          return `${year}-${month + 1}-${day}`
        } else return ''
      },
      set(val) {
        emit('update:modelValue', val)
      },
    })
    const getMonthDaysList = (date: Date = new Date()) => {
      // 本月开始时间
      const monthStartDay = getMonthStartDay(date)
      // 本月开始时间是在周几
      const startWeek = monthStartDay.getDay()
      // 补齐日历是开始时间
      const diffDay = startWeek === 0 ? 6 : startWeek - 1
      const startDay = new Date(
        monthStartDay.getTime() - diffDay * 24 * 60 * 60 * 1000,
      ).getTime()
      const list = []
      let i = 0
      while (i < 42) {
        const itemDay = startDay + 24 * 60 * 60 * 1000 * i
        const itemInfo = getYearMonthDay(new Date(itemDay))
        list.push({
          ...itemInfo,
          date: new Date(itemDay),
        })
        // const isCurrentInfo = isCurrentMonthAndDay(
        //   itemInfo.year,
        //   itemInfo.month,
        //   itemInfo.day,
        // )
        // list.push({ ...itemInfo, ...isCurrentInfo })
        i++
      }
      dateList.list = list
      return list
    }
    getMonthDaysList(props.modelValue)
    const changeDateRange = (year: number, month: number) => {
      getMonthDaysList(new Date(`${year}/${month + 1}/1`))
    }

    const selectDay = (date: Date) => {
      normalizeDate.value = date
    }
    return { normalizeDate, visible, dateList, changeDateRange, selectDay }
  },
})
</script>

<style lang="scss" scoped></style>
