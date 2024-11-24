// package: flow.entities
// file: flow/entities/register.proto

import * as jspb from "google-protobuf";

export class RegisterID extends jspb.Message {
  getOwner(): Uint8Array | string;
  getOwner_asU8(): Uint8Array;
  getOwner_asB64(): string;
  setOwner(value: Uint8Array | string): void;

  getKey(): Uint8Array | string;
  getKey_asU8(): Uint8Array;
  getKey_asB64(): string;
  setKey(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterID.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterID): RegisterID.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RegisterID, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterID;
  static deserializeBinaryFromReader(message: RegisterID, reader: jspb.BinaryReader): RegisterID;
}

export namespace RegisterID {
  export type AsObject = {
    owner: Uint8Array | string,
    key: Uint8Array | string,
  }
}

