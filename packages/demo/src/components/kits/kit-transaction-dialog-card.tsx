import {TransactionButton, TransactionDialog} from "@onflow/kit"
import {useState} from "react"

export function KitTransactionDialogCard() {
  const [open, setOpen] = useState(false)
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
      <h2 className="text-lg font-bold mb-2">Transaction Dialog Component</h2>
      <p className="mb-4">
        This component shows the status of a transaction. Click the button to
        trigger a transaction and open the dialog.
      </p>
      <TransactionButton
        label="Trigger Transaction Dialog"
        transaction={{
          cadence: GREETING_TRANSACTION,
          args: (arg, t) => [arg("Hello, World!", t.String)],
          limit: 999,
        }}
        mutation={{
          onSuccess: data => {
            setTxId(data)
            setOpen(true)
          },
        }}
      />
      <TransactionDialog open={open} onOpenChange={setOpen} txId={txId} />
    </div>
  )
}
