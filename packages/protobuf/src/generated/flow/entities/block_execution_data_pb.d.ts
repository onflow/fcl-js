// package: flow.entities
// file: flow/entities/block_execution_data.proto

import * as jspb from "google-protobuf";
import * as flow_entities_event_pb from "../../flow/entities/event_pb";
import * as flow_entities_transaction_pb from "../../flow/entities/transaction_pb";

export class BlockExecutionData extends jspb.Message {
  getBlockId(): Uint8Array | string;
  getBlockId_asU8(): Uint8Array;
  getBlockId_asB64(): string;
  setBlockId(value: Uint8Array | string): void;

  clearChunkExecutionDataList(): void;
  getChunkExecutionDataList(): Array<ChunkExecutionData>;
  setChunkExecutionDataList(value: Array<ChunkExecutionData>): void;
  addChunkExecutionData(value?: ChunkExecutionData, index?: number): ChunkExecutionData;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockExecutionData.AsObject;
  static toObject(includeInstance: boolean, msg: BlockExecutionData): BlockExecutionData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockExecutionData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockExecutionData;
  static deserializeBinaryFromReader(message: BlockExecutionData, reader: jspb.BinaryReader): BlockExecutionData;
}

export namespace BlockExecutionData {
  export type AsObject = {
    blockId: Uint8Array | string,
    chunkExecutionDataList: Array<ChunkExecutionData.AsObject>,
  }
}

export class ChunkExecutionData extends jspb.Message {
  hasCollection(): boolean;
  clearCollection(): void;
  getCollection(): ExecutionDataCollection | undefined;
  setCollection(value?: ExecutionDataCollection): void;

  clearEventsList(): void;
  getEventsList(): Array<flow_entities_event_pb.Event>;
  setEventsList(value: Array<flow_entities_event_pb.Event>): void;
  addEvents(value?: flow_entities_event_pb.Event, index?: number): flow_entities_event_pb.Event;

  hasTrieupdate(): boolean;
  clearTrieupdate(): void;
  getTrieupdate(): TrieUpdate | undefined;
  setTrieupdate(value?: TrieUpdate): void;

  clearTransactionResultsList(): void;
  getTransactionResultsList(): Array<ExecutionDataTransactionResult>;
  setTransactionResultsList(value: Array<ExecutionDataTransactionResult>): void;
  addTransactionResults(value?: ExecutionDataTransactionResult, index?: number): ExecutionDataTransactionResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChunkExecutionData.AsObject;
  static toObject(includeInstance: boolean, msg: ChunkExecutionData): ChunkExecutionData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ChunkExecutionData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChunkExecutionData;
  static deserializeBinaryFromReader(message: ChunkExecutionData, reader: jspb.BinaryReader): ChunkExecutionData;
}

export namespace ChunkExecutionData {
  export type AsObject = {
    collection?: ExecutionDataCollection.AsObject,
    eventsList: Array<flow_entities_event_pb.Event.AsObject>,
    trieupdate?: TrieUpdate.AsObject,
    transactionResultsList: Array<ExecutionDataTransactionResult.AsObject>,
  }
}

export class ExecutionDataCollection extends jspb.Message {
  clearTransactionsList(): void;
  getTransactionsList(): Array<flow_entities_transaction_pb.Transaction>;
  setTransactionsList(value: Array<flow_entities_transaction_pb.Transaction>): void;
  addTransactions(value?: flow_entities_transaction_pb.Transaction, index?: number): flow_entities_transaction_pb.Transaction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExecutionDataCollection.AsObject;
  static toObject(includeInstance: boolean, msg: ExecutionDataCollection): ExecutionDataCollection.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExecutionDataCollection, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExecutionDataCollection;
  static deserializeBinaryFromReader(message: ExecutionDataCollection, reader: jspb.BinaryReader): ExecutionDataCollection;
}

export namespace ExecutionDataCollection {
  export type AsObject = {
    transactionsList: Array<flow_entities_transaction_pb.Transaction.AsObject>,
  }
}

export class TrieUpdate extends jspb.Message {
  getRootHash(): Uint8Array | string;
  getRootHash_asU8(): Uint8Array;
  getRootHash_asB64(): string;
  setRootHash(value: Uint8Array | string): void;

  clearPathsList(): void;
  getPathsList(): Array<Uint8Array | string>;
  getPathsList_asU8(): Array<Uint8Array>;
  getPathsList_asB64(): Array<string>;
  setPathsList(value: Array<Uint8Array | string>): void;
  addPaths(value: Uint8Array | string, index?: number): Uint8Array | string;

  clearPayloadsList(): void;
  getPayloadsList(): Array<Payload>;
  setPayloadsList(value: Array<Payload>): void;
  addPayloads(value?: Payload, index?: number): Payload;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrieUpdate.AsObject;
  static toObject(includeInstance: boolean, msg: TrieUpdate): TrieUpdate.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TrieUpdate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrieUpdate;
  static deserializeBinaryFromReader(message: TrieUpdate, reader: jspb.BinaryReader): TrieUpdate;
}

export namespace TrieUpdate {
  export type AsObject = {
    rootHash: Uint8Array | string,
    pathsList: Array<Uint8Array | string>,
    payloadsList: Array<Payload.AsObject>,
  }
}

export class Payload extends jspb.Message {
  clearKeypartList(): void;
  getKeypartList(): Array<KeyPart>;
  setKeypartList(value: Array<KeyPart>): void;
  addKeypart(value?: KeyPart, index?: number): KeyPart;

  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Payload.AsObject;
  static toObject(includeInstance: boolean, msg: Payload): Payload.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Payload, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Payload;
  static deserializeBinaryFromReader(message: Payload, reader: jspb.BinaryReader): Payload;
}

export namespace Payload {
  export type AsObject = {
    keypartList: Array<KeyPart.AsObject>,
    value: Uint8Array | string,
  }
}

export class KeyPart extends jspb.Message {
  getType(): number;
  setType(value: number): void;

  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KeyPart.AsObject;
  static toObject(includeInstance: boolean, msg: KeyPart): KeyPart.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: KeyPart, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KeyPart;
  static deserializeBinaryFromReader(message: KeyPart, reader: jspb.BinaryReader): KeyPart;
}

export namespace KeyPart {
  export type AsObject = {
    type: number,
    value: Uint8Array | string,
  }
}

export class ExecutionDataTransactionResult extends jspb.Message {
  getTransactionId(): Uint8Array | string;
  getTransactionId_asU8(): Uint8Array;
  getTransactionId_asB64(): string;
  setTransactionId(value: Uint8Array | string): void;

  getFailed(): boolean;
  setFailed(value: boolean): void;

  getComputationUsed(): number;
  setComputationUsed(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExecutionDataTransactionResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExecutionDataTransactionResult): ExecutionDataTransactionResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExecutionDataTransactionResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExecutionDataTransactionResult;
  static deserializeBinaryFromReader(message: ExecutionDataTransactionResult, reader: jspb.BinaryReader): ExecutionDataTransactionResult;
}

export namespace ExecutionDataTransactionResult {
  export type AsObject = {
    transactionId: Uint8Array | string,
    failed: boolean,
    computationUsed: number,
  }
}

