/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.19.4
 * source: flow/entities/block_seal.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
export namespace flow.entities {
    export class BlockSeal extends pb_1.Message {
        constructor(data?: any[] | {
            block_id?: Uint8Array;
            execution_receipt_id?: Uint8Array;
            execution_receipt_signatures?: Uint8Array[];
            result_approval_signatures?: Uint8Array[];
            final_state?: Uint8Array;
            result_id?: Uint8Array;
            aggregated_approval_sigs?: AggregatedSignature[];
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [3, 4, 7], []);
            if (!Array.isArray(data) && typeof data == "object") {
                if ("block_id" in data && data.block_id != undefined) {
                    this.block_id = data.block_id;
                }
                if ("execution_receipt_id" in data && data.execution_receipt_id != undefined) {
                    this.execution_receipt_id = data.execution_receipt_id;
                }
                if ("execution_receipt_signatures" in data && data.execution_receipt_signatures != undefined) {
                    this.execution_receipt_signatures = data.execution_receipt_signatures;
                }
                if ("result_approval_signatures" in data && data.result_approval_signatures != undefined) {
                    this.result_approval_signatures = data.result_approval_signatures;
                }
                if ("final_state" in data && data.final_state != undefined) {
                    this.final_state = data.final_state;
                }
                if ("result_id" in data && data.result_id != undefined) {
                    this.result_id = data.result_id;
                }
                if ("aggregated_approval_sigs" in data && data.aggregated_approval_sigs != undefined) {
                    this.aggregated_approval_sigs = data.aggregated_approval_sigs;
                }
            }
        }
        get block_id() {
            return pb_1.Message.getField(this, 1) as Uint8Array;
        }
        set block_id(value: Uint8Array) {
            pb_1.Message.setField(this, 1, value);
        }
        get execution_receipt_id() {
            return pb_1.Message.getField(this, 2) as Uint8Array;
        }
        set execution_receipt_id(value: Uint8Array) {
            pb_1.Message.setField(this, 2, value);
        }
        get execution_receipt_signatures() {
            return pb_1.Message.getField(this, 3) as Uint8Array[];
        }
        set execution_receipt_signatures(value: Uint8Array[]) {
            pb_1.Message.setField(this, 3, value);
        }
        get result_approval_signatures() {
            return pb_1.Message.getField(this, 4) as Uint8Array[];
        }
        set result_approval_signatures(value: Uint8Array[]) {
            pb_1.Message.setField(this, 4, value);
        }
        get final_state() {
            return pb_1.Message.getField(this, 5) as Uint8Array;
        }
        set final_state(value: Uint8Array) {
            pb_1.Message.setField(this, 5, value);
        }
        get result_id() {
            return pb_1.Message.getField(this, 6) as Uint8Array;
        }
        set result_id(value: Uint8Array) {
            pb_1.Message.setField(this, 6, value);
        }
        get aggregated_approval_sigs() {
            return pb_1.Message.getRepeatedWrapperField(this, AggregatedSignature, 7) as AggregatedSignature[];
        }
        set aggregated_approval_sigs(value: AggregatedSignature[]) {
            pb_1.Message.setRepeatedWrapperField(this, 7, value);
        }
        static fromObject(data: {
            block_id?: Uint8Array;
            execution_receipt_id?: Uint8Array;
            execution_receipt_signatures?: Uint8Array[];
            result_approval_signatures?: Uint8Array[];
            final_state?: Uint8Array;
            result_id?: Uint8Array;
            aggregated_approval_sigs?: ReturnType<typeof AggregatedSignature.prototype.toObject>[];
        }) {
            const message = new BlockSeal({});
            if (data.block_id != null) {
                message.block_id = data.block_id;
            }
            if (data.execution_receipt_id != null) {
                message.execution_receipt_id = data.execution_receipt_id;
            }
            if (data.execution_receipt_signatures != null) {
                message.execution_receipt_signatures = data.execution_receipt_signatures;
            }
            if (data.result_approval_signatures != null) {
                message.result_approval_signatures = data.result_approval_signatures;
            }
            if (data.final_state != null) {
                message.final_state = data.final_state;
            }
            if (data.result_id != null) {
                message.result_id = data.result_id;
            }
            if (data.aggregated_approval_sigs != null) {
                message.aggregated_approval_sigs = data.aggregated_approval_sigs.map(item => AggregatedSignature.fromObject(item));
            }
            return message;
        }
        toObject() {
            const data: {
                block_id?: Uint8Array;
                execution_receipt_id?: Uint8Array;
                execution_receipt_signatures?: Uint8Array[];
                result_approval_signatures?: Uint8Array[];
                final_state?: Uint8Array;
                result_id?: Uint8Array;
                aggregated_approval_sigs?: ReturnType<typeof AggregatedSignature.prototype.toObject>[];
            } = {};
            if (this.block_id != null) {
                data.block_id = this.block_id;
            }
            if (this.execution_receipt_id != null) {
                data.execution_receipt_id = this.execution_receipt_id;
            }
            if (this.execution_receipt_signatures != null) {
                data.execution_receipt_signatures = this.execution_receipt_signatures;
            }
            if (this.result_approval_signatures != null) {
                data.result_approval_signatures = this.result_approval_signatures;
            }
            if (this.final_state != null) {
                data.final_state = this.final_state;
            }
            if (this.result_id != null) {
                data.result_id = this.result_id;
            }
            if (this.aggregated_approval_sigs != null) {
                data.aggregated_approval_sigs = this.aggregated_approval_sigs.map((item: AggregatedSignature) => item.toObject());
            }
            return data;
        }
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
            const writer = w || new pb_1.BinaryWriter();
            if (this.block_id !== undefined)
                writer.writeBytes(1, this.block_id);
            if (this.execution_receipt_id !== undefined)
                writer.writeBytes(2, this.execution_receipt_id);
            if (this.execution_receipt_signatures !== undefined)
                writer.writeRepeatedBytes(3, this.execution_receipt_signatures);
            if (this.result_approval_signatures !== undefined)
                writer.writeRepeatedBytes(4, this.result_approval_signatures);
            if (this.final_state !== undefined)
                writer.writeBytes(5, this.final_state);
            if (this.result_id !== undefined)
                writer.writeBytes(6, this.result_id);
            if (this.aggregated_approval_sigs !== undefined)
                writer.writeRepeatedMessage(7, this.aggregated_approval_sigs, (item: AggregatedSignature) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BlockSeal {
            const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new BlockSeal();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.block_id = reader.readBytes();
                        break;
                    case 2:
                        message.execution_receipt_id = reader.readBytes();
                        break;
                    case 3:
                        pb_1.Message.addToRepeatedField(message, 3, reader.readBytes());
                        break;
                    case 4:
                        pb_1.Message.addToRepeatedField(message, 4, reader.readBytes());
                        break;
                    case 5:
                        message.final_state = reader.readBytes();
                        break;
                    case 6:
                        message.result_id = reader.readBytes();
                        break;
                    case 7:
                        reader.readMessage(message.aggregated_approval_sigs, () => pb_1.Message.addToRepeatedWrapperField(message, 7, AggregatedSignature.deserialize(reader), AggregatedSignature));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
        serializeBinary(): Uint8Array {
            return this.serialize();
        }
        static deserializeBinary(bytes: Uint8Array): BlockSeal {
            return BlockSeal.deserialize(bytes);
        }
    }
    export class AggregatedSignature extends pb_1.Message {
        constructor(data?: any[] | {
            verifier_signatures?: Uint8Array[];
            signer_ids?: Uint8Array[];
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [1, 2], []);
            if (!Array.isArray(data) && typeof data == "object") {
                if ("verifier_signatures" in data && data.verifier_signatures != undefined) {
                    this.verifier_signatures = data.verifier_signatures;
                }
                if ("signer_ids" in data && data.signer_ids != undefined) {
                    this.signer_ids = data.signer_ids;
                }
            }
        }
        get verifier_signatures() {
            return pb_1.Message.getField(this, 1) as Uint8Array[];
        }
        set verifier_signatures(value: Uint8Array[]) {
            pb_1.Message.setField(this, 1, value);
        }
        get signer_ids() {
            return pb_1.Message.getField(this, 2) as Uint8Array[];
        }
        set signer_ids(value: Uint8Array[]) {
            pb_1.Message.setField(this, 2, value);
        }
        static fromObject(data: {
            verifier_signatures?: Uint8Array[];
            signer_ids?: Uint8Array[];
        }) {
            const message = new AggregatedSignature({});
            if (data.verifier_signatures != null) {
                message.verifier_signatures = data.verifier_signatures;
            }
            if (data.signer_ids != null) {
                message.signer_ids = data.signer_ids;
            }
            return message;
        }
        toObject() {
            const data: {
                verifier_signatures?: Uint8Array[];
                signer_ids?: Uint8Array[];
            } = {};
            if (this.verifier_signatures != null) {
                data.verifier_signatures = this.verifier_signatures;
            }
            if (this.signer_ids != null) {
                data.signer_ids = this.signer_ids;
            }
            return data;
        }
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
            const writer = w || new pb_1.BinaryWriter();
            if (this.verifier_signatures !== undefined)
                writer.writeRepeatedBytes(1, this.verifier_signatures);
            if (this.signer_ids !== undefined)
                writer.writeRepeatedBytes(2, this.signer_ids);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): AggregatedSignature {
            const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new AggregatedSignature();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        pb_1.Message.addToRepeatedField(message, 1, reader.readBytes());
                        break;
                    case 2:
                        pb_1.Message.addToRepeatedField(message, 2, reader.readBytes());
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
        serializeBinary(): Uint8Array {
            return this.serialize();
        }
        static deserializeBinary(bytes: Uint8Array): AggregatedSignature {
            return AggregatedSignature.deserialize(bytes);
        }
    }
}
