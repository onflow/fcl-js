// package: execution
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
  readonly responseType: typeof flow_execution_execution_pb.ExecuteScriptResponse;
};

type ExecutionAPIGetEventsForBlockIDs = {
  readonly methodName: string;
  readonly service: typeof ExecutionAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_execution_execution_pb.GetEventsForBlockIDsRequest;
  readonly responseType: typeof flow_execution_execution_pb.EventsResponse;
};

type ExecutionAPIGetEventsForBlockIDTransactionID = {
  readonly methodName: string;
  readonly service: typeof ExecutionAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_execution_execution_pb.GetEventsForBlockIDTransactionIDRequest;
  readonly responseType: typeof flow_execution_execution_pb.EventsResponse;
};

export class ExecutionAPI {
  static readonly serviceName: string;
  static readonly Ping: ExecutionAPIPing;
  static readonly GetAccountAtBlockID: ExecutionAPIGetAccountAtBlockID;
  static readonly ExecuteScriptAtBlockID: ExecutionAPIExecuteScriptAtBlockID;
  static readonly GetEventsForBlockIDs: ExecutionAPIGetEventsForBlockIDs;
  static readonly GetEventsForBlockIDTransactionID: ExecutionAPIGetEventsForBlockIDTransactionID;
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
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.ExecuteScriptResponse|null) => void
  ): UnaryResponse;
  executeScriptAtBlockID(
    requestMessage: flow_execution_execution_pb.ExecuteScriptAtBlockIDRequest,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.ExecuteScriptResponse|null) => void
  ): UnaryResponse;
  getEventsForBlockIDs(
    requestMessage: flow_execution_execution_pb.GetEventsForBlockIDsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.EventsResponse|null) => void
  ): UnaryResponse;
  getEventsForBlockIDs(
    requestMessage: flow_execution_execution_pb.GetEventsForBlockIDsRequest,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.EventsResponse|null) => void
  ): UnaryResponse;
  getEventsForBlockIDTransactionID(
    requestMessage: flow_execution_execution_pb.GetEventsForBlockIDTransactionIDRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.EventsResponse|null) => void
  ): UnaryResponse;
  getEventsForBlockIDTransactionID(
    requestMessage: flow_execution_execution_pb.GetEventsForBlockIDTransactionIDRequest,
    callback: (error: ServiceError|null, responseMessage: flow_execution_execution_pb.EventsResponse|null) => void
  ): UnaryResponse;
}

