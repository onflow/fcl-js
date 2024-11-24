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

  getFinalState(): Uint8Array | string;
  getFinalState_asU8(): Uint8Array;
  getFinalState_asB64(): string;
  setFinalState(value: Uint8Array | string): void;

  getResultId(): Uint8Array | string;
  getResultId_asU8(): Uint8Array;
  getResultId_asB64(): string;
  setResultId(value: Uint8Array | string): void;

  clearAggregatedApprovalSigsList(): void;
  getAggregatedApprovalSigsList(): Array<AggregatedSignature>;
  setAggregatedApprovalSigsList(value: Array<AggregatedSignature>): void;
  addAggregatedApprovalSigs(value?: AggregatedSignature, index?: number): AggregatedSignature;

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
    finalState: Uint8Array | string,
    resultId: Uint8Array | string,
    aggregatedApprovalSigsList: Array<AggregatedSignature.AsObject>,
  }
}

export class AggregatedSignature extends jspb.Message {
  clearVerifierSignaturesList(): void;
  getVerifierSignaturesList(): Array<Uint8Array | string>;
  getVerifierSignaturesList_asU8(): Array<Uint8Array>;
  getVerifierSignaturesList_asB64(): Array<string>;
  setVerifierSignaturesList(value: Array<Uint8Array | string>): void;
  addVerifierSignatures(value: Uint8Array | string, index?: number): Uint8Array | string;

  clearSignerIdsList(): void;
  getSignerIdsList(): Array<Uint8Array | string>;
  getSignerIdsList_asU8(): Array<Uint8Array>;
  getSignerIdsList_asB64(): Array<string>;
  setSignerIdsList(value: Array<Uint8Array | string>): void;
  addSignerIds(value: Uint8Array | string, index?: number): Uint8Array | string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AggregatedSignature.AsObject;
  static toObject(includeInstance: boolean, msg: AggregatedSignature): AggregatedSignature.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AggregatedSignature, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AggregatedSignature;
  static deserializeBinaryFromReader(message: AggregatedSignature, reader: jspb.BinaryReader): AggregatedSignature;
}

export namespace AggregatedSignature {
  export type AsObject = {
    verifierSignaturesList: Array<Uint8Array | string>,
    signerIdsList: Array<Uint8Array | string>,
  }
}

