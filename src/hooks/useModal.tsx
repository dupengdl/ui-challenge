import { useCallback, useState, type FC, type PropsWithChildren } from 'react'

import Modal, { ModalBaseProps } from '../components/Modal'

interface UseModalOptions extends ModalBaseProps {
  defaultOpen?: boolean;
  appendTo?: HTMLElement;
}

type UseModalResult = [
  ModalWrapper: FC<PropsWithChildren>,
  open: () => void,
  close: () => void,
  isOpen: boolean
];

const useModal = (options?: UseModalOptions): UseModalResult => {
  const { appendTo, defaultOpen = false, showClose, title, description } = options || {}

  const [isOpen, setOpen] = useState<boolean>(defaultOpen)
  const open = useCallback(() => setOpen(true), [setOpen])
  const close = useCallback(() => setOpen(false), [setOpen])
  const ModalWrapper = useCallback(
    ({ children }: PropsWithChildren) => {
      return (
        <Modal
          appendTo={appendTo}
          isOpen={isOpen}
          showClose={showClose}
          title={title}
          description={description}
          close={close}
        >
          {children}
        </Modal>
      )
    },
    [appendTo, close, description, isOpen, showClose, title]
  )

  return [ModalWrapper, open, close, isOpen]
}

export default useModal
