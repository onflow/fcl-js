import * as pb_1 from "google-protobuf";
import * as grpc_1 from "grpc";
export namespace execution {
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
    export class GetAccountAtBlockIDRequest extends pb_1.Message {
        constructor(data?: any[] | {
            block_id?: Uint8Array;
            address?: Uint8Array;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.block_id = data.block_id;
                this.address = data.address;
            }
        }
        get block_id(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as Uint8Array | undefined;
        }
        set block_id(value: Uint8Array) {
            pb_1.Message.setField(this, 1, value);
        }
        get address(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as Uint8Array | undefined;
        }
        set address(value: Uint8Array) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                block_id: this.block_id,
                address: this.address
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.block_id !== undefined)
                writer.writeBytes(1, this.block_id);
            if (this.address !== undefined)
                writer.writeBytes(2, this.address);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetAccountAtBlockIDRequest {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new GetAccountAtBlockIDRequest();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.block_id = reader.readBytes();
                        break;
                    case 2:
                        message.address = reader.readBytes();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export class GetAccountAtBlockIDResponse extends pb_1.Message {
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
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetAccountAtBlockIDResponse {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new GetAccountAtBlockIDResponse();
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
    export class GetEventsForBlockIDTransactionIDRequest extends pb_1.Message {
        constructor(data?: any[] | {
            block_id?: Uint8Array;
            transaction_id?: Uint8Array;
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) && data, 0, -1, [], null);
            if (!Array.isArray(data) && typeof data == "object") {
                this.block_id = data.block_id;
                this.transaction_id = data.transaction_id;
            }
        }
        get block_id(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 1, undefined) as Uint8Array | undefined;
        }
        set block_id(value: Uint8Array) {
            pb_1.Message.setField(this, 1, value);
        }
        get transaction_id(): Uint8Array | undefined {
            return pb_1.Message.getFieldWithDefault(this, 2, undefined) as Uint8Array | undefined;
        }
        set transaction_id(value: Uint8Array) {
            pb_1.Message.setField(this, 2, value);
        }
        toObject() {
            return {
                block_id: this.block_id,
                transaction_id: this.transaction_id
            };
        }
        serialize(w?: pb_1.BinaryWriter): Uint8Array | undefined {
            const writer = w || new pb_1.BinaryWriter();
            if (this.block_id !== undefined)
                writer.writeBytes(1, this.block_id);
            if (this.transaction_id !== undefined)
                writer.writeBytes(2, this.transaction_id);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): GetEventsForBlockIDTransactionIDRequest {
            const reader = bytes instanceof Uint8Array ? new pb_1.BinaryReader(bytes) : bytes, message = new GetEventsForBlockIDTransactionIDRequest();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.block_id = reader.readBytes();
                        break;
                    case 2:
                        message.transaction_id = reader.readBytes();
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
    }
    export var ExecutionAPI = {
        Ping: {
            path: "/execution.ExecutionAPI/Ping",
            requestStream: false,
            responseStream: false,
            requestType: execution.PingRequest,
            responseType: execution.PingResponse,
            requestSerialize: (message: PingRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => PingRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: PingResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => PingResponse.deserialize(new Uint8Array(bytes))
        },
        GetAccountAtBlockID: {
            path: "/execution.ExecutionAPI/GetAccountAtBlockID",
            requestStream: false,
            responseStream: false,
            requestType: execution.GetAccountAtBlockIDRequest,
            responseType: execution.GetAccountAtBlockIDResponse,
            requestSerialize: (message: GetAccountAtBlockIDRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => GetAccountAtBlockIDRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: GetAccountAtBlockIDResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => GetAccountAtBlockIDResponse.deserialize(new Uint8Array(bytes))
        },
        ExecuteScriptAtBlockID: {
            path: "/execution.ExecutionAPI/ExecuteScriptAtBlockID",
            requestStream: false,
            responseStream: false,
            requestType: execution.ExecuteScriptAtBlockIDRequest,
            responseType: execution.ExecuteScriptResponse,
            requestSerialize: (message: ExecuteScriptAtBlockIDRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => ExecuteScriptAtBlockIDRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: ExecuteScriptResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => ExecuteScriptResponse.deserialize(new Uint8Array(bytes))
        },
        GetEventsForBlockIDs: {
            path: "/execution.ExecutionAPI/GetEventsForBlockIDs",
            requestStream: false,
            responseStream: false,
            requestType: execution.GetEventsForBlockIDsRequest,
            responseType: execution.EventsResponse,
            requestSerialize: (message: GetEventsForBlockIDsRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => GetEventsForBlockIDsRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: EventsResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => EventsResponse.deserialize(new Uint8Array(bytes))
        },
        GetEventsForBlockIDTransactionID: {
            path: "/execution.ExecutionAPI/GetEventsForBlockIDTransactionID",
            requestStream: false,
            responseStream: false,
            requestType: execution.GetEventsForBlockIDTransactionIDRequest,
            responseType: execution.EventsResponse,
            requestSerialize: (message: GetEventsForBlockIDTransactionIDRequest) => Buffer.from(message.serialize()),
            requestDeserialize: (bytes: Buffer) => GetEventsForBlockIDTransactionIDRequest.deserialize(new Uint8Array(bytes)),
            responseSerialize: (message: EventsResponse) => Buffer.from(message.serialize()),
            responseDeserialize: (bytes: Buffer) => EventsResponse.deserialize(new Uint8Array(bytes))
        }
    };
    export class ExecutionAPIClient extends grpc_1.makeGenericClientConstructor(ExecutionAPI, "ExecutionAPI", {}) {
        constructor(address: string, credentials: grpc_1.ChannelCredentials) {
            super(address, credentials)
        }
    }
}
