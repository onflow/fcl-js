import {transaction, proposer, payer, authorizations} from "../../sdk"
import {overload} from "../../test-utils/overload"
import {run} from "../../test-utils/run"
import {authzFn} from "../../test-utils/authz-fn"
import {mockSend} from "../../test-utils/mock-send"

const S1 = {addr: "0x1234567890123456", keyId: 4}

test("pre-signable", async () => {
  await overload(
    {
      "sdk.send": mockSend(),
    },
    async () => {
      const resolve = jest.fn((acct, preSignable) => {
        // console.log("PRE_SIGNABLE", preSignable)
        return authzFn(S1)(acct)
      })

      const authz = account => ({
        ...account,
        tempId: "CURRENT_USER",
        resolve,
      })

      await run([
        transaction`CODE`,
        proposer(authz),
        payer(authz),
        authorizations([authz]),
      ])

      expect(resolve.mock.calls.length).toBe(1)
      expect(resolve.mock.calls[0][1]).toMatchObject({
        f_type: "PreSignable",
        f_vsn: "1.0.1",
        roles: {
          proposer: true,
          authorizer: true,
          payer: true,
        },
        data: {},
        voucher: {
          cadence: "CODE",
          refBlock: "123",
          computeLimit: 10,
          arguments: [],
          proposalKey: {address: null, keyId: null, sequenceNum: null},
          payer: null,
          authorizers: [null],
          payloadSigs: [],
        },
      })
    }
  )
})
