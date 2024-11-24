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

  getReferenceBlockId(): Uint8Array | string;
  getReferenceBlockId_asU8(): Uint8Array;
  getReferenceBlockId_asB64(): string;
  setReferenceBlockId(value: Uint8Array | string): void;

  getSignature(): Uint8Array | string;
  getSignature_asU8(): Uint8Array;
  getSignature_asB64(): string;
  setSignature(value: Uint8Array | string): void;

  clearSignerIdsList(): void;
  getSignerIdsList(): Array<Uint8Array | string>;
  getSignerIdsList_asU8(): Array<Uint8Array>;
  getSignerIdsList_asB64(): Array<string>;
  setSignerIdsList(value: Array<Uint8Array | string>): void;
  addSignerIds(value: Uint8Array | string, index?: number): Uint8Array | string;

  getSignerIndices(): Uint8Array | string;
  getSignerIndices_asU8(): Uint8Array;
  getSignerIndices_asB64(): string;
  setSignerIndices(value: Uint8Array | string): void;

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
    referenceBlockId: Uint8Array | string,
    signature: Uint8Array | string,
    signerIdsList: Array<Uint8Array | string>,
    signerIndices: Uint8Array | string,
  }
}

