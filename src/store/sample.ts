import { create } from 'zustand'

type Count = {
  count: number
  increase: () => void
}

export const useCount = create<Count>()(set => ({
  count: 1,
  increase: () => set(state => ({ count: state.count + 1 })),
}))

/* Example usage */
// function Counter() {
//   const { count, inc } = useStore()
//   return (
//     <div>
//       <span>{count}</span>
//       <button onClick={inc}>one up</button>
//     </div>
//   )
// }
