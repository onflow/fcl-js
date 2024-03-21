// package: flow.entities
// file: flow/entities/execution_result.proto

import * as jspb from "google-protobuf";

export class ExecutionResult extends jspb.Message {
  getPreviousResultId(): Uint8Array | string;
  getPreviousResultId_asU8(): Uint8Array;
  getPreviousResultId_asB64(): string;
  setPreviousResultId(value: Uint8Array | string): void;

  getBlockId(): Uint8Array | string;
  getBlockId_asU8(): Uint8Array;
  getBlockId_asB64(): string;
  setBlockId(value: Uint8Array | string): void;

  clearChunksList(): void;
  getChunksList(): Array<Chunk>;
  setChunksList(value: Array<Chunk>): void;
  addChunks(value?: Chunk, index?: number): Chunk;

  clearServiceEventsList(): void;
  getServiceEventsList(): Array<ServiceEvent>;
  setServiceEventsList(value: Array<ServiceEvent>): void;
  addServiceEvents(value?: ServiceEvent, index?: number): ServiceEvent;

  getExecutionDataId(): Uint8Array | string;
  getExecutionDataId_asU8(): Uint8Array;
  getExecutionDataId_asB64(): string;
  setExecutionDataId(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExecutionResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExecutionResult): ExecutionResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExecutionResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExecutionResult;
  static deserializeBinaryFromReader(message: ExecutionResult, reader: jspb.BinaryReader): ExecutionResult;
}

export namespace ExecutionResult {
  export type AsObject = {
    previousResultId: Uint8Array | string,
    blockId: Uint8Array | string,
    chunksList: Array<Chunk.AsObject>,
    serviceEventsList: Array<ServiceEvent.AsObject>,
    executionDataId: Uint8Array | string,
  }
}

export class Chunk extends jspb.Message {
  getCollectionindex(): number;
  setCollectionindex(value: number): void;

  getStartState(): Uint8Array | string;
  getStartState_asU8(): Uint8Array;
  getStartState_asB64(): string;
  setStartState(value: Uint8Array | string): void;

  getEventCollection(): Uint8Array | string;
  getEventCollection_asU8(): Uint8Array;
  getEventCollection_asB64(): string;
  setEventCollection(value: Uint8Array | string): void;

  getBlockId(): Uint8Array | string;
  getBlockId_asU8(): Uint8Array;
  getBlockId_asB64(): string;
  setBlockId(value: Uint8Array | string): void;

  getTotalComputationUsed(): number;
  setTotalComputationUsed(value: number): void;

  getNumberOfTransactions(): number;
  setNumberOfTransactions(value: number): void;

  getIndex(): number;
  setIndex(value: number): void;

  getEndState(): Uint8Array | string;
  getEndState_asU8(): Uint8Array;
  getEndState_asB64(): string;
  setEndState(value: Uint8Array | string): void;

  getExecutionDataId(): Uint8Array | string;
  getExecutionDataId_asU8(): Uint8Array;
  getExecutionDataId_asB64(): string;
  setExecutionDataId(value: Uint8Array | string): void;

  getStateDeltaCommitment(): Uint8Array | string;
  getStateDeltaCommitment_asU8(): Uint8Array;
  getStateDeltaCommitment_asB64(): string;
  setStateDeltaCommitment(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Chunk.AsObject;
  static toObject(includeInstance: boolean, msg: Chunk): Chunk.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Chunk, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Chunk;
  static deserializeBinaryFromReader(message: Chunk, reader: jspb.BinaryReader): Chunk;
}

export namespace Chunk {
  export type AsObject = {
    collectionindex: number,
    startState: Uint8Array | string,
    eventCollection: Uint8Array | string,
    blockId: Uint8Array | string,
    totalComputationUsed: number,
    numberOfTransactions: number,
    index: number,
    endState: Uint8Array | string,
    executionDataId: Uint8Array | string,
    stateDeltaCommitment: Uint8Array | string,
  }
}

export class ServiceEvent extends jspb.Message {
  getType(): string;
  setType(value: string): void;

  getPayload(): Uint8Array | string;
  getPayload_asU8(): Uint8Array;
  getPayload_asB64(): string;
  setPayload(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceEvent.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceEvent): ServiceEvent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServiceEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceEvent;
  static deserializeBinaryFromReader(message: ServiceEvent, reader: jspb.BinaryReader): ServiceEvent;
}

export namespace ServiceEvent {
  export type AsObject = {
    type: string,
    payload: Uint8Array | string,
  }
}

export class ExecutionReceiptMeta extends jspb.Message {
  getExecutorId(): Uint8Array | string;
  getExecutorId_asU8(): Uint8Array;
  getExecutorId_asB64(): string;
  setExecutorId(value: Uint8Array | string): void;

  getResultId(): Uint8Array | string;
  getResultId_asU8(): Uint8Array;
  getResultId_asB64(): string;
  setResultId(value: Uint8Array | string): void;

  clearSpocksList(): void;
  getSpocksList(): Array<Uint8Array | string>;
  getSpocksList_asU8(): Array<Uint8Array>;
  getSpocksList_asB64(): Array<string>;
  setSpocksList(value: Array<Uint8Array | string>): void;
  addSpocks(value: Uint8Array | string, index?: number): Uint8Array | string;

  getExecutorSignature(): Uint8Array | string;
  getExecutorSignature_asU8(): Uint8Array;
  getExecutorSignature_asB64(): string;
  setExecutorSignature(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExecutionReceiptMeta.AsObject;
  static toObject(includeInstance: boolean, msg: ExecutionReceiptMeta): ExecutionReceiptMeta.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExecutionReceiptMeta, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExecutionReceiptMeta;
  static deserializeBinaryFromReader(message: ExecutionReceiptMeta, reader: jspb.BinaryReader): ExecutionReceiptMeta;
}

export namespace ExecutionReceiptMeta {
  export type AsObject = {
    executorId: Uint8Array | string,
    resultId: Uint8Array | string,
    spocksList: Array<Uint8Array | string>,
    executorSignature: Uint8Array | string,
  }
}

