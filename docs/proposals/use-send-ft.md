### useSendFt: LostAndFound‑aware FT sending via Flow Actions Sink

> Alignment one‑pager for a small SDK feature that guarantees successful FT sends by routing to either the recipient’s vault or LostAndFound, leveraging the Flow Actions Sink pattern.

### Summary

Ship `useSendFt`: a small React hook that sends fungible tokens and falls back to FLIP‑281 LostAndFound when recipients are not ready.

### Problem

Many transfers fail because recipients haven't initialized vault storage. This breaks UX, causes developer friction, and forces teams to build complex, non‑standard publish/claim or initialization workarounds.

### Proposed feature

`useSendFt` does a quick pre‑flight check and runs a single Cadence tx that either deposits to the recipient or to LostAndFound (with optional storage payment). Simple API, clear result (direct vs LostAndFound + any storage fee).

### Flow Actions context (Source/Sink)

- **Sink abstraction**: Implement a DeFi Actions Sink that attempts a direct deposit to the recipient. If the recipient is not initialized, route the payment to LostAndFound instead. This encapsulates the initialization problem into one reusable Sink.
- **Implementation detail**: The hook uses this Sink inside a single transaction. API/UX is identical either way.
- **Reference**: See Flow Actions discussion and interfaces in the FLIP: [FLIP 338: Flow Actions: Composable Standards for Protocols](https://github.com/onflow/flips/pull/339).

### Short user stories

- **Sender**: "I send tokens and it succeeds or I know they were deposited to the recipient's inbox."
- **Recipient**: "Tokens are deposited to either my account or LostAndFound. For MVP, claim UX is provided by wallets or supporting apps (e.g., Flow Port); the SDK does not provide claim UI or attempt to detect wallet support."
- **Developer**: "Integrate token transfers quickly—no need to require recipient vault initialization."

### Impact

- **Fewer failed transfers** → better UX and lower support burden
- **Simpler integrations** for payments/marketplaces
- **Unblocks airdrops** without custom publish/claim flows

### Key metrics

- **Transfer success rate**: 100%
- **Integration time**: <5 minutes
- **Adoption**: number of apps using `useSendFt`

### MVP

- `useSendFt` hook (pre‑flight scripts + conditional tx via Sink)
- Short integration example + docs

### Follow‑ups & MVP‑adjacent

- SendFtForm UI with LostAndFound‑aware UX (MVP‑adjacent)
- Wallet Inbox / Claim UX support (coordinate with wallet teams) (MVP‑adjacent)
- Docs: point to supporting wallets/apps for claiming (e.g., Flow Port) (MVP‑adjacent)
- `useClaimFt` + inbox UI for recipients (post‑MVP)
- Analytics hooks to measure deposits vs claims (post‑MVP)
- Guidance & canonical LostAndFound addresses + override policy (MVP‑adjacent; governance)
- Airdrop guidance & examples (MVP‑adjacent)

### Risks

- **Wallet dependency**: Wallets must expose an "Inbox/Unclaimed" UX (list + Redeem/Discard). The SDK will not detect or warn about support. Mitigation: document and direct users to supporting wallets/apps (e.g., Flow Port).
- **Storage fee friction**: Surface fee and require explicit consent.
- **Ownership**: Canonical LostAndFound is currently third‑party operated. Mitigation: explore Foundation/shared multisig and support SDK overrides.

### Why a Sink?

- Encapsulates routing logic (vault vs LostAndFound) behind a standard interface.
- Reusable across apps and higher‑level Actions; reduces boilerplate and fragmentation.
- Aligns with the Flow Actions composability model (Source/Sink).

### References

- Flow Actions FLIP discussion: [FLIP 338: Flow Actions: Composable Standards for Protocols](https://github.com/onflow/flips/pull/339)



