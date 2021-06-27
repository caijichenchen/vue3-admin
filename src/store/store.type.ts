import { Module } from 'vuex'

export type RootState = {
  [key: string]: unknown
}

export type ModuleStoreItemMap = {
  [key: string]: Module
}
