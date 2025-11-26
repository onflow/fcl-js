import React from "react"
import {
  Tab as HeadlessTab,
  TabGroup as HeadlessTabGroup,
  TabList as HeadlessTabList,
  TabPanel as HeadlessTabPanel,
  TabPanels as HeadlessTabPanels,
} from "@headlessui/react"
import {twMerge} from "tailwind-merge"

export interface TabGroupProps
  extends React.ComponentProps<typeof HeadlessTabGroup> {}

export const TabGroup: React.FC<TabGroupProps> = ({className, ...props}) => {
  return <HeadlessTabGroup className={twMerge(className)} {...props} />
}

export interface TabListProps
  extends React.ComponentProps<typeof HeadlessTabList> {}

export const TabList: React.FC<TabListProps> = ({className, ...props}) => {
  return (
    <HeadlessTabList
      className={twMerge(
        "flow-flex flow-gap-6 flow-border-b flow-border-slate-200 dark:flow-border-slate-700",
        className
      )}
      {...props}
    />
  )
}

export interface TabProps extends React.ComponentProps<typeof HeadlessTab> {}

export const Tab: React.FC<TabProps> = ({className, ...props}) => {
  return (
    <HeadlessTab
      className={twMerge(
        "flow-relative flow-py-3 flow-px-1 flow-text-sm flow-font-medium",
        "flow-text-slate-600 dark:flow-text-slate-400",
        "hover:flow-text-slate-900 dark:hover:flow-text-slate-100",
        "focus:flow-outline-none flow-transition-colors",
        "data-[selected]:flow-text-slate-900 data-[selected]:dark:flow-text-slate-100",
        className
      )}
      {...props}
    />
  )
}

export interface TabPanelsProps
  extends React.ComponentProps<typeof HeadlessTabPanels> {}

export const TabPanels: React.FC<TabPanelsProps> = ({
  className,
  ...props
}) => {
  return <HeadlessTabPanels className={twMerge(className)} {...props} />
}

export interface TabPanelProps
  extends React.ComponentProps<typeof HeadlessTabPanel> {}

export const TabPanel: React.FC<TabPanelProps> = ({
  className,
  ...props
}) => {
  return (
    <HeadlessTabPanel
      className={twMerge("flow-pt-4 focus:flow-outline-none", className)}
      {...props}
    />
  )
}
