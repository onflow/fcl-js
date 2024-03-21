// package: flow.executiondata
// file: flow/executiondata/executiondata.proto

import * as flow_executiondata_executiondata_pb from "../../flow/executiondata/executiondata_pb";
import {grpc} from "@improbable-eng/grpc-web";

type ExecutionDataAPIGetExecutionDataByBlockID = {
  readonly methodName: string;
  readonly service: typeof ExecutionDataAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_executiondata_executiondata_pb.GetExecutionDataByBlockIDRequest;
  readonly responseType: typeof flow_executiondata_executiondata_pb.GetExecutionDataByBlockIDResponse;
};

type ExecutionDataAPISubscribeExecutionData = {
  readonly methodName: string;
  readonly service: typeof ExecutionDataAPI;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof flow_executiondata_executiondata_pb.SubscribeExecutionDataRequest;
  readonly responseType: typeof flow_executiondata_executiondata_pb.SubscribeExecutionDataResponse;
};

type ExecutionDataAPISubscribeEvents = {
  readonly methodName: string;
  readonly service: typeof ExecutionDataAPI;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof flow_executiondata_executiondata_pb.SubscribeEventsRequest;
  readonly responseType: typeof flow_executiondata_executiondata_pb.SubscribeEventsResponse;
};

type ExecutionDataAPIGetRegisterValues = {
  readonly methodName: string;
  readonly service: typeof ExecutionDataAPI;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof flow_executiondata_executiondata_pb.GetRegisterValuesRequest;
  readonly responseType: typeof flow_executiondata_executiondata_pb.GetRegisterValuesResponse;
};

export class ExecutionDataAPI {
  static readonly serviceName: string;
  static readonly GetExecutionDataByBlockID: ExecutionDataAPIGetExecutionDataByBlockID;
  static readonly SubscribeExecutionData: ExecutionDataAPISubscribeExecutionData;
  static readonly SubscribeEvents: ExecutionDataAPISubscribeEvents;
  static readonly GetRegisterValues: ExecutionDataAPIGetRegisterValues;
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

export class ExecutionDataAPIClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getExecutionDataByBlockID(
    requestMessage: flow_executiondata_executiondata_pb.GetExecutionDataByBlockIDRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_executiondata_executiondata_pb.GetExecutionDataByBlockIDResponse|null) => void
  ): UnaryResponse;
  getExecutionDataByBlockID(
    requestMessage: flow_executiondata_executiondata_pb.GetExecutionDataByBlockIDRequest,
    callback: (error: ServiceError|null, responseMessage: flow_executiondata_executiondata_pb.GetExecutionDataByBlockIDResponse|null) => void
  ): UnaryResponse;
  subscribeExecutionData(requestMessage: flow_executiondata_executiondata_pb.SubscribeExecutionDataRequest, metadata?: grpc.Metadata): ResponseStream<flow_executiondata_executiondata_pb.SubscribeExecutionDataResponse>;
  subscribeEvents(requestMessage: flow_executiondata_executiondata_pb.SubscribeEventsRequest, metadata?: grpc.Metadata): ResponseStream<flow_executiondata_executiondata_pb.SubscribeEventsResponse>;
  getRegisterValues(
    requestMessage: flow_executiondata_executiondata_pb.GetRegisterValuesRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: flow_executiondata_executiondata_pb.GetRegisterValuesResponse|null) => void
  ): UnaryResponse;
  getRegisterValues(
    requestMessage: flow_executiondata_executiondata_pb.GetRegisterValuesRequest,
    callback: (error: ServiceError|null, responseMessage: flow_executiondata_executiondata_pb.GetRegisterValuesResponse|null) => void
  ): UnaryResponse;
}

