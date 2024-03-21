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

type AccessAPIGetNodeVersionInfo = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetNodeVersionInfoRequest;
  readonly responseType: typeof flow_access_access_pb.GetNodeVersionInfoResponse;
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

type AccessAPIGetTransactionResultByIndex = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetTransactionByIndexRequest;
  readonly responseType: typeof flow_access_access_pb.TransactionResultResponse;
};

type AccessAPIGetTransactionResultsByBlockID = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetTransactionsByBlockIDRequest;
  readonly responseType: typeof flow_access_access_pb.TransactionResultsResponse;
};

type AccessAPIGetTransactionsByBlockID = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetTransactionsByBlockIDRequest;
  readonly responseType: typeof flow_access_access_pb.TransactionsResponse;
};

type AccessAPIGetSystemTransaction = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetSystemTransactionRequest;
  readonly responseType: typeof flow_access_access_pb.TransactionResponse;
};

type AccessAPIGetSystemTransactionResult = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetSystemTransactionResultRequest;
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

type AccessAPIGetLatestProtocolStateSnapshot = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetLatestProtocolStateSnapshotRequest;
  readonly responseType: typeof flow_access_access_pb.ProtocolStateSnapshotResponse;
};

type AccessAPIGetProtocolStateSnapshotByBlockID = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetProtocolStateSnapshotByBlockIDRequest;
  readonly responseType: typeof flow_access_access_pb.ProtocolStateSnapshotResponse;
};

type AccessAPIGetProtocolStateSnapshotByHeight = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetProtocolStateSnapshotByHeightRequest;
  readonly responseType: typeof flow_access_access_pb.ProtocolStateSnapshotResponse;
};

type AccessAPIGetExecutionResultForBlockID = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetExecutionResultForBlockIDRequest;
  readonly responseType: typeof flow_access_access_pb.ExecutionResultForBlockIDResponse;
};

type AccessAPIGetExecutionResultByID = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_access_access_pb.GetExecutionResultByIDRequest;
  readonly responseType: typeof flow_access_access_pb.ExecutionResultByIDResponse;
};

type AccessAPISubscribeBlocksFromStartBlockID = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof flow_access_access_pb.SubscribeBlocksFromStartBlockIDRequest;
  readonly responseType: typeof flow_access_access_pb.SubscribeBlocksResponse;
};

type AccessAPISubscribeBlocksFromStartHeight = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof flow_access_access_pb.SubscribeBlocksFromStartHeightRequest;
  readonly responseType: typeof flow_access_access_pb.SubscribeBlocksResponse;
};

type AccessAPISubscribeBlocksFromLatest = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof flow_access_access_pb.SubscribeBlocksFromLatestRequest;
  readonly responseType: typeof flow_access_access_pb.SubscribeBlocksResponse;
};

type AccessAPISubscribeBlockHeadersFromStartBlockID = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof flow_access_access_pb.SubscribeBlockHeadersFromStartBlockIDRequest;
  readonly responseType: typeof flow_access_access_pb.SubscribeBlockHeadersResponse;
};

type AccessAPISubscribeBlockHeadersFromStartHeight = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof flow_access_access_pb.SubscribeBlockHeadersFromStartHeightRequest;
  readonly responseType: typeof flow_access_access_pb.SubscribeBlockHeadersResponse;
};

type AccessAPISubscribeBlockHeadersFromLatest = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof flow_access_access_pb.SubscribeBlockHeadersFromLatestRequest;
  readonly responseType: typeof flow_access_access_pb.SubscribeBlockHeadersResponse;
};

type AccessAPISubscribeBlockDigestsFromStartBlockID = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof flow_access_access_pb.SubscribeBlockDigestsFromStartBlockIDRequest;
  readonly responseType: typeof flow_access_access_pb.SubscribeBlockDigestsResponse;
};

type AccessAPISubscribeBlockDigestsFromStartHeight = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof flow_access_access_pb.SubscribeBlockDigestsFromStartHeightRequest;
  readonly responseType: typeof flow_access_access_pb.SubscribeBlockDigestsResponse;
};

type AccessAPISubscribeBlockDigestsFromLatest = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof flow_access_access_pb.SubscribeBlockDigestsFromLatestRequest;
  readonly responseType: typeof flow_access_access_pb.SubscribeBlockDigestsResponse;
};

type AccessAPISendAndSubscribeTransactionStatuses = {
  readonly methodName: string;
  readonly service: typeof AccessAPI;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof flow_access_access_pb.SendAndSubscribeTransactionStatusesRequest;
  readonly responseType: typeof flow_access_access_pb.SendAndSubscribeTransactionStatusesResponse;
};

export class AccessAPI {
  static readonly serviceName: string;
  static readonly Ping: AccessAPIPing;
  static readonly GetNodeVersionInfo: AccessAPIGetNodeVersionInfo;
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
  static readonly GetTransactionResultByIndex: AccessAPIGetTransactionResultByIndex;
  static readonly GetTransactionResultsByBlockID: AccessAPIGetTransactionResultsByBlockID;
  static readonly GetTransactionsByBlockID: AccessAPIGetTransactionsByBlockID;
  static readonly GetSystemTransaction: AccessAPIGetSystemTransaction;
  static readonly GetSystemTransactionResult: AccessAPIGetSystemTransactionResult;
  static readonly GetAccount: AccessAPIGetAccount;
  static readonly GetAccountAtLatestBlock: AccessAPIGetAccountAtLatestBlock;
  static readonly GetAccountAtBlockHeight: AccessAPIGetAccountAtBlockHeight;
  static readonly ExecuteScriptAtLatestBlock: AccessAPIExecuteScriptAtLatestBlock;
  static readonly ExecuteScriptAtBlockID: AccessAPIExecuteScriptAtBlockID;
  static readonly ExecuteScriptAtBlockHeight: AccessAPIExecuteScriptAtBlockHeight;
  static readonly GetEventsForHeightRange: AccessAPIGetEventsForHeightRange;
  static readonly GetEventsForBlockIDs: AccessAPIGetEventsForBlockIDs;
  static readonly GetNetworkParameters: AccessAPIGetNetworkParameters;
  static readonly GetLatestProtocolStateSnapshot: AccessAPIGetLatestProtocolStateSnapshot;
  static readonly GetProtocolStateSnapshotByBlockID: AccessAPIGetProtocolStateSnapshotByBlockID;
  static readonly GetProtocolStateSnapshotByHeight: AccessAPIGetProtocolStateSnapshotByHeight;
  static readonly GetExecutionResultForBlockID: AccessAPIGetExecutionResultForBlockID;
  static readonly GetExecutionResultByID: AccessAPIGetExecutionResultByID;
  static readonly SubscribeBlocksFromStartBlockID: AccessAPISubscribeBlocksFromStartBlockID;
  static readonly SubscribeBlocksFromStartHeight: AccessAPISubscribeBlocksFromStartHeight;
  static readonly SubscribeBlocksFromLatest: AccessAPISubscribeBlocksFromLatest;
  static readonly SubscribeBlockHeadersFromStartBlockID: AccessAPISubscribeBlockHeadersFromStartBlockID;
  static readonly SubscribeBlockHeadersFromStartHeight: AccessAPISubscribeBlockHeadersFromStartHeight;
  static readonly SubscribeBlockHeadersFromLatest: AccessAPISubscribeBlockHeadersFromLatest;
  static readonly SubscribeBlockDigestsFromStartBlockID: AccessAPISubscribeBlockDigestsFromStartBlockID;
  static readonly SubscribeBlockDigestsFromStartHeight: AccessAPISubscribeBlockDigestsFromStartHeight;
  static readonly SubscribeBlockDigestsFromLatest: AccessAPISubscribeBlockDigestsFromLatest;
  static readonly SendAndSubscribeTransactionStatuses: AccessAPISendAndSubscribeTransactionStatuses;
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
  getNodeVersionInfo(
    requestMessage: flow_access_access_pb.GetNodeVersionInfoRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.GetNodeVersionInfoResponse|null) => void
  ): UnaryResponse;
  getNodeVersionInfo(
    requestMessage: flow_access_access_pb.GetNodeVersionInfoRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.GetNodeVersionInfoResponse|null) => void
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
  getTransactionResultByIndex(
    requestMessage: flow_access_access_pb.GetTransactionByIndexRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.TransactionResultResponse|null) => void
  ): UnaryResponse;
  getTransactionResultByIndex(
    requestMessage: flow_access_access_pb.GetTransactionByIndexRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.TransactionResultResponse|null) => void
  ): UnaryResponse;
  getTransactionResultsByBlockID(
    requestMessage: flow_access_access_pb.GetTransactionsByBlockIDRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.TransactionResultsResponse|null) => void
  ): UnaryResponse;
  getTransactionResultsByBlockID(
    requestMessage: flow_access_access_pb.GetTransactionsByBlockIDRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.TransactionResultsResponse|null) => void
  ): UnaryResponse;
  getTransactionsByBlockID(
    requestMessage: flow_access_access_pb.GetTransactionsByBlockIDRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.TransactionsResponse|null) => void
  ): UnaryResponse;
  getTransactionsByBlockID(
    requestMessage: flow_access_access_pb.GetTransactionsByBlockIDRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.TransactionsResponse|null) => void
  ): UnaryResponse;
  getSystemTransaction(
    requestMessage: flow_access_access_pb.GetSystemTransactionRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.TransactionResponse|null) => void
  ): UnaryResponse;
  getSystemTransaction(
    requestMessage: flow_access_access_pb.GetSystemTransactionRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.TransactionResponse|null) => void
  ): UnaryResponse;
  getSystemTransactionResult(
    requestMessage: flow_access_access_pb.GetSystemTransactionResultRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.TransactionResultResponse|null) => void
  ): UnaryResponse;
  getSystemTransactionResult(
    requestMessage: flow_access_access_pb.GetSystemTransactionResultRequest,
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
  getLatestProtocolStateSnapshot(
    requestMessage: flow_access_access_pb.GetLatestProtocolStateSnapshotRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.ProtocolStateSnapshotResponse|null) => void
  ): UnaryResponse;
  getLatestProtocolStateSnapshot(
    requestMessage: flow_access_access_pb.GetLatestProtocolStateSnapshotRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.ProtocolStateSnapshotResponse|null) => void
  ): UnaryResponse;
  getProtocolStateSnapshotByBlockID(
    requestMessage: flow_access_access_pb.GetProtocolStateSnapshotByBlockIDRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.ProtocolStateSnapshotResponse|null) => void
  ): UnaryResponse;
  getProtocolStateSnapshotByBlockID(
    requestMessage: flow_access_access_pb.GetProtocolStateSnapshotByBlockIDRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.ProtocolStateSnapshotResponse|null) => void
  ): UnaryResponse;
  getProtocolStateSnapshotByHeight(
    requestMessage: flow_access_access_pb.GetProtocolStateSnapshotByHeightRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.ProtocolStateSnapshotResponse|null) => void
  ): UnaryResponse;
  getProtocolStateSnapshotByHeight(
    requestMessage: flow_access_access_pb.GetProtocolStateSnapshotByHeightRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.ProtocolStateSnapshotResponse|null) => void
  ): UnaryResponse;
  getExecutionResultForBlockID(
    requestMessage: flow_access_access_pb.GetExecutionResultForBlockIDRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.ExecutionResultForBlockIDResponse|null) => void
  ): UnaryResponse;
  getExecutionResultForBlockID(
    requestMessage: flow_access_access_pb.GetExecutionResultForBlockIDRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.ExecutionResultForBlockIDResponse|null) => void
  ): UnaryResponse;
  getExecutionResultByID(
    requestMessage: flow_access_access_pb.GetExecutionResultByIDRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.ExecutionResultByIDResponse|null) => void
  ): UnaryResponse;
  getExecutionResultByID(
    requestMessage: flow_access_access_pb.GetExecutionResultByIDRequest,
    callback: (error: ServiceError|null, responseMessage: flow_access_access_pb.ExecutionResultByIDResponse|null) => void
  ): UnaryResponse;
  subscribeBlocksFromStartBlockID(requestMessage: flow_access_access_pb.SubscribeBlocksFromStartBlockIDRequest, metadata?: grpc.Metadata): ResponseStream<flow_access_access_pb.SubscribeBlocksResponse>;
  subscribeBlocksFromStartHeight(requestMessage: flow_access_access_pb.SubscribeBlocksFromStartHeightRequest, metadata?: grpc.Metadata): ResponseStream<flow_access_access_pb.SubscribeBlocksResponse>;
  subscribeBlocksFromLatest(requestMessage: flow_access_access_pb.SubscribeBlocksFromLatestRequest, metadata?: grpc.Metadata): ResponseStream<flow_access_access_pb.SubscribeBlocksResponse>;
  subscribeBlockHeadersFromStartBlockID(requestMessage: flow_access_access_pb.SubscribeBlockHeadersFromStartBlockIDRequest, metadata?: grpc.Metadata): ResponseStream<flow_access_access_pb.SubscribeBlockHeadersResponse>;
  subscribeBlockHeadersFromStartHeight(requestMessage: flow_access_access_pb.SubscribeBlockHeadersFromStartHeightRequest, metadata?: grpc.Metadata): ResponseStream<flow_access_access_pb.SubscribeBlockHeadersResponse>;
  subscribeBlockHeadersFromLatest(requestMessage: flow_access_access_pb.SubscribeBlockHeadersFromLatestRequest, metadata?: grpc.Metadata): ResponseStream<flow_access_access_pb.SubscribeBlockHeadersResponse>;
  subscribeBlockDigestsFromStartBlockID(requestMessage: flow_access_access_pb.SubscribeBlockDigestsFromStartBlockIDRequest, metadata?: grpc.Metadata): ResponseStream<flow_access_access_pb.SubscribeBlockDigestsResponse>;
  subscribeBlockDigestsFromStartHeight(requestMessage: flow_access_access_pb.SubscribeBlockDigestsFromStartHeightRequest, metadata?: grpc.Metadata): ResponseStream<flow_access_access_pb.SubscribeBlockDigestsResponse>;
  subscribeBlockDigestsFromLatest(requestMessage: flow_access_access_pb.SubscribeBlockDigestsFromLatestRequest, metadata?: grpc.Metadata): ResponseStream<flow_access_access_pb.SubscribeBlockDigestsResponse>;
  sendAndSubscribeTransactionStatuses(requestMessage: flow_access_access_pb.SendAndSubscribeTransactionStatusesRequest, metadata?: grpc.Metadata): ResponseStream<flow_access_access_pb.SendAndSubscribeTransactionStatusesResponse>;
}

