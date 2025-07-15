import {TransactionButton} from "@onflow/kit"

export function KitTransactionButtonCard() {
  const GREETING_TRANSACTION = `
    transaction(greeting: String) {
      prepare(signer: &Account) {
        log(greeting)
      }
    }
  `
  return (
    <div className="p-4 border border-gray-200 rounded-lg mb-8">
      <h2 className="text-lg font-bold mb-2">Transaction Button Component</h2>
      <p className="mb-4">This component allows users to sign transactions.</p>
      <TransactionButton
        label="Sign Transaction"
        transaction={{
          cadence: GREETING_TRANSACTION,
          args: (arg, t) => [arg("Hello, World!", t.String)],
          limit: 999,
        }}
      />
    </div>
  )
}
