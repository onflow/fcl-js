import React, {useState} from "react"
import ReactDOM from "react-dom"
import {SixAddNewKey} from "./ix/SixAddNewKey"
import {SixCreateAccount} from "./ix/SixCreateAccount"
import {SixTransferTokens} from "./ix/SixTransferTokens"

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
