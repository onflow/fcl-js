// package: flow.entities
// file: flow/entities/block_header.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class BlockHeader extends jspb.Message {
  getId(): Uint8Array | string;
  getId_asU8(): Uint8Array;
  getId_asB64(): string;
  setId(value: Uint8Array | string): void;

  getParentId(): Uint8Array | string;
  getParentId_asU8(): Uint8Array;
  getParentId_asB64(): string;
  setParentId(value: Uint8Array | string): void;

  getHeight(): number;
  setHeight(value: number): void;

  hasTimestamp(): boolean;
  clearTimestamp(): void;
  getTimestamp(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTimestamp(value?: google_protobuf_timestamp_pb.Timestamp): void;

  getPayloadHash(): Uint8Array | string;
  getPayloadHash_asU8(): Uint8Array;
  getPayloadHash_asB64(): string;
  setPayloadHash(value: Uint8Array | string): void;

  getView(): number;
  setView(value: number): void;

  clearParentVoterIdsList(): void;
  getParentVoterIdsList(): Array<Uint8Array | string>;
  getParentVoterIdsList_asU8(): Array<Uint8Array>;
  getParentVoterIdsList_asB64(): Array<string>;
  setParentVoterIdsList(value: Array<Uint8Array | string>): void;
  addParentVoterIds(value: Uint8Array | string, index?: number): Uint8Array | string;

  getParentVoterSigData(): Uint8Array | string;
  getParentVoterSigData_asU8(): Uint8Array;
  getParentVoterSigData_asB64(): string;
  setParentVoterSigData(value: Uint8Array | string): void;

  getProposerId(): Uint8Array | string;
  getProposerId_asU8(): Uint8Array;
  getProposerId_asB64(): string;
  setProposerId(value: Uint8Array | string): void;

  getProposerSigData(): Uint8Array | string;
  getProposerSigData_asU8(): Uint8Array;
  getProposerSigData_asB64(): string;
  setProposerSigData(value: Uint8Array | string): void;

  getChainId(): string;
  setChainId(value: string): void;

  getParentVoterIndices(): Uint8Array | string;
  getParentVoterIndices_asU8(): Uint8Array;
  getParentVoterIndices_asB64(): string;
  setParentVoterIndices(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockHeader.AsObject;
  static toObject(includeInstance: boolean, msg: BlockHeader): BlockHeader.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockHeader, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockHeader;
  static deserializeBinaryFromReader(message: BlockHeader, reader: jspb.BinaryReader): BlockHeader;
}

export namespace BlockHeader {
  export type AsObject = {
    id: Uint8Array | string,
    parentId: Uint8Array | string,
    height: number,
    timestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    payloadHash: Uint8Array | string,
    view: number,
    parentVoterIdsList: Array<Uint8Array | string>,
    parentVoterSigData: Uint8Array | string,
    proposerId: Uint8Array | string,
    proposerSigData: Uint8Array | string,
    chainId: string,
    parentVoterIndices: Uint8Array | string,
  }
}

