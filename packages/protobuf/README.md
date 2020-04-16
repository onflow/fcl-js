## Generating Protobuf Files

To generate the js-protobuf files, run the following command in the root of this package:

```
protoc --plugin="protoc-gen-ts=./node_modules/.bin/protoc-gen-ts" --js_out="import_style=commonjs,binary:src/generated" --ts_out="service=grpc-web:src/generated" -I ./src/proto ./src/proto/flow/**/*.proto;
```
