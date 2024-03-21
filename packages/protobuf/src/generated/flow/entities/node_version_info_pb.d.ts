// package: flow.entities
// file: flow/entities/node_version_info.proto

import * as jspb from "google-protobuf";

export class NodeVersionInfo extends jspb.Message {
  getSemver(): string;
  setSemver(value: string): void;

  getCommit(): string;
  setCommit(value: string): void;

  getSporkId(): Uint8Array | string;
  getSporkId_asU8(): Uint8Array;
  getSporkId_asB64(): string;
  setSporkId(value: Uint8Array | string): void;

  getProtocolVersion(): number;
  setProtocolVersion(value: number): void;

  getSporkRootBlockHeight(): number;
  setSporkRootBlockHeight(value: number): void;

  getNodeRootBlockHeight(): number;
  setNodeRootBlockHeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NodeVersionInfo.AsObject;
  static toObject(includeInstance: boolean, msg: NodeVersionInfo): NodeVersionInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NodeVersionInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NodeVersionInfo;
  static deserializeBinaryFromReader(message: NodeVersionInfo, reader: jspb.BinaryReader): NodeVersionInfo;
}

export namespace NodeVersionInfo {
  export type AsObject = {
    semver: string,
    commit: string,
    sporkId: Uint8Array | string,
    protocolVersion: number,
    sporkRootBlockHeight: number,
    nodeRootBlockHeight: number,
  }
}

