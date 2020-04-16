import * as pb_1 from "google-protobuf";
export namespace entities {
    export class Event extends pb_1.Message {
        constructor(data?: any[] | {
            type?: string;
            transaction_id?: Uint8Array;
            transaction_index?: number;
            event_index?: number;
            payload?: Uint8Array;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.type = data.type;
                this.transaction_id = data.transaction_id;
                this.transaction_index = data.transaction_index;
                this.event_index = data.event_index;
                this.payload = data.payload;
            }
        }
        get type(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set type(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get transaction_id(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as Uint8Array | undefined;
        }
        set transaction_id(value: Uint8Array) {
            pb_1.Message.setField(this, 2, value);
        }
        get transaction_index(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set transaction_index(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get event_index(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set event_index(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        get payload(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as Uint8Array | undefined;
        }
        set payload(value: Uint8Array) {
            pb_1.Message.setField(this, 5, value);
        }
        toObject() {
            return {
                type: this.type,
                transaction_id: this.transaction_id,
                transaction_index: this.transaction_index,
                event_index: this.event_index,
                payload: this.payload
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.type !== undefined)
                writer.writeString(1, this.type);
            if (this.transaction_id !== undefined)
                writer.writeBytes(2, this.transaction_id);
            if (this.transaction_index !== undefined)
                writer.writeUint32(3, this.transaction_index);
            if (this.event_index !== undefined)
                writer.writeUint32(4, this.event_index);
            if (this.payload !== undefined)
                writer.writeBytes(5, this.payload);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Event {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Event();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.type = reader.readString();
                        break;
                    case 2:
                        message.transaction_id = reader.readBytes();
                        break;
                    case 3:
                        message.transaction_index = reader.readUint32();
                        break;
                    case 4:
                        message.event_index = reader.readUint32();
                        break;
                    case 5:
                        message.payload = reader.readBytes();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
}
