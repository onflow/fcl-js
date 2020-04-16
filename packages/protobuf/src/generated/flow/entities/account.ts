import * as pb_1 from "google-protobuf";
export namespace entities {
    export class Account extends pb_1.Message {
        constructor(data?: any[] | {
            address?: Uint8Array;
            balance?: number;
            code?: Uint8Array;
            keys?: AccountKey[];
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [4], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.address = data.address;
                this.balance = data.balance;
                this.code = data.code;
                this.keys = data.keys;
            }
        }
        get address(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as Uint8Array | undefined;
        }
        set address(value: Uint8Array) {
            pb_1.Message.setField(this, 1, value);
        }
        get balance(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set balance(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get code(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as Uint8Array | undefined;
        }
        set code(value: Uint8Array) {
            pb_1.Message.setField(this, 3, value);
        }
        get keys(): AccountKey[] {
            return pb_1.Message.getRepeatedWrapperField(this, AccountKey, 4) as AccountKey[];
        }
        set keys(value: AccountKey[]) {
            pb_1.Message.setRepeatedWrapperField(this, 4, value);
        }
        toObject() {
            return {
                address: this.address,
                balance: this.balance,
                code: this.code,
                keys: this.keys.map((item: AccountKey) => item.toObject())
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.address !== undefined)
                writer.writeBytes(1, this.address);
            if (this.balance !== undefined)
                writer.writeUint64(2, this.balance);
            if (this.code !== undefined)
                writer.writeBytes(3, this.code);
            if (this.keys !== undefined)
                writer.writeRepeatedMessage(4, this.keys, (item: AccountKey) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Account {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Account();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.address = reader.readBytes();
                        break;
                    case 2:
                        message.balance = reader.readUint64();
                        break;
                    case 3:
                        message.code = reader.readBytes();
                        break;
                    case 4:
                        reader.readMessage(message.keys, () => pb_1.Message.addToRepeatedWrapperField(message, 4, AccountKey.deserialize(reader), AccountKey));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class AccountKey extends pb_1.Message {
        constructor(data?: any[] | {
            index?: number;
            public_key?: Uint8Array;
            sign_algo?: number;
            hash_algo?: number;
            weight?: number;
            sequence_number?: number;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.index = data.index;
                this.public_key = data.public_key;
                this.sign_algo = data.sign_algo;
                this.hash_algo = data.hash_algo;
                this.weight = data.weight;
                this.sequence_number = data.sequence_number;
            }
        }
        get index(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set index(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get public_key(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as Uint8Array | undefined;
        }
        set public_key(value: Uint8Array) {
            pb_1.Message.setField(this, 2, value);
        }
        get sign_algo(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set sign_algo(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        get hash_algo(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 4, undefined) as number | undefined;
        }
        set hash_algo(value: number) {
            pb_1.Message.setField(this, 4, value);
        }
        get weight(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 5, undefined) as number | undefined;
        }
        set weight(value: number) {
            pb_1.Message.setField(this, 5, value);
        }
        get sequence_number(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 6, undefined) as number | undefined;
        }
        set sequence_number(value: number) {
            pb_1.Message.setField(this, 6, value);
        }
        toObject() {
            return {
                index: this.index,
                public_key: this.public_key,
                sign_algo: this.sign_algo,
                hash_algo: this.hash_algo,
                weight: this.weight,
                sequence_number: this.sequence_number
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.index !== undefined)
                writer.writeUint32(1, this.index);
            if (this.public_key !== undefined)
                writer.writeBytes(2, this.public_key);
            if (this.sign_algo !== undefined)
                writer.writeUint32(3, this.sign_algo);
            if (this.hash_algo !== undefined)
                writer.writeUint32(4, this.hash_algo);
            if (this.weight !== undefined)
                writer.writeUint32(5, this.weight);
            if (this.sequence_number !== undefined)
                writer.writeUint32(6, this.sequence_number);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): AccountKey {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new AccountKey();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.index = reader.readUint32();
                        break;
                    case 2:
                        message.public_key = reader.readBytes();
                        break;
                    case 3:
                        message.sign_algo = reader.readUint32();
                        break;
                    case 4:
                        message.hash_algo = reader.readUint32();
                        break;
                    case 5:
                        message.weight = reader.readUint32();
                        break;
                    case 6:
                        message.sequence_number = reader.readUint32();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
}
