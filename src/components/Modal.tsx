import { useRef, forwardRef, type ReactNode, type PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'
import { styled } from 'styled-components'

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
`
const StyledContent = styled.div`
  position: relative;
  min-width: 360px;
  padding: 30px 20px;
  border-radius: 10px;
  background-color: #ffffff;
  .content {
    display: flex;
  }
`
const CloseButton = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: block;
  height: 24px;
  width: 24px;
  line-height: 24px;
  text-align: center;
  color: #697584;
  cursor: pointer;
  &::after {
    content: 'x';
    display: block;
    font-size: 16px;
  }
`

export interface ModalBaseProps {
  showClose?: boolean;
  title?: ReactNode;
  description?: ReactNode;
}

interface ModalContentProps extends ModalBaseProps, PropsWithChildren {
  close: () => void;
}

const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ showClose, close, children }, ref) => {
    return (
      <StyledContent
        ref={ref}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        {showClose ? <CloseButton onClick={close} /> : null}
        <div className="content">{children}</div>
      </StyledContent>
    )
  }
)

interface ModalProps extends ModalContentProps {
  isOpen: boolean;
  appendTo?: HTMLElement;
}

const Modal = ({
  isOpen,
  appendTo = document.body,
  showClose = true,
  title,
  description,
  close,
  children,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null)

  if (!isOpen) {
    return null
  }

  return createPortal(
    <Wrapper>
      <Overlay />
      <ModalContent
        ref={dialogRef}
        showClose={showClose}
        title={title}
        description={description}
        close={close}
      >
        {children}
      </ModalContent>
    </Wrapper>,
    appendTo
  )
}

export default Modal
