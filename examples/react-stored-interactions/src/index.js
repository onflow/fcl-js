import React, {useState} from "react"
import ReactDOM from "react-dom"
import * as fcl from "@onflow/fcl"
import * as types from "@onflow/types"
import {SixAddNewKey} from "./ix/SixAddNewKey"
import {SixCreateAccount} from "./ix/SixCreateAccount"
import {SixTransferTokens} from "./ix/SixTransferTokens"

fcl.config()
  .put("accessNode.api", "http://localhost:8080")
  .put("challenge.handshake", "http://localhost:3000/local/authn")

window.fcl = fcl
window.t = types

const App = () => (
  <div>
    <SixCreateAccount />
    <hr />
    <SixAddNewKey />
    <hr />
    <SixTransferTokens />
  </div>
)

ReactDOM.render(<App />, document.getElementById("APP"))
