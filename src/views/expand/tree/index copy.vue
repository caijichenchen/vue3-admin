<template>
  <!-- <input type="checkbox" /> -->
  <div ref="cvirtualTree" class="c-virtual-tree" @scroll="handleScroll">
    <div
      class="virtual-tree-plantom"
      :style="{ height: treeListHeight + 'px' }"
    />
    <div class="virtual-tree-content" :style="{ transform: transformStyle }">
      <div
        v-for="item in visibleData"
        :key="item.value"
        class="virtual-tree-item"
        :style="getTreeItemStyle(item)"
        @click="handleClick(item)"
      >
        <div>
          <span
            :class="[
              item._isLeaf && 'is-leaf',
              'virtual-tree-icon',
              `virtual-tree__${item._expand ? 'expand' : 'close'}`,
            ]"
          />
          <span>{{ item._expand }}-{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * 试验思路
 * element的tree主要设计实现是数据递归  但是数据量一大的时候就会卡顿 性能不好
 * new Map()利用key的唯一性  将数组拍平  查询数据更快
 * new Map() -->  key --> value   new Map在template上不方便显示数据
 * {} 普通对象
 * key: 0-1 对应每个index
 * value应该是个数组
 * 点击某个tree-item我
 */
import { computed, defineComponent, reactive, ref } from 'vue'
import arr1 from './data'
export default defineComponent({
  props: {
    itemSize: {
      type: [String, Number],
      default: 26,
    },
    accordion: {
      // 手风琴
      type: Boolean,
      default: true,
    },
    indent: {
      //节点缩进距离
      type: Number,
      default: 16,
    },
  },
  setup(props) {
    const test = reactive(arr1)
    // tree ref
    const cvirtualTree = ref<Nullable<HTMLElement>>(null)
    // 滚动高度
    const scrollTop = ref(0)
    // 偏移量
    const startOffset = ref(0)
    // 可视区高度
    const visibleHeight = 500
    // 可视区tree-item数量
    const visibleCount = computed(() =>
      Math.ceil(visibleHeight / +props.itemSize),
    )
    const getVisibleData = () => {
      return Object.values(test).filter((data: any) => data._visible)
    }
    // visibleData起始index
    const startIndex = computed(() =>
      Math.floor(scrollTop.value / +props.itemSize),
    )
    // visibleData结束index
    const endIndex = computed(() => startIndex.value + visibleCount.value)
    // visibleData截取
    const visibleData = computed(() =>
      getVisibleData().slice(startIndex.value, endIndex.value),
    )
    // 偏移量
    const transformStyle = computed(
      () => `translate3d(0, ${startOffset.value}px,0)`,
    )
    // tree列表总高度
    const treeListHeight = computed(
      () => Object.keys(test).length * +props.itemSize,
    )
    const handleScroll = () => {
      scrollTop.value = cvirtualTree.value ? cvirtualTree.value.scrollTop : 0
      startOffset.value = scrollTop.value - (scrollTop.value % +props.itemSize)
    }
    // 给tree-item添加样式
    const getTreeItemStyle = (item: any) => {
      const key = item.key as string
      const _level = key.match(/-/g)?.length as number
      return {
        paddingLeft: (_level - 1) * 18 + 'px',
      }
    }

    const handleClick = (item: any) => {
      if (!item._expand && props.accordion && item.children) {
        // 说明要打开且在手风琴模式下要判断同级节点下有没有打开
        const _parentlevel = item._parentlevel
        let i = 0
        let _flag = false
        let brother = test[`${_parentlevel}-${i}`]
        while (brother && !_flag) {
          if (brother._expand) {
            brother._expand = false
            if (brother.children) {
              deepHandle(brother.children, (val: any) => {
                val._expand = false
                val._visible = false
              })
            }
            _flag = true
          }
          i++
          brother = test[`${_parentlevel}-${i}`]
        }
      }
      item._expand = !item._expand
      item.children &&
        item.children.forEach((child: any) => {
          child._expand = item._expand
          child._visible = item._expand
        })
    }
    const deepHandle = (data: any[], handle: any) => {
      data.forEach((item) => {
        handle(item)
        if (Array.isArray(item.children) && item.children.length > 0) {
          deepHandle(item.children, handle)
        }
      })
    }
    return {
      test,
      treeListHeight,
      transformStyle,
      visibleData,
      getTreeItemStyle,
      handleScroll,
      handleClick,
    }
  },
})
</script>

<style lang="scss" scoped>
.c-virtual-tree {
  position: relative;
  overflow-y: scroll;
  height: 500px;
  background: #fff;
  color: #606266;
  .virtual-tree-plantom {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: -1;
  }
  .virtual-tree-content {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    .virtual-tree-item {
      box-sizing: border-box;
      cursor: pointer;
      height: 26px;
      display: flex;
      align-items: center;
      line-height: 26px;
      &:hover {
        background-color: #f5f7fa;
      }

      .virtual-tree-icon {
        speak: none;
        font-style: normal;
        font-weight: 400;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        vertical-align: baseline;
        display: inline-block;
        padding: 6px;
        cursor: pointer;
        color: #c0c4cc;
        font-size: 12px;
        transition: transform 0.3s ease-in-out;
        ::before {
          content: '';
        }
      }
      .virtual-tree__expand {
        transform: rotate(90deg);
      }
      .virtual-tree__close {
        transform: rotate(0deg);
      }
    }
  }
}
</style>
