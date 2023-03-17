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
 * @typedef {object} CompositeSignature
 * @property {string} f_type - A type identifier used internally by FCL
 * @property {string} f_vsn - FCL protocol version
 * @property {string} addr - Flow Address (sans prefix)
 * @property {number} keyId - Key ID
 * @property {string} signature - Signature as a hex string
 */

// Needed for bundler to export this file
exports.unused = {};