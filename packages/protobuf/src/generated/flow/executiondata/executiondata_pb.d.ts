// package: flow.executiondata
// file: flow/executiondata/executiondata.proto

import * as jspb from "google-protobuf";
import * as flow_entities_block_execution_data_pb from "../../flow/entities/block_execution_data_pb";
import * as flow_entities_event_pb from "../../flow/entities/event_pb";
import * as flow_entities_register_pb from "../../flow/entities/register_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class GetExecutionDataByBlockIDRequest extends jspb.Message {
  getBlockId(): Uint8Array | string;
  getBlockId_asU8(): Uint8Array;
  getBlockId_asB64(): string;
  setBlockId(value: Uint8Array | string): void;

  getEventEncodingVersion(): flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap];
  setEventEncodingVersion(value: flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetExecutionDataByBlockIDRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetExecutionDataByBlockIDRequest): GetExecutionDataByBlockIDRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetExecutionDataByBlockIDRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetExecutionDataByBlockIDRequest;
  static deserializeBinaryFromReader(message: GetExecutionDataByBlockIDRequest, reader: jspb.BinaryReader): GetExecutionDataByBlockIDRequest;
}

export namespace GetExecutionDataByBlockIDRequest {
  export type AsObject = {
    blockId: Uint8Array | string,
    eventEncodingVersion: flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap],
  }
}

export class GetExecutionDataByBlockIDResponse extends jspb.Message {
  hasBlockExecutionData(): boolean;
  clearBlockExecutionData(): void;
  getBlockExecutionData(): flow_entities_block_execution_data_pb.BlockExecutionData | undefined;
  setBlockExecutionData(value?: flow_entities_block_execution_data_pb.BlockExecutionData): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetExecutionDataByBlockIDResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetExecutionDataByBlockIDResponse): GetExecutionDataByBlockIDResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetExecutionDataByBlockIDResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetExecutionDataByBlockIDResponse;
  static deserializeBinaryFromReader(message: GetExecutionDataByBlockIDResponse, reader: jspb.BinaryReader): GetExecutionDataByBlockIDResponse;
}

export namespace GetExecutionDataByBlockIDResponse {
  export type AsObject = {
    blockExecutionData?: flow_entities_block_execution_data_pb.BlockExecutionData.AsObject,
  }
}

export class SubscribeExecutionDataRequest extends jspb.Message {
  getStartBlockId(): Uint8Array | string;
  getStartBlockId_asU8(): Uint8Array;
  getStartBlockId_asB64(): string;
  setStartBlockId(value: Uint8Array | string): void;

  getStartBlockHeight(): number;
  setStartBlockHeight(value: number): void;

  getEventEncodingVersion(): flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap];
  setEventEncodingVersion(value: flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribeExecutionDataRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeExecutionDataRequest): SubscribeExecutionDataRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubscribeExecutionDataRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeExecutionDataRequest;
  static deserializeBinaryFromReader(message: SubscribeExecutionDataRequest, reader: jspb.BinaryReader): SubscribeExecutionDataRequest;
}

export namespace SubscribeExecutionDataRequest {
  export type AsObject = {
    startBlockId: Uint8Array | string,
    startBlockHeight: number,
    eventEncodingVersion: flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap],
  }
}

export class SubscribeExecutionDataResponse extends jspb.Message {
  getBlockHeight(): number;
  setBlockHeight(value: number): void;

  hasBlockExecutionData(): boolean;
  clearBlockExecutionData(): void;
  getBlockExecutionData(): flow_entities_block_execution_data_pb.BlockExecutionData | undefined;
  setBlockExecutionData(value?: flow_entities_block_execution_data_pb.BlockExecutionData): void;

  hasBlockTimestamp(): boolean;
  clearBlockTimestamp(): void;
  getBlockTimestamp(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setBlockTimestamp(value?: google_protobuf_timestamp_pb.Timestamp): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribeExecutionDataResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeExecutionDataResponse): SubscribeExecutionDataResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubscribeExecutionDataResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeExecutionDataResponse;
  static deserializeBinaryFromReader(message: SubscribeExecutionDataResponse, reader: jspb.BinaryReader): SubscribeExecutionDataResponse;
}

export namespace SubscribeExecutionDataResponse {
  export type AsObject = {
    blockHeight: number,
    blockExecutionData?: flow_entities_block_execution_data_pb.BlockExecutionData.AsObject,
    blockTimestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class SubscribeEventsRequest extends jspb.Message {
  getStartBlockId(): Uint8Array | string;
  getStartBlockId_asU8(): Uint8Array;
  getStartBlockId_asB64(): string;
  setStartBlockId(value: Uint8Array | string): void;

  getStartBlockHeight(): number;
  setStartBlockHeight(value: number): void;

  hasFilter(): boolean;
  clearFilter(): void;
  getFilter(): EventFilter | undefined;
  setFilter(value?: EventFilter): void;

  getHeartbeatInterval(): number;
  setHeartbeatInterval(value: number): void;

  getEventEncodingVersion(): flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap];
  setEventEncodingVersion(value: flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubscribeEventsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeEventsRequest): SubscribeEventsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubscribeEventsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeEventsRequest;
  static deserializeBinaryFromReader(message: SubscribeEventsRequest, reader: jspb.BinaryReader): SubscribeEventsRequest;
}

export namespace SubscribeEventsRequest {
  export type AsObject = {
    startBlockId: Uint8Array | string,
    startBlockHeight: number,
    filter?: EventFilter.AsObject,
    heartbeatInterval: number,
    eventEncodingVersion: flow_entities_event_pb.EventEncodingVersionMap[keyof flow_entities_event_pb.EventEncodingVersionMap],
  }
}

export class SubscribeEventsResponse extends jspb.Message {
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
  toObject(includeInstance?: boolean): SubscribeEventsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SubscribeEventsResponse): SubscribeEventsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SubscribeEventsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubscribeEventsResponse;
  static deserializeBinaryFromReader(message: SubscribeEventsResponse, reader: jspb.BinaryReader): SubscribeEventsResponse;
}

export namespace SubscribeEventsResponse {
  export type AsObject = {
    blockId: Uint8Array | string,
    blockHeight: number,
    eventsList: Array<flow_entities_event_pb.Event.AsObject>,
    blockTimestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class EventFilter extends jspb.Message {
  clearEventTypeList(): void;
  getEventTypeList(): Array<string>;
  setEventTypeList(value: Array<string>): void;
  addEventType(value: string, index?: number): string;

  clearContractList(): void;
  getContractList(): Array<string>;
  setContractList(value: Array<string>): void;
  addContract(value: string, index?: number): string;

  clearAddressList(): void;
  getAddressList(): Array<string>;
  setAddressList(value: Array<string>): void;
  addAddress(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EventFilter.AsObject;
  static toObject(includeInstance: boolean, msg: EventFilter): EventFilter.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EventFilter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EventFilter;
  static deserializeBinaryFromReader(message: EventFilter, reader: jspb.BinaryReader): EventFilter;
}

export namespace EventFilter {
  export type AsObject = {
    eventTypeList: Array<string>,
    contractList: Array<string>,
    addressList: Array<string>,
  }
}

export class GetRegisterValuesRequest extends jspb.Message {
  getBlockHeight(): number;
  setBlockHeight(value: number): void;

  clearRegisterIdsList(): void;
  getRegisterIdsList(): Array<flow_entities_register_pb.RegisterID>;
  setRegisterIdsList(value: Array<flow_entities_register_pb.RegisterID>): void;
  addRegisterIds(value?: flow_entities_register_pb.RegisterID, index?: number): flow_entities_register_pb.RegisterID;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRegisterValuesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetRegisterValuesRequest): GetRegisterValuesRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetRegisterValuesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRegisterValuesRequest;
  static deserializeBinaryFromReader(message: GetRegisterValuesRequest, reader: jspb.BinaryReader): GetRegisterValuesRequest;
}

export namespace GetRegisterValuesRequest {
  export type AsObject = {
    blockHeight: number,
    registerIdsList: Array<flow_entities_register_pb.RegisterID.AsObject>,
  }
}

export class GetRegisterValuesResponse extends jspb.Message {
  clearValuesList(): void;
  getValuesList(): Array<Uint8Array | string>;
  getValuesList_asU8(): Array<Uint8Array>;
  getValuesList_asB64(): Array<string>;
  setValuesList(value: Array<Uint8Array | string>): void;
  addValues(value: Uint8Array | string, index?: number): Uint8Array | string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRegisterValuesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetRegisterValuesResponse): GetRegisterValuesResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetRegisterValuesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRegisterValuesResponse;
  static deserializeBinaryFromReader(message: GetRegisterValuesResponse, reader: jspb.BinaryReader): GetRegisterValuesResponse;
}

export namespace GetRegisterValuesResponse {
  export type AsObject = {
    valuesList: Array<Uint8Array | string>,
  }
}

