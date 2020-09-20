<p align='center'>
<img src='https://github.com/vue-reactivity/art/blob/master/svg/package-scope.svg?raw=true' height='250'>
</p>

<p align='center'>
The auto effect collecting for <a href="https://github.com/vuejs/vue-next/tree/master/packages/reactivity"><code>@vue/reactivity</code></a>
</p>

<p align='center'>
  <a href="https://www.npmjs.com/package/@vue-reactivity/scope"><img src="https://img.shields.io/npm/v/@vue-reactivity/scope?color=43b883&label=" alt="npm"></a>
  <a href="https://bundlephobia.com/result?p=@vue-reactivity/scope"><img src="https://img.shields.io/bundlephobia/minzip/@vue-reactivity/scope?color=364a5e&label=" alt="npm bundle size"></a>
</p>

<p align='center'>
  <b><a href='https://github.com/vuejs/rfcs/pull/212'>An RFC to back porting this feature into <code>@vue/reactivity</code> itself is in progress</a>. Feedback wanted, thanks!</b>
</p>

## Install

<pre>
npm i @vue-reactivity/<b>scope</b>
</pre>

### Usage

> Note: `effectScope` do NOT have equivalent in Vue. This package is designed to be used on **non-Vue environment**.

<details>
<summary>🥵 Collect and dispose manually</summary>
<br>

```ts
import { ref, computed, stop } from '@vue/reactivity'
import { watch, watchEffect } from '@vue-reactivity/watch'

const counter = ref(0)
let disposables = []

const doubled = computed(() => counter.value * 2)

const stopWatch = watch(doubled, () => console.log(double.value))

const stopWatchEffect = watchEffect(() => console.log('Count: ', double.value))

// manually collect effects
disposables.push(() => stop(doubled.effect))
disposables.push(stopWatch)
disposables.push(stopWatchEffect)

// to dispose all
disposables.forEach(d => d())
disposables = []
```

</details>

<details>
<summary>😎 With <code>@vue-reactivity/scope</code></summary>
<br>

```ts
import { effectScope, ref, computed, watch, watchEffect } from '@vue-reactivity/scope

const counter = ref(0)

const stop = effectScope(() => {
  // computed, watch, watchEffect, effect ran inside the scope will be auto collected
  const doubled = computed(() => counter.value * 2)

  watch(doubled, () => console.log(double.value))

  watchEffect(() => console.log('Count: ', double.value))
})

// to dispose all effects
stop()
```

</details>
<br>

This package redirects the APIs in `@vue/reactivity` and add some hook to them. You should always import APIs from `@vue-reactivity/scope` instead of `@vue/reactivity`.

## License

MIT
