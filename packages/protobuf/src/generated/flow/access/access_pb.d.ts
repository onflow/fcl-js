// package: flow.access
// file: flow/access/access.proto

import * as jspb from "google-protobuf";
import * as flow_entities_account_pb from "../../flow/entities/account_pb";
import * as flow_entities_block_header_pb from "../../flow/entities/block_header_pb";
import * as flow_entities_block_pb from "../../flow/entities/block_pb";
import * as flow_entities_collection_pb from "../../flow/entities/collection_pb";
import * as flow_entities_event_pb from "../../flow/entities/event_pb";
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
  }
}

export class GetLatestBlockRequest extends jspb.Message {
  getIsSealed(): boolean;
  setIsSealed(value: boolean): void;

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
  }
}

export class GetBlockByIDRequest extends jspb.Message {
  getId(): Uint8Array | string;
  getId_asU8(): Uint8Array;
  getId_asB64(): string;
  setId(value: Uint8Array | string): void;

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
  }
}

export class GetBlockByHeightRequest extends jspb.Message {
  getHeight(): number;
  setHeight(value: number): void;

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
  }
}

export class BlockResponse extends jspb.Message {
  hasBlock(): boolean;
  clearBlock(): void;
  getBlock(): flow_entities_block_pb.Block | undefined;
  setBlock(value?: flow_entities_block_pb.Block): void;

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
  }
}

export class GetTransactionRequest extends jspb.Message {
  getId(): Uint8Array | string;
  getId_asU8(): Uint8Array;
  getId_asB64(): string;
  setId(value: Uint8Array | string): void;

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
  }
}

export class TransactionResponse extends jspb.Message {
  hasTransaction(): boolean;
  clearTransaction(): void;
  getTransaction(): flow_entities_transaction_pb.Transaction | undefined;
  setTransaction(value?: flow_entities_transaction_pb.Transaction): void;

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
  }
}

export class GetEventsForHeightRangeRequest extends jspb.Message {
  getType(): string;
  setType(value: string): void;

  getStartHeight(): number;
  setStartHeight(value: number): void;

  getEndHeight(): number;
  setEndHeight(value: number): void;

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
  }
}

export class EventsResponse extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<EventsResponse.Result>;
  setResultsList(value: Array<EventsResponse.Result>): void;
  addResults(value?: EventsResponse.Result, index?: number): EventsResponse.Result;

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

