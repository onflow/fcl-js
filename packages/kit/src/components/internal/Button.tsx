import React from "react"
import {Button as HeadlessButton} from "@headlessui/react"

export const Button: React.FC<React.ComponentProps<typeof HeadlessButton>> = (props) => {
  return <HeadlessButton {...props} />
} 