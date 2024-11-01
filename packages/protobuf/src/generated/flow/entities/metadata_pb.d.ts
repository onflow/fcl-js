// package: flow.entities
// file: flow/entities/metadata.proto

import * as jspb from "google-protobuf";

export class Metadata extends jspb.Message {
  getLatestFinalizedBlockId(): Uint8Array | string;
  getLatestFinalizedBlockId_asU8(): Uint8Array;
  getLatestFinalizedBlockId_asB64(): string;
  setLatestFinalizedBlockId(value: Uint8Array | string): void;

  getLatestFinalizedHeight(): number;
  setLatestFinalizedHeight(value: number): void;

  getNodeId(): Uint8Array | string;
  getNodeId_asU8(): Uint8Array;
  getNodeId_asB64(): string;
  setNodeId(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Metadata.AsObject;
  static toObject(includeInstance: boolean, msg: Metadata): Metadata.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Metadata, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Metadata;
  static deserializeBinaryFromReader(message: Metadata, reader: jspb.BinaryReader): Metadata;
}

export namespace Metadata {
  export type AsObject = {
    latestFinalizedBlockId: Uint8Array | string,
    latestFinalizedHeight: number,
    nodeId: Uint8Array | string,
  }
}

