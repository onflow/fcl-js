import * as pb_1 from "google-protobuf";
export namespace entities {
    export class BlockSeal extends pb_1.Message {
        constructor(data?: any[] | {
            block_id?: Uint8Array;
            execution_receipt_id?: Uint8Array;
            execution_receipt_signatures?: Uint8Array[];
            result_approval_signatures?: Uint8Array[];
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [3, 4], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.block_id = data.block_id;
                this.execution_receipt_id = data.execution_receipt_id;
                this.execution_receipt_signatures = data.execution_receipt_signatures;
                this.result_approval_signatures = data.result_approval_signatures;
            }
        }
        get block_id(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as Uint8Array | undefined;
        }
        set block_id(value: Uint8Array) {
            pb_1.Message.setField(this, 1, value);
        }
        get execution_receipt_id(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as Uint8Array | undefined;
        }
        set execution_receipt_id(value: Uint8Array) {
            pb_1.Message.setField(this, 2, value);
        }
        get execution_receipt_signatures(): Uint8Array[] {
            return pb_1.Message.getField(this, 3) as Uint8Array[];
        }
        set execution_receipt_signatures(value: Uint8Array[]) {
            pb_1.Message.setField(this, 3, value);
        }
        get result_approval_signatures(): Uint8Array[] {
            return pb_1.Message.getField(this, 4) as Uint8Array[];
        }
        set result_approval_signatures(value: Uint8Array[]) {
            pb_1.Message.setField(this, 4, value);
        }
        toObject() {
            return {
                block_id: this.block_id,
                execution_receipt_id: this.execution_receipt_id,
                execution_receipt_signatures: this.execution_receipt_signatures,
                result_approval_signatures: this.result_approval_signatures
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.block_id !== undefined)
                writer.writeBytes(1, this.block_id);
            if (this.execution_receipt_id !== undefined)
                writer.writeBytes(2, this.execution_receipt_id);
            if (this.execution_receipt_signatures !== undefined)
                writer.writeRepeatedBytes(3, this.execution_receipt_signatures);
            if (this.result_approval_signatures !== undefined)
                writer.writeRepeatedBytes(4, this.result_approval_signatures);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BlockSeal {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new BlockSeal();
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
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
}
