import * as pb_1 from "google-protobuf";
export namespace google.protobuf {
    export class Timestamp extends pb_1.Message {
        constructor(data?: any[] | {
            seconds?: number;
            nanos?: number;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.seconds = data.seconds;
                this.nanos = data.nanos;
            }
        }
        get seconds(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set seconds(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get nanos(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set nanos(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                seconds: this.seconds,
                nanos: this.nanos
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.seconds !== undefined)
                writer.writeInt64(1, this.seconds);
            if (this.nanos !== undefined)
                writer.writeInt32(2, this.nanos);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Timestamp {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Timestamp();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.seconds = reader.readInt64();
                        break;
                    case 2:
                        message.nanos = reader.readInt32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
}
