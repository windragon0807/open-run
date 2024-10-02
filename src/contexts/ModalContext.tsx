'use client'

import { ComponentProps, createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import Modal from '@shared/Modal'

type ModalProps = ComponentProps<typeof Modal>
type ModalOptions = Pick<ModalProps, 'contents'>

type ModalContextValue = {
  openModal: (options: ModalOptions) => void
  closeModal: () => void
}

const Context = createContext<ModalContextValue | undefined>(undefined)

const defaultValues: ModalProps = {
  isOpen: false,
  contents: null,
  closeModal: () => {},
}

export function ModalContext({ children }: { children: ReactNode }) {
  const [modalProps, setModalProps] = useState(defaultValues)

  const $portal_root = typeof window === 'undefined' ? null : document.getElementById('root-portal')

  const close = useCallback(() => {
    setModalProps(defaultValues)
  }, [])

  const open = useCallback(
    ({ ...options }: ModalOptions) => {
      setModalProps({
        ...options,
        isOpen: true,
        closeModal: () => {
          close()
        },
      })
    },
    [close],
  )

  const values = useMemo(() => ({ openModal: open, closeModal: close }), [open, close])

  return (
    <Context.Provider value={values}>
      {children}
      {$portal_root != null ? createPortal(<Modal {...modalProps} />, $portal_root) : null}
    </Context.Provider>
  )
}

export function useModalContext() {
  const values = useContext(Context)

  if (values == null) {
    throw new Error('ModalContext 내부에서 사용해주세요')
  }

  return values
}
