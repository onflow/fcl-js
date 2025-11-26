import React from "react"
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "./internal/Tabs"

export const FundContent: React.FC = () => {
  return (
    <div>
      <h2 className="flow-text-lg flow-font-semibold flow-text-slate-900 dark:flow-text-slate-100 flow-mb-4">
        Fund
      </h2>
      <TabGroup>
        <TabList>
          <Tab>
            {({selected}) => (
              <>
                Tab 1
                {selected && (
                  <div className="flow-absolute flow-bottom-0 flow-left-0 flow-right-0 flow-h-0.5 flow-bg-slate-900 dark:flow-bg-slate-100" />
                )}
              </>
            )}
          </Tab>
          <Tab>
            {({selected}) => (
              <>
                Tab 2
                {selected && (
                  <div className="flow-absolute flow-bottom-0 flow-left-0 flow-right-0 flow-h-0.5 flow-bg-slate-900 dark:flow-bg-slate-100" />
                )}
              </>
            )}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Content 1</TabPanel>
          <TabPanel>Content 2</TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  )
}
