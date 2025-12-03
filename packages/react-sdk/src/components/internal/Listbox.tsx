import React from "react"
import {
  Listbox as HeadlessListbox,
  ListboxButton as HeadlessListboxButton,
  ListboxOption as HeadlessListboxOption,
  ListboxOptions as HeadlessListboxOptions,
} from "@headlessui/react"
import {twMerge} from "tailwind-merge"

export interface ListboxProps<T>
  extends Omit<
    React.ComponentProps<typeof HeadlessListbox>,
    "value" | "onChange"
  > {
  value: T
  onChange: (value: T) => void
}

export function Listbox<T>({className, ...props}: ListboxProps<T>) {
  return (
    <HeadlessListbox
      as="div"
      className={twMerge("flow-relative", className)}
      {...props}
    />
  )
}

export interface ListboxButtonProps
  extends React.ComponentProps<typeof HeadlessListboxButton> {}

export const ListboxButton: React.FC<ListboxButtonProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <HeadlessListboxButton
      className={twMerge(
        "flow-w-full flow-px-4 flow-py-2 flow-text-left flow-rounded-md flow-border",
        "flow-bg-white dark:flow-bg-slate-800",
        "flow-text-slate-900 dark:flow-text-slate-100",
        "flow-border-slate-300 dark:flow-border-slate-600",
        "focus:flow-outline-none focus:flow-ring-2 focus:flow-ring-flow-primary/50",
        "focus:flow-border-flow-primary",
        "hover:flow-bg-slate-50 dark:hover:flow-bg-slate-700",
        "flow-transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </HeadlessListboxButton>
  )
}

export interface ListboxOptionsProps
  extends React.ComponentProps<typeof HeadlessListboxOptions> {}

export const ListboxOptions: React.FC<ListboxOptionsProps> = ({
  className,
  ...props
}) => {
  return (
    <HeadlessListboxOptions
      className={twMerge(
        "flow-absolute flow-z-10 flow-mt-1 flow-w-full flow-max-h-60 flow-overflow-auto",
        "flow-rounded-md flow-border flow-shadow-lg",
        "flow-bg-white dark:flow-bg-slate-800",
        "flow-border-slate-300 dark:flow-border-slate-600",
        "focus:flow-outline-none",
        className
      )}
      {...props}
    />
  )
}

export interface ListboxOptionProps<T>
  extends React.ComponentProps<typeof HeadlessListboxOption> {
  value: T
}

export function ListboxOption<T>({
  className,
  children,
  ...props
}: ListboxOptionProps<T>) {
  return (
    <HeadlessListboxOption
      className={twMerge(
        "flow-px-4 flow-py-2 flow-cursor-pointer flow-text-sm",
        "flow-text-slate-900 dark:flow-text-slate-100",
        "data-[focus]:flow-bg-slate-100 data-[focus]:dark:flow-bg-slate-700",
        `data-[selected]:flow-bg-flow-primary/10
        data-[selected]:dark:flow-bg-flow-primary/20`,
        `data-[selected]:flow-text-flow-primary
        dark:data-[selected]:flow-text-flow-primary`,
        "flow-transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </HeadlessListboxOption>
  )
}
