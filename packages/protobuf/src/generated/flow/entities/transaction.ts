import * as pb_1 from "google-protobuf";
export namespace entities {
    export class Transaction extends pb_1.Message {
        constructor(data?: any[] | {
            script?: Uint8Array;
            reference_block_id?: Uint8Array;
            gas_limit?: number;
            proposal_key?: Transaction.ProposalKey;
            payer?: Uint8Array;
            authorizers?: Uint8Array[];
            payload_signatures?: Transaction.Signature[];
            envelope_signatures?: Transaction.Signature[];
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [6, 7, 8], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.script = data.script;
                this.reference_block_id = data.reference_block_id;
                this.gas_limit = data.gas_limit;
                this.proposal_key = data.proposal_key;
                this.payer = data.payer;
                this.authorizers = data.authorizers;
                this.payload_signatures = data.payload_signatures;
                this.envelope_signatures = data.envelope_signatures;
            }
        }
        get script(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as Uint8Array | undefined;
        }
        set script(value: Uint8Array) {
            pb_1.Message.setField(this, 1, value);
        }
        get reference_block_id(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as Uint8Array | undefined;
        }
        set reference_block_id(value: Uint8Array) {
            pb_1.Message.setField(this, 2, value);
        }
        get gas_limit(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set gas_limit(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get proposal_key(): Transaction.ProposalKey | undefined {
            return pb_1.Message.getWrapperField(this, Transaction.ProposalKey, 4) as Transaction.ProposalKey | undefined;
        }
        set proposal_key(value: Transaction.ProposalKey) {
            pb_1.Message.setWrapperField(this, 4, value);
        }
        get payer(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as Uint8Array | undefined;
        }
        set payer(value: Uint8Array) {
            pb_1.Message.setField(this, 5, value);
        }
        get authorizers(): Uint8Array[] {
            return pb_1.Message.getField(this, 6) as Uint8Array[];
        }
        set authorizers(value: Uint8Array[]) {
            pb_1.Message.setField(this, 6, value);
        }
        get payload_signatures(): Transaction.Signature[] {
            return pb_1.Message.getRepeatedWrapperField(this, Transaction.Signature, 7) as Transaction.Signature[];
        }
        set payload_signatures(value: Transaction.Signature[]) {
            pb_1.Message.setRepeatedWrapperField(this, 7, value);
        }
        get envelope_signatures(): Transaction.Signature[] {
            return pb_1.Message.getRepeatedWrapperField(this, Transaction.Signature, 8) as Transaction.Signature[];
        }
        set envelope_signatures(value: Transaction.Signature[]) {
            pb_1.Message.setRepeatedWrapperField(this, 8, value);
        }
        toObject() {
            return {
                script: this.script,
                reference_block_id: this.reference_block_id,
                gas_limit: this.gas_limit,
                proposal_key: this.proposal_key && this.proposal_key.toObject(),
                payer: this.payer,
                authorizers: this.authorizers,
                payload_signatures: this.payload_signatures.map((item: Transaction.Signature) => item.toObject()),
                envelope_signatures: this.envelope_signatures.map((item: Transaction.Signature) => item.toObject())
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.script !== undefined)
                writer.writeBytes(1, this.script);
            if (this.reference_block_id !== undefined)
                writer.writeBytes(2, this.reference_block_id);
            if (this.gas_limit !== undefined)
                writer.writeUint64(3, this.gas_limit);
            if (this.proposal_key !== undefined)
                writer.writeMessage(4, this.proposal_key, () => this.proposal_key.serialize(writer));
            if (this.payer !== undefined)
                writer.writeBytes(5, this.payer);
            if (this.authorizers !== undefined)
                writer.writeRepeatedBytes(6, this.authorizers);
            if (this.payload_signatures !== undefined)
                writer.writeRepeatedMessage(7, this.payload_signatures, (item: Transaction.Signature) => item.serialize(writer));
            if (this.envelope_signatures !== undefined)
                writer.writeRepeatedMessage(8, this.envelope_signatures, (item: Transaction.Signature) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Transaction {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Transaction();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.script = reader.readBytes();
                        break;
                    case 2:
                        message.reference_block_id = reader.readBytes();
                        break;
                    case 3:
                        message.gas_limit = reader.readUint64();
                        break;
                    case 4:
                        reader.readMessage(message.proposal_key, () => message.proposal_key = Transaction.ProposalKey.deserialize(reader));
                        break;
                    case 5:
                        message.payer = reader.readBytes();
                        break;
                    case 6:
                        pb_1.Message.addToRepeatedField(message, 6, reader.readBytes());
                        break;
                    case 7:
                        reader.readMessage(message.payload_signatures, () => pb_1.Message.addToRepeatedWrapperField(message, 7, Transaction.Signature.deserialize(reader), Transaction.Signature));
                        break;
                    case 8:
                        reader.readMessage(message.envelope_signatures, () => pb_1.Message.addToRepeatedWrapperField(message, 8, Transaction.Signature.deserialize(reader), Transaction.Signature));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export namespace Transaction {
        export class ProposalKey extends pb_1.Message {
            constructor(data?: any[] | {
                address?: Uint8Array;
                key_id?: number;
                sequence_number?: number;
            }) {
                super();
                pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
                if (!Array.isArray(data) && typeof data == "object") {
                    this.address = data.address;
                    this.key_id = data.key_id;
                    this.sequence_number = data.sequence_number;
                }
            }
            get address(): Uint8Array | undefined {
                return pb_1.Message.getFieldWithDefault(this, 1, undefined) as Uint8Array | undefined;
            }
            set address(value: Uint8Array) {
                pb_1.Message.setField(this, 1, value);
            }
            get key_id(): number | undefined {
                return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
            }
            set key_id(value: number) {
                pb_1.Message.setField(this, 2, value);
            }
            get sequence_number(): number | undefined {
                return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
            }
            set sequence_number(value: number) {
                pb_1.Message.setField(this, 3, value);
            }
            toObject() {
                return {
                    address: this.address,
                    key_id: this.key_id,
                    sequence_number: this.sequence_number
                };
            }
            serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
                const writer = w || new pb_1.BinaryWriter();
                if (this.address !== undefined)
                    writer.writeBytes(1, this.address);
                if (this.key_id !== undefined)
                    writer.writeUint32(2, this.key_id);
                if (this.sequence_number !== undefined)
                    writer.writeUint64(3, this.sequence_number);
                if (!w)
                    return writer.getResultBuffer();
            }
            static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ProposalKey {
                const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new ProposalKey();
                while (reader.nextField()) {
                    if (reader.isEndGroup())
                        break;
                    switch (reader.getFieldNumber()) {
                        case 1:
                            message.address = reader.readBytes();
                            break;
                        case 2:
                            message.key_id = reader.readUint32();
                            break;
                        case 3:
                            message.sequence_number = reader.readUint64();
                            break;
                        default: reader.skipField();
                    }
                }
                return message;
            }
        }
        export class Signature extends pb_1.Message {
            constructor(data?: any[] | {
                address?: Uint8Array;
                key_id?: number;
                signature?: Uint8Array;
            }) {
                super();
                pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
                if (!Array.isArray(data) && typeof data == "object") {
                    this.address = data.address;
                    this.key_id = data.key_id;
                    this.signature = data.signature;
                }
            }
            get address(): Uint8Array | undefined {
                return pb_1.Message.getFieldWithDefault(this, 1, undefined) as Uint8Array | undefined;
            }
            set address(value: Uint8Array) {
                pb_1.Message.setField(this, 1, value);
            }
            get key_id(): number | undefined {
                return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
            }
            set key_id(value: number) {
                pb_1.Message.setField(this, 2, value);
            }
            get signature(): Uint8Array | undefined {
                return pb_1.Message.getFieldWithDefault(this, 3, undefined) as Uint8Array | undefined;
            }
            set signature(value: Uint8Array) {
                pb_1.Message.setField(this, 3, value);
            }
            toObject() {
                return {
                    address: this.address,
                    key_id: this.key_id,
                    signature: this.signature
                };
            }
            serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
                const writer = w || new pb_1.BinaryWriter();
                if (this.address !== undefined)
                    writer.writeBytes(1, this.address);
                if (this.key_id !== undefined)
                    writer.writeUint32(2, this.key_id);
                if (this.signature !== undefined)
                    writer.writeBytes(3, this.signature);
                if (!w)
                    return writer.getResultBuffer();
            }
            static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Signature {
                const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Signature();
                while (reader.nextField()) {
                    if (reader.isEndGroup())
                        break;
                    switch (reader.getFieldNumber()) {
                        case 1:
                            message.address = reader.readBytes();
                            break;
                        case 2:
                            message.key_id = reader.readUint32();
                            break;
                        case 3:
                            message.signature = reader.readBytes();
                            break;
                        default: reader.skipField();
                    }
                }
                return message;
            }
        }
    }
    export enum TransactionStatus {
        UNKNOWN = 0,
        PENDING = 1,
        FINALIZED = 2,
        EXECUTED = 3,
        SEALED = 4
    }
}
