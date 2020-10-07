import React, {useState} from "react"

import Card from '../components/Card'
import Header from '../components/Header'
import Code from '../components/Code'  
import { Send } from "../helper/fcl-deployer"

const simpleContract = `
pub contract HelloWorld {
  pub let greeting: String
  pub event HelloEvent(message: String)

  init() {
    self.greeting = "Hello, World!"
  }

  pub fun hello(message: String): String {
    emit HelloEvent(message: message)
    return self.greeting
  }
}
`

const DeployContract = () => {
  const [status, setStatus] = useState("Not started")
  const [transaction, setTransaction] = useState(null)

  const runTransaction = async (event: any) => {
    event.preventDefault()
    
    setStatus("Resolving...")
    const result = await Send(simpleContract);
    setStatus("Transaction Completed");
    setTransaction(result);
  }

  return (
    <Card>
      <Header>Deploy contract with six set code</Header>

      <Code>{simpleContract}</Code>

      <button onClick={runTransaction}>
        Deploy Contract
      </button>

      <Code>Status: {status}</Code>

      { transaction && <Code>{JSON.stringify(transaction, null, 2)}</Code>}
    </Card>
  )
}

export default DeployContract