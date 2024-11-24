// package: flow.execution
// file: flow/execution/execution.proto

import * as flow_execution_execution_pb from "../../flow/execution/execution_pb";
import {grpc} from "@improbable-eng/grpc-web";

type ExecutionAPIPing = {
  readonly methodName: string;
  readonly service: typeof ExecutionAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_execution_execution_pb.PingRequest;
  readonly responseType: typeof flow_execution_execution_pb.PingResponse;
};

type ExecutionAPIGetAccountAtBlockID = {
  readonly methodName: string;
  readonly service: typeof ExecutionAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_execution_execution_pb.GetAccountAtBlockIDRequest;
  readonly responseType: typeof flow_execution_execution_pb.GetAccountAtBlockIDResponse;
};

type ExecutionAPIExecuteScriptAtBlockID = {
  readonly methodName: string;
  readonly service: typeof ExecutionAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_execution_execution_pb.ExecuteScriptAtBlockIDRequest;
  readonly responseType: typeof flow_execution_execution_pb.ExecuteScriptAtBlockIDResponse;
};

type ExecutionAPIGetEventsForBlockIDs = {
  readonly methodName: string;
  readonly service: typeof ExecutionAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_execution_execution_pb.GetEventsForBlockIDsRequest;
  readonly responseType: typeof flow_execution_execution_pb.GetEventsForBlockIDsResponse;
};

type ExecutionAPIGetTransactionResult = {
  readonly methodName: string;
  readonly service: typeof ExecutionAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_execution_execution_pb.GetTransactionResultRequest;
  readonly responseType: typeof flow_execution_execution_pb.GetTransactionResultResponse;
};

type ExecutionAPIGetTransactionResultByIndex = {
  readonly methodName: string;
  readonly service: typeof ExecutionAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_execution_execution_pb.GetTransactionByIndexRequest;
  readonly responseType: typeof flow_execution_execution_pb.GetTransactionResultResponse;
};

type ExecutionAPIGetTransactionResultsByBlockID = {
  readonly methodName: string;
  readonly service: typeof ExecutionAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_execution_execution_pb.GetTransactionsByBlockIDRequest;
  readonly responseType: typeof flow_execution_execution_pb.GetTransactionResultsResponse;
};

type ExecutionAPIGetTransactionErrorMessage = {
  readonly methodName: string;
  readonly service: typeof ExecutionAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_execution_execution_pb.GetTransactionErrorMessageRequest;
  readonly responseType: typeof flow_execution_execution_pb.GetTransactionErrorMessageResponse;
};

type ExecutionAPIGetTransactionErrorMessageByIndex = {
  readonly methodName: string;
  readonly service: typeof ExecutionAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_execution_execution_pb.GetTransactionErrorMessageByIndexRequest;
  readonly responseType: typeof flow_execution_execution_pb.GetTransactionErrorMessageResponse;
};

type ExecutionAPIGetTransactionErrorMessagesByBlockID = {
  readonly methodName: string;
  readonly service: typeof ExecutionAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_execution_execution_pb.GetTransactionErrorMessagesByBlockIDRequest;
  readonly responseType: typeof flow_execution_execution_pb.GetTransactionErrorMessagesResponse;
};

type ExecutionAPIGetRegisterAtBlockID = {
  readonly methodName: string;
  readonly service: typeof ExecutionAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_execution_execution_pb.GetRegisterAtBlockIDRequest;
  readonly responseType: typeof flow_execution_execution_pb.GetRegisterAtBlockIDResponse;
};

type ExecutionAPIGetLatestBlockHeader = {
  readonly methodName: string;
  readonly service: typeof ExecutionAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_execution_execution_pb.GetLatestBlockHeaderRequest;
  readonly responseType: typeof flow_execution_execution_pb.BlockHeaderResponse;
};

type ExecutionAPIGetBlockHeaderByID = {
  readonly methodName: string;
  readonly service: typeof ExecutionAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_execution_execution_pb.GetBlockHeaderByIDRequest;
  readonly responseType: typeof flow_execution_execution_pb.BlockHeaderResponse;
};

export class ExecutionAPI {
  static readonly serviceName: string;
  static readonly Ping: ExecutionAPIPing;
  static readonly GetAccountAtBlockID: ExecutionAPIGetAccountAtBlockID;
  static readonly ExecuteScriptAtBlockID: ExecutionAPIExecuteScriptAtBlockID;
  static readonly GetEventsForBlockIDs: ExecutionAPIGetEventsForBlockIDs;
  static readonly GetTransactionResult: ExecutionAPIGetTransactionResult;
  static readonly GetTransactionResultByIndex: ExecutionAPIGetTransactionResultByIndex;
  static readonly GetTransactionResultsByBlockID: ExecutionAPIGetTransactionResultsByBlockID;
  static readonly GetTransactionErrorMessage: ExecutionAPIGetTransactionErrorMessage;
  static readonly GetTransactionErrorMessageByIndex: ExecutionAPIGetTransactionErrorMessageByIndex;
  static readonly GetTransactionErrorMessagesByBlockID: ExecutionAPIGetTransactionErrorMessagesByBlockID;
  static readonly GetRegisterAtBlockID: ExecutionAPIGetRegisterAtBlockID;
  static readonly GetLatestBlockHeader: ExecutionAPIGetLatestBlockHeader;
  static readonly GetBlockHeaderByID: ExecutionAPIGetBlockHeaderByID;
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

export class ExecutionAPIClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  ping(
    requestMessage: flow_execution_execution_pb.PingRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.PingResponse|null) => void
  ): UnaryResponse;
  ping(
    requestMessage: flow_execution_execution_pb.PingRequest,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.PingResponse|null) => void
  ): UnaryResponse;
  getAccountAtBlockID(
    requestMessage: flow_execution_execution_pb.GetAccountAtBlockIDRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.GetAccountAtBlockIDResponse|null) => void
  ): UnaryResponse;
  getAccountAtBlockID(
    requestMessage: flow_execution_execution_pb.GetAccountAtBlockIDRequest,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.GetAccountAtBlockIDResponse|null) => void
  ): UnaryResponse;
  executeScriptAtBlockID(
    requestMessage: flow_execution_execution_pb.ExecuteScriptAtBlockIDRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.ExecuteScriptAtBlockIDResponse|null) => void
  ): UnaryResponse;
  executeScriptAtBlockID(
    requestMessage: flow_execution_execution_pb.ExecuteScriptAtBlockIDRequest,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.ExecuteScriptAtBlockIDResponse|null) => void
  ): UnaryResponse;
  getEventsForBlockIDs(
    requestMessage: flow_execution_execution_pb.GetEventsForBlockIDsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.GetEventsForBlockIDsResponse|null) => void
  ): UnaryResponse;
  getEventsForBlockIDs(
    requestMessage: flow_execution_execution_pb.GetEventsForBlockIDsRequest,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.GetEventsForBlockIDsResponse|null) => void
  ): UnaryResponse;
  getTransactionResult(
    requestMessage: flow_execution_execution_pb.GetTransactionResultRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.GetTransactionResultResponse|null) => void
  ): UnaryResponse;
  getTransactionResult(
    requestMessage: flow_execution_execution_pb.GetTransactionResultRequest,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.GetTransactionResultResponse|null) => void
  ): UnaryResponse;
  getTransactionResultByIndex(
    requestMessage: flow_execution_execution_pb.GetTransactionByIndexRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.GetTransactionResultResponse|null) => void
  ): UnaryResponse;
  getTransactionResultByIndex(
    requestMessage: flow_execution_execution_pb.GetTransactionByIndexRequest,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.GetTransactionResultResponse|null) => void
  ): UnaryResponse;
  getTransactionResultsByBlockID(
    requestMessage: flow_execution_execution_pb.GetTransactionsByBlockIDRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.GetTransactionResultsResponse|null) => void
  ): UnaryResponse;
  getTransactionResultsByBlockID(
    requestMessage: flow_execution_execution_pb.GetTransactionsByBlockIDRequest,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.GetTransactionResultsResponse|null) => void
  ): UnaryResponse;
  getTransactionErrorMessage(
    requestMessage: flow_execution_execution_pb.GetTransactionErrorMessageRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.GetTransactionErrorMessageResponse|null) => void
  ): UnaryResponse;
  getTransactionErrorMessage(
    requestMessage: flow_execution_execution_pb.GetTransactionErrorMessageRequest,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.GetTransactionErrorMessageResponse|null) => void
  ): UnaryResponse;
  getTransactionErrorMessageByIndex(
    requestMessage: flow_execution_execution_pb.GetTransactionErrorMessageByIndexRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.GetTransactionErrorMessageResponse|null) => void
  ): UnaryResponse;
  getTransactionErrorMessageByIndex(
    requestMessage: flow_execution_execution_pb.GetTransactionErrorMessageByIndexRequest,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.GetTransactionErrorMessageResponse|null) => void
  ): UnaryResponse;
  getTransactionErrorMessagesByBlockID(
    requestMessage: flow_execution_execution_pb.GetTransactionErrorMessagesByBlockIDRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.GetTransactionErrorMessagesResponse|null) => void
  ): UnaryResponse;
  getTransactionErrorMessagesByBlockID(
    requestMessage: flow_execution_execution_pb.GetTransactionErrorMessagesByBlockIDRequest,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.GetTransactionErrorMessagesResponse|null) => void
  ): UnaryResponse;
  getRegisterAtBlockID(
    requestMessage: flow_execution_execution_pb.GetRegisterAtBlockIDRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.GetRegisterAtBlockIDResponse|null) => void
  ): UnaryResponse;
  getRegisterAtBlockID(
    requestMessage: flow_execution_execution_pb.GetRegisterAtBlockIDRequest,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.GetRegisterAtBlockIDResponse|null) => void
  ): UnaryResponse;
  getLatestBlockHeader(
    requestMessage: flow_execution_execution_pb.GetLatestBlockHeaderRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.BlockHeaderResponse|null) => void
  ): UnaryResponse;
  getLatestBlockHeader(
    requestMessage: flow_execution_execution_pb.GetLatestBlockHeaderRequest,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.BlockHeaderResponse|null) => void
  ): UnaryResponse;
  getBlockHeaderByID(
    requestMessage: flow_execution_execution_pb.GetBlockHeaderByIDRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.BlockHeaderResponse|null) => void
  ): UnaryResponse;
  getBlockHeaderByID(
    requestMessage: flow_execution_execution_pb.GetBlockHeaderByIDRequest,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.BlockHeaderResponse|null) => void
  ): UnaryResponse;
}

