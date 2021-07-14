<template>
  <div v-show="true" class="date-panel">
    <div class="date-header">
      <span class="date-control" @click="handleDateControl('prev', 'Year')">
        &lt;&lt;
      </span>
      <span
        v-show="!panelInfo.visible"
        class="date-control"
        @click="handleDateControl('prev', 'Month')"
      >
        &lt;
      </span>
      <span>
        <span class="date-control" @click="showYearPanel">
          {{ rangeDate.year }}年
        </span>
        <span> - </span>
        <span class="date-control" @click="showMonthPanel">
          {{ rangeDate.month + 1 }}月
        </span>
      </span>
      <span
        v-show="!panelInfo.visible"
        class="date-control"
        @click="handleDateControl('next', 'Month')"
      >
        &gt;
      </span>
      <span class="date-control" @click="handleDateControl('next', 'Year')">
        &gt;&gt;
      </span>
    </div>
    <div v-show="panelInfo.visible" class="date-content">
      <div
        v-for="(item, index) in getCurrentPanelData()"
        :key="item"
        class="panel-item"
        :class="{
          'active-panel-item': isActivePanelItem(item, index),
        }"
        @click="selectPanelRangeDate(item, index)"
      >
        {{ item }}
      </div>
    </div>
    <div v-show="!panelInfo.visible" class="date-content">
      <span v-for="week in weeks" :key="week" class="week-item">
        {{ week }}
      </span>
      <span v-for="row in 6" :key="row" class="date-row">
        <span
          v-for="col in 7"
          :key="col"
          class="date-col date-item"
          :class="{
            'current-day': isCurrentDateItem(row, col).isCurrentDay,
            'current-month': isCurrentDateItem(row, col).isCurrentMonth,
          }"
          @click="selectDate(row, col)"
        >
          {{ findDay(row, col).day }}
        </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { getYearMonthDay } from '@/utils/time'
import { computed, defineComponent, PropType, reactive, ref } from 'vue'
import { CalenderDateItem } from './index.vue'
const weeksList = ['一', '二', '三', '四', '五', '六', '日']
const monthList = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
]
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    dateList: {
      type: Array as PropType<Array<CalenderDateItem>>,
      default: () => [],
    },
  },
  emits: ['change', 'select'],
  setup(props, { emit }) {
    const panelVisible = computed({
      get() {
        return props.visible
      },
      set(val) {
        panelVisible.value = val
      },
    })
    // 月份、年份面板相关
    const panelInfo = reactive({
      visible: false,
      rangeYear: [] as number[],
      rangeMonth: monthList,
      rangeYearTitle: '',
      name: '',
      year: '',
      month: '',
    })
    const showYearPanel = () => {
      panelInfo.name = 'year'
      getYearRange()
      panelInfo.visible = true
    }
    const showMonthPanel = () => {
      panelInfo.name = 'month'
      panelInfo.visible = true
    }
    const getCurrentPanelData = () => {
      const { name } = panelInfo
      if (name === 'year') return panelInfo.rangeYear
      if (name === 'month') return panelInfo.rangeMonth
      return []
    }
    const selectPanelRangeDate = (value: number | string, index: number) => {
      const { name } = panelInfo
      if (name === 'year') {
        rangeDate.year = value as number
      }
      if (name === 'month') {
        rangeDate.month = index
      }
      panelInfo.visible = false
      emitChangeEvent()
    }
    const getYearRange = (year = rangeDate.year) => {
      const startYear = Math.floor(year / 10) * 10
      let i = 0
      const list = []
      while (i < 10) {
        list.push(startYear + i)
        i++
      }
      panelInfo.rangeYearTitle = `${list[0]}年 - ${list[list.length - 1]}年`
      panelInfo.rangeYear = list
    }

    const rangeDate = reactive({ year: 0, month: 0 })
    const getRangeDate = () => {
      const { year, month } = getYearMonthDay()
      rangeDate.year = year
      rangeDate.month = month
    }
    getRangeDate()
    // 周 - 列表
    const weeks = reactive(weeksList)

    const findDay = (row: number, col: number) =>
      props.dateList[(row - 1) * 7 + col - 1]
    const selectDate = (row: number, col: number) => {
      const selectDay = findDay(row, col).date
      emit('select', selectDay)
    }
    const isCurrentDateItem = (row: number, col: number) => {
      const { year, month, day } = findDay(row, col)
      const current = getYearMonthDay()
      return {
        isCurrentDay:
          year === current.year &&
          month === current.month &&
          day === current.day,
        isCurrentMonth: month === rangeDate.month,
      }
    }
    const isActivePanelItem = (value: number | string, index: number) => {
      const { name } = panelInfo
      if (name === 'year') {
        return value === rangeDate.year
      }
      if (name === 'month') {
        return index === rangeDate.month
      }
      return false
    }

    const emitChangeEvent = (
      year = rangeDate.year,
      month = rangeDate.month,
    ) => {
      emit('change', year, month)
    }
    // 处理panel-header控制按钮
    const handleDateControl = (type: string, flag: string) => {
      if (panelInfo.visible) {
        handlePanelControl(type)
      } else {
        handleBaseControl(type + flag)
      }
    }
    const handlePanelControl = (type: string) => {
      const { name } = panelInfo
      switch (type) {
        case 'prev':
          if (name === 'year') {
            const prevYear = panelInfo.rangeYear[0]
            getYearRange(prevYear - 10)
          }
          if (name === 'month') {
            rangeDate.year -= 1
          }
          break
        case 'next':
          if (name === 'year') {
            const nextYear = panelInfo.rangeYear[0]
            getYearRange(nextYear + 10)
          }
          if (name === 'month') {
            rangeDate.year += 1
          }
          break
      }
    }
    const handleBaseControl = (type: string) => {
      switch (type) {
        case 'prevYear':
          rangeDate.year -= 1
          break
        case 'prevMonth':
          rangeDate.month -= 1
          if (rangeDate.month === -1) {
            rangeDate.year -= 1
            rangeDate.month = 11
          }
          break
        case 'nextYear':
          rangeDate.year += 1
          break
        case 'nextMonth':
          rangeDate.month += 1
          if (rangeDate.month === 12) {
            rangeDate.month = 0
            rangeDate.year += 1
          }
          break
      }
      emitChangeEvent()
    }

    return {
      panelVisible,
      findDay,
      weeks,
      rangeDate,
      panelInfo,
      getCurrentPanelData,
      showYearPanel,
      showMonthPanel,
      selectPanelRangeDate,
      selectDate,
      isCurrentDateItem,
      handleDateControl,
      isActivePanelItem,
    }
  },
})
</script>

<style lang="scss" scoped>
.week-item {
  width: 32px;
  height: 32px;
  font-size: 13px;
  text-align: center;
  line-height: 32px;
  color: #333333;
  display: inline-block;
}
.date-panel {
  width: 224px;
  position: absolute;
  background-color: #fff;
  .date-header {
    display: flex;
    justify-content: space-between;
    padding: 0 8px;
  }
  .date-content {
    display: flex;
    flex-wrap: wrap;
    .panel-item {
      cursor: pointer;
      width: 56px;
      height: 56px;
      line-height: 56px;
      text-align: center;
    }
    .date-row {
      display: flex;
      width: 100%;
      .date-col {
        justify-content: center;
        align-items: center;
        display: flex;
        width: 32px;
        height: 32px;
        color: #c0c4cc;
        cursor: pointer;
        &:hover {
          background: #f2f8fe;
        }
      }
    }
  }
}
.current-month {
  color: #333333 !important;
}
.current-day {
  background: red !important;
  border-radius: 4px;
  color: #fff !important;
}
// .date-range-select
.date-control {
  cursor: pointer;
  &:hover {
    color: #409eff;
  }
}
.is-select {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}
.active-panel-item {
  color: #409eff;
}
</style>
