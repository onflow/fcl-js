import React, {useState} from "react"
import * as fcl from "@onflow/fcl"

import Card from '../components/Card'
import Header from '../components/Header'
import Code from '../components/Code'

const scriptOne = `\
pub fun main(): Int {
  return 42 + 6
}
`

export default function ScriptOne() {
  const [data, setData] = useState(null)

  const runScript = async (event: any) => {
    event.preventDefault()

    const response = await fcl.send([
      fcl.script(scriptOne),
    ])
    
    setData(await fcl.decode(response))
  }

  return (
    <Card>
      <Header>run script</Header>
      
      <Code>{scriptOne}</Code>
      
      <button onClick={runScript}>Run Script</button>

      {data && (
        <Code>
          {JSON.stringify(data, null, 2)}
        </Code>
      )}
    </Card>
  )
}
