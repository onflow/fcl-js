---
"@onflow/sdk": minor
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

Please see the [Flow Developer Documentation](https://developers.flow.com/clients/fcl-js/) for more details on how to use these new methods.