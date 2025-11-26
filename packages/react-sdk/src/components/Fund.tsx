import React, {useState} from "react"
import {Button, ButtonProps} from "./internal/Button"
import {Dialog} from "./internal/Dialog"
import {StyleWrapper} from "./internal/StyleWrapper"
import {FundContent} from "./FundContent"

interface FundProps {
  variant?: ButtonProps["variant"]
}

export const Fund: React.FC<FundProps> = ({variant = "primary"}) => {
  const [open, setOpen] = useState(false)

  const handleButtonClick = () => {
    setOpen(true)
  }

  return (
    <>
      <StyleWrapper>
        <Button
          onClick={handleButtonClick}
          variant={variant}
          className="flow-px-2 flow-text-sm"
        >
          Fund
        </Button>
      </StyleWrapper>
      <Dialog
        isOpen={open}
        onClose={() => setOpen(false)}
        className="flow-max-w-md"
      >
        <FundContent />
      </Dialog>
    </>
  )
}
