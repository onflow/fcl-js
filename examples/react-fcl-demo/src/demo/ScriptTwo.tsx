import React, {useState} from "react"
import * as fcl from "@onflow/fcl"

import Card from '../components/Card'
import Header from '../components/Header'
import Code from '../components/Code'
import Point from '../model/Point'

const scriptTwo = `\
pub struct SomeStruct {
  pub var x: Int
  pub var y: Int

  init(x: Int, y: Int) {
    self.x = x
    self.y = y
  }
}

pub fun main(): [SomeStruct] {
  return [SomeStruct(x: 1, y: 2), SomeStruct(x: 3, y: 4)]
}
`;

fcl.config()
  .put("decoder.SomeStruct", (data: Point) => new Point(data))

export default function ScriptTwo() {
  const [data, setData] = useState<any>([])

  const runScript = async (event: any) => {
    event.preventDefault()

    const response = await fcl.send([
      fcl.script(scriptTwo),
    ])
    
    setData(await fcl.decode(response))
  }

  return (
    <Card>
      <Header>run script - with custom decoder</Header>

      <Code>{scriptTwo}</Code>

      <button onClick={runScript}>Run Script</button>
      
      {data && (
        <Code>
          {data && data.map((item: any, index: number) => (
            <div key={index}>
              {item.constructor.name} {index}
              <br />
              {JSON.stringify(item, null, 2)}
              <br />
              --
            </div>
          ))}
        </Code>
      )}
    </Card>
  )
}
