import * as pb_1 from "google-protobuf";
export namespace entities {
    export class BlockHeader extends pb_1.Message {
        constructor(data?: any[] | {
            id?: Uint8Array;
            parent_id?: Uint8Array;
            height?: number;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.id = data.id;
                this.parent_id = data.parent_id;
                this.height = data.height;
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
        toObject() {
            return {
                id: this.id,
                parent_id: this.parent_id,
                height: this.height
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
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BlockHeader {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new BlockHeader();
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
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
}
