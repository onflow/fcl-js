## Technical Specification: useSendFt and LostAndFound Sink

This document specifies the SDK API, transaction shape, Flow Actions Sink design, and edge cases for a LostAndFound‑aware FT sending flow. It aligns the implementation with the Flow Actions Source/Sink model proposed in [FLIP 338: Flow Actions: Composable Standards for Protocols](https://github.com/onflow/flips/pull/339) and uses the LostAndFound mechanism from FLIP‑281.

### Scope

- `useSendFt` React hook that initiates a LostAndFound‑aware FT transfer.
- A DeFi Actions‑style `LostAndFoundSink` that routes to either the recipient vault or LostAndFound in a single transaction.
- Minimal pre‑flight read for UX clarity; primary branching occurs on‑chain.
- MVP targets FTs; NFTs are out of scope.

### Definitions

- Recipient readiness: account has an initialized vault for the given FT type and public receiver capability.
- LostAndFound: contract and storage that can accept deposits when recipients are uninitialized, enabling later claims by the intended recipient.
- Storage fee: optional fee paid to initialize or store in inbox mechanisms; surfaced pre‑tx and confirmed by the user.

### High‑level flow

1. Optional pre‑flight script to detect recipient readiness and estimate pathway (direct vs LostAndFound) and any storage fee.
2. Single transaction executes a `LostAndFoundSink.deposit` action that attempts direct deposit; on failure routes to LostAndFound.
3. Hook returns a structured result indicating the outcome path, fees, and identifiers for later claim tracking.

### Hook API

```ts
type UseSendFtArgs = {
  tokenId: string;               // canonical ID, e.g. "A.1654653399040a61.FlowToken"
  amount: string;                // decimal string; validated and converted to UFix64
  recipient: string;             // address (0x‑prefixed)
  payer?: string;                // optional override; defaults to current user
  allowStorageFee?: boolean;     // require explicit consent if fee may be charged
  lostAndFoundAddress?: string;  // override canonical; governance controlled default
};

type SendFtOutcome =
  | { kind: "direct"; txId: string }
  | { kind: "lost_and_found"; txId: string; depositId: string }
  | { kind: "rejected_fee" };

type UseSendFtReturn = {
  send: () => Promise<SendFtOutcome>;
  loading: boolean;
  error: Error | null;
  preview?: { path: "direct" | "lost_and_found"; storageFee?: string };
};
```

Notes:
- `preview` is best‑effort; authoritative outcome is on‑chain.
- `depositId` is an identifier yielded by the LostAndFound deposit event/logs for claim reconciliation.

### Transaction design

- Single transaction parameterized by `tokenType`, `amount`, `recipient`, `lostAndFoundAddress`, and `allowStorageFee`.
- Uses a `LostAndFoundSink` Action that implements the Flow Actions Sink interface.

#### Pseudocode (Cadence)

```cadence
import FungibleToken from tokenContract
import LostAndFound from lostAndFoundAddress
// import Actions or define Sink interface compatible with FLIP 338

pub struct LostAndFoundSink: Sink {
    pub fun deposit(token: @FungibleToken.Vault, recipient: Address): LostAndFound.DepositResult {
        // Try direct deposit via recipient's public receiver
        let receiverCap = getAccount(recipient)
            .getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)

        if receiverCap.check() {
            let receiver = receiverCap.borrow()!
            receiver.deposit(from: <- token)
            emit DepositDirect(recipient: recipient, amount: token.balance)
            return LostAndFound.DepositResultDirect()
        }

        // Fallback to LostAndFound inbox
        let inbox <- LostAndFound.borrowInboxOrCreate(recipient: recipient)
        inbox.deposit(token: <- token)
        let depositId = inbox.lastDepositId()
        emit DepositLostAndFound(recipient: recipient, depositId: depositId)
        return LostAndFound.DepositResultInbox(depositId: depositId)
    }
}

transaction(tokenType: Type, amount: UFix64, recipient: Address, lostAndFoundAddress: Address, allowStorageFee: Bool) {
    prepare(signer: AuthAccount) {
        // Guard storage fee consent if inbox creation/storage requires fee
        if LostAndFound.willChargeFee(recipient) && !allowStorageFee { panic("fee not allowed") }

        let vaultRef = signer.borrow<&FungibleToken.Vault>(from: /storage/flowTokenVault)!
        let payment <- vaultRef.withdraw(amount: amount)

        let sink = LostAndFoundSink()
        let result = sink.deposit(token: <- payment, recipient: recipient)
        // store minimal result if needed
    }
}
```

Implementation will use concrete token paths for the selected `tokenId` and the canonical LostAndFound deployment. Exact types and paths vary by token.

### Events and telemetry

- SDK parses transaction events to determine outcome path and extract `depositId` for LostAndFound deposits.
- Optional analytics hooks can be added post‑MVP.

### Pre‑flight script (optional)

- Checks for recipient receiver capability presence for the given token.
- Queries LostAndFound for whether inbox creation will incur a fee.
- Returns a `preview` used to display UX confirmation, especially if a fee may be charged.

### Configuration and governance

- Canonical LostAndFound contract address is provided by configuration with a sensible default.
- Apps may override via `lostAndFoundAddress`.
- Document governance and trust model; monitor for a Foundation/shared multisig deployment when available.

### Edge cases and error handling

- Recipient deletes receiver between pre‑flight and tx: direct path fails safely as Sink falls back to LostAndFound.
- Insufficient payer balance for fee: transaction aborts unless app opts into fee and covers it; surface error.
- Token type mismatches: validate `tokenId` maps to correct storage/public paths; fail early in SDK.
- Precision/amount: accept decimal strings; normalize to UFix64 with proper rounding/validation.

### Minimal React usage example (pseudo)

```tsx
const { send, loading, error, preview } = useSendFt({
  tokenId: "A.1654653399040a61.FlowToken",
  amount: "10.5",
  recipient: "0xabc...",
  allowStorageFee: true,
});

const onClick = async () => {
  const outcome = await send();
  if (outcome.kind === "direct") {
    // success
  } else if (outcome.kind === "lost_and_found") {
    // show claim instructions with outcome.depositId
  }
};
```

### Non‑goals

- Claim UI and flows are out of scope for MVP (left to wallets/Flow Port).
- NFT support.

### References

- Flow Actions FLIP discussion: [FLIP 338](https://github.com/onflow/flips/pull/339)



