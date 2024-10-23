import {ComponentChildren} from "preact"
import {Dialog} from "./Dialog"
import {Drawer} from "./Drawer"
import {useBreakpoint} from "../hooks/useBreakpoint"
import {Breakpoint} from "../constants"

enum ModalType {
  Drawer = "drawer",
  Dialog = "dialog",
}

export function AdaptiveModal({
  title,
  isOpen,
  onClose,
  children,
}: {
  title: string
  isOpen: boolean
  onClose: () => void
  children: ComponentChildren
}) {
  const type = useBreakpoint(Breakpoint.SM)
    ? ModalType.Dialog
    : ModalType.Drawer

  if (type === ModalType.Dialog) {
    return (
      <Dialog isOpen={isOpen} onClose={onClose} title={title}>
        {children}
      </Dialog>
    )
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={title}>
      {children}
    </Drawer>
  )
}
