import * as pb_1 from "google-protobuf";
export namespace entities {
    export class Collection extends pb_1.Message {
        constructor(data?: any[] | {
            id?: Uint8Array;
            transaction_ids?: Uint8Array[];
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [2], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.id = data.id;
                this.transaction_ids = data.transaction_ids;
            }
        }
        get id(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as Uint8Array | undefined;
        }
        set id(value: Uint8Array) {
            pb_1.Message.setField(this, 1, value);
        }
        get transaction_ids(): Uint8Array[] {
            return pb_1.Message.getField(this, 2) as Uint8Array[];
        }
        set transaction_ids(value: Uint8Array[]) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                id: this.id,
                transaction_ids: this.transaction_ids
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id !== undefined)
                writer.writeBytes(1, this.id);
            if (this.transaction_ids !== undefined)
                writer.writeRepeatedBytes(2, this.transaction_ids);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Collection {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Collection();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readBytes();
                        break;
                    case 2:
                        pb_1.Message.addToRepeatedField(message, 2, reader.readBytes());
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class CollectionGuarantee extends pb_1.Message {
        constructor(data?: any[] | {
            collection_id?: Uint8Array;
            signatures?: Uint8Array[];
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [2], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.collection_id = data.collection_id;
                this.signatures = data.signatures;
            }
        }
        get collection_id(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as Uint8Array | undefined;
        }
        set collection_id(value: Uint8Array) {
            pb_1.Message.setField(this, 1, value);
        }
        get signatures(): Uint8Array[] {
            return pb_1.Message.getField(this, 2) as Uint8Array[];
        }
        set signatures(value: Uint8Array[]) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                collection_id: this.collection_id,
                signatures: this.signatures
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.collection_id !== undefined)
                writer.writeBytes(1, this.collection_id);
            if (this.signatures !== undefined)
                writer.writeRepeatedBytes(2, this.signatures);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): CollectionGuarantee {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new CollectionGuarantee();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.collection_id = reader.readBytes();
                        break;
                    case 2:
                        pb_1.Message.addToRepeatedField(message, 2, reader.readBytes());
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
}
