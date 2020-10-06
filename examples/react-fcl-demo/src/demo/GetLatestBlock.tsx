import React, {useState} from "react"

import { decode, send, getLatestBlock } from "@onflow/fcl"

import Card from '../components/Card'
import Code from '../components/Code'

const GetLatestBlock = () => {
  const [data, setData] = useState(null)

  const runGetLatestBlock = async (event: any) => {
    event.preventDefault()

    const response = await send([
      getLatestBlock(),
    ])
    
    setData(await decode(response))
  }

  return (
    <Card>
      <button onClick={runGetLatestBlock}>
        Get Latest Block
      </button>
      
      {data && <Code>{JSON.stringify(data, null, 2)}</Code>}
    </Card>
  )
}

export default GetLatestBlock
