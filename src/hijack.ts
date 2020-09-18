import {
  effect as _effect,
  computed as _computed,
} from '@vue/reactivity'
import {
  watch as _watch,
  watchEffect as _watchEffect,
} from '@vue-reactivity/watch'
import { recordEffect } from './scope'

export const computed = ((arg: any) => {
  const c = _computed(arg)
  recordEffect(c.effect)
  return c
}) as typeof _computed

export const watch = ((...args: any) => {
  // @ts-ignore
  const c = _watch(...args)
  // @ts-ignore
  recordEffect(c.effect)
  return c
}) as typeof _watch

export const watchEffect = ((...args: any) => {
  // @ts-ignore
  const c = _watchEffect(...args)
  // @ts-ignore
  recordEffect(c.effect)
  return c
}) as typeof _watchEffect

export const effect = ((...args: any) => {
  // @ts-ignore
  const e = _effect(...args)
  recordEffect(e)
  return e
}) as typeof _watchEffect
