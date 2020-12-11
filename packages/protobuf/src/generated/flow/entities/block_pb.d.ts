// package: flow.entities
// file: flow/entities/block.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";
import * as flow_entities_collection_pb from "../../flow/entities/collection_pb";
import * as flow_entities_block_seal_pb from "../../flow/entities/block_seal_pb";

export class Block extends jspb.Message {
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

  clearCollectionGuaranteesList(): void;
  getCollectionGuaranteesList(): Array<flow_entities_collection_pb.CollectionGuarantee>;
  setCollectionGuaranteesList(value: Array<flow_entities_collection_pb.CollectionGuarantee>): void;
  addCollectionGuarantees(value?: flow_entities_collection_pb.CollectionGuarantee, index?: number): flow_entities_collection_pb.CollectionGuarantee;

  clearBlockSealsList(): void;
  getBlockSealsList(): Array<flow_entities_block_seal_pb.BlockSeal>;
  setBlockSealsList(value: Array<flow_entities_block_seal_pb.BlockSeal>): void;
  addBlockSeals(value?: flow_entities_block_seal_pb.BlockSeal, index?: number): flow_entities_block_seal_pb.BlockSeal;

  clearSignaturesList(): void;
  getSignaturesList(): Array<Uint8Array | string>;
  getSignaturesList_asU8(): Array<Uint8Array>;
  getSignaturesList_asB64(): Array<string>;
  setSignaturesList(value: Array<Uint8Array | string>): void;
  addSignatures(value: Uint8Array | string, index?: number): Uint8Array | string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Block.AsObject;
  static toObject(includeInstance: boolean, msg: Block): Block.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Block, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Block;
  static deserializeBinaryFromReader(message: Block, reader: jspb.BinaryReader): Block;
}

export namespace Block {
  export type AsObject = {
    id: Uint8Array | string,
    parentId: Uint8Array | string,
    height: number,
    timestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    collectionGuaranteesList: Array<flow_entities_collection_pb.CollectionGuarantee.AsObject>,
    blockSealsList: Array<flow_entities_block_seal_pb.BlockSeal.AsObject>,
    signaturesList: Array<Uint8Array | string>,
  }
}

