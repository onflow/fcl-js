# @onflow/protobuf

This package contains the protobuf files used in the JS-SDK for communicating with the AccessAPI

# Install

```bash
npm install --save @onflow/protobuf
```

## Versioning

The version of this package reflects the version of the AccessAPI spec for which it supports.

## Generating Protobuf Files

To generate the js-protobuf files, run the following command in the root of this package:

```
protoc --plugin="protoc-gen-ts=./node_modules/.bin/protoc-gen-ts" --js_out="import_style=commonjs,binary:src/generated" --ts_out="service=grpc-web:src/generated" -I ./src/proto ./src/proto/flow/**/*.proto;
```
