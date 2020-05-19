# @onflow/protobuf

This package contains the protobuf files used by the Flow JS SDK to communicate with the Access API.

# Status

- **Last Updated:** April 21st 2020
- **Stable:** Yes
- **Risk of Breaking Change:** High

These change when the access nodes need different data. If the access nodes introduce a breaking change this package will proxy that breaking change into the SDK and FCL.
This risk is what lead us to the interaction abstraction and our send functions acting as a translation layer between the interaction and these.

Known Upcoming Changes:

- Future versions of the access node will allow us to send Cadence params beside the code. This isn't a thing that is in the proto files at all yet.

# Install

```bash
npm install --save @onflow/protobuf
```

## Versioning

The version of this package reflects the version of the AccessAPI spec for which it supports.

## Generating Protobuf Files

First, ensure you have `protoc` installed on your machine. `protoc` is a tool that will allow us to generate js-protobuf files. To install `protoc`, follow the guide available here https://grpc.io/docs/quickstart/go/#protocol-buffers (note: MacOS users can install `protoc` using homebrew: `brew install protoc`)

To generate the js-protobuf files, run the following command in the root of this package:

```
protoc --plugin="protoc-gen-ts=./node_modules/.bin/protoc-gen-ts" --js_out="import_style=commonjs,binary:src/generated" --ts_out="service=grpc-web:src/generated" -I ./src/proto ./src/proto/flow/**/*.proto;
```
