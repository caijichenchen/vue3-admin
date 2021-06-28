import { Emitter } from 'mitt'
import { PropType, Ref } from 'vue'

export type CollapseModelValue = PropType<
  string | number | Array<string | number>
>

export type CollapseCtx = {
  collapseMitt: Emitter
  opend: Ref<Array<string | number>>
}
