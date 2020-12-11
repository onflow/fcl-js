// package: flow.entities
// file: flow/entities/account.proto

import * as jspb from "google-protobuf";

export class Account extends jspb.Message {
  getAddress(): Uint8Array | string;
  getAddress_asU8(): Uint8Array;
  getAddress_asB64(): string;
  setAddress(value: Uint8Array | string): void;

  getBalance(): number;
  setBalance(value: number): void;

  getCode(): Uint8Array | string;
  getCode_asU8(): Uint8Array;
  getCode_asB64(): string;
  setCode(value: Uint8Array | string): void;

  clearKeysList(): void;
  getKeysList(): Array<AccountKey>;
  setKeysList(value: Array<AccountKey>): void;
  addKeys(value?: AccountKey, index?: number): AccountKey;

  getContractsMap(): jspb.Map<string, Uint8Array | string>;
  clearContractsMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Account.AsObject;
  static toObject(includeInstance: boolean, msg: Account): Account.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Account, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Account;
  static deserializeBinaryFromReader(message: Account, reader: jspb.BinaryReader): Account;
}

export namespace Account {
  export type AsObject = {
    address: Uint8Array | string,
    balance: number,
    code: Uint8Array | string,
    keysList: Array<AccountKey.AsObject>,
    contractsMap: Array<[string, Uint8Array | string]>,
  }
}

export class AccountKey extends jspb.Message {
  getIndex(): number;
  setIndex(value: number): void;

  getPublicKey(): Uint8Array | string;
  getPublicKey_asU8(): Uint8Array;
  getPublicKey_asB64(): string;
  setPublicKey(value: Uint8Array | string): void;

  getSignAlgo(): number;
  setSignAlgo(value: number): void;

  getHashAlgo(): number;
  setHashAlgo(value: number): void;

  getWeight(): number;
  setWeight(value: number): void;

  getSequenceNumber(): number;
  setSequenceNumber(value: number): void;

  getRevoked(): boolean;
  setRevoked(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountKey.AsObject;
  static toObject(includeInstance: boolean, msg: AccountKey): AccountKey.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AccountKey, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountKey;
  static deserializeBinaryFromReader(message: AccountKey, reader: jspb.BinaryReader): AccountKey;
}

export namespace AccountKey {
  export type AsObject = {
    index: number,
    publicKey: Uint8Array | string,
    signAlgo: number,
    hashAlgo: number,
    weight: number,
    sequenceNumber: number,
    revoked: boolean,
  }
}

