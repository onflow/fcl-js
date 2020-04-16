import * as pb_1 from "google-protobuf";
import * as grpc_1 from "grpc";
export namespace access {
    export class PingRequest extends pb_1.Message {
        constructor(data?: any[] | {}) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") { }
        }
        toObject() {
            return {};
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PingRequest {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PingRequest();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class PingResponse extends pb_1.Message {
        constructor(data?: any[] | {}) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") { }
        }
        toObject() {
            return {};
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PingResponse {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new PingResponse();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class GetLatestBlockHeaderRequest extends pb_1.Message {
        constructor(data?: any[] | {
            is_sealed?: boolean;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.is_sealed = data.is_sealed;
            }
        }
        get is_sealed(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as boolean | undefined;
        }
        set is_sealed(value: boolean) {
            pb_1.Message.setField(this, 1, value);
        }
        toObject() {
            return {
                is_sealed: this.is_sealed
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.is_sealed !== undefined)
                writer.writeBool(1, this.is_sealed);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetLatestBlockHeaderRequest {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new GetLatestBlockHeaderRequest();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.is_sealed = reader.readBool();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class GetBlockHeaderByIDRequest extends pb_1.Message {
        constructor(data?: any[] | {
            id?: Uint8Array;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.id = data.id;
            }
        }
        get id(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as Uint8Array | undefined;
        }
        set id(value: Uint8Array) {
            pb_1.Message.setField(this, 1, value);
        }
        toObject() {
            return {
                id: this.id
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id !== undefined)
                writer.writeBytes(1, this.id);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetBlockHeaderByIDRequest {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new GetBlockHeaderByIDRequest();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readBytes();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class GetBlockHeaderByHeightRequest extends pb_1.Message {
        constructor(data?: any[] | {
            height?: number;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.height = data.height;
            }
        }
        get height(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set height(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        toObject() {
            return {
                height: this.height
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.height !== undefined)
                writer.writeUint64(1, this.height);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetBlockHeaderByHeightRequest {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new GetBlockHeaderByHeightRequest();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.height = reader.readUint64();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class BlockHeaderResponse extends pb_1.Message {
        constructor(data?: any[] | {
            block?: entities.BlockHeader;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.block = data.block;
            }
        }
        get block(): entities.BlockHeader | undefined {
            return pb_1.Message.getWrapperField(this, entities.BlockHeader, 1) as entities.BlockHeader | undefined;
        }
        set block(value: entities.BlockHeader) {
            pb_1.Message.setWrapperField(this, 1, value);
        }
        toObject() {
            return {
                block: this.block && this.block.toObject()
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.block !== undefined)
                writer.writeMessage(1, this.block, () => this.block.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BlockHeaderResponse {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new BlockHeaderResponse();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.block, () => message.block = entities.BlockHeader.deserialize(reader));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class GetLatestBlockRequest extends pb_1.Message {
        constructor(data?: any[] | {
            is_sealed?: boolean;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.is_sealed = data.is_sealed;
            }
        }
        get is_sealed(): boolean | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as boolean | undefined;
        }
        set is_sealed(value: boolean) {
            pb_1.Message.setField(this, 1, value);
        }
        toObject() {
            return {
                is_sealed: this.is_sealed
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.is_sealed !== undefined)
                writer.writeBool(1, this.is_sealed);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetLatestBlockRequest {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new GetLatestBlockRequest();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.is_sealed = reader.readBool();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class GetBlockByIDRequest extends pb_1.Message {
        constructor(data?: any[] | {
            id?: Uint8Array;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.id = data.id;
            }
        }
        get id(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as Uint8Array | undefined;
        }
        set id(value: Uint8Array) {
            pb_1.Message.setField(this, 1, value);
        }
        toObject() {
            return {
                id: this.id
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id !== undefined)
                writer.writeBytes(1, this.id);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetBlockByIDRequest {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new GetBlockByIDRequest();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readBytes();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class GetBlockByHeightRequest extends pb_1.Message {
        constructor(data?: any[] | {
            height?: number;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.height = data.height;
            }
        }
        get height(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set height(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        toObject() {
            return {
                height: this.height
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.height !== undefined)
                writer.writeUint64(1, this.height);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetBlockByHeightRequest {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new GetBlockByHeightRequest();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.height = reader.readUint64();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class BlockResponse extends pb_1.Message {
        constructor(data?: any[] | {
            block?: entities.Block;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.block = data.block;
            }
        }
        get block(): entities.Block | undefined {
            return pb_1.Message.getWrapperField(this, entities.Block, 1) as entities.Block | undefined;
        }
        set block(value: entities.Block) {
            pb_1.Message.setWrapperField(this, 1, value);
        }
        toObject() {
            return {
                block: this.block && this.block.toObject()
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.block !== undefined)
                writer.writeMessage(1, this.block, () => this.block.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BlockResponse {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new BlockResponse();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.block, () => message.block = entities.Block.deserialize(reader));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class GetCollectionByIDRequest extends pb_1.Message {
        constructor(data?: any[] | {
            id?: Uint8Array;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.id = data.id;
            }
        }
        get id(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as Uint8Array | undefined;
        }
        set id(value: Uint8Array) {
            pb_1.Message.setField(this, 1, value);
        }
        toObject() {
            return {
                id: this.id
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id !== undefined)
                writer.writeBytes(1, this.id);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetCollectionByIDRequest {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new GetCollectionByIDRequest();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readBytes();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class CollectionResponse extends pb_1.Message {
        constructor(data?: any[] | {
            collection?: entities.Collection;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.collection = data.collection;
            }
        }
        get collection(): entities.Collection | undefined {
            return pb_1.Message.getWrapperField(this, entities.Collection, 1) as entities.Collection | undefined;
        }
        set collection(value: entities.Collection) {
            pb_1.Message.setWrapperField(this, 1, value);
        }
        toObject() {
            return {
                collection: this.collection && this.collection.toObject()
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.collection !== undefined)
                writer.writeMessage(1, this.collection, () => this.collection.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): CollectionResponse {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new CollectionResponse();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.collection, () => message.collection = entities.Collection.deserialize(reader));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class SendTransactionRequest extends pb_1.Message {
        constructor(data?: any[] | {
            transaction?: entities.Transaction;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.transaction = data.transaction;
            }
        }
        get transaction(): entities.Transaction | undefined {
            return pb_1.Message.getWrapperField(this, entities.Transaction, 1) as entities.Transaction | undefined;
        }
        set transaction(value: entities.Transaction) {
            pb_1.Message.setWrapperField(this, 1, value);
        }
        toObject() {
            return {
                transaction: this.transaction && this.transaction.toObject()
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.transaction !== undefined)
                writer.writeMessage(1, this.transaction, () => this.transaction.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SendTransactionRequest {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new SendTransactionRequest();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.transaction, () => message.transaction = entities.Transaction.deserialize(reader));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class SendTransactionResponse extends pb_1.Message {
        constructor(data?: any[] | {
            id?: Uint8Array;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.id = data.id;
            }
        }
        get id(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as Uint8Array | undefined;
        }
        set id(value: Uint8Array) {
            pb_1.Message.setField(this, 1, value);
        }
        toObject() {
            return {
                id: this.id
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id !== undefined)
                writer.writeBytes(1, this.id);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): SendTransactionResponse {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new SendTransactionResponse();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readBytes();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class GetTransactionRequest extends pb_1.Message {
        constructor(data?: any[] | {
            id?: Uint8Array;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.id = data.id;
            }
        }
        get id(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as Uint8Array | undefined;
        }
        set id(value: Uint8Array) {
            pb_1.Message.setField(this, 1, value);
        }
        toObject() {
            return {
                id: this.id
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.id !== undefined)
                writer.writeBytes(1, this.id);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetTransactionRequest {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new GetTransactionRequest();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.id = reader.readBytes();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class TransactionResponse extends pb_1.Message {
        constructor(data?: any[] | {
            transaction?: entities.Transaction;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.transaction = data.transaction;
            }
        }
        get transaction(): entities.Transaction | undefined {
            return pb_1.Message.getWrapperField(this, entities.Transaction, 1) as entities.Transaction | undefined;
        }
        set transaction(value: entities.Transaction) {
            pb_1.Message.setWrapperField(this, 1, value);
        }
        toObject() {
            return {
                transaction: this.transaction && this.transaction.toObject()
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.transaction !== undefined)
                writer.writeMessage(1, this.transaction, () => this.transaction.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): TransactionResponse {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new TransactionResponse();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.transaction, () => message.transaction = entities.Transaction.deserialize(reader));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class TransactionResultResponse extends pb_1.Message {
        constructor(data?: any[] | {
            status?: entities.TransactionStatus;
            status_code?: number;
            error_message?: string;
            events?: entities.Event[];
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [4], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.status = data.status;
                this.status_code = data.status_code;
                this.error_message = data.error_message;
                this.events = data.events;
            }
        }
        get status(): entities.TransactionStatus | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as entities.TransactionStatus | undefined;
        }
        set status(value: entities.TransactionStatus) {
            pb_1.Message.setField(this, 1, value);
        }
        get status_code(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set status_code(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get error_message(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as string | undefined;
        }
        set error_message(value: string) {
            pb_1.Message.setField(this, 3, value);
        }
        get events(): entities.Event[] {
            return pb_1.Message.getRepeatedWrapperField(this, entities.Event, 4) as entities.Event[];
        }
        set events(value: entities.Event[]) {
            pb_1.Message.setRepeatedWrapperField(this, 4, value);
        }
        toObject() {
            return {
                status: this.status,
                status_code: this.status_code,
                error_message: this.error_message,
                events: this.events.map((item: entities.Event) => item.toObject())
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.status !== undefined)
                writer.writeEnum(1, this.status);
            if (this.status_code !== undefined)
                writer.writeUint32(2, this.status_code);
            if (this.error_message !== undefined)
                writer.writeString(3, this.error_message);
            if (this.events !== undefined)
                writer.writeRepeatedMessage(4, this.events, (item: entities.Event) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): TransactionResultResponse {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new TransactionResultResponse();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.status = reader.readEnum();
                        break;
                    case 2:
                        message.status_code = reader.readUint32();
                        break;
                    case 3:
                        message.error_message = reader.readString();
                        break;
                    case 4:
                        reader.readMessage(message.events, () => pb_1.Message.addToRepeatedWrapperField(message, 4, entities.Event.deserialize(reader), entities.Event));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class GetAccountRequest extends pb_1.Message {
        constructor(data?: any[] | {
            address?: Uint8Array;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.address = data.address;
            }
        }
        get address(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as Uint8Array | undefined;
        }
        set address(value: Uint8Array) {
            pb_1.Message.setField(this, 1, value);
        }
        toObject() {
            return {
                address: this.address
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.address !== undefined)
                writer.writeBytes(1, this.address);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetAccountRequest {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new GetAccountRequest();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.address = reader.readBytes();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class GetAccountResponse extends pb_1.Message {
        constructor(data?: any[] | {
            account?: entities.Account;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.account = data.account;
            }
        }
        get account(): entities.Account | undefined {
            return pb_1.Message.getWrapperField(this, entities.Account, 1) as entities.Account | undefined;
        }
        set account(value: entities.Account) {
            pb_1.Message.setWrapperField(this, 1, value);
        }
        toObject() {
            return {
                account: this.account && this.account.toObject()
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.account !== undefined)
                writer.writeMessage(1, this.account, () => this.account.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetAccountResponse {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new GetAccountResponse();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.account, () => message.account = entities.Account.deserialize(reader));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class ExecuteScriptAtLatestBlockRequest extends pb_1.Message {
        constructor(data?: any[] | {
            script?: Uint8Array;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.script = data.script;
            }
        }
        get script(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as Uint8Array | undefined;
        }
        set script(value: Uint8Array) {
            pb_1.Message.setField(this, 1, value);
        }
        toObject() {
            return {
                script: this.script
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.script !== undefined)
                writer.writeBytes(1, this.script);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ExecuteScriptAtLatestBlockRequest {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new ExecuteScriptAtLatestBlockRequest();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.script = reader.readBytes();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class ExecuteScriptAtBlockIDRequest extends pb_1.Message {
        constructor(data?: any[] | {
            block_id?: Uint8Array;
            script?: Uint8Array;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.block_id = data.block_id;
                this.script = data.script;
            }
        }
        get block_id(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as Uint8Array | undefined;
        }
        set block_id(value: Uint8Array) {
            pb_1.Message.setField(this, 1, value);
        }
        get script(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as Uint8Array | undefined;
        }
        set script(value: Uint8Array) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                block_id: this.block_id,
                script: this.script
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.block_id !== undefined)
                writer.writeBytes(1, this.block_id);
            if (this.script !== undefined)
                writer.writeBytes(2, this.script);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ExecuteScriptAtBlockIDRequest {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new ExecuteScriptAtBlockIDRequest();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.block_id = reader.readBytes();
                        break;
                    case 2:
                        message.script = reader.readBytes();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class ExecuteScriptAtBlockHeightRequest extends pb_1.Message {
        constructor(data?: any[] | {
            block_height?: number;
            script?: Uint8Array;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.block_height = data.block_height;
                this.script = data.script;
            }
        }
        get block_height(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as number | undefined;
        }
        set block_height(value: number) {
            pb_1.Message.setField(this, 1, value);
        }
        get script(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as Uint8Array | undefined;
        }
        set script(value: Uint8Array) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                block_height: this.block_height,
                script: this.script
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.block_height !== undefined)
                writer.writeUint64(1, this.block_height);
            if (this.script !== undefined)
                writer.writeBytes(2, this.script);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ExecuteScriptAtBlockHeightRequest {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new ExecuteScriptAtBlockHeightRequest();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.block_height = reader.readUint64();
                        break;
                    case 2:
                        message.script = reader.readBytes();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class ExecuteScriptResponse extends pb_1.Message {
        constructor(data?: any[] | {
            value?: Uint8Array;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.value = data.value;
            }
        }
        get value(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as Uint8Array | undefined;
        }
        set value(value: Uint8Array) {
            pb_1.Message.setField(this, 1, value);
        }
        toObject() {
            return {
                value: this.value
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.value !== undefined)
                writer.writeBytes(1, this.value);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ExecuteScriptResponse {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new ExecuteScriptResponse();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.value = reader.readBytes();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class GetEventsForHeightRangeRequest extends pb_1.Message {
        constructor(data?: any[] | {
            type?: string;
            start_height?: number;
            end_height?: number;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.type = data.type;
                this.start_height = data.start_height;
                this.end_height = data.end_height;
            }
        }
        get type(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set type(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get start_height(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
        }
        set start_height(value: number) {
            pb_1.Message.setField(this, 2, value);
        }
        get end_height(): number | undefined {
            return pb_1.Message.getFieldWithDefault(this, 3, undefined) as number | undefined;
        }
        set end_height(value: number) {
            pb_1.Message.setField(this, 3, value);
        }
        toObject() {
            return {
                type: this.type,
                start_height: this.start_height,
                end_height: this.end_height
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.type !== undefined)
                writer.writeString(1, this.type);
            if (this.start_height !== undefined)
                writer.writeUint64(2, this.start_height);
            if (this.end_height !== undefined)
                writer.writeUint64(3, this.end_height);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetEventsForHeightRangeRequest {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new GetEventsForHeightRangeRequest();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.type = reader.readString();
                        break;
                    case 2:
                        message.start_height = reader.readUint64();
                        break;
                    case 3:
                        message.end_height = reader.readUint64();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class GetEventsForBlockIDsRequest extends pb_1.Message {
        constructor(data?: any[] | {
            type?: string;
            block_ids?: Uint8Array[];
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [2], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.type = data.type;
                this.block_ids = data.block_ids;
            }
        }
        get type(): string | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as string | undefined;
        }
        set type(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get block_ids(): Uint8Array[] {
            return pb_1.Message.getField(this, 2) as Uint8Array[];
        }
        set block_ids(value: Uint8Array[]) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                type: this.type,
                block_ids: this.block_ids
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.type !== undefined)
                writer.writeString(1, this.type);
            if (this.block_ids !== undefined)
                writer.writeRepeatedBytes(2, this.block_ids);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetEventsForBlockIDsRequest {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new GetEventsForBlockIDsRequest();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.type = reader.readString();
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
    export class EventsResponse extends pb_1.Message {
        constructor(data?: any[] | {
            results?: EventsResponse.Result[];
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [1], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.results = data.results;
            }
        }
        get results(): EventsResponse.Result[] {
            return pb_1.Message.getRepeatedWrapperField(this, EventsResponse.Result, 1) as EventsResponse.Result[];
        }
        set results(value: EventsResponse.Result[]) {
            pb_1.Message.setRepeatedWrapperField(this, 1, value);
        }
        toObject() {
            return {
                results: this.results.map((item: EventsResponse.Result) => item.toObject())
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.results !== undefined)
                writer.writeRepeatedMessage(1, this.results, (item: EventsResponse.Result) => item.serialize(writer));
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): EventsResponse {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new EventsResponse();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        reader.readMessage(message.results, () => pb_1.Message.addToRepeatedWrapperField(message, 1, EventsResponse.Result.deserialize(reader), EventsResponse.Result));
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export namespace EventsResponse {
        export class Result extends pb_1.Message {
            constructor(data?: any[] | {
                block_id?: Uint8Array;
                block_height?: number;
                events?: entities.Event[];
            }) {
                super();
                pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [3], null);
                if (!Array.isArray(data) && typeof data == "object") {
                    this.block_id = data.block_id;
                    this.block_height = data.block_height;
                    this.events = data.events;
                }
            }
            get block_id(): Uint8Array | undefined {
                return pb_1.Message.getFieldWithDefault(this, 1, undefined) as Uint8Array | undefined;
            }
            set block_id(value: Uint8Array) {
                pb_1.Message.setField(this, 1, value);
            }
            get block_height(): number | undefined {
                return pb_1.Message.getFieldWithDefault(this, 2, undefined) as number | undefined;
            }
            set block_height(value: number) {
                pb_1.Message.setField(this, 2, value);
            }
            get events(): entities.Event[] {
                return pb_1.Message.getRepeatedWrapperField(this, entities.Event, 3) as entities.Event[];
            }
            set events(value: entities.Event[]) {
                pb_1.Message.setRepeatedWrapperField(this, 3, value);
            }
            toObject() {
                return {
                    block_id: this.block_id,
                    block_height: this.block_height,
                    events: this.events.map((item: entities.Event) => item.toObject())
                };
            }
            serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
                const writer = w || new pb_1.BinaryWriter();
                if (this.block_id !== undefined)
                    writer.writeBytes(1, this.block_id);
                if (this.block_height !== undefined)
                    writer.writeUint64(2, this.block_height);
                if (this.events !== undefined)
                    writer.writeRepeatedMessage(3, this.events, (item: entities.Event) => item.serialize(writer));
                if (!w)
                    return writer.getResultBuffer();
            }
            static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Result {
                const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new Result();
                while (reader.nextField()) {
                    if (reader.isEndGroup())
                        break;
                    switch (reader.getFieldNumber()) {
                        case 1:
                            message.block_id = reader.readBytes();
                            break;
                        case 2:
                            message.block_height = reader.readUint64();
                            break;
                        case 3:
                            reader.readMessage(message.events, () => pb_1.Message.addToRepeatedWrapperField(message, 3, entities.Event.deserialize(reader), entities.Event));
                            break;
                        default: reader.skipField();
                    }
                }
                return message;
            }
        }
    }
    export var AccessAPI = {
        Ping: {
            path: "/access.AccessAPI/Ping",
            requestStream: false,
            responseStream: false,
            requestType: access.PingRequest,
            responseType: access.PingResponse,
            requestSerialize: (message: PingRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => PingRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: PingResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => PingResponse.deserialize(new Uint8Array(bytes))
        },
        GetLatestBlockHeader: {
            path: "/access.AccessAPI/GetLatestBlockHeader",
            requestStream: false,
            responseStream: false,
            requestType: access.GetLatestBlockHeaderRequest,
            responseType: access.BlockHeaderResponse,
            requestSerialize: (message: GetLatestBlockHeaderRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => GetLatestBlockHeaderRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: BlockHeaderResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => BlockHeaderResponse.deserialize(new Uint8Array(bytes))
        },
        GetBlockHeaderByID: {
            path: "/access.AccessAPI/GetBlockHeaderByID",
            requestStream: false,
            responseStream: false,
            requestType: access.GetBlockHeaderByIDRequest,
            responseType: access.BlockHeaderResponse,
            requestSerialize: (message: GetBlockHeaderByIDRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => GetBlockHeaderByIDRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: BlockHeaderResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => BlockHeaderResponse.deserialize(new Uint8Array(bytes))
        },
        GetBlockHeaderByHeight: {
            path: "/access.AccessAPI/GetBlockHeaderByHeight",
            requestStream: false,
            responseStream: false,
            requestType: access.GetBlockHeaderByHeightRequest,
            responseType: access.BlockHeaderResponse,
            requestSerialize: (message: GetBlockHeaderByHeightRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => GetBlockHeaderByHeightRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: BlockHeaderResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => BlockHeaderResponse.deserialize(new Uint8Array(bytes))
        },
        GetLatestBlock: {
            path: "/access.AccessAPI/GetLatestBlock",
            requestStream: false,
            responseStream: false,
            requestType: access.GetLatestBlockRequest,
            responseType: access.BlockResponse,
            requestSerialize: (message: GetLatestBlockRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => GetLatestBlockRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: BlockResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => BlockResponse.deserialize(new Uint8Array(bytes))
        },
        GetBlockByID: {
            path: "/access.AccessAPI/GetBlockByID",
            requestStream: false,
            responseStream: false,
            requestType: access.GetBlockByIDRequest,
            responseType: access.BlockResponse,
            requestSerialize: (message: GetBlockByIDRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => GetBlockByIDRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: BlockResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => BlockResponse.deserialize(new Uint8Array(bytes))
        },
        GetBlockByHeight: {
            path: "/access.AccessAPI/GetBlockByHeight",
            requestStream: false,
            responseStream: false,
            requestType: access.GetBlockByHeightRequest,
            responseType: access.BlockResponse,
            requestSerialize: (message: GetBlockByHeightRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => GetBlockByHeightRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: BlockResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => BlockResponse.deserialize(new Uint8Array(bytes))
        },
        GetCollectionByID: {
            path: "/access.AccessAPI/GetCollectionByID",
            requestStream: false,
            responseStream: false,
            requestType: access.GetCollectionByIDRequest,
            responseType: access.CollectionResponse,
            requestSerialize: (message: GetCollectionByIDRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => GetCollectionByIDRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: CollectionResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => CollectionResponse.deserialize(new Uint8Array(bytes))
        },
        SendTransaction: {
            path: "/access.AccessAPI/SendTransaction",
            requestStream: false,
            responseStream: false,
            requestType: access.SendTransactionRequest,
            responseType: access.SendTransactionResponse,
            requestSerialize: (message: SendTransactionRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => SendTransactionRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: SendTransactionResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => SendTransactionResponse.deserialize(new Uint8Array(bytes))
        },
        GetTransaction: {
            path: "/access.AccessAPI/GetTransaction",
            requestStream: false,
            responseStream: false,
            requestType: access.GetTransactionRequest,
            responseType: access.TransactionResponse,
            requestSerialize: (message: GetTransactionRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => GetTransactionRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: TransactionResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => TransactionResponse.deserialize(new Uint8Array(bytes))
        },
        GetTransactionResult: {
            path: "/access.AccessAPI/GetTransactionResult",
            requestStream: false,
            responseStream: false,
            requestType: access.GetTransactionRequest,
            responseType: access.TransactionResultResponse,
            requestSerialize: (message: GetTransactionRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => GetTransactionRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: TransactionResultResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => TransactionResultResponse.deserialize(new Uint8Array(bytes))
        },
        GetAccount: {
            path: "/access.AccessAPI/GetAccount",
            requestStream: false,
            responseStream: false,
            requestType: access.GetAccountRequest,
            responseType: access.GetAccountResponse,
            requestSerialize: (message: GetAccountRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => GetAccountRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: GetAccountResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => GetAccountResponse.deserialize(new Uint8Array(bytes))
        },
        ExecuteScriptAtLatestBlock: {
            path: "/access.AccessAPI/ExecuteScriptAtLatestBlock",
            requestStream: false,
            responseStream: false,
            requestType: access.ExecuteScriptAtLatestBlockRequest,
            responseType: access.ExecuteScriptResponse,
            requestSerialize: (message: ExecuteScriptAtLatestBlockRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => ExecuteScriptAtLatestBlockRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: ExecuteScriptResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => ExecuteScriptResponse.deserialize(new Uint8Array(bytes))
        },
        ExecuteScriptAtBlockID: {
            path: "/access.AccessAPI/ExecuteScriptAtBlockID",
            requestStream: false,
            responseStream: false,
            requestType: access.ExecuteScriptAtBlockIDRequest,
            responseType: access.ExecuteScriptResponse,
            requestSerialize: (message: ExecuteScriptAtBlockIDRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => ExecuteScriptAtBlockIDRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: ExecuteScriptResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => ExecuteScriptResponse.deserialize(new Uint8Array(bytes))
        },
        ExecuteScriptAtBlockHeight: {
            path: "/access.AccessAPI/ExecuteScriptAtBlockHeight",
            requestStream: false,
            responseStream: false,
            requestType: access.ExecuteScriptAtBlockHeightRequest,
            responseType: access.ExecuteScriptResponse,
            requestSerialize: (message: ExecuteScriptAtBlockHeightRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => ExecuteScriptAtBlockHeightRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: ExecuteScriptResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => ExecuteScriptResponse.deserialize(new Uint8Array(bytes))
        },
        GetEventsForHeightRange: {
            path: "/access.AccessAPI/GetEventsForHeightRange",
            requestStream: false,
            responseStream: false,
            requestType: access.GetEventsForHeightRangeRequest,
            responseType: access.EventsResponse,
            requestSerialize: (message: GetEventsForHeightRangeRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => GetEventsForHeightRangeRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: EventsResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => EventsResponse.deserialize(new Uint8Array(bytes))
        },
        GetEventsForBlockIDs: {
            path: "/access.AccessAPI/GetEventsForBlockIDs",
            requestStream: false,
            responseStream: false,
            requestType: access.GetEventsForBlockIDsRequest,
            responseType: access.EventsResponse,
            requestSerialize: (message: GetEventsForBlockIDsRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => GetEventsForBlockIDsRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: EventsResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => EventsResponse.deserialize(new Uint8Array(bytes))
        }
    };
    export class AccessAPIClient extends grpc_1.makeGenericClientConstructor(AccessAPI, "AccessAPI", {}) {
        constructor(address: string, credentials: grpc_1.ChannelCredentials) {
            super(address, credentials)
        }
    }
}
