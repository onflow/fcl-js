// package: flow.entities
// file: flow/entities/collection.proto

import * as jspb from "google-protobuf";

export class Collection extends jspb.Message {
  getId(): Uint8Array | string;
  getId_asU8(): Uint8Array;
  getId_asB64(): string;
  setId(value: Uint8Array | string): void;

  clearTransactionIdsList(): void;
  getTransactionIdsList(): Array<Uint8Array | string>;
  getTransactionIdsList_asU8(): Array<Uint8Array>;
  getTransactionIdsList_asB64(): Array<string>;
  setTransactionIdsList(value: Array<Uint8Array | string>): void;
  addTransactionIds(value: Uint8Array | string, index?: number): Uint8Array | string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Collection.AsObject;
  static toObject(includeInstance: boolean, msg: Collection): Collection.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Collection, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Collection;
  static deserializeBinaryFromReader(message: Collection, reader: jspb.BinaryReader): Collection;
}

export namespace Collection {
  export type AsObject = {
    id: Uint8Array | string,
    transactionIdsList: Array<Uint8Array | string>,
  }
}

export class CollectionGuarantee extends jspb.Message {
  getCollectionId(): Uint8Array | string;
  getCollectionId_asU8(): Uint8Array;
  getCollectionId_asB64(): string;
  setCollectionId(value: Uint8Array | string): void;

  clearSignaturesList(): void;
  getSignaturesList(): Array<Uint8Array | string>;
  getSignaturesList_asU8(): Array<Uint8Array>;
  getSignaturesList_asB64(): Array<string>;
  setSignaturesList(value: Array<Uint8Array | string>): void;
  addSignatures(value: Uint8Array | string, index?: number): Uint8Array | string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CollectionGuarantee.AsObject;
  static toObject(includeInstance: boolean, msg: CollectionGuarantee): CollectionGuarantee.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CollectionGuarantee, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CollectionGuarantee;
  static deserializeBinaryFromReader(message: CollectionGuarantee, reader: jspb.BinaryReader): CollectionGuarantee;
}

export namespace CollectionGuarantee {
  export type AsObject = {
    collectionId: Uint8Array | string,
    signaturesList: Array<Uint8Array | string>,
  }
}

