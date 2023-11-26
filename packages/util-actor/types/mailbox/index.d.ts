export interface IMailbox<T> {
    deliver(msg: T): Promise<void>;
    receive(): Promise<T>;
}
export declare const mailbox: <T>() => IMailbox<T>;
