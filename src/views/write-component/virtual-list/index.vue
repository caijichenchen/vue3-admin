<template>
  <div ref="vlist" class="virtual-list-wrapper" @scroll="listenScroll">
    <div
      class="virtual-list-phantom"
      :style="{ height: listHeight + 'px' }"
    ></div>
    <div class="virtual-list" :style="{ transform: transformStyle }">
      <div
        v-for="item in visibleListData"
        :key="item.id"
        class="virtual-list-item"
        :style="{ height: itemSize + 'px', lineHeight: itemSize + 'px' }"
      >
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed } from 'vue'
interface ListItem {
  value: number
  id: number
}
let i = 0
const arr: ListItem[] = []
while (i < 1000) {
  arr.push({ value: i, id: i })
  i++
}
export default defineComponent({
  props: {
    listData: {
      type: Array as PropType<Array<ListItem>>,
      default: () => arr,
    },
    itemSize: {
      type: [String, Number],
      default: 200,
    },
  },
  setup(props) {
    const vlist = ref<Nullable<HTMLElement>>(null)
    // 可视区高度
    const visibleHeight = 700
    // 滚动高度
    const scrollTop = ref(0)
    // 偏移量
    const startOffset = ref(0)
    // 列表总高度
    const listHeight = computed(() => props.listData.length * +props.itemSize)
    // 可视item数量
    const visibleCount = computed(() =>
      Math.ceil(visibleHeight / +props.itemSize),
    )
    // 可视区起始index
    const startIndex = computed(() =>
      Math.floor(scrollTop.value / +props.itemSize),
    )
    // 可视区末尾index
    const endIndex = computed(() => startIndex.value + visibleCount.value)
    // 可视区数据截取
    const visibleListData = computed(() =>
      props.listData.slice(startIndex.value, endIndex.value),
    )
    // 偏移量style
    const transformStyle = computed(
      () => `translate3d(0, ${startOffset.value}px,0)`,
    )
    const listenScroll = () => {
      scrollTop.value = vlist.value ? vlist.value.scrollTop : 0
      startOffset.value = scrollTop.value - (scrollTop.value % +props.itemSize)
    }
    return { vlist, visibleListData, listenScroll, listHeight, transformStyle }
  },
})
</script>

<style lang="scss" scoped>
.virtual-list {
  &-wrapper {
    height: 700px;
    overflow: auto;
    position: relative;
    -webkit-overflow-scrolling: touch;

    .virtual-list {
      left: 0;
      right: 0;
      top: 0;
      position: absolute;
      text-align: center;
      &-item {
        height: 100px;
        padding: 10px;
        color: #555;
        box-sizing: border-box;
        border-bottom: 1px solid #999;
      }
    }
  }
  &-phantom {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    z-index: -1;
  }
}
</style>
