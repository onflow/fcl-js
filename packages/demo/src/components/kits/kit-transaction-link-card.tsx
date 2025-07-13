import {TransactionButton, TransactionLink} from "@onflow/kit"
import {useState} from "react"

export function KitTransactionLinkCard() {
  const [txId, setTxId] = useState<string | undefined>(undefined)

  const GREETING_TRANSACTION = `
    transaction(greeting: String) {
      prepare(signer: AuthAccount) {
        log(greeting)
      }
    }
  `

  return (
    <div className="p-4 border border-gray-200 rounded-lg mb-8">
      <h2 className="text-lg font-bold mb-2">Transaction Link Component</h2>
      <p className="mb-4">
        Click the button to trigger a transaction. Once the transaction is
        submitted, a link to the block explorer will be displayed.
      </p>
      <TransactionButton
        label="Trigger Transaction"
        transaction={{
          cadence: GREETING_TRANSACTION,
          args: (arg, t) => [arg("Hello, World!", t.String)],
          limit: 999,
        }}
        mutation={{
          onSuccess: data => {
            setTxId(data)
          },
        }}
      />
      {txId && (
        <div className="mt-4">
          <p className="font-bold">Transaction Submitted!</p>
          <TransactionLink txId={txId} />
        </div>
      )}
    </div>
  )
}
