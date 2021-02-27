# minicoil

partial re-implementation of [Recoil](https://wz.ax/recoiljs-kvkvigef)

no history, no selectors, just `useRecoilState`/`useRecoilValue`

## usage

state.tsx
```jsx
import {atom} from 'minicoil'
export const SomeState = atom({key: 'CursorPosition', default: {x:0,y:0}})
```

components.tsx
```jsx
import {useRecoilState} from 'minicoil'
import {SomeState} from './state'

export function FirstComponent() {
  let [position, setPosition] = useRecoilState(SomeState) // same as `useState` but with atom ref instead of default value
  ...
}

export function SecondComponent() {
  let [position, setPosition] = useRecoilState(SomeState)
  ...
}
```
