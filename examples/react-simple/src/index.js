import React, {useState} from "react"
import ReactDOM from "react-dom"
import {Script} from "./ix/Script"
import {Transaction} from "./ix/Transaction"
import {GetTransactionStatus} from "./ix/GetTransactionStatus"
import {GetAccount} from "./ix/GetAccount"
import {GetEvents} from "./ix/GetEvents"
import {GetLatestBlock} from "./ix/GetLatestBlock"
import {Ping} from "./ix/Ping"
import {BatchTransactions} from "./ix/BatchTransactions"
import {SixCreateAccount} from "./ix/SixCreateAccount"

const App = () => (
  <div>
    <Script />
    <hr />
    <Transaction />
    <hr />
    <GetTransactionStatus />
    <hr />
    <GetAccount />
    <hr />
    <GetEvents />
    <hr />
    <GetLatestBlock />
    <hr />
    <Ping />
    <hr />
    <BatchTransactions />
    <hr />
    <SixCreateAccount />
  </div>
)

ReactDOM.render(<App />, document.getElementById("APP"))
