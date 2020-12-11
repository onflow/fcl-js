// package: flow.access
// file: flow/access/access.proto

import * as flow_access_access_pb from "../../flow/access/access_pb";
import {grpc} from "@improbable-eng/grpc-web";

type AccessAPIPing = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.PingRequest;
  readonly responseType: typeof flow_access_access_pb.PingResponse;
};

type AccessAPIGetLatestBlockHeader = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetLatestBlockHeaderRequest;
  readonly responseType: typeof flow_access_access_pb.BlockHeaderResponse;
};

type AccessAPIGetBlockHeaderByID = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetBlockHeaderByIDRequest;
  readonly responseType: typeof flow_access_access_pb.BlockHeaderResponse;
};

type AccessAPIGetBlockHeaderByHeight = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetBlockHeaderByHeightRequest;
  readonly responseType: typeof flow_access_access_pb.BlockHeaderResponse;
};

type AccessAPIGetLatestBlock = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetLatestBlockRequest;
  readonly responseType: typeof flow_access_access_pb.BlockResponse;
};

type AccessAPIGetBlockByID = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetBlockByIDRequest;
  readonly responseType: typeof flow_access_access_pb.BlockResponse;
};

type AccessAPIGetBlockByHeight = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetBlockByHeightRequest;
  readonly responseType: typeof flow_access_access_pb.BlockResponse;
};

type AccessAPIGetCollectionByID = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetCollectionByIDRequest;
  readonly responseType: typeof flow_access_access_pb.CollectionResponse;
};

type AccessAPISendTransaction = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.SendTransactionRequest;
  readonly responseType: typeof flow_access_access_pb.SendTransactionResponse;
};

type AccessAPIGetTransaction = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetTransactionRequest;
  readonly responseType: typeof flow_access_access_pb.TransactionResponse;
};

type AccessAPIGetTransactionResult = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetTransactionRequest;
  readonly responseType: typeof flow_access_access_pb.TransactionResultResponse;
};

type AccessAPIGetAccount = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetAccountRequest;
  readonly responseType: typeof flow_access_access_pb.GetAccountResponse;
};

type AccessAPIGetAccountAtLatestBlock = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetAccountAtLatestBlockRequest;
  readonly responseType: typeof flow_access_access_pb.AccountResponse;
};

type AccessAPIGetAccountAtBlockHeight = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetAccountAtBlockHeightRequest;
  readonly responseType: typeof flow_access_access_pb.AccountResponse;
};

type AccessAPIExecuteScriptAtLatestBlock = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.ExecuteScriptAtLatestBlockRequest;
  readonly responseType: typeof flow_access_access_pb.ExecuteScriptResponse;
};

type AccessAPIExecuteScriptAtBlockID = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.ExecuteScriptAtBlockIDRequest;
  readonly responseType: typeof flow_access_access_pb.ExecuteScriptResponse;
};

type AccessAPIExecuteScriptAtBlockHeight = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.ExecuteScriptAtBlockHeightRequest;
  readonly responseType: typeof flow_access_access_pb.ExecuteScriptResponse;
};

type AccessAPIGetEventsForHeightRange = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetEventsForHeightRangeRequest;
  readonly responseType: typeof flow_access_access_pb.EventsResponse;
};

type AccessAPIGetEventsForBlockIDs = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetEventsForBlockIDsRequest;
  readonly responseType: typeof flow_access_access_pb.EventsResponse;
};

type AccessAPIGetNetworkParameters = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetNetworkParametersRequest;
  readonly responseType: typeof flow_access_access_pb.GetNetworkParametersResponse;
};

export class AccessAPI {
  static readonly serviceName: string;
  static readonly Ping: AccessAPIPing;
  static readonly GetLatestBlockHeader: AccessAPIGetLatestBlockHeader;
  static readonly GetBlockHeaderByID: AccessAPIGetBlockHeaderByID;
  static readonly GetBlockHeaderByHeight: AccessAPIGetBlockHeaderByHeight;
  static readonly GetLatestBlock: AccessAPIGetLatestBlock;
  static readonly GetBlockByID: AccessAPIGetBlockByID;
  static readonly GetBlockByHeight: AccessAPIGetBlockByHeight;
  static readonly GetCollectionByID: AccessAPIGetCollectionByID;
  static readonly SendTransaction: AccessAPISendTransaction;
  static readonly GetTransaction: AccessAPIGetTransaction;
  static readonly GetTransactionResult: AccessAPIGetTransactionResult;
  static readonly GetAccount: AccessAPIGetAccount;
  static readonly GetAccountAtLatestBlock: AccessAPIGetAccountAtLatestBlock;
  static readonly GetAccountAtBlockHeight: AccessAPIGetAccountAtBlockHeight;
  static readonly ExecuteScriptAtLatestBlock: AccessAPIExecuteScriptAtLatestBlock;
  static readonly ExecuteScriptAtBlockID: AccessAPIExecuteScriptAtBlockID;
  static readonly ExecuteScriptAtBlockHeight: AccessAPIExecuteScriptAtBlockHeight;
  static readonly GetEventsForHeightRange: AccessAPIGetEventsForHeightRange;
  static readonly GetEventsForBlockIDs: AccessAPIGetEventsForBlockIDs;
  static readonly GetNetworkParameters: AccessAPIGetNetworkParameters;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class AccessAPIClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  ping(
    requestMessage: flow_access_access_pb.PingRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.PingResponse|null) => void
  ): UnaryResponse;
  ping(
    requestMessage: flow_access_access_pb.PingRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.PingResponse|null) => void
  ): UnaryResponse;
  getLatestBlockHeader(
    requestMessage: flow_access_access_pb.GetLatestBlockHeaderRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.BlockHeaderResponse|null) => void
  ): UnaryResponse;
  getLatestBlockHeader(
    requestMessage: flow_access_access_pb.GetLatestBlockHeaderRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.BlockHeaderResponse|null) => void
  ): UnaryResponse;
  getBlockHeaderByID(
    requestMessage: flow_access_access_pb.GetBlockHeaderByIDRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.BlockHeaderResponse|null) => void
  ): UnaryResponse;
  getBlockHeaderByID(
    requestMessage: flow_access_access_pb.GetBlockHeaderByIDRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.BlockHeaderResponse|null) => void
  ): UnaryResponse;
  getBlockHeaderByHeight(
    requestMessage: flow_access_access_pb.GetBlockHeaderByHeightRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.BlockHeaderResponse|null) => void
  ): UnaryResponse;
  getBlockHeaderByHeight(
    requestMessage: flow_access_access_pb.GetBlockHeaderByHeightRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.BlockHeaderResponse|null) => void
  ): UnaryResponse;
  getLatestBlock(
    requestMessage: flow_access_access_pb.GetLatestBlockRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.BlockResponse|null) => void
  ): UnaryResponse;
  getLatestBlock(
    requestMessage: flow_access_access_pb.GetLatestBlockRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.BlockResponse|null) => void
  ): UnaryResponse;
  getBlockByID(
    requestMessage: flow_access_access_pb.GetBlockByIDRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.BlockResponse|null) => void
  ): UnaryResponse;
  getBlockByID(
    requestMessage: flow_access_access_pb.GetBlockByIDRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.BlockResponse|null) => void
  ): UnaryResponse;
  getBlockByHeight(
    requestMessage: flow_access_access_pb.GetBlockByHeightRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.BlockResponse|null) => void
  ): UnaryResponse;
  getBlockByHeight(
    requestMessage: flow_access_access_pb.GetBlockByHeightRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.BlockResponse|null) => void
  ): UnaryResponse;
  getCollectionByID(
    requestMessage: flow_access_access_pb.GetCollectionByIDRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.CollectionResponse|null) => void
  ): UnaryResponse;
  getCollectionByID(
    requestMessage: flow_access_access_pb.GetCollectionByIDRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.CollectionResponse|null) => void
  ): UnaryResponse;
  sendTransaction(
    requestMessage: flow_access_access_pb.SendTransactionRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.SendTransactionResponse|null) => void
  ): UnaryResponse;
  sendTransaction(
    requestMessage: flow_access_access_pb.SendTransactionRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.SendTransactionResponse|null) => void
  ): UnaryResponse;
  getTransaction(
    requestMessage: flow_access_access_pb.GetTransactionRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.TransactionResponse|null) => void
  ): UnaryResponse;
  getTransaction(
    requestMessage: flow_access_access_pb.GetTransactionRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.TransactionResponse|null) => void
  ): UnaryResponse;
  getTransactionResult(
    requestMessage: flow_access_access_pb.GetTransactionRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.TransactionResultResponse|null) => void
  ): UnaryResponse;
  getTransactionResult(
    requestMessage: flow_access_access_pb.GetTransactionRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.TransactionResultResponse|null) => void
  ): UnaryResponse;
  getAccount(
    requestMessage: flow_access_access_pb.GetAccountRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.GetAccountResponse|null) => void
  ): UnaryResponse;
  getAccount(
    requestMessage: flow_access_access_pb.GetAccountRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.GetAccountResponse|null) => void
  ): UnaryResponse;
  getAccountAtLatestBlock(
    requestMessage: flow_access_access_pb.GetAccountAtLatestBlockRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.AccountResponse|null) => void
  ): UnaryResponse;
  getAccountAtLatestBlock(
    requestMessage: flow_access_access_pb.GetAccountAtLatestBlockRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.AccountResponse|null) => void
  ): UnaryResponse;
  getAccountAtBlockHeight(
    requestMessage: flow_access_access_pb.GetAccountAtBlockHeightRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.AccountResponse|null) => void
  ): UnaryResponse;
  getAccountAtBlockHeight(
    requestMessage: flow_access_access_pb.GetAccountAtBlockHeightRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.AccountResponse|null) => void
  ): UnaryResponse;
  executeScriptAtLatestBlock(
    requestMessage: flow_access_access_pb.ExecuteScriptAtLatestBlockRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.ExecuteScriptResponse|null) => void
  ): UnaryResponse;
  executeScriptAtLatestBlock(
    requestMessage: flow_access_access_pb.ExecuteScriptAtLatestBlockRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.ExecuteScriptResponse|null) => void
  ): UnaryResponse;
  executeScriptAtBlockID(
    requestMessage: flow_access_access_pb.ExecuteScriptAtBlockIDRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.ExecuteScriptResponse|null) => void
  ): UnaryResponse;
  executeScriptAtBlockID(
    requestMessage: flow_access_access_pb.ExecuteScriptAtBlockIDRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.ExecuteScriptResponse|null) => void
  ): UnaryResponse;
  executeScriptAtBlockHeight(
    requestMessage: flow_access_access_pb.ExecuteScriptAtBlockHeightRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.ExecuteScriptResponse|null) => void
  ): UnaryResponse;
  executeScriptAtBlockHeight(
    requestMessage: flow_access_access_pb.ExecuteScriptAtBlockHeightRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.ExecuteScriptResponse|null) => void
  ): UnaryResponse;
  getEventsForHeightRange(
    requestMessage: flow_access_access_pb.GetEventsForHeightRangeRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.EventsResponse|null) => void
  ): UnaryResponse;
  getEventsForHeightRange(
    requestMessage: flow_access_access_pb.GetEventsForHeightRangeRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.EventsResponse|null) => void
  ): UnaryResponse;
  getEventsForBlockIDs(
    requestMessage: flow_access_access_pb.GetEventsForBlockIDsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.EventsResponse|null) => void
  ): UnaryResponse;
  getEventsForBlockIDs(
    requestMessage: flow_access_access_pb.GetEventsForBlockIDsRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.EventsResponse|null) => void
  ): UnaryResponse;
  getNetworkParameters(
    requestMessage: flow_access_access_pb.GetNetworkParametersRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.GetNetworkParametersResponse|null) => void
  ): UnaryResponse;
  getNetworkParameters(
    requestMessage: flow_access_access_pb.GetNetworkParametersRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.GetNetworkParametersResponse|null) => void
  ): UnaryResponse;
}

