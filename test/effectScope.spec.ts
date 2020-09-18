import test from 'ava'
import { watch, ref, effectScope, watchEffect } from '../src'

test('should work', (t) => {
  let triggered = 0
  const counter = ref(0)

  const stop = effectScope(() => {
    watch(counter, () => {
      triggered += 1
    })

    counter.value += 1
    t.is(counter.value, 1)
    t.is(triggered, 1)
  })

  counter.value += 1
  t.is(counter.value, 2)
  t.is(triggered, 2)

  stop()

  counter.value += 1
  t.is(counter.value, 3)
  t.is(triggered, 2) // should not trigger again
})

test('should work with multiple effect', (t) => {
  let triggered = 0
  let sync = 0
  const counter = ref(0)

  const stop = effectScope(() => {
    watch(counter, () => {
      triggered += 1
    })

    watchEffect(() => {
      sync = counter.value
    })

    counter.value += 1
    t.is(counter.value, 1)
    t.is(triggered, 1)
    t.is(sync, 1)
  })

  stop()

  counter.value += 2
  t.is(counter.value, 3)

  // should not trigger again
  t.is(triggered, 1)
  t.is(sync, 1)
})

test('should work with nested scopes', (t) => {
  let triggered = 0
  let sync = 0
  const counter = ref(0)

  const stop = effectScope(() => {
    watch(counter, () => {
      triggered += 1
    })

    effectScope(() => {
      watchEffect(() => {
        sync = counter.value
      })

      counter.value += 1
      t.is(counter.value, 1)
      t.is(triggered, 1)
      t.is(sync, 1)
    })
  })

  stop()

  counter.value += 2
  t.is(counter.value, 3)

  // should not trigger again
  t.is(triggered, 1)
  t.is(sync, 1)
})
