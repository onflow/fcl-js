import { TransactionStatus } from "@onflow/typedefs";

export class TransactionError<T extends number> extends Error {
    constructor(
        public message: string,
        public code?: T,
        public name: string = "TransactionError"
    ) {
        super(message);
    }

    static fromErrorMessage(message: string) {  
        return new TransactionError(message);
    }

    static fromStatus(status: TransactionStatus): TransactionError<number> | null {
        if (!status.errorMessage) return null;
        return TransactionError.fromErrorMessage(status.errorMessage);
    }
}

export class TransactionRejectedError extends TransactionError<403> {
    constructor(message: string) {
        super(message, 403, "TransactionRejectedError");
    }

    static fromErrorMessage(message: string) {
        return new TransactionRejectedError(message);
    }
}