import * as fcl from "./fcl"
import fs from "fs"
import path from "path"
import {serialize} from "./serialize"
import {
  resolve,
  build,
  transaction,
  limit,
  proposer,
  authorizations,
  payer,
  ref,
  createSignableVoucher,
} from "@onflow/sdk"

test("config", async () => {
  const $ = fcl.config()
  expect(await $.get("accessNode.api")).toBe("http://localhost:8080")
})

test("fcl.VERSION needs to match version in package.json", () => {
  const pkg = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf-8")
  )
  expect(pkg.version).toBe(fcl.VERSION)
})

const userData = {
  f_type: "USER",
  f_vsn: "1.0.0",
  addr: "0x6a14b81975f0ee46",
  cid: "d388f086a545ce3c552d89447a786a4a58753775",
  loggedIn: true,
  expiresAt: null,
  services: [
    {
      f_type: "Service",
      f_vsn: "1.0.0",
      type: "authn",
      uid: "blocto#authn",
      id: "DzxjJXu7u",
      identity: {
        address: "0x6a14b81975f0ee46",
      },
      provider: {
        address: "0xf086a545ce3c552d",
        name: "Blocto",
        icon: "https://blocto.portto.io/icons/icon-512x512.png",
        description: "Blocto is your entrance to blockchain world.",
      },
      authn: "https://flow-wallet-testnet.blocto.app/api/authz",
    },
    {
      f_type: "Service",
      f_vsn: "1.0.0",
      type: "authz",
      uid: "blocto#authz",
      method: "HTTP/POST",
      identity: {
        address: "0x6a14b81975f0ee46",
        keyId: 1,
        addr: "0x6a14b81975f0ee46",
      },
      address: "0x6a14b81975f0ee46",
      addr: "0x6a14b81975f0ee46",
      keyId: 1,
      endpoint: "https://flow-wallet-testnet.blocto.app/api/authz",
      params: {
        sessionId: "DzxjJXu7u",
      },
    },
    {
      f_type: "Service",
      f_vsn: "1.0.0",
      type: "pre-authz",
      uid: "blocto#pre-authz",
      method: "HTTP/POST",
      endpoint: "https://flow-wallet-testnet.blocto.app/api/pre-authz",
      params: {
        sessionId: "DzxjJXu7u",
      },
    },
    {
      f_type: "Service",
      f_vsn: "1.0.0",
      type: "authz",
      uid: "DzxjJXu7u#authz-http-post",
      endpoint: "https://flow-wallet-testnet.blocto.app/api/authz",
      method: "HTTP/POST",
      identity: {
        f_type: "Identity",
        f_vsn: "1.0.0",
        address: "0x6a14b81975f0ee46",
        keyId: 1,
      },
      params: {
        sessionId: "DzxjJXu7u",
      },
    },
    {
      f_type: "Service",
      f_vsn: "1.0.0",
      type: "signature",
      uid: "wallet-provider#signature",
      endpoint: "http://localhost:3000/fcl/authn",
      method: "IFRAME/RPC", // HTTP/POST | IFRAME/RPC | HTTP/RPC
      identity: {
        f_type: "Identity",
        f_vsn: "1.0.0",
        address: "0x6a14b81975f0ee46",
        keyId: 1,
      },
      provider: {
        address: "0xf8d6e0586b0a20c7",
        name: "Flow Dev Wallet",
        description: "The Best Wallet",
        icon: "https://blocto.portto.io/icons/icon-512x512.png",
      },
      data: {}, // included in body of authz request
      params: {}, // included as query params on endpoint url
    },
  ],
}

const close = () => {}

test("sign", async () => {
  const testServiceStrategy = (service, {onResponse}) => {
    try {
      onResponse({data: userData}, {close})
    } catch (error) {
      console.error("Test Authn Callback Error", error)
    }
  }

  const user = await fcl.authenticate({serviceStrategy: testServiceStrategy})

  const signature = await fcl.sign({}, {serviceStrategy: testServiceStrategy})

  expect(signature).toBe(true)
})
