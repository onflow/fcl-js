// package: flow.entities
// file: flow/entities/block_seal.proto

import * as jspb from "google-protobuf";

export class BlockSeal extends jspb.Message {
  getBlockId(): Uint8Array | string;
  getBlockId_asU8(): Uint8Array;
  getBlockId_asB64(): string;
  setBlockId(value: Uint8Array | string): void;

  getExecutionReceiptId(): Uint8Array | string;
  getExecutionReceiptId_asU8(): Uint8Array;
  getExecutionReceiptId_asB64(): string;
  setExecutionReceiptId(value: Uint8Array | string): void;

  clearExecutionReceiptSignaturesList(): void;
  getExecutionReceiptSignaturesList(): Array<Uint8Array | string>;
  getExecutionReceiptSignaturesList_asU8(): Array<Uint8Array>;
  getExecutionReceiptSignaturesList_asB64(): Array<string>;
  setExecutionReceiptSignaturesList(value: Array<Uint8Array | string>): void;
  addExecutionReceiptSignatures(value: Uint8Array | string, index?: number): Uint8Array | string;

  clearResultApprovalSignaturesList(): void;
  getResultApprovalSignaturesList(): Array<Uint8Array | string>;
  getResultApprovalSignaturesList_asU8(): Array<Uint8Array>;
  getResultApprovalSignaturesList_asB64(): Array<string>;
  setResultApprovalSignaturesList(value: Array<Uint8Array | string>): void;
  addResultApprovalSignatures(value: Uint8Array | string, index?: number): Uint8Array | string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockSeal.AsObject;
  static toObject(includeInstance: boolean, msg: BlockSeal): BlockSeal.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockSeal, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockSeal;
  static deserializeBinaryFromReader(message: BlockSeal, reader: jspb.BinaryReader): BlockSeal;
}

export namespace BlockSeal {
  export type AsObject = {
    blockId: Uint8Array | string,
    executionReceiptId: Uint8Array | string,
    executionReceiptSignaturesList: Array<Uint8Array | string>,
    resultApprovalSignaturesList: Array<Uint8Array | string>,
  }
}

