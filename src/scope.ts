import {
  stop as _stop,
  ReactiveEffect,
} from '@vue/reactivity'

interface Scope {
  active: boolean
  effects: (ReactiveEffect | Scope)[]
}

const scopeStacks: Scope[] = []
let activeScope: Scope | undefined

export function recordEffect(effect: ReactiveEffect | Scope) {
  if (activeScope?.active && effect)
    activeScope.effects.push(effect)
}

export function isEffect(fn: any): fn is ReactiveEffect {
  return fn && fn._isEffect === true
}

export function stop(targets: Scope | ReactiveEffect | (Scope | ReactiveEffect)[]) {
  if (!Array.isArray(targets))
    targets = [targets]

  for (const target of targets) {
    if (!target.active)
      return
    if (isEffect(target)) {
      _stop(target)
    }
    else {
      stop(target.effects)
      target.active = false
    }
  }
}

export function effectScope(fn: () => void) {
  const scope: Scope = {
    active: true,
    effects: [],
  }
  try {
    recordEffect(scope)
    scopeStacks.push(scope)
    activeScope = scope
    fn()
    return () => stop(scope)
  }
  finally {
    scopeStacks.pop()
    activeScope = scopeStacks.length
      ? scopeStacks[scopeStacks.length - 1]
      : undefined
  }
}
