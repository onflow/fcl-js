import React, {useLayoutEffect, useRef, useState} from "react"
import {createPortal} from "react-dom"
import tailwindStyles from "../../styles/tailwind.css"
import {useDarkMode} from "../../hooks"

export interface ShadowRootProps {
  children: React.ReactNode
}

export const ShadowRoot: React.FC<ShadowRootProps> = ({children}) => {
  const hostRef = useRef<HTMLDivElement>(null)
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const {isDark} = useDarkMode()

  useLayoutEffect(() => {
    if (!hostRef.current) return

    // Use existing shadow root if present, otherwise create one
    let shadow: ShadowRoot
    if (hostRef.current.shadowRoot) {
      shadow = hostRef.current.shadowRoot
    } else {
      shadow = hostRef.current.attachShadow({mode: "open"})
    }

    // Remove all children (except style) to avoid duplicates
    Array.from(shadow.childNodes).forEach(node => {
      if (!(node instanceof HTMLStyleElement)) {
        shadow.removeChild(node)
      }
    })

    // Inject style if not present
    let style = Array.from(shadow.childNodes).find(
      node => node instanceof HTMLStyleElement
    ) as HTMLStyleElement | undefined
    if (!style) {
      style = document.createElement("style")
      shadow.appendChild(style)
    }
    style.textContent = tailwindStyles

    // Create a container for the portal if not present
    let containerElement = Array.from(shadow.childNodes).find(
      node => node instanceof HTMLDivElement
    ) as HTMLDivElement | undefined
    if (!containerElement) {
      containerElement = document.createElement("div")
      shadow.appendChild(containerElement)
    }
    setContainer(containerElement)

    // Cleanup: remove container on unmount
    return () => {
      if (containerElement && containerElement.parentNode === shadow) {
        shadow.removeChild(containerElement)
      }
    }
  }, [])

  useLayoutEffect(() => {
    if (container) {
      container.classList.toggle("dark", isDark)
    }
  }, [container, isDark])

  return (
    <div ref={hostRef}>
      {container ? createPortal(children, container) : null}
    </div>
  )
}
