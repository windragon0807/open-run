const FOCUSED_COLOR = '#222222'
const UNFOCUSED_COLOR = '#89939D'

export function FullSetIcon({ focused }: { focused: boolean }) {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M19.2301 1.19535C19.3158 0.934882 19.6842 0.934882 19.7699 1.19535L20.2286 2.59022C20.2568 2.67594 20.3241 2.74317 20.4098 2.77136L21.8046 3.2301C22.0651 3.31577 22.0651 3.68423 21.8046 3.7699L20.4098 4.22864C20.3241 4.25683 20.2568 4.32406 20.2286 4.40978L19.7699 5.80465C19.6842 6.06512 19.3158 6.06512 19.2301 5.80465L18.7714 4.40978C18.7432 4.32406 18.6759 4.25683 18.5902 4.22864L17.1954 3.7699C16.9349 3.68423 16.9349 3.31577 17.1954 3.2301L18.5902 2.77136C18.6759 2.74317 18.7432 2.67594 18.7714 2.59022L19.2301 1.19535ZM2.9081 11.2796L3.08734 10.2341H5.66684L6.01186 8.2998H3.41892H2.80205H1.25465L0 15.6186H2.16427L2.6034 13.057H5.09179L5.40545 11.2796H2.9081ZM9.04615 8.2998H6.77732L5.95135 13.2139C5.8677 13.8412 5.93392 14.3639 6.15 14.7822C6.37305 15.2004 6.70414 15.514 7.14326 15.7232C7.58239 15.9323 8.08774 16.0368 8.6593 16.0368C9.25177 16.0368 9.79894 15.9323 10.3008 15.7232C10.8096 15.514 11.2348 15.2004 11.5764 14.7822C11.9179 14.3639 12.1375 13.8412 12.2351 13.2139L13.061 8.2998H10.8027L9.98714 12.9943C9.95229 13.1755 9.88607 13.3428 9.78848 13.4961C9.69787 13.6495 9.57589 13.7715 9.42254 13.8621C9.2692 13.9527 9.09146 13.9945 8.88932 13.9876C8.69415 13.9806 8.54429 13.9318 8.43974 13.8412C8.33518 13.7506 8.26548 13.6321 8.23063 13.4857C8.20275 13.3323 8.19926 13.172 8.22017 13.0047L9.04615 8.2998ZM13.9393 8.2998H16.2082L15.2881 13.6843H18.1842L17.8392 15.6186H12.6847L13.9393 8.2998ZM19.7551 8.2998H22.0239L21.1039 13.6843H24L23.655 15.6186H18.5005L19.7551 8.2998ZM4.7699 18.1954C4.68423 17.9349 4.31577 17.9349 4.2301 18.1954L3.77136 19.5902C3.74317 19.6759 3.67594 19.7432 3.59022 19.7714L2.19535 20.2301C1.93488 20.3158 1.93488 20.6842 2.19535 20.7699L3.59022 21.2286C3.67594 21.2568 3.74317 21.3241 3.77136 21.4098L4.2301 22.8046C4.31577 23.0651 4.68423 23.0651 4.7699 22.8046L5.22864 21.4098C5.25683 21.3241 5.32406 21.2568 5.40978 21.2286L6.80465 20.7699C7.06512 20.6842 7.06512 20.3158 6.80465 20.2301L5.40978 19.7714C5.32406 19.7432 5.25683 19.6759 5.22864 19.5902L4.7699 18.1954Z'
        fill={focused ? FOCUSED_COLOR : UNFOCUSED_COLOR}
      />
    </svg>
  )
}

export function UpperClothingIcon({ focused }: { focused: boolean }) {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M2 11L6.54545 4H9C9 4.79565 9.31607 5.55871 9.87868 6.12132C10.4413 6.68393 11.2044 7 12 7C12.7956 7 13.5587 6.68393 14.1213 6.12132C14.6839 5.55871 15 4.79565 15 4H17.4545L22 11L18.3636 13.5V20H5.63636V13.5L2 11Z'
        fill={focused ? FOCUSED_COLOR : UNFOCUSED_COLOR}
      />
    </svg>
  )
}

export function LowerClothingIcon({ focused }: { focused: boolean }) {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M17.3367 4H6.66479L3.91931 18.9437L10.4536 20.0354L11.9913 11.7722L13.5355 20.0704L20.0932 18.9748L17.3367 4.10129V4Z'
        fill={focused ? FOCUSED_COLOR : UNFOCUSED_COLOR}
      />
    </svg>
  )
}

export function FootwearIcon({ focused }: { focused: boolean }) {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M10.2352 8.96584L12.9979 6.44227C13.1125 6.3376 13.2874 6.33887 13.4095 6.4347C15.2253 7.86011 18.0681 7.3328 19.8 6.80549C20.0347 6.73401 20.9999 8.4496 20.9999 10.0937V11.1185V12.2859V13.3107V14.2748V14.8255C20.9999 14.8315 20.9999 14.8374 20.9998 14.8433V15.8538C20.9998 16.2629 20.7513 16.6362 20.3621 16.762C18.8494 17.2513 17.7172 17.1874 16.4763 17.1173C15.8608 17.0825 15.2185 17.0463 14.4897 17.0753C14.4305 17.0776 14.3711 17.0858 14.3132 17.0988C9.69767 18.1322 4.55562 17.6498 3.13629 15.6515C3.0391 15.5147 3.00056 15.3447 3.00032 15.1769C2.9992 14.4172 2.99426 13.8348 3.00993 13.3782C3.00376 13.3537 3.00092 13.3282 3.00136 13.3031C3.00649 13.0097 3.04031 12.7425 3.09943 12.4986C3.11566 12.4257 3.13447 12.3582 3.15623 12.2953C3.73034 10.4888 5.7973 10.0676 7.73427 9.67291C8.62141 9.49214 9.48128 9.31693 10.158 9.01672C10.1865 9.00405 10.2121 8.98691 10.2352 8.96584Z'
        fill={focused ? FOCUSED_COLOR : UNFOCUSED_COLOR}
      />
    </svg>
  )
}

export function FaceIcon({ focused }: { focused: boolean }) {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM9.22836 14.1481C9.0776 13.7841 9 13.394 9 13H11H13H15C15 13.394 14.9224 13.7841 14.7716 14.1481C14.6422 14.4605 14.461 14.7485 14.2361 15C14.199 15.0414 14.1607 15.0819 14.1213 15.1213C13.8427 15.3999 13.512 15.6209 13.1481 15.7716C12.7841 15.9224 12.394 16 12 16C11.606 16 11.2159 15.9224 10.8519 15.7716C10.488 15.6209 10.1573 15.3999 9.87868 15.1213C9.83927 15.0819 9.801 15.0414 9.76393 15C9.53898 14.7485 9.35779 14.4605 9.22836 14.1481ZM8 9.5C8 8.67157 8.67157 8 9.5 8C10.3284 8 11 8.67157 11 9.5C11 10.3284 10.3284 11 9.5 11C8.67157 11 8 10.3284 8 9.5ZM14.5 8C13.6716 8 13 8.67157 13 9.5C13 10.3284 13.6716 11 14.5 11C15.3284 11 16 10.3284 16 9.5C16 8.67157 15.3284 8 14.5 8Z'
        fill={focused ? FOCUSED_COLOR : UNFOCUSED_COLOR}
      />
    </svg>
  )
}

export function SkinIcon({ focused }: { focused: boolean }) {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M20.5023 14.9589C19.2785 18.4759 15.934 21 12 21C8.066 21 4.72153 18.4759 3.4977 14.9589C3.33582 14.9859 3.16956 15 3 15C1.34315 15 0 13.6569 0 12C0 10.3431 1.34315 9 3 9C3.16955 9 3.33582 9.01407 3.4977 9.0411C4.72154 5.52407 8.066 3 12 3C15.934 3 19.2785 5.52407 20.5023 9.0411C20.6642 9.01407 20.8304 9 21 9C22.6569 9 24 10.3431 24 12C24 13.6569 22.6569 15 21 15C20.8304 15 20.6642 14.9859 20.5023 14.9589Z'
        fill={focused ? FOCUSED_COLOR : UNFOCUSED_COLOR}
      />
    </svg>
  )
}

export function HairIcon({ focused }: { focused: boolean }) {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M12 3C7.02944 3 3 7.02944 3 12V12.6874C3.47767 12.2599 4.10843 12 4.7999 12H4.8H5.17304H7.5C9.98528 12 12 9.98528 12 7.5C12 9.98528 14.0147 12 16.5 12H18.8264H19.1999C19.8915 12 20.5223 12.26 21 12.6876V12C21 7.02944 16.9706 3 12 3ZM21 16.7124C20.5223 17.14 19.8915 17.4 19.1999 17.4H19.0023C18.4842 18.8659 17.5188 20.1206 16.2701 21H19C20.1046 21 21 20.1046 21 19V16.7124ZM7.72941 21C6.48069 20.1206 5.51528 18.8659 4.99716 17.4H4.7999C4.10843 17.4 3.47767 17.1401 3 16.7126V19C3 20.1046 3.89543 21 5 21H7.72941Z'
        fill={focused ? FOCUSED_COLOR : UNFOCUSED_COLOR}
      />
    </svg>
  )
}

export function AccessoriesIcon({ focused }: { focused: boolean }) {
  const color = focused ? FOCUSED_COLOR : UNFOCUSED_COLOR
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <rect x='10' y='11' width='4' height='2' fill={color} />
      <circle cx='6' cy='12' r='4' stroke={color} strokeWidth='2' />
      <circle cx='18' cy='12' r='4' stroke={color} strokeWidth='2' />
    </svg>
  )
}

export function BackgroundIcon({ focused }: { focused: boolean }) {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M5 5H19V13.5859L15.2071 9.79304L14.5 9.08594L13.7929 9.79304L10.3726 13.2134L8.0547 11.6681L7.37258 11.2134L6.79289 11.793L5 13.5859V5ZM21 17.3665V15.5859V5V3H19H5H3V5V15.5859V17.3665ZM8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7Z'
        fill={focused ? FOCUSED_COLOR : UNFOCUSED_COLOR}
      />
    </svg>
  )
}
