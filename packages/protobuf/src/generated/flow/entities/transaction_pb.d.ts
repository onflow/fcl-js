// package: flow.entities
// file: flow/entities/transaction.proto

import * as jspb from "google-protobuf";

export class Transaction extends jspb.Message {
  getScript(): Uint8Array | string;
  getScript_asU8(): Uint8Array;
  getScript_asB64(): string;
  setScript(value: Uint8Array | string): void;

  clearArgumentsList(): void;
  getArgumentsList(): Array<Uint8Array | string>;
  getArgumentsList_asU8(): Array<Uint8Array>;
  getArgumentsList_asB64(): Array<string>;
  setArgumentsList(value: Array<Uint8Array | string>): void;
  addArguments(value: Uint8Array | string, index?: number): Uint8Array | string;

  getReferenceBlockId(): Uint8Array | string;
  getReferenceBlockId_asU8(): Uint8Array;
  getReferenceBlockId_asB64(): string;
  setReferenceBlockId(value: Uint8Array | string): void;

  getGasLimit(): number;
  setGasLimit(value: number): void;

  hasProposalKey(): boolean;
  clearProposalKey(): void;
  getProposalKey(): Transaction.ProposalKey | undefined;
  setProposalKey(value?: Transaction.ProposalKey): void;

  getPayer(): Uint8Array | string;
  getPayer_asU8(): Uint8Array;
  getPayer_asB64(): string;
  setPayer(value: Uint8Array | string): void;

  clearAuthorizersList(): void;
  getAuthorizersList(): Array<Uint8Array | string>;
  getAuthorizersList_asU8(): Array<Uint8Array>;
  getAuthorizersList_asB64(): Array<string>;
  setAuthorizersList(value: Array<Uint8Array | string>): void;
  addAuthorizers(value: Uint8Array | string, index?: number): Uint8Array | string;

  clearPayloadSignaturesList(): void;
  getPayloadSignaturesList(): Array<Transaction.Signature>;
  setPayloadSignaturesList(value: Array<Transaction.Signature>): void;
  addPayloadSignatures(value?: Transaction.Signature, index?: number): Transaction.Signature;

  clearEnvelopeSignaturesList(): void;
  getEnvelopeSignaturesList(): Array<Transaction.Signature>;
  setEnvelopeSignaturesList(value: Array<Transaction.Signature>): void;
  addEnvelopeSignatures(value?: Transaction.Signature, index?: number): Transaction.Signature;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Transaction.AsObject;
  static toObject(includeInstance: boolean, msg: Transaction): Transaction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Transaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Transaction;
  static deserializeBinaryFromReader(message: Transaction, reader: jspb.BinaryReader): Transaction;
}

export namespace Transaction {
  export type AsObject = {
    script: Uint8Array | string,
    argumentsList: Array<Uint8Array | string>,
    referenceBlockId: Uint8Array | string,
    gasLimit: number,
    proposalKey?: Transaction.ProposalKey.AsObject,
    payer: Uint8Array | string,
    authorizersList: Array<Uint8Array | string>,
    payloadSignaturesList: Array<Transaction.Signature.AsObject>,
    envelopeSignaturesList: Array<Transaction.Signature.AsObject>,
  }

  export class ProposalKey extends jspb.Message {
    getAddress(): Uint8Array | string;
    getAddress_asU8(): Uint8Array;
    getAddress_asB64(): string;
    setAddress(value: Uint8Array | string): void;

    getKeyId(): number;
    setKeyId(value: number): void;

    getSequenceNumber(): number;
    setSequenceNumber(value: number): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ProposalKey.AsObject;
    static toObject(includeInstance: boolean, msg: ProposalKey): ProposalKey.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ProposalKey, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ProposalKey;
    static deserializeBinaryFromReader(message: ProposalKey, reader: jspb.BinaryReader): ProposalKey;
  }

  export namespace ProposalKey {
    export type AsObject = {
      address: Uint8Array | string,
      keyId: number,
      sequenceNumber: number,
    }
  }

  export class Signature extends jspb.Message {
    getAddress(): Uint8Array | string;
    getAddress_asU8(): Uint8Array;
    getAddress_asB64(): string;
    setAddress(value: Uint8Array | string): void;

    getKeyId(): number;
    setKeyId(value: number): void;

    getSignature(): Uint8Array | string;
    getSignature_asU8(): Uint8Array;
    getSignature_asB64(): string;
    setSignature(value: Uint8Array | string): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Signature.AsObject;
    static toObject(includeInstance: boolean, msg: Signature): Signature.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Signature, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Signature;
    static deserializeBinaryFromReader(message: Signature, reader: jspb.BinaryReader): Signature;
  }

  export namespace Signature {
    export type AsObject = {
      address: Uint8Array | string,
      keyId: number,
      signature: Uint8Array | string,
    }
  }
}

export interface TransactionStatusMap {
  UNKNOWN: 0;
  PENDING: 1;
  FINALIZED: 2;
  EXECUTED: 3;
  SEALED: 4;
  EXPIRED: 5;
}

export const TransactionStatus: TransactionStatusMap;

