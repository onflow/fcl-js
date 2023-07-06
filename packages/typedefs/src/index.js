
/**
 * @typedef {object} Account
 * @property {string} address - The address of the account
 * @property {number} balance - The FLOW balance of the account in 10^8
 * @property {number} code - The code of any Cadence contracts stored in the account
 * @property {object} contracts - An object with keys as the contract name deployed and the value as the the cadence string
 * @property {object} keys - Any contracts deployed to this account
 */

/**
 * @typedef {object} Block
 * @property {string} id - The id of the block
 * @property {string} parentId - The id of the parent block
 * @property {number} height - The height of the block
 * @property {object} timestamp - Time related fields
 * @property {CollectionGuarantee} collectionGuarantees - Contains the ids of collections included in the block
 * @property {object} blockSeals - The details of which nodes executed and sealed the blocks
 * @property {Array<number>} signatures - The cryptographic signature of the block
 */

/**
 * @typedef {object} CollectionGuarantee
 * @property {string} collectionId - The id of the block
 * @property {Array<object>} signatures - All signatures
 */

/**
 * @typedef {object} CompositeSignature
 * @property {string} f_type - A type identifier used internally by FCL
 * @property {string} f_vsn - FCL protocol version
 * @property {string} addr - Flow Address (sans prefix)
 * @property {number} keyId - Key ID
 * @property {string} signature - Signature as a hex string
 */

/**
 * @typedef {object} CurrentUser
 * @property {string} [addr] - The public address of the current user
 * @property {string} [cid] - A wallet specified content identifier for user metadata
 * @property {number} [expiresAt] - A wallet specified time-frame for a valid session
 * @property {string} f_type - A type identifier used internally by FCL
 * @property {string} f_vsn - FCL protocol version
 * @property {boolean} [loggedIn] - Whether or not the current user is logged in
 * @property {Array<object>} services - A list of trusted services that express ways of interacting with the current user's identity
 */

/**
 * @typedef {object} Event
 * @property {string} blockId - ID of the block that contains the event.
 * @property {number} blockHeight - Height of the block that contains the event.
 * @property {string} blockTimestamp - The timestamp of when the block was sealed in a DateString format. eg. '2021-06-25T13:42:04.227Z'
 * @property {string} type - A string containing the event name.
 * @property {string} transactionId - Can be used to query transaction information, eg. via a Flow block explorer.
 * @property {number} transactionIndex - Used to prevent replay attacks.
 * @property {number} eventIndex - Used to prevent replay attacks.
 * @property {any} data - The data emitted from the event.
 */

/**
 * @typedef {object} Key
 * @property {number} sequenceNumber - Sequence number of key used by the proposer of this transaction
 * @property {number} keyId - The ID of the key in the account used by the proposer of this transaction
 * @property {string} address - The address of the proposer of this transaction
 */

/**
 * @typedef {object} Service
 * @property {string} f_type - A type identifier used internally by FCL
 * @property {string} f_vsn - FCL protocol version
 * @property {string} type - Service type
 * @property {string} method - Service method
 * @property {string} [uid] - Service uid
 * @property {string} endpoint - Service endpoint
 * @property {Provider} provider - Service provider object
 */

/**
 * @typedef {object} Signature
 * @property {string} sequenceNumber - Sequence number of the key used to perform this signature.
 * @property {number} keyId - ID of the key in the account used to perform this signature.
 * @property {string} signature - The signature represented as a hex string.
 */

/**
 * @typedef {object} Transaction
 * @property {string} script - The Cadence code used to execute this transaction.
 * @property {Array<string>} args - The JSON-CDC encoded arguments passed in to the transaction.
 * @property {string} referenceBlockId - The reference block id for this transaction.
 * @property {number} gasLimit - The gas limit for the transaction.
 * @property {Key} proposalKey - The key used by the proposer of this transaction.
 * @property {string} sequenceNumber - Sequence number of the key used by the proposer of this transaction.
 * @property {number} keyId - The ID of the key in the account used by the proposer of this transaction.
 * @property {string} address - The address of the proposer of this transaction.
 * @property {string} payer - Address of the payer of the transaction.
 * @property {string} proposer - Address of the proposer of this transaction.
 * @property {Array<string>} authorizers - Array of addresses of authorizers of this transaction.
 * @property {Array<Signature>} payloadSignatures - The payload signatures for the transaction.
 * @property {Array<Signature>} envelopeSignatures - The envelope signatures for the transaction.
 */

/**
 * @typedef {object} TransactionStatus
 * @property {string} blockId - The ID of the Block the transaction is included in.
 * @property {number} status - The status code of the transaction.
 * @property {number} statusString - The status as as descriptive text (e.g. "FINALIZED").
 * @property {string} errorMessage - The error message of the transaction.
 * @property {Array<Event>} events - The events for this result.
 */

/**
 * @typedef {object} Provider
 * @property {string} name - Provider name.
 * @todo fill the rest
 */

// Needed for bundler to export this file
exports.unused = {};