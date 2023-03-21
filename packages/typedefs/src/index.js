
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
 * @typedef {object} Service
 * @property {string} f_type - A type identifier used internally by FCL
 * @property {string} f_vsn - FCL protocol version
 * @property {string} type - Service type
 * @property {string} method - Service method
 * @property {string} [uid] - Service uid
 * @property {string} endpoint - Service endpoint
 * @property {object} provider - Service provider object
 */

// Needed for bundler to export this file
exports.unused = {};