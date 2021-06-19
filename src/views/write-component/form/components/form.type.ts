import { RuleItem } from 'async-validator'
import type { Emitter } from 'mitt'

export interface CFormItemContext {
  formItemMitt: Emitter
  prop?: string
  validate(): boolean
}
export interface ValidateFieldCallback {
  (isValid?: boolean): void
}

interface RuleItemType {
  [key: string]: RuleItem
}

export interface CFormContext {
  rules: RuleItemType
  model: Record<string, unknown>
  formMitt: Emitter
  validate(callback?: ValidateFieldCallback): void
}
