import {ComponentChildren} from "preact"
import {useState} from "preact/hooks"
import {Dialog} from "./Dialog"
import {Drawer} from "./Drawer"

enum ModalType {
  Drawer = "drawer",
  Dialog = "dialog",
}

export function AdaptiveModal({
  isOpen,
  onOpenChange,
  children,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  children: ComponentChildren
}) {
  //temp for migration to tailwind
  const oldstyles = `
    :host {
      display: block;
    }
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      visibility: hidden;
      opacity: 0;
      transition:
        visibility 0s,
        opacity 0.3s ease;
    }
    .modal-overlay[open] {
      visibility: visible;
      opacity: 1;
    }
    .modal-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: white;
      gap: 2rem;
      padding: 2rem;
      border-radius: 0.5rem;
      max-width: 24rem;
      width: 100%;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
    }
    @media only screen and (max-width: 600px) {
      .modal-content {
        width: 90vw;
        max-width: 90vw;
      }
    }
    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      position: absolute;
      top: 10px;
      right: 15px;
      cursor: pointer;
    }
  `

  const [type, setType] = useState<ModalType>(ModalType.Dialog)

  if (type === ModalType.Dialog) {
    return (
      <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
        {children}
      </Dialog>
    )
  }

  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
      {children}
    </Drawer>
  )
}
