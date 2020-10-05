import {
  stop as _stop,
  ReactiveEffect,
} from '@vue/reactivity'

export interface EffectScope {
  (fn: () => void): void
  _isEffectScope: true
  id: number
  active: boolean
  effects: (ReactiveEffect | EffectScope)[]
}

export interface EffectScopeOptions {
  detached?: boolean
}

let uid = 0
const effectScopeStack: EffectScope[] = []
let activeEffectScope: EffectScope | undefined

export function recordEffect(effect: ReactiveEffect | EffectScope) {
  if (activeEffectScope?.active && effect)
    activeEffectScope.effects.push(effect)
}

export function isEffect(fn: any): fn is ReactiveEffect {
  return fn && fn._isEffect === true
}

export function stop(effect: EffectScope | ReactiveEffect) {
  if (!effect.active)
    return
  if (isEffect(effect)) {
    _stop(effect)
  }
  else {
    effect.effects.forEach(e => stop(e))
    effect.active = false
  }
}

function recordEffectScope(effect: ReactiveEffect | EffectScope) {
  if (activeEffectScope && activeEffectScope.active)
    activeEffectScope.effects.push(effect)
}

export function effectScope(
  fn?: () => void,
  options: EffectScopeOptions = {},
): EffectScope {
  const scope = function(fn: () => void): unknown {
    if (!scope.active)
      return

    try {
      if (!options.detached)
        recordEffectScope(scope)

      effectScopeStack.push(scope)
      activeEffectScope = scope
      fn()
      return scope
    }
    finally {
      effectScopeStack.pop()
      activeEffectScope = effectScopeStack[effectScopeStack.length - 1]
    }
  } as EffectScope

  scope._isEffectScope = true
  scope.id = uid++
  scope.active = true
  scope.effects = []

  if (fn)
    scope(fn)

  return scope
}
