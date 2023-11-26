/// <reference types="node" />
import { Buffer } from "buffer";
export { Buffer };
type EncodeInput = Buffer | string | number | Uint8Array | null | undefined | EncodeInput[];
/**
 * Built on top of rlp library, removing the BN dependency for the flow.
 * Package : https://github.com/ethereumjs/rlp
 * RLP License : https://github.com/ethereumjs/rlp/blob/master/LICENSE
 *
 * ethereumjs/rlp is licensed under the
 * Mozilla Public License 2.0
 * Permissions of this weak copyleft license are conditioned on making available source code of licensed files and modifications of those files under the same license (or in certain cases, one of the GNU licenses). Copyright and license notices must be preserved. Contributors provide an express grant of patent rights. However, a larger work using the licensed work may be distributed under different terms and without source code for files added in the larger work.
 */
/**
 * @param input - will be converted to buffer
 * @returns returns buffer of encoded data
 */
export declare function encode(input: EncodeInput): Buffer;
/**
 * Built on top of rlp library, removing the BN dependency for the flow.
 * Package : https://github.com/ethereumjs/rlp
 * RLP License : https://github.com/ethereumjs/rlp/blob/master/LICENSE
 *
 * ethereumjs/rlp is licensed under the
 * Mozilla Public License 2.0
 * Permissions of this weak copyleft license are conditioned on making available source code of licensed files and modifications of those files under the same license (or in certain cases, one of the GNU licenses). Copyright and license notices must be preserved. Contributors provide an express grant of patent rights. However, a larger work using the licensed work may be distributed under different terms and without source code for files added in the larger work.
 */
/**
 * @param input - will be converted to buffer
 * @param stream Is the input a stream (false by default)
 * @returns returns buffer of encoded data
 */
export declare function decode(input: Buffer | Uint8Array, stream?: boolean): Buffer;
/**
 * Get the length of the RLP input
 * @param input
 * @returns The length of the input or an empty Buffer if no input
 */
export declare function getLength(input: Buffer | Uint8Array | null | undefined | string | number): number;
/** Transform anything into a Buffer */
export declare function toBuffer(v: Buffer | string | number | Uint8Array | null | undefined): Buffer;
