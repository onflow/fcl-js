// package: flow.access
// file: flow/access/access.proto

import * as jspb from "google-protobuf";
import * as flow_entities_account_pb from "../../flow/entities/account_pb";
import * as flow_entities_block_header_pb from "../../flow/entities/block_header_pb";
import * as flow_entities_block_pb from "../../flow/entities/block_pb";
import * as flow_entities_collection_pb from "../../flow/entities/collection_pb";
import * as flow_entities_event_pb from "../../flow/entities/event_pb";
import * as flow_entities_execution_result_pb from "../../flow/entities/execution_result_pb";
import * as flow_entities_metadata_pb from "../../flow/entities/metadata_pb";
import * as flow_entities_node_version_info_pb from "../../flow/entities/node_version_info_pb";
import * as flow_entities_transaction_pb from "../../flow/entities/transaction_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class PingRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PingRequest): PingRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PingRequest;
  static deserializeBinaryFromReader(message: PingRequest, reader: jspb.BinaryReader): PingRequest;
}

export namespace PingRequest {
  export type AsObject = {
  }
}

export class PingResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PingResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PingResponse): PingResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PingResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PingResponse;
  static deserializeBinaryFromReader(message: PingResponse, reader: jspb.BinaryReader): PingResponse;
}

export namespace PingResponse {
  export type AsObject = {
  }
}

export class GetNodeVersionInfoRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetNodeVersionInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetNodeVersionInfoRequest): GetNodeVersionInfoRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetNodeVersionInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetNodeVersionInfoRequest;
  static deserializeBinaryFromReader(message: GetNodeVersionInfoRequest, reader: jspb.BinaryReader): GetNodeVersionInfoRequest;
}

export namespace GetNodeVersionInfoRequest {
  export type AsObject = {
  }
}

export class GetNodeVersionInfoResponse extends jspb.Message {
  hasInfo(): boolean;
  clearInfo(): void;
  getInfo(): flow_entities_node_version_info_pb.NodeVersionInfo | undefined;
  setInfo(value?: flow_entities_node_version_info_pb.NodeVersionInfo): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetNodeVersionInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetNodeVersionInfoResponse): GetNodeVersionInfoResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetNodeVersionInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetNodeVersionInfoResponse;
  static deserializeBinaryFromReader(message: GetNodeVersionInfoResponse, reader: jspb.BinaryReader): GetNodeVersionInfoResponse;
}

export namespace GetNodeVersionInfoResponse {
  export type AsObject = {
    info?: flow_entities_node_version_info_pb.NodeVersionInfo.AsObject,
  }
}

export class GetLatestBlockHeaderRequest extends jspb.Message {
  getIsSealed(): boolean;
  setIsSealed(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetLatestBlockHeaderRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetLatestBlockHeaderRequest): GetLatestBlockHeaderRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetLatestBlockHeaderRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetLatestBlockHeaderRequest;
  static deserializeBinaryFromReader(message: GetLatestBlockHeaderRequest, reader: jspb.BinaryReader): GetLatestBlockHeaderRequest;
}

export namespace GetLatestBlockHeaderRequest {
  export type AsObject = {
    isSealed: boolean,
  }
}

export class GetBlockHeaderByIDRequest extends jspb.Message {
  getId(): Uint8Array | string;
  getId_asU8(): Uint8Array;
  getId_asB64(): string;
  setId(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBlockHeaderByIDRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetBlockHeaderByIDRequest): GetBlockHeaderByIDRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBlockHeaderByIDRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBlockHeaderByIDRequest;
  static deserializeBinaryFromReader(message: GetBlockHeaderByIDRequest, reader: jspb.BinaryReader): GetBlockHeaderByIDRequest;
}

export namespace GetBlockHeaderByIDRequest {
  export type AsObject = {
    id: Uint8Array | string,
  }
}

export class GetBlockHeaderByHeightRequest extends jspb.Message {
  getHeight(): number;
  setHeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBlockHeaderByHeightRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetBlockHeaderByHeightRequest): GetBlockHeaderByHeightRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBlockHeaderByHeightRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBlockHeaderByHeightRequest;
  static deserializeBinaryFromReader(message: GetBlockHeaderByHeightRequest, reader: jspb.BinaryReader): GetBlockHeaderByHeightRequest;
}

export namespace GetBlockHeaderByHeightRequest {
  export type AsObject = {
    height: number,
  }
}

export class BlockHeaderResponse extends jspb.Message {
  hasBlock(): boolean;
  clearBlock(): void;
  getBlock(): flow_entities_block_header_pb.BlockHeader | undefined;
  setBlock(value?: flow_entities_block_header_pb.BlockHeader): void;

  getBlockStatus(): flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap];
  setBlockStatus(value: flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap]): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): flow_entities_metadata_pb.Metadata | undefined;
  setMetadata(value?: flow_entities_metadata_pb.Metadata): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockHeaderResponse.AsObject;
  static toObject(includeInstance: boolean, msg: BlockHeaderResponse): BlockHeaderResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockHeaderResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockHeaderResponse;
  static deserializeBinaryFromReader(message: BlockHeaderResponse, reader: jspb.BinaryReader): BlockHeaderResponse;
}

export namespace BlockHeaderResponse {
  export type AsObject = {
    block?: flow_entities_block_header_pb.BlockHeader.AsObject,
    blockStatus: flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap],
    metadata?: flow_entities_metadata_pb.Metadata.AsObject,
  }
}

export class GetLatestBlockRequest extends jspb.Message {
  getIsSealed(): boolean;
  setIsSealed(value: boolean): void;

  getFullBlockResponse(): boolean;
  setFullBlockResponse(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetLatestBlockRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetLatestBlockRequest): GetLatestBlockRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetLatestBlockRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetLatestBlockRequest;
  static deserializeBinaryFromReader(message: GetLatestBlockRequest, reader: jspb.BinaryReader): GetLatestBlockRequest;
}

export namespace GetLatestBlockRequest {
  export type AsObject = {
    isSealed: boolean,
    fullBlockResponse: boolean,
  }
}

export class GetBlockByIDRequest extends jspb.Message {
  getId(): Uint8Array | string;
  getId_asU8(): Uint8Array;
  getId_asB64(): string;
  setId(value: Uint8Array | string): void;

  getFullBlockResponse(): boolean;
  setFullBlockResponse(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBlockByIDRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetBlockByIDRequest): GetBlockByIDRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBlockByIDRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBlockByIDRequest;
  static deserializeBinaryFromReader(message: GetBlockByIDRequest, reader: jspb.BinaryReader): GetBlockByIDRequest;
}

export namespace GetBlockByIDRequest {
  export type AsObject = {
    id: Uint8Array | string,
    fullBlockResponse: boolean,
  }
}

export class GetBlockByHeightRequest extends jspb.Message {
  getHeight(): number;
  setHeight(value: number): void;

  getFullBlockResponse(): boolean;
  setFullBlockResponse(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBlockByHeightRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetBlockByHeightRequest): GetBlockByHeightRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBlockByHeightRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBlockByHeightRequest;
  static deserializeBinaryFromReader(message: GetBlockByHeightRequest, reader: jspb.BinaryReader): GetBlockByHeightRequest;
}

export namespace GetBlockByHeightRequest {
  export type AsObject = {
    height: number,
    fullBlockResponse: boolean,
  }
}

export class BlockResponse extends jspb.Message {
  hasBlock(): boolean;
  clearBlock(): void;
  getBlock(): flow_entities_block_pb.Block | undefined;
  setBlock(value?: flow_entities_block_pb.Block): void;

  getBlockStatus(): flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap];
  setBlockStatus(value: flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap]): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): flow_entities_metadata_pb.Metadata | undefined;
  setMetadata(value?: flow_entities_metadata_pb.Metadata): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockResponse.AsObject;
  static toObject(includeInstance: boolean, msg: BlockResponse): BlockResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockResponse;
  static deserializeBinaryFromReader(message: BlockResponse, reader: jspb.BinaryReader): BlockResponse;
}

export namespace BlockResponse {
  export type AsObject = {
    block?: flow_entities_block_pb.Block.AsObject,
    blockStatus: flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap],
    metadata?: flow_entities_metadata_pb.Metadata.AsObject,
  }
}

export class GetCollectionByIDRequest extends jspb.Message {
  getId(): Uint8Array | string;
  getId_asU8(): Uint8Array;
  getId_asB64(): string;
  setId(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCollectionByIDRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCollectionByIDRequest): GetCollectionByIDRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetCollectionByIDRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCollectionByIDRequest;
  static deserializeBinaryFromReader(message: GetCollectionByIDRequest, reader: jspb.BinaryReader): GetCollectionByIDRequest;
}

export namespace GetCollectionByIDRequest {
  export type AsObject = {
    id: Uint8Array | string,
  }
}

export class CollectionResponse extends jspb.Message {
  hasCollection(): boolean;
  clearCollection(): void;
  getCollection(): flow_entities_collection_pb.Collection | undefined;
  setCollection(value?: flow_entities_collection_pb.Collection): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): flow_entities_metadata_pb.Metadata | undefined;
  setMetadata(value?: flow_entities_metadata_pb.Metadata): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CollectionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CollectionResponse): CollectionResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CollectionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CollectionResponse;
  static deserializeBinaryFromReader(message: CollectionResponse, reader: jspb.BinaryReader): CollectionResponse;
}

export namespace CollectionResponse {
  export type AsObject = {
    collection?: flow_entities_collection_pb.Collection.AsObject,
    metadata?: flow_entities_metadata_pb.Metadata.AsObject,
  }
}

export class SendTransactionRequest extends jspb.Message {
  hasTransaction(): boolean;
  clearTransaction(): void;
  getTransaction(): flow_entities_transaction_pb.Transaction | undefined;
  setTransaction(value?: flow_entities_transaction_pb.Transaction): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendTransactionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SendTransactionRequest): SendTransactionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SendTransactionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendTransactionRequest;
  static deserializeBinaryFromReader(message: SendTransactionRequest, reader: jspb.BinaryReader): SendTransactionRequest;
}

export namespace SendTransactionRequest {
  export type AsObject = {
    transaction?: flow_entities_transaction_pb.Transaction.AsObject,
  }
}

export class SendTransactionResponse extends jspb.Message {
  getId(): Uint8Array | string;
  getId_asU8(): Uint8Array;
  getId_asB64(): string;
  setId(value: Uint8Array | string): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): flow_entities_metadata_pb.Metadata | undefined;
  setMetadata(value?: flow_entities_metadata_pb.Metadata): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendTransactionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SendTransactionResponse): SendTransactionResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SendTransactionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendTransactionResponse;
  static deserializeBinaryFromReader(message: SendTransactionResponse, reader: jspb.BinaryReader): SendTransactionResponse;
}

export namespace SendTransactionResponse {
  export type AsObject = {
    id: Uint8Array | string,
    metadata?: flow_entities_metadata_pb.Metadata.AsObject,
  }
}

export class GetTransactionRequest extends jspb.Message {
  getId(): Uint8Array | string;
  getId_asU8(): Uint8Array;
  getId_asB64(): string;
  setId(value: Uint8Array | string): void;

  getBlockId(): Uint8Array | string;
  getBlockId_asU8(): Uint8Array;
  getBlockId_asB64(): string;
  setBlockId(value: Uint8Array | string): void;

  getCollectionId(): Uint8Array | string;
  getCollectionId_asU8(): Uint8Array;
  getCollectionId_asB64(): string;
  setCollectionId(value: Uint8Array | string): void;

  getEventEncodingVersion(): flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap];
  setEventEncodingVersion(value: flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionRequest): GetTransactionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetTransactionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionRequest;
  static deserializeBinaryFromReader(message: GetTransactionRequest, reader: jspb.BinaryReader): GetTransactionRequest;
}

export namespace GetTransactionRequest {
  export type AsObject = {
    id: Uint8Array | string,
    blockId: Uint8Array | string,
    collectionId: Uint8Array | string,
    eventEncodingVersion: flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap],
  }
}

export class GetSystemTransactionRequest extends jspb.Message {
  getBlockId(): Uint8Array | string;
  getBlockId_asU8(): Uint8Array;
  getBlockId_asB64(): string;
  setBlockId(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSystemTransactionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetSystemTransactionRequest): GetSystemTransactionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetSystemTransactionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSystemTransactionRequest;
  static deserializeBinaryFromReader(message: GetSystemTransactionRequest, reader: jspb.BinaryReader): GetSystemTransactionRequest;
}

export namespace GetSystemTransactionRequest {
  export type AsObject = {
    blockId: Uint8Array | string,
  }
}

export class GetSystemTransactionResultRequest extends jspb.Message {
  getBlockId(): Uint8Array | string;
  getBlockId_asU8(): Uint8Array;
  getBlockId_asB64(): string;
  setBlockId(value: Uint8Array | string): void;

  getEventEncodingVersion(): flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap];
  setEventEncodingVersion(value: flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSystemTransactionResultRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetSystemTransactionResultRequest): GetSystemTransactionResultRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetSystemTransactionResultRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSystemTransactionResultRequest;
  static deserializeBinaryFromReader(message: GetSystemTransactionResultRequest, reader: jspb.BinaryReader): GetSystemTransactionResultRequest;
}

export namespace GetSystemTransactionResultRequest {
  export type AsObject = {
    blockId: Uint8Array | string,
    eventEncodingVersion: flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap],
  }
}

export class GetTransactionByIndexRequest extends jspb.Message {
  getBlockId(): Uint8Array | string;
  getBlockId_asU8(): Uint8Array;
  getBlockId_asB64(): string;
  setBlockId(value: Uint8Array | string): void;

  getIndex(): number;
  setIndex(value: number): void;

  getEventEncodingVersion(): flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap];
  setEventEncodingVersion(value: flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionByIndexRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionByIndexRequest): GetTransactionByIndexRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetTransactionByIndexRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionByIndexRequest;
  static deserializeBinaryFromReader(message: GetTransactionByIndexRequest, reader: jspb.BinaryReader): GetTransactionByIndexRequest;
}

export namespace GetTransactionByIndexRequest {
  export type AsObject = {
    blockId: Uint8Array | string,
    index: number,
    eventEncodingVersion: flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap],
  }
}

export class GetTransactionsByBlockIDRequest extends jspb.Message {
  getBlockId(): Uint8Array | string;
  getBlockId_asU8(): Uint8Array;
  getBlockId_asB64(): string;
  setBlockId(value: Uint8Array | string): void;

  getEventEncodingVersion(): flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap];
  setEventEncodingVersion(value: flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTransactionsByBlockIDRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTransactionsByBlockIDRequest): GetTransactionsByBlockIDRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetTransactionsByBlockIDRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTransactionsByBlockIDRequest;
  static deserializeBinaryFromReader(message: GetTransactionsByBlockIDRequest, reader: jspb.BinaryReader): GetTransactionsByBlockIDRequest;
}

export namespace GetTransactionsByBlockIDRequest {
  export type AsObject = {
    blockId: Uint8Array | string,
    eventEncodingVersion: flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap],
  }
}

export class TransactionResultsResponse extends jspb.Message {
  clearTransactionResultsList(): void;
  getTransactionResultsList(): Array<TransactionResultResponse>;
  setTransactionResultsList(value: Array<TransactionResultResponse>): void;
  addTransactionResults(value?: TransactionResultResponse, index?: number): TransactionResultResponse;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): flow_entities_metadata_pb.Metadata | undefined;
  setMetadata(value?: flow_entities_metadata_pb.Metadata): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionResultsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TransactionResultsResponse): TransactionResultsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransactionResultsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransactionResultsResponse;
  static deserializeBinaryFromReader(message: TransactionResultsResponse, reader: jspb.BinaryReader): TransactionResultsResponse;
}

export namespace TransactionResultsResponse {
  export type AsObject = {
    transactionResultsList: Array<TransactionResultResponse.AsObject>,
    metadata?: flow_entities_metadata_pb.Metadata.AsObject,
  }
}

export class TransactionsResponse extends jspb.Message {
  clearTransactionsList(): void;
  getTransactionsList(): Array<flow_entities_transaction_pb.Transaction>;
  setTransactionsList(value: Array<flow_entities_transaction_pb.Transaction>): void;
  addTransactions(value?: flow_entities_transaction_pb.Transaction, index?: number): flow_entities_transaction_pb.Transaction;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): flow_entities_metadata_pb.Metadata | undefined;
  setMetadata(value?: flow_entities_metadata_pb.Metadata): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TransactionsResponse): TransactionsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransactionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransactionsResponse;
  static deserializeBinaryFromReader(message: TransactionsResponse, reader: jspb.BinaryReader): TransactionsResponse;
}

export namespace TransactionsResponse {
  export type AsObject = {
    transactionsList: Array<flow_entities_transaction_pb.Transaction.AsObject>,
    metadata?: flow_entities_metadata_pb.Metadata.AsObject,
  }
}

export class TransactionResponse extends jspb.Message {
  hasTransaction(): boolean;
  clearTransaction(): void;
  getTransaction(): flow_entities_transaction_pb.Transaction | undefined;
  setTransaction(value?: flow_entities_transaction_pb.Transaction): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): flow_entities_metadata_pb.Metadata | undefined;
  setMetadata(value?: flow_entities_metadata_pb.Metadata): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TransactionResponse): TransactionResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransactionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransactionResponse;
  static deserializeBinaryFromReader(message: TransactionResponse, reader: jspb.BinaryReader): TransactionResponse;
}

export namespace TransactionResponse {
  export type AsObject = {
    transaction?: flow_entities_transaction_pb.Transaction.AsObject,
    metadata?: flow_entities_metadata_pb.Metadata.AsObject,
  }
}

export class TransactionResultResponse extends jspb.Message {
  getStatus(): flow_entities_transaction_pb.TransactionStatusMap[keyof flow_entities_transaction_pb.TransactionStatusMap];
  setStatus(value: flow_entities_transaction_pb.TransactionStatusMap[keyof flow_entities_transaction_pb.TransactionStatusMap]): void;

  getStatusCode(): number;
  setStatusCode(value: number): void;

  getErrorMessage(): string;
  setErrorMessage(value: string): void;

  clearEventsList(): void;
  getEventsList(): Array<flow_entities_event_pb.Event>;
  setEventsList(value: Array<flow_entities_event_pb.Event>): void;
  addEvents(value?: flow_entities_event_pb.Event, index?: number): flow_entities_event_pb.Event;

  getBlockId(): Uint8Array | string;
  getBlockId_asU8(): Uint8Array;
  getBlockId_asB64(): string;
  setBlockId(value: Uint8Array | string): void;

  getTransactionId(): Uint8Array | string;
  getTransactionId_asU8(): Uint8Array;
  getTransactionId_asB64(): string;
  setTransactionId(value: Uint8Array | string): void;

  getCollectionId(): Uint8Array | string;
  getCollectionId_asU8(): Uint8Array;
  getCollectionId_asB64(): string;
  setCollectionId(value: Uint8Array | string): void;

  getBlockHeight(): number;
  setBlockHeight(value: number): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): flow_entities_metadata_pb.Metadata | undefined;
  setMetadata(value?: flow_entities_metadata_pb.Metadata): void;

  getComputationUsage(): number;
  setComputationUsage(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionResultResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TransactionResultResponse): TransactionResultResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransactionResultResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransactionResultResponse;
  static deserializeBinaryFromReader(message: TransactionResultResponse, reader: jspb.BinaryReader): TransactionResultResponse;
}

export namespace TransactionResultResponse {
  export type AsObject = {
    status: flow_entities_transaction_pb.TransactionStatusMap[keyof flow_entities_transaction_pb.TransactionStatusMap],
    statusCode: number,
    errorMessage: string,
    eventsList: Array<flow_entities_event_pb.Event.AsObject>,
    blockId: Uint8Array | string,
    transactionId: Uint8Array | string,
    collectionId: Uint8Array | string,
    blockHeight: number,
    metadata?: flow_entities_metadata_pb.Metadata.AsObject,
    computationUsage: number,
  }
}

export class GetAccountRequest extends jspb.Message {
  getAddress(): Uint8Array | string;
  getAddress_asU8(): Uint8Array;
  getAddress_asB64(): string;
  setAddress(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountRequest): GetAccountRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAccountRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountRequest;
  static deserializeBinaryFromReader(message: GetAccountRequest, reader: jspb.BinaryReader): GetAccountRequest;
}

export namespace GetAccountRequest {
  export type AsObject = {
    address: Uint8Array | string,
  }
}

export class GetAccountResponse extends jspb.Message {
  hasAccount(): boolean;
  clearAccount(): void;
  getAccount(): flow_entities_account_pb.Account | undefined;
  setAccount(value?: flow_entities_account_pb.Account): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): flow_entities_metadata_pb.Metadata | undefined;
  setMetadata(value?: flow_entities_metadata_pb.Metadata): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountResponse): GetAccountResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAccountResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountResponse;
  static deserializeBinaryFromReader(message: GetAccountResponse, reader: jspb.BinaryReader): GetAccountResponse;
}

export namespace GetAccountResponse {
  export type AsObject = {
    account?: flow_entities_account_pb.Account.AsObject,
    metadata?: flow_entities_metadata_pb.Metadata.AsObject,
  }
}

export class GetAccountAtLatestBlockRequest extends jspb.Message {
  getAddress(): Uint8Array | string;
  getAddress_asU8(): Uint8Array;
  getAddress_asB64(): string;
  setAddress(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountAtLatestBlockRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountAtLatestBlockRequest): GetAccountAtLatestBlockRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAccountAtLatestBlockRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountAtLatestBlockRequest;
  static deserializeBinaryFromReader(message: GetAccountAtLatestBlockRequest, reader: jspb.BinaryReader): GetAccountAtLatestBlockRequest;
}

export namespace GetAccountAtLatestBlockRequest {
  export type AsObject = {
    address: Uint8Array | string,
  }
}

export class AccountResponse extends jspb.Message {
  hasAccount(): boolean;
  clearAccount(): void;
  getAccount(): flow_entities_account_pb.Account | undefined;
  setAccount(value?: flow_entities_account_pb.Account): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): flow_entities_metadata_pb.Metadata | undefined;
  setMetadata(value?: flow_entities_metadata_pb.Metadata): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccountResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AccountResponse): AccountResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AccountResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccountResponse;
  static deserializeBinaryFromReader(message: AccountResponse, reader: jspb.BinaryReader): AccountResponse;
}

export namespace AccountResponse {
  export type AsObject = {
    account?: flow_entities_account_pb.Account.AsObject,
    metadata?: flow_entities_metadata_pb.Metadata.AsObject,
  }
}

export class GetAccountAtBlockHeightRequest extends jspb.Message {
  getAddress(): Uint8Array | string;
  getAddress_asU8(): Uint8Array;
  getAddress_asB64(): string;
  setAddress(value: Uint8Array | string): void;

  getBlockHeight(): number;
  setBlockHeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetAccountAtBlockHeightRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetAccountAtBlockHeightRequest): GetAccountAtBlockHeightRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetAccountAtBlockHeightRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetAccountAtBlockHeightRequest;
  static deserializeBinaryFromReader(message: GetAccountAtBlockHeightRequest, reader: jspb.BinaryReader): GetAccountAtBlockHeightRequest;
}

export namespace GetAccountAtBlockHeightRequest {
  export type AsObject = {
    address: Uint8Array | string,
    blockHeight: number,
  }
}

export class ExecuteScriptAtLatestBlockRequest extends jspb.Message {
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

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExecuteScriptAtLatestBlockRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ExecuteScriptAtLatestBlockRequest): ExecuteScriptAtLatestBlockRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExecuteScriptAtLatestBlockRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExecuteScriptAtLatestBlockRequest;
  static deserializeBinaryFromReader(message: ExecuteScriptAtLatestBlockRequest, reader: jspb.BinaryReader): ExecuteScriptAtLatestBlockRequest;
}

export namespace ExecuteScriptAtLatestBlockRequest {
  export type AsObject = {
    script: Uint8Array | string,
    argumentsList: Array<Uint8Array | string>,
  }
}

export class ExecuteScriptAtBlockIDRequest extends jspb.Message {
  getBlockId(): Uint8Array | string;
  getBlockId_asU8(): Uint8Array;
  getBlockId_asB64(): string;
  setBlockId(value: Uint8Array | string): void;

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

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExecuteScriptAtBlockIDRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ExecuteScriptAtBlockIDRequest): ExecuteScriptAtBlockIDRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExecuteScriptAtBlockIDRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExecuteScriptAtBlockIDRequest;
  static deserializeBinaryFromReader(message: ExecuteScriptAtBlockIDRequest, reader: jspb.BinaryReader): ExecuteScriptAtBlockIDRequest;
}

export namespace ExecuteScriptAtBlockIDRequest {
  export type AsObject = {
    blockId: Uint8Array | string,
    script: Uint8Array | string,
    argumentsList: Array<Uint8Array | string>,
  }
}

export class ExecuteScriptAtBlockHeightRequest extends jspb.Message {
  getBlockHeight(): number;
  setBlockHeight(value: number): void;

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

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExecuteScriptAtBlockHeightRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ExecuteScriptAtBlockHeightRequest): ExecuteScriptAtBlockHeightRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExecuteScriptAtBlockHeightRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExecuteScriptAtBlockHeightRequest;
  static deserializeBinaryFromReader(message: ExecuteScriptAtBlockHeightRequest, reader: jspb.BinaryReader): ExecuteScriptAtBlockHeightRequest;
}

export namespace ExecuteScriptAtBlockHeightRequest {
  export type AsObject = {
    blockHeight: number,
    script: Uint8Array | string,
    argumentsList: Array<Uint8Array | string>,
  }
}

export class ExecuteScriptResponse extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): flow_entities_metadata_pb.Metadata | undefined;
  setMetadata(value?: flow_entities_metadata_pb.Metadata): void;

  getComputationUsage(): number;
  setComputationUsage(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExecuteScriptResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ExecuteScriptResponse): ExecuteScriptResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExecuteScriptResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExecuteScriptResponse;
  static deserializeBinaryFromReader(message: ExecuteScriptResponse, reader: jspb.BinaryReader): ExecuteScriptResponse;
}

export namespace ExecuteScriptResponse {
  export type AsObject = {
    value: Uint8Array | string,
    metadata?: flow_entities_metadata_pb.Metadata.AsObject,
    computationUsage: number,
  }
}

export class GetEventsForHeightRangeRequest extends jspb.Message {
  getType(): string;
  setType(value: string): void;

  getStartHeight(): number;
  setStartHeight(value: number): void;

  getEndHeight(): number;
  setEndHeight(value: number): void;

  getEventEncodingVersion(): flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap];
  setEventEncodingVersion(value: flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEventsForHeightRangeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetEventsForHeightRangeRequest): GetEventsForHeightRangeRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetEventsForHeightRangeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEventsForHeightRangeRequest;
  static deserializeBinaryFromReader(message: GetEventsForHeightRangeRequest, reader: jspb.BinaryReader): GetEventsForHeightRangeRequest;
}

export namespace GetEventsForHeightRangeRequest {
  export type AsObject = {
    type: string,
    startHeight: number,
    endHeight: number,
    eventEncodingVersion: flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap],
  }
}

export class GetEventsForBlockIDsRequest extends jspb.Message {
  getType(): string;
  setType(value: string): void;

  clearBlockIdsList(): void;
  getBlockIdsList(): Array<Uint8Array | string>;
  getBlockIdsList_asU8(): Array<Uint8Array>;
  getBlockIdsList_asB64(): Array<string>;
  setBlockIdsList(value: Array<Uint8Array | string>): void;
  addBlockIds(value: Uint8Array | string, index?: number): Uint8Array | string;

  getEventEncodingVersion(): flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap];
  setEventEncodingVersion(value: flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEventsForBlockIDsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetEventsForBlockIDsRequest): GetEventsForBlockIDsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetEventsForBlockIDsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEventsForBlockIDsRequest;
  static deserializeBinaryFromReader(message: GetEventsForBlockIDsRequest, reader: jspb.BinaryReader): GetEventsForBlockIDsRequest;
}

export namespace GetEventsForBlockIDsRequest {
  export type AsObject = {
    type: string,
    blockIdsList: Array<Uint8Array | string>,
    eventEncodingVersion: flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap],
  }
}

export class EventsResponse extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<EventsResponse.Result>;
  setResultsList(value: Array<EventsResponse.Result>): void;
  addResults(value?: EventsResponse.Result, index?: number): EventsResponse.Result;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): flow_entities_metadata_pb.Metadata | undefined;
  setMetadata(value?: flow_entities_metadata_pb.Metadata): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EventsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: EventsResponse): EventsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EventsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EventsResponse;
  static deserializeBinaryFromReader(message: EventsResponse, reader: jspb.BinaryReader): EventsResponse;
}

export namespace EventsResponse {
  export type AsObject = {
    resultsList: Array<EventsResponse.Result.AsObject>,
    metadata?: flow_entities_metadata_pb.Metadata.AsObject,
  }

  export class Result extends jspb.Message {
    getBlockId(): Uint8Array | string;
    getBlockId_asU8(): Uint8Array;
    getBlockId_asB64(): string;
    setBlockId(value: Uint8Array | string): void;

    getBlockHeight(): number;
    setBlockHeight(value: number): void;

    clearEventsList(): void;
    getEventsList(): Array<flow_entities_event_pb.Event>;
    setEventsList(value: Array<flow_entities_event_pb.Event>): void;
    addEvents(value?: flow_entities_event_pb.Event, index?: number): flow_entities_event_pb.Event;

    hasBlockTimestamp(): boolean;
    clearBlockTimestamp(): void;
    getBlockTimestamp(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setBlockTimestamp(value?: google_protobuf_timestamp_pb.Timestamp): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Result.AsObject;
    static toObject(includeInstance: boolean, msg: Result): Result.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Result, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Result;
    static deserializeBinaryFromReader(message: Result, reader: jspb.BinaryReader): Result;
  }

  export namespace Result {
    export type AsObject = {
      blockId: Uint8Array | string,
      blockHeight: number,
      eventsList: Array<flow_entities_event_pb.Event.AsObject>,
      blockTimestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    }
  }
}

export class GetNetworkParametersRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetNetworkParametersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetNetworkParametersRequest): GetNetworkParametersRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetNetworkParametersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetNetworkParametersRequest;
  static deserializeBinaryFromReader(message: GetNetworkParametersRequest, reader: jspb.BinaryReader): GetNetworkParametersRequest;
}

export namespace GetNetworkParametersRequest {
  export type AsObject = {
  }
}

export class GetNetworkParametersResponse extends jspb.Message {
  getChainId(): string;
  setChainId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetNetworkParametersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetNetworkParametersResponse): GetNetworkParametersResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetNetworkParametersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetNetworkParametersResponse;
  static deserializeBinaryFromReader(message: GetNetworkParametersResponse, reader: jspb.BinaryReader): GetNetworkParametersResponse;
}

export namespace GetNetworkParametersResponse {
  export type AsObject = {
    chainId: string,
  }
}

export class GetLatestProtocolStateSnapshotRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetLatestProtocolStateSnapshotRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetLatestProtocolStateSnapshotRequest): GetLatestProtocolStateSnapshotRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetLatestProtocolStateSnapshotRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetLatestProtocolStateSnapshotRequest;
  static deserializeBinaryFromReader(message: GetLatestProtocolStateSnapshotRequest, reader: jspb.BinaryReader): GetLatestProtocolStateSnapshotRequest;
}

export namespace GetLatestProtocolStateSnapshotRequest {
  export type AsObject = {
  }
}

export class GetProtocolStateSnapshotByBlockIDRequest extends jspb.Message {
  getBlockId(): Uint8Array | string;
  getBlockId_asU8(): Uint8Array;
  getBlockId_asB64(): string;
  setBlockId(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetProtocolStateSnapshotByBlockIDRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetProtocolStateSnapshotByBlockIDRequest): GetProtocolStateSnapshotByBlockIDRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetProtocolStateSnapshotByBlockIDRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetProtocolStateSnapshotByBlockIDRequest;
  static deserializeBinaryFromReader(message: GetProtocolStateSnapshotByBlockIDRequest, reader: jspb.BinaryReader): GetProtocolStateSnapshotByBlockIDRequest;
}

export namespace GetProtocolStateSnapshotByBlockIDRequest {
  export type AsObject = {
    blockId: Uint8Array | string,
  }
}

export class GetProtocolStateSnapshotByHeightRequest extends jspb.Message {
  getBlockHeight(): number;
  setBlockHeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetProtocolStateSnapshotByHeightRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetProtocolStateSnapshotByHeightRequest): GetProtocolStateSnapshotByHeightRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetProtocolStateSnapshotByHeightRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetProtocolStateSnapshotByHeightRequest;
  static deserializeBinaryFromReader(message: GetProtocolStateSnapshotByHeightRequest, reader: jspb.BinaryReader): GetProtocolStateSnapshotByHeightRequest;
}

export namespace GetProtocolStateSnapshotByHeightRequest {
  export type AsObject = {
    blockHeight: number,
  }
}

export class ProtocolStateSnapshotResponse extends jspb.Message {
  getSerializedsnapshot(): Uint8Array | string;
  getSerializedsnapshot_asU8(): Uint8Array;
  getSerializedsnapshot_asB64(): string;
  setSerializedsnapshot(value: Uint8Array | string): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): flow_entities_metadata_pb.Metadata | undefined;
  setMetadata(value?: flow_entities_metadata_pb.Metadata): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProtocolStateSnapshotResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ProtocolStateSnapshotResponse): ProtocolStateSnapshotResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ProtocolStateSnapshotResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProtocolStateSnapshotResponse;
  static deserializeBinaryFromReader(message: ProtocolStateSnapshotResponse, reader: jspb.BinaryReader): ProtocolStateSnapshotResponse;
}

export namespace ProtocolStateSnapshotResponse {
  export type AsObject = {
    serializedsnapshot: Uint8Array | string,
    metadata?: flow_entities_metadata_pb.Metadata.AsObject,
  }
}

export class GetExecutionResultForBlockIDRequest extends jspb.Message {
  getBlockId(): Uint8Array | string;
  getBlockId_asU8(): Uint8Array;
  getBlockId_asB64(): string;
  setBlockId(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetExecutionResultForBlockIDRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetExecutionResultForBlockIDRequest): GetExecutionResultForBlockIDRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetExecutionResultForBlockIDRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetExecutionResultForBlockIDRequest;
  static deserializeBinaryFromReader(message: GetExecutionResultForBlockIDRequest, reader: jspb.BinaryReader): GetExecutionResultForBlockIDRequest;
}

export namespace GetExecutionResultForBlockIDRequest {
  export type AsObject = {
    blockId: Uint8Array | string,
  }
}

export class ExecutionResultForBlockIDResponse extends jspb.Message {
  hasExecutionResult(): boolean;
  clearExecutionResult(): void;
  getExecutionResult(): flow_entities_execution_result_pb.ExecutionResult | undefined;
  setExecutionResult(value?: flow_entities_execution_result_pb.ExecutionResult): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): flow_entities_metadata_pb.Metadata | undefined;
  setMetadata(value?: flow_entities_metadata_pb.Metadata): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExecutionResultForBlockIDResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ExecutionResultForBlockIDResponse): ExecutionResultForBlockIDResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExecutionResultForBlockIDResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExecutionResultForBlockIDResponse;
  static deserializeBinaryFromReader(message: ExecutionResultForBlockIDResponse, reader: jspb.BinaryReader): ExecutionResultForBlockIDResponse;
}

export namespace ExecutionResultForBlockIDResponse {
  export type AsObject = {
    executionResult?: flow_entities_execution_result_pb.ExecutionResult.AsObject,
    metadata?: flow_entities_metadata_pb.Metadata.AsObject,
  }
}

export class GetExecutionResultByIDRequest extends jspb.Message {
  getId(): Uint8Array | string;
  getId_asU8(): Uint8Array;
  getId_asB64(): string;
  setId(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetExecutionResultByIDRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetExecutionResultByIDRequest): GetExecutionResultByIDRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetExecutionResultByIDRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetExecutionResultByIDRequest;
  static deserializeBinaryFromReader(message: GetExecutionResultByIDRequest, reader: jspb.BinaryReader): GetExecutionResultByIDRequest;
}

export namespace GetExecutionResultByIDRequest {
  export type AsObject = {
    id: Uint8Array | string,
  }
}

export class ExecutionResultByIDResponse extends jspb.Message {
  hasExecutionResult(): boolean;
  clearExecutionResult(): void;
  getExecutionResult(): flow_entities_execution_result_pb.ExecutionResult | undefined;
  setExecutionResult(value?: flow_entities_execution_result_pb.ExecutionResult): void;

  hasMetadata(): boolean;
  clearMetadata(): void;
  getMetadata(): flow_entities_metadata_pb.Metadata | undefined;
  setMetadata(value?: flow_entities_metadata_pb.Metadata): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExecutionResultByIDResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ExecutionResultByIDResponse): ExecutionResultByIDResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExecutionResultByIDResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExecutionResultByIDResponse;
  static deserializeBinaryFromReader(message: ExecutionResultByIDResponse, reader: jspb.BinaryReader): ExecutionResultByIDResponse;
}

export namespace ExecutionResultByIDResponse {
  export type AsObject = {
    executionResult?: flow_entities_execution_result_pb.ExecutionResult.AsObject,
    metadata?: flow_entities_metadata_pb.Metadata.AsObject,
  }
}

export class SubscribeBlocksFromStartBlockIDRequest extends jspb.Message {
  getStartBlockId(): Uint8Array | string;
  getStartBlockId_asU8(): Uint8Array;
  getStartBlockId_asB64(): string;
  setStartBlockId(value: Uint8Array | string): void;

  getBlockStatus(): flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap];
  setBlockStatus(value: flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap]): void;

  getFullBlockResponse(): boolean;
  setFullBlockResponse(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribeBlocksFromStartBlockIDRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeBlocksFromStartBlockIDRequest): SubscribeBlocksFromStartBlockIDRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubscribeBlocksFromStartBlockIDRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeBlocksFromStartBlockIDRequest;
  static deserializeBinaryFromReader(message: SubscribeBlocksFromStartBlockIDRequest, reader: jspb.BinaryReader): SubscribeBlocksFromStartBlockIDRequest;
}

export namespace SubscribeBlocksFromStartBlockIDRequest {
  export type AsObject = {
    startBlockId: Uint8Array | string,
    blockStatus: flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap],
    fullBlockResponse: boolean,
  }
}

export class SubscribeBlocksFromStartHeightRequest extends jspb.Message {
  getStartBlockHeight(): number;
  setStartBlockHeight(value: number): void;

  getBlockStatus(): flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap];
  setBlockStatus(value: flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap]): void;

  getFullBlockResponse(): boolean;
  setFullBlockResponse(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribeBlocksFromStartHeightRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeBlocksFromStartHeightRequest): SubscribeBlocksFromStartHeightRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubscribeBlocksFromStartHeightRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeBlocksFromStartHeightRequest;
  static deserializeBinaryFromReader(message: SubscribeBlocksFromStartHeightRequest, reader: jspb.BinaryReader): SubscribeBlocksFromStartHeightRequest;
}

export namespace SubscribeBlocksFromStartHeightRequest {
  export type AsObject = {
    startBlockHeight: number,
    blockStatus: flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap],
    fullBlockResponse: boolean,
  }
}

export class SubscribeBlocksFromLatestRequest extends jspb.Message {
  getBlockStatus(): flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap];
  setBlockStatus(value: flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap]): void;

  getFullBlockResponse(): boolean;
  setFullBlockResponse(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribeBlocksFromLatestRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeBlocksFromLatestRequest): SubscribeBlocksFromLatestRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubscribeBlocksFromLatestRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeBlocksFromLatestRequest;
  static deserializeBinaryFromReader(message: SubscribeBlocksFromLatestRequest, reader: jspb.BinaryReader): SubscribeBlocksFromLatestRequest;
}

export namespace SubscribeBlocksFromLatestRequest {
  export type AsObject = {
    blockStatus: flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap],
    fullBlockResponse: boolean,
  }
}

export class SubscribeBlocksResponse extends jspb.Message {
  hasBlock(): boolean;
  clearBlock(): void;
  getBlock(): flow_entities_block_pb.Block | undefined;
  setBlock(value?: flow_entities_block_pb.Block): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribeBlocksResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeBlocksResponse): SubscribeBlocksResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubscribeBlocksResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeBlocksResponse;
  static deserializeBinaryFromReader(message: SubscribeBlocksResponse, reader: jspb.BinaryReader): SubscribeBlocksResponse;
}

export namespace SubscribeBlocksResponse {
  export type AsObject = {
    block?: flow_entities_block_pb.Block.AsObject,
  }
}

export class SubscribeBlockHeadersFromStartBlockIDRequest extends jspb.Message {
  getStartBlockId(): Uint8Array | string;
  getStartBlockId_asU8(): Uint8Array;
  getStartBlockId_asB64(): string;
  setStartBlockId(value: Uint8Array | string): void;

  getBlockStatus(): flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap];
  setBlockStatus(value: flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribeBlockHeadersFromStartBlockIDRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeBlockHeadersFromStartBlockIDRequest): SubscribeBlockHeadersFromStartBlockIDRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubscribeBlockHeadersFromStartBlockIDRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeBlockHeadersFromStartBlockIDRequest;
  static deserializeBinaryFromReader(message: SubscribeBlockHeadersFromStartBlockIDRequest, reader: jspb.BinaryReader): SubscribeBlockHeadersFromStartBlockIDRequest;
}

export namespace SubscribeBlockHeadersFromStartBlockIDRequest {
  export type AsObject = {
    startBlockId: Uint8Array | string,
    blockStatus: flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap],
  }
}

export class SubscribeBlockHeadersFromStartHeightRequest extends jspb.Message {
  getStartBlockHeight(): number;
  setStartBlockHeight(value: number): void;

  getBlockStatus(): flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap];
  setBlockStatus(value: flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribeBlockHeadersFromStartHeightRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeBlockHeadersFromStartHeightRequest): SubscribeBlockHeadersFromStartHeightRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubscribeBlockHeadersFromStartHeightRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeBlockHeadersFromStartHeightRequest;
  static deserializeBinaryFromReader(message: SubscribeBlockHeadersFromStartHeightRequest, reader: jspb.BinaryReader): SubscribeBlockHeadersFromStartHeightRequest;
}

export namespace SubscribeBlockHeadersFromStartHeightRequest {
  export type AsObject = {
    startBlockHeight: number,
    blockStatus: flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap],
  }
}

export class SubscribeBlockHeadersFromLatestRequest extends jspb.Message {
  getBlockStatus(): flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap];
  setBlockStatus(value: flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribeBlockHeadersFromLatestRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeBlockHeadersFromLatestRequest): SubscribeBlockHeadersFromLatestRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubscribeBlockHeadersFromLatestRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeBlockHeadersFromLatestRequest;
  static deserializeBinaryFromReader(message: SubscribeBlockHeadersFromLatestRequest, reader: jspb.BinaryReader): SubscribeBlockHeadersFromLatestRequest;
}

export namespace SubscribeBlockHeadersFromLatestRequest {
  export type AsObject = {
    blockStatus: flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap],
  }
}

export class SubscribeBlockHeadersResponse extends jspb.Message {
  hasHeader(): boolean;
  clearHeader(): void;
  getHeader(): flow_entities_block_header_pb.BlockHeader | undefined;
  setHeader(value?: flow_entities_block_header_pb.BlockHeader): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribeBlockHeadersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeBlockHeadersResponse): SubscribeBlockHeadersResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubscribeBlockHeadersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeBlockHeadersResponse;
  static deserializeBinaryFromReader(message: SubscribeBlockHeadersResponse, reader: jspb.BinaryReader): SubscribeBlockHeadersResponse;
}

export namespace SubscribeBlockHeadersResponse {
  export type AsObject = {
    header?: flow_entities_block_header_pb.BlockHeader.AsObject,
  }
}

export class SubscribeBlockDigestsFromStartBlockIDRequest extends jspb.Message {
  getStartBlockId(): Uint8Array | string;
  getStartBlockId_asU8(): Uint8Array;
  getStartBlockId_asB64(): string;
  setStartBlockId(value: Uint8Array | string): void;

  getBlockStatus(): flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap];
  setBlockStatus(value: flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribeBlockDigestsFromStartBlockIDRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeBlockDigestsFromStartBlockIDRequest): SubscribeBlockDigestsFromStartBlockIDRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubscribeBlockDigestsFromStartBlockIDRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeBlockDigestsFromStartBlockIDRequest;
  static deserializeBinaryFromReader(message: SubscribeBlockDigestsFromStartBlockIDRequest, reader: jspb.BinaryReader): SubscribeBlockDigestsFromStartBlockIDRequest;
}

export namespace SubscribeBlockDigestsFromStartBlockIDRequest {
  export type AsObject = {
    startBlockId: Uint8Array | string,
    blockStatus: flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap],
  }
}

export class SubscribeBlockDigestsFromStartHeightRequest extends jspb.Message {
  getStartBlockHeight(): number;
  setStartBlockHeight(value: number): void;

  getBlockStatus(): flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap];
  setBlockStatus(value: flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribeBlockDigestsFromStartHeightRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeBlockDigestsFromStartHeightRequest): SubscribeBlockDigestsFromStartHeightRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubscribeBlockDigestsFromStartHeightRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeBlockDigestsFromStartHeightRequest;
  static deserializeBinaryFromReader(message: SubscribeBlockDigestsFromStartHeightRequest, reader: jspb.BinaryReader): SubscribeBlockDigestsFromStartHeightRequest;
}

export namespace SubscribeBlockDigestsFromStartHeightRequest {
  export type AsObject = {
    startBlockHeight: number,
    blockStatus: flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap],
  }
}

export class SubscribeBlockDigestsFromLatestRequest extends jspb.Message {
  getBlockStatus(): flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap];
  setBlockStatus(value: flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribeBlockDigestsFromLatestRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeBlockDigestsFromLatestRequest): SubscribeBlockDigestsFromLatestRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubscribeBlockDigestsFromLatestRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeBlockDigestsFromLatestRequest;
  static deserializeBinaryFromReader(message: SubscribeBlockDigestsFromLatestRequest, reader: jspb.BinaryReader): SubscribeBlockDigestsFromLatestRequest;
}

export namespace SubscribeBlockDigestsFromLatestRequest {
  export type AsObject = {
    blockStatus: flow_entities_block_pb.BlockStatusMap[keyof flow_entities_block_pb.BlockStatusMap],
  }
}

export class SubscribeBlockDigestsResponse extends jspb.Message {
  getBlockId(): Uint8Array | string;
  getBlockId_asU8(): Uint8Array;
  getBlockId_asB64(): string;
  setBlockId(value: Uint8Array | string): void;

  getBlockHeight(): number;
  setBlockHeight(value: number): void;

  hasBlockTimestamp(): boolean;
  clearBlockTimestamp(): void;
  getBlockTimestamp(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setBlockTimestamp(value?: google_protobuf_timestamp_pb.Timestamp): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribeBlockDigestsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeBlockDigestsResponse): SubscribeBlockDigestsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubscribeBlockDigestsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeBlockDigestsResponse;
  static deserializeBinaryFromReader(message: SubscribeBlockDigestsResponse, reader: jspb.BinaryReader): SubscribeBlockDigestsResponse;
}

export namespace SubscribeBlockDigestsResponse {
  export type AsObject = {
    blockId: Uint8Array | string,
    blockHeight: number,
    blockTimestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class SendAndSubscribeTransactionStatusesRequest extends jspb.Message {
  hasTransaction(): boolean;
  clearTransaction(): void;
  getTransaction(): flow_entities_transaction_pb.Transaction | undefined;
  setTransaction(value?: flow_entities_transaction_pb.Transaction): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendAndSubscribeTransactionStatusesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SendAndSubscribeTransactionStatusesRequest): SendAndSubscribeTransactionStatusesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SendAndSubscribeTransactionStatusesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendAndSubscribeTransactionStatusesRequest;
  static deserializeBinaryFromReader(message: SendAndSubscribeTransactionStatusesRequest, reader: jspb.BinaryReader): SendAndSubscribeTransactionStatusesRequest;
}

export namespace SendAndSubscribeTransactionStatusesRequest {
  export type AsObject = {
    transaction?: flow_entities_transaction_pb.Transaction.AsObject,
  }
}

export class SendAndSubscribeTransactionStatusesResponse extends jspb.Message {
  getId(): Uint8Array | string;
  getId_asU8(): Uint8Array;
  getId_asB64(): string;
  setId(value: Uint8Array | string): void;

  getStatus(): flow_entities_transaction_pb.TransactionStatusMap[keyof flow_entities_transaction_pb.TransactionStatusMap];
  setStatus(value: flow_entities_transaction_pb.TransactionStatusMap[keyof flow_entities_transaction_pb.TransactionStatusMap]): void;

  getMessageIndex(): number;
  setMessageIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendAndSubscribeTransactionStatusesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SendAndSubscribeTransactionStatusesResponse): SendAndSubscribeTransactionStatusesResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SendAndSubscribeTransactionStatusesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SendAndSubscribeTransactionStatusesResponse;
  static deserializeBinaryFromReader(message: SendAndSubscribeTransactionStatusesResponse, reader: jspb.BinaryReader): SendAndSubscribeTransactionStatusesResponse;
}

export namespace SendAndSubscribeTransactionStatusesResponse {
  export type AsObject = {
    id: Uint8Array | string,
    status: flow_entities_transaction_pb.TransactionStatusMap[keyof flow_entities_transaction_pb.TransactionStatusMap],
    messageIndex: number,
  }
}

