---
"@onflow/fcl-react-native": minor
"@onflow/fcl-core": minor
"@onflow/fcl": minor
---

Add real-time streaming methods `subscribe` and `rawSubscribe`.

These are only available when using a REST API endpoint and not supported by the deprecated GRPC trasnport.

The following topics are now available:

- `blocks`
- `block_headers`
- `block_digests`
- `transaction_statues`
- `events`
- `account_statuses`

Developers using `fcl.tx` and `fcl.events` will not need to make any changes to their existing app to realize the latency improvements of this change and will automatically benefit by upgrading to this version.

Please see the [Flow Developer Documentation](https://developers.flow.com/clients/fcl-js/) for more details on how to use these new methods.