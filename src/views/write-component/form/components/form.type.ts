// import { RuleItem } from 'async-validator'
import type { Emitter } from 'mitt'

export interface CFormItemContext {
  formItemMitt: Emitter
  prop?: string
  validate(): boolean
}
export interface ValidateFieldCallback {
  (isValid?: boolean): void
}

export interface RuleItem {
  required: boolean
  message: string
  trigger: string
}

export interface CFormContext {
  rules: { [key: string]: Array<RuleItem> }
  model: Record<string, unknown>
  formMitt: Emitter
  validate(callback?: ValidateFieldCallback): void
}
