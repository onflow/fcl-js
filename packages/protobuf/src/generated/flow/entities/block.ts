import * as pb_1 from "google-protobuf";
export namespace entities {
    export class Block extends pb_1.Message {
        constructor(data?: any[] | {
            id?: Uint8Array;
            parent_id?: Uint8Array;
            height?: number;
            timestamp?: google.protobuf.Timestamp;
            collection_guarantees?: CollectionGuarantee[];
            block_seals?: BlockSeal[];
            signatures?: Uint8Array[];
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [5, 6, 7], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.id = data.id;
                this.parent_id = data.parent_id;
                this.height = data.height;
                this.timestamp = data.timestamp;
                this.collection_guarantees = data.collection_guarantees;
                this.block_seals = data.block_seals;
                this.signatures = data.signatures;
            }
        }
        get id(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as Uint8Array | undefined;
        }
        set id(value: Uint8Array) {
            pb_1.Message.setField(this, 1, value);
        }
        get parent_id(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as Uint8Array | undefined;
        }
        set parent_id(value: Uint8Array) {
            pb_1.Message.setField(this, 2, value);
        }
        get height(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set height(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get timestamp(): google.protobuf.Timestamp | undefined {
            return pb_1.Message.getWrapperField(this, google.protobuf.Timestamp, 4) as google.protobuf.Timestamp | undefined;
        }
        set timestamp(value: google.protobuf.Timestamp) {
            pb_1.Message.setWrapperField(this, 4, value);
        }
        get collection_guarantees(): CollectionGuarantee[] {
            return pb_1.Message.getRepeatedWrapperField(this, CollectionGuarantee, 5) as CollectionGuarantee[];
        }
        set collection_guarantees(value: CollectionGuarantee[]) {
            pb_1.Message.setRepeatedWrapperField(this, 5, value);
        }
        get block_seals(): BlockSeal[] {
            return pb_1.Message.getRepeatedWrapperField(this, BlockSeal, 6) as BlockSeal[];
        }
        set block_seals(value: BlockSeal[]) {
            pb_1.Message.setRepeatedWrapperField(this, 6, value);
        }
        get signatures(): Uint8Array[] {
            return pb_1.Message.getField(this, 7) as Uint8Array[];
        }
        set signatures(value: Uint8Array[]) {
            pb_1.Message.setField(this, 7, value);
        }
        toObject() {
            return {
                id: this.id,
                parent_id: this.parent_id,
                height: this.height,
                timestamp: this.timestamp && this.timestamp.toObject(),
                collection_guarantees: this.collection_guarantees.map((item: CollectionGuarantee) => item.toObject()),
                block_seals: this.block_seals.map((item: BlockSeal) => item.toObject()),
                signatures: this.signatures
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id !== undefined)
                writer.writeBytes(1, this.id);
            if (this.parent_id !== undefined)
                writer.writeBytes(2, this.parent_id);
            if (this.height !== undefined)
                writer.writeUint64(3, this.height);
            if (this.timestamp !== undefined)
                writer.writeMessage(4, this.timestamp, () => this.timestamp.serialize(writer));
            if (this.collection_guarantees !== undefined)
                writer.writeRepeatedMessage(5, this.collection_guarantees, (item: CollectionGuarantee) => item.serialize(writer));
            if (this.block_seals !== undefined)
                writer.writeRepeatedMessage(6, this.block_seals, (item: BlockSeal) => item.serialize(writer));
            if (this.signatures !== undefined)
                writer.writeRepeatedBytes(7, this.signatures);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Block {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Block();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readBytes();
                        break;
                    case 2:
                        message.parent_id = reader.readBytes();
                        break;
                    case 3:
                        message.height = reader.readUint64();
                        break;
                    case 4:
                        reader.readMessage(message.timestamp, () => message.timestamp = google.protobuf.Timestamp.deserialize(reader));
                        break;
                    case 5:
                        reader.readMessage(message.collection_guarantees, () => pb_1.Message.addToRepeatedWrapperField(message, 5, CollectionGuarantee.deserialize(reader), CollectionGuarantee));
                        break;
                    case 6:
                        reader.readMessage(message.block_seals, () => pb_1.Message.addToRepeatedWrapperField(message, 6, BlockSeal.deserialize(reader), BlockSeal));
                        break;
                    case 7:
                        pb_1.Message.addToRepeatedField(message, 7, reader.readBytes());
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
}
