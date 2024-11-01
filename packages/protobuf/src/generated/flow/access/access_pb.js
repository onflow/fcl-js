// source: flow/access/access.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global =
    (typeof globalThis !== 'undefined' && globalThis) ||
    (typeof window !== 'undefined' && window) ||
    (typeof global !== 'undefined' && global) ||
    (typeof self !== 'undefined' && self) ||
    (function () { return this; }).call(null) ||
    Function('return this')();

var flow_entities_account_pb = require('../../flow/entities/account_pb.js');
goog.object.extend(proto, flow_entities_account_pb);
var flow_entities_block_header_pb = require('../../flow/entities/block_header_pb.js');
goog.object.extend(proto, flow_entities_block_header_pb);
var flow_entities_block_pb = require('../../flow/entities/block_pb.js');
goog.object.extend(proto, flow_entities_block_pb);
var flow_entities_collection_pb = require('../../flow/entities/collection_pb.js');
goog.object.extend(proto, flow_entities_collection_pb);
var flow_entities_event_pb = require('../../flow/entities/event_pb.js');
goog.object.extend(proto, flow_entities_event_pb);
var flow_entities_execution_result_pb = require('../../flow/entities/execution_result_pb.js');
goog.object.extend(proto, flow_entities_execution_result_pb);
var flow_entities_metadata_pb = require('../../flow/entities/metadata_pb.js');
goog.object.extend(proto, flow_entities_metadata_pb);
var flow_entities_node_version_info_pb = require('../../flow/entities/node_version_info_pb.js');
goog.object.extend(proto, flow_entities_node_version_info_pb);
var flow_entities_transaction_pb = require('../../flow/entities/transaction_pb.js');
goog.object.extend(proto, flow_entities_transaction_pb);
var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
goog.object.extend(proto, google_protobuf_timestamp_pb);
goog.exportSymbol('proto.flow.access.AccountResponse', null, global);
goog.exportSymbol('proto.flow.access.BlockHeaderResponse', null, global);
goog.exportSymbol('proto.flow.access.BlockResponse', null, global);
goog.exportSymbol('proto.flow.access.CollectionResponse', null, global);
goog.exportSymbol('proto.flow.access.EventsResponse', null, global);
goog.exportSymbol('proto.flow.access.EventsResponse.Result', null, global);
goog.exportSymbol('proto.flow.access.ExecuteScriptAtBlockHeightRequest', null, global);
goog.exportSymbol('proto.flow.access.ExecuteScriptAtBlockIDRequest', null, global);
goog.exportSymbol('proto.flow.access.ExecuteScriptAtLatestBlockRequest', null, global);
goog.exportSymbol('proto.flow.access.ExecuteScriptResponse', null, global);
goog.exportSymbol('proto.flow.access.ExecutionResultByIDResponse', null, global);
goog.exportSymbol('proto.flow.access.ExecutionResultForBlockIDResponse', null, global);
goog.exportSymbol('proto.flow.access.GetAccountAtBlockHeightRequest', null, global);
goog.exportSymbol('proto.flow.access.GetAccountAtLatestBlockRequest', null, global);
goog.exportSymbol('proto.flow.access.GetAccountRequest', null, global);
goog.exportSymbol('proto.flow.access.GetAccountResponse', null, global);
goog.exportSymbol('proto.flow.access.GetBlockByHeightRequest', null, global);
goog.exportSymbol('proto.flow.access.GetBlockByIDRequest', null, global);
goog.exportSymbol('proto.flow.access.GetBlockHeaderByHeightRequest', null, global);
goog.exportSymbol('proto.flow.access.GetBlockHeaderByIDRequest', null, global);
goog.exportSymbol('proto.flow.access.GetCollectionByIDRequest', null, global);
goog.exportSymbol('proto.flow.access.GetEventsForBlockIDsRequest', null, global);
goog.exportSymbol('proto.flow.access.GetEventsForHeightRangeRequest', null, global);
goog.exportSymbol('proto.flow.access.GetExecutionResultByIDRequest', null, global);
goog.exportSymbol('proto.flow.access.GetExecutionResultForBlockIDRequest', null, global);
goog.exportSymbol('proto.flow.access.GetLatestBlockHeaderRequest', null, global);
goog.exportSymbol('proto.flow.access.GetLatestBlockRequest', null, global);
goog.exportSymbol('proto.flow.access.GetLatestProtocolStateSnapshotRequest', null, global);
goog.exportSymbol('proto.flow.access.GetNetworkParametersRequest', null, global);
goog.exportSymbol('proto.flow.access.GetNetworkParametersResponse', null, global);
goog.exportSymbol('proto.flow.access.GetNodeVersionInfoRequest', null, global);
goog.exportSymbol('proto.flow.access.GetNodeVersionInfoResponse', null, global);
goog.exportSymbol('proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest', null, global);
goog.exportSymbol('proto.flow.access.GetProtocolStateSnapshotByHeightRequest', null, global);
goog.exportSymbol('proto.flow.access.GetSystemTransactionRequest', null, global);
goog.exportSymbol('proto.flow.access.GetSystemTransactionResultRequest', null, global);
goog.exportSymbol('proto.flow.access.GetTransactionByIndexRequest', null, global);
goog.exportSymbol('proto.flow.access.GetTransactionRequest', null, global);
goog.exportSymbol('proto.flow.access.GetTransactionsByBlockIDRequest', null, global);
goog.exportSymbol('proto.flow.access.PingRequest', null, global);
goog.exportSymbol('proto.flow.access.PingResponse', null, global);
goog.exportSymbol('proto.flow.access.ProtocolStateSnapshotResponse', null, global);
goog.exportSymbol('proto.flow.access.SendAndSubscribeTransactionStatusesRequest', null, global);
goog.exportSymbol('proto.flow.access.SendAndSubscribeTransactionStatusesResponse', null, global);
goog.exportSymbol('proto.flow.access.SendTransactionRequest', null, global);
goog.exportSymbol('proto.flow.access.SendTransactionResponse', null, global);
goog.exportSymbol('proto.flow.access.SubscribeBlockDigestsFromLatestRequest', null, global);
goog.exportSymbol('proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest', null, global);
goog.exportSymbol('proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest', null, global);
goog.exportSymbol('proto.flow.access.SubscribeBlockDigestsResponse', null, global);
goog.exportSymbol('proto.flow.access.SubscribeBlockHeadersFromLatestRequest', null, global);
goog.exportSymbol('proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest', null, global);
goog.exportSymbol('proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest', null, global);
goog.exportSymbol('proto.flow.access.SubscribeBlockHeadersResponse', null, global);
goog.exportSymbol('proto.flow.access.SubscribeBlocksFromLatestRequest', null, global);
goog.exportSymbol('proto.flow.access.SubscribeBlocksFromStartBlockIDRequest', null, global);
goog.exportSymbol('proto.flow.access.SubscribeBlocksFromStartHeightRequest', null, global);
goog.exportSymbol('proto.flow.access.SubscribeBlocksResponse', null, global);
goog.exportSymbol('proto.flow.access.TransactionResponse', null, global);
goog.exportSymbol('proto.flow.access.TransactionResultResponse', null, global);
goog.exportSymbol('proto.flow.access.TransactionResultsResponse', null, global);
goog.exportSymbol('proto.flow.access.TransactionsResponse', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.PingRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.PingRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.PingRequest.displayName = 'proto.flow.access.PingRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.PingResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.PingResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.PingResponse.displayName = 'proto.flow.access.PingResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetNodeVersionInfoRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetNodeVersionInfoRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetNodeVersionInfoRequest.displayName = 'proto.flow.access.GetNodeVersionInfoRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetNodeVersionInfoResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetNodeVersionInfoResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetNodeVersionInfoResponse.displayName = 'proto.flow.access.GetNodeVersionInfoResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetLatestBlockHeaderRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetLatestBlockHeaderRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetLatestBlockHeaderRequest.displayName = 'proto.flow.access.GetLatestBlockHeaderRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetBlockHeaderByIDRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetBlockHeaderByIDRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetBlockHeaderByIDRequest.displayName = 'proto.flow.access.GetBlockHeaderByIDRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetBlockHeaderByHeightRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetBlockHeaderByHeightRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetBlockHeaderByHeightRequest.displayName = 'proto.flow.access.GetBlockHeaderByHeightRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.BlockHeaderResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.BlockHeaderResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.BlockHeaderResponse.displayName = 'proto.flow.access.BlockHeaderResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetLatestBlockRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetLatestBlockRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetLatestBlockRequest.displayName = 'proto.flow.access.GetLatestBlockRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetBlockByIDRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetBlockByIDRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetBlockByIDRequest.displayName = 'proto.flow.access.GetBlockByIDRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetBlockByHeightRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetBlockByHeightRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetBlockByHeightRequest.displayName = 'proto.flow.access.GetBlockByHeightRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.BlockResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.BlockResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.BlockResponse.displayName = 'proto.flow.access.BlockResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetCollectionByIDRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetCollectionByIDRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetCollectionByIDRequest.displayName = 'proto.flow.access.GetCollectionByIDRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.CollectionResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.CollectionResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.CollectionResponse.displayName = 'proto.flow.access.CollectionResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.SendTransactionRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.SendTransactionRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.SendTransactionRequest.displayName = 'proto.flow.access.SendTransactionRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.SendTransactionResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.SendTransactionResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.SendTransactionResponse.displayName = 'proto.flow.access.SendTransactionResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetTransactionRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetTransactionRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetTransactionRequest.displayName = 'proto.flow.access.GetTransactionRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetSystemTransactionRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetSystemTransactionRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetSystemTransactionRequest.displayName = 'proto.flow.access.GetSystemTransactionRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetSystemTransactionResultRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetSystemTransactionResultRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetSystemTransactionResultRequest.displayName = 'proto.flow.access.GetSystemTransactionResultRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetTransactionByIndexRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetTransactionByIndexRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetTransactionByIndexRequest.displayName = 'proto.flow.access.GetTransactionByIndexRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetTransactionsByBlockIDRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetTransactionsByBlockIDRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetTransactionsByBlockIDRequest.displayName = 'proto.flow.access.GetTransactionsByBlockIDRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.TransactionResultsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.flow.access.TransactionResultsResponse.repeatedFields_, null);
};
goog.inherits(proto.flow.access.TransactionResultsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.TransactionResultsResponse.displayName = 'proto.flow.access.TransactionResultsResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.TransactionsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.flow.access.TransactionsResponse.repeatedFields_, null);
};
goog.inherits(proto.flow.access.TransactionsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.TransactionsResponse.displayName = 'proto.flow.access.TransactionsResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.TransactionResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.TransactionResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.TransactionResponse.displayName = 'proto.flow.access.TransactionResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.TransactionResultResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.flow.access.TransactionResultResponse.repeatedFields_, null);
};
goog.inherits(proto.flow.access.TransactionResultResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.TransactionResultResponse.displayName = 'proto.flow.access.TransactionResultResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetAccountRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetAccountRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetAccountRequest.displayName = 'proto.flow.access.GetAccountRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetAccountResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetAccountResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetAccountResponse.displayName = 'proto.flow.access.GetAccountResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetAccountAtLatestBlockRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetAccountAtLatestBlockRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetAccountAtLatestBlockRequest.displayName = 'proto.flow.access.GetAccountAtLatestBlockRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.AccountResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.AccountResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.AccountResponse.displayName = 'proto.flow.access.AccountResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetAccountAtBlockHeightRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetAccountAtBlockHeightRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetAccountAtBlockHeightRequest.displayName = 'proto.flow.access.GetAccountAtBlockHeightRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.ExecuteScriptAtLatestBlockRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.flow.access.ExecuteScriptAtLatestBlockRequest.repeatedFields_, null);
};
goog.inherits(proto.flow.access.ExecuteScriptAtLatestBlockRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.ExecuteScriptAtLatestBlockRequest.displayName = 'proto.flow.access.ExecuteScriptAtLatestBlockRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.ExecuteScriptAtBlockIDRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.flow.access.ExecuteScriptAtBlockIDRequest.repeatedFields_, null);
};
goog.inherits(proto.flow.access.ExecuteScriptAtBlockIDRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.ExecuteScriptAtBlockIDRequest.displayName = 'proto.flow.access.ExecuteScriptAtBlockIDRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.ExecuteScriptAtBlockHeightRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.flow.access.ExecuteScriptAtBlockHeightRequest.repeatedFields_, null);
};
goog.inherits(proto.flow.access.ExecuteScriptAtBlockHeightRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.ExecuteScriptAtBlockHeightRequest.displayName = 'proto.flow.access.ExecuteScriptAtBlockHeightRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.ExecuteScriptResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.ExecuteScriptResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.ExecuteScriptResponse.displayName = 'proto.flow.access.ExecuteScriptResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetEventsForHeightRangeRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetEventsForHeightRangeRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetEventsForHeightRangeRequest.displayName = 'proto.flow.access.GetEventsForHeightRangeRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetEventsForBlockIDsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.flow.access.GetEventsForBlockIDsRequest.repeatedFields_, null);
};
goog.inherits(proto.flow.access.GetEventsForBlockIDsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetEventsForBlockIDsRequest.displayName = 'proto.flow.access.GetEventsForBlockIDsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.EventsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.flow.access.EventsResponse.repeatedFields_, null);
};
goog.inherits(proto.flow.access.EventsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.EventsResponse.displayName = 'proto.flow.access.EventsResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.EventsResponse.Result = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.flow.access.EventsResponse.Result.repeatedFields_, null);
};
goog.inherits(proto.flow.access.EventsResponse.Result, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.EventsResponse.Result.displayName = 'proto.flow.access.EventsResponse.Result';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetNetworkParametersRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetNetworkParametersRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetNetworkParametersRequest.displayName = 'proto.flow.access.GetNetworkParametersRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetNetworkParametersResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetNetworkParametersResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetNetworkParametersResponse.displayName = 'proto.flow.access.GetNetworkParametersResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetLatestProtocolStateSnapshotRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetLatestProtocolStateSnapshotRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetLatestProtocolStateSnapshotRequest.displayName = 'proto.flow.access.GetLatestProtocolStateSnapshotRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest.displayName = 'proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetProtocolStateSnapshotByHeightRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetProtocolStateSnapshotByHeightRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetProtocolStateSnapshotByHeightRequest.displayName = 'proto.flow.access.GetProtocolStateSnapshotByHeightRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.ProtocolStateSnapshotResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.ProtocolStateSnapshotResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.ProtocolStateSnapshotResponse.displayName = 'proto.flow.access.ProtocolStateSnapshotResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetExecutionResultForBlockIDRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetExecutionResultForBlockIDRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetExecutionResultForBlockIDRequest.displayName = 'proto.flow.access.GetExecutionResultForBlockIDRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.ExecutionResultForBlockIDResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.ExecutionResultForBlockIDResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.ExecutionResultForBlockIDResponse.displayName = 'proto.flow.access.ExecutionResultForBlockIDResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.GetExecutionResultByIDRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.GetExecutionResultByIDRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.GetExecutionResultByIDRequest.displayName = 'proto.flow.access.GetExecutionResultByIDRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.ExecutionResultByIDResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.ExecutionResultByIDResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.ExecutionResultByIDResponse.displayName = 'proto.flow.access.ExecutionResultByIDResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.SubscribeBlocksFromStartBlockIDRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.SubscribeBlocksFromStartBlockIDRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.SubscribeBlocksFromStartBlockIDRequest.displayName = 'proto.flow.access.SubscribeBlocksFromStartBlockIDRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.SubscribeBlocksFromStartHeightRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.SubscribeBlocksFromStartHeightRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.SubscribeBlocksFromStartHeightRequest.displayName = 'proto.flow.access.SubscribeBlocksFromStartHeightRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.SubscribeBlocksFromLatestRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.SubscribeBlocksFromLatestRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.SubscribeBlocksFromLatestRequest.displayName = 'proto.flow.access.SubscribeBlocksFromLatestRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.SubscribeBlocksResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.SubscribeBlocksResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.SubscribeBlocksResponse.displayName = 'proto.flow.access.SubscribeBlocksResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest.displayName = 'proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest.displayName = 'proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.SubscribeBlockHeadersFromLatestRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.SubscribeBlockHeadersFromLatestRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.SubscribeBlockHeadersFromLatestRequest.displayName = 'proto.flow.access.SubscribeBlockHeadersFromLatestRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.SubscribeBlockHeadersResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.SubscribeBlockHeadersResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.SubscribeBlockHeadersResponse.displayName = 'proto.flow.access.SubscribeBlockHeadersResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest.displayName = 'proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest.displayName = 'proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.SubscribeBlockDigestsFromLatestRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.SubscribeBlockDigestsFromLatestRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.SubscribeBlockDigestsFromLatestRequest.displayName = 'proto.flow.access.SubscribeBlockDigestsFromLatestRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.SubscribeBlockDigestsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.SubscribeBlockDigestsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.SubscribeBlockDigestsResponse.displayName = 'proto.flow.access.SubscribeBlockDigestsResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.SendAndSubscribeTransactionStatusesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.SendAndSubscribeTransactionStatusesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.SendAndSubscribeTransactionStatusesRequest.displayName = 'proto.flow.access.SendAndSubscribeTransactionStatusesRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.flow.access.SendAndSubscribeTransactionStatusesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.flow.access.SendAndSubscribeTransactionStatusesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.flow.access.SendAndSubscribeTransactionStatusesResponse.displayName = 'proto.flow.access.SendAndSubscribeTransactionStatusesResponse';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.PingRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.PingRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.PingRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.PingRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.PingRequest}
 */
proto.flow.access.PingRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.PingRequest;
  return proto.flow.access.PingRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.PingRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.PingRequest}
 */
proto.flow.access.PingRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.PingRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.PingRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.PingRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.PingRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.PingResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.PingResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.PingResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.PingResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.PingResponse}
 */
proto.flow.access.PingResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.PingResponse;
  return proto.flow.access.PingResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.PingResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.PingResponse}
 */
proto.flow.access.PingResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.PingResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.PingResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.PingResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.PingResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetNodeVersionInfoRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetNodeVersionInfoRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetNodeVersionInfoRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetNodeVersionInfoRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetNodeVersionInfoRequest}
 */
proto.flow.access.GetNodeVersionInfoRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetNodeVersionInfoRequest;
  return proto.flow.access.GetNodeVersionInfoRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetNodeVersionInfoRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetNodeVersionInfoRequest}
 */
proto.flow.access.GetNodeVersionInfoRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetNodeVersionInfoRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetNodeVersionInfoRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetNodeVersionInfoRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetNodeVersionInfoRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetNodeVersionInfoResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetNodeVersionInfoResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetNodeVersionInfoResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetNodeVersionInfoResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    info: (f = msg.getInfo()) && flow_entities_node_version_info_pb.NodeVersionInfo.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetNodeVersionInfoResponse}
 */
proto.flow.access.GetNodeVersionInfoResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetNodeVersionInfoResponse;
  return proto.flow.access.GetNodeVersionInfoResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetNodeVersionInfoResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetNodeVersionInfoResponse}
 */
proto.flow.access.GetNodeVersionInfoResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new flow_entities_node_version_info_pb.NodeVersionInfo;
      reader.readMessage(value,flow_entities_node_version_info_pb.NodeVersionInfo.deserializeBinaryFromReader);
      msg.setInfo(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetNodeVersionInfoResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetNodeVersionInfoResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetNodeVersionInfoResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetNodeVersionInfoResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInfo();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      flow_entities_node_version_info_pb.NodeVersionInfo.serializeBinaryToWriter
    );
  }
};


/**
 * optional flow.entities.NodeVersionInfo info = 1;
 * @return {?proto.flow.entities.NodeVersionInfo}
 */
proto.flow.access.GetNodeVersionInfoResponse.prototype.getInfo = function() {
  return /** @type{?proto.flow.entities.NodeVersionInfo} */ (
    jspb.Message.getWrapperField(this, flow_entities_node_version_info_pb.NodeVersionInfo, 1));
};


/**
 * @param {?proto.flow.entities.NodeVersionInfo|undefined} value
 * @return {!proto.flow.access.GetNodeVersionInfoResponse} returns this
*/
proto.flow.access.GetNodeVersionInfoResponse.prototype.setInfo = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.GetNodeVersionInfoResponse} returns this
 */
proto.flow.access.GetNodeVersionInfoResponse.prototype.clearInfo = function() {
  return this.setInfo(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.GetNodeVersionInfoResponse.prototype.hasInfo = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetLatestBlockHeaderRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetLatestBlockHeaderRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetLatestBlockHeaderRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetLatestBlockHeaderRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    isSealed: jspb.Message.getBooleanFieldWithDefault(msg, 1, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetLatestBlockHeaderRequest}
 */
proto.flow.access.GetLatestBlockHeaderRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetLatestBlockHeaderRequest;
  return proto.flow.access.GetLatestBlockHeaderRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetLatestBlockHeaderRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetLatestBlockHeaderRequest}
 */
proto.flow.access.GetLatestBlockHeaderRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsSealed(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetLatestBlockHeaderRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetLatestBlockHeaderRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetLatestBlockHeaderRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetLatestBlockHeaderRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getIsSealed();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool is_sealed = 1;
 * @return {boolean}
 */
proto.flow.access.GetLatestBlockHeaderRequest.prototype.getIsSealed = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.flow.access.GetLatestBlockHeaderRequest} returns this
 */
proto.flow.access.GetLatestBlockHeaderRequest.prototype.setIsSealed = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetBlockHeaderByIDRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetBlockHeaderByIDRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetBlockHeaderByIDRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetBlockHeaderByIDRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: msg.getId_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetBlockHeaderByIDRequest}
 */
proto.flow.access.GetBlockHeaderByIDRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetBlockHeaderByIDRequest;
  return proto.flow.access.GetBlockHeaderByIDRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetBlockHeaderByIDRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetBlockHeaderByIDRequest}
 */
proto.flow.access.GetBlockHeaderByIDRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetBlockHeaderByIDRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetBlockHeaderByIDRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetBlockHeaderByIDRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetBlockHeaderByIDRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
};


/**
 * optional bytes id = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.GetBlockHeaderByIDRequest.prototype.getId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes id = 1;
 * This is a type-conversion wrapper around `getId()`
 * @return {string}
 */
proto.flow.access.GetBlockHeaderByIDRequest.prototype.getId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getId()));
};


/**
 * optional bytes id = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getId()`
 * @return {!Uint8Array}
 */
proto.flow.access.GetBlockHeaderByIDRequest.prototype.getId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.GetBlockHeaderByIDRequest} returns this
 */
proto.flow.access.GetBlockHeaderByIDRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetBlockHeaderByHeightRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetBlockHeaderByHeightRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetBlockHeaderByHeightRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetBlockHeaderByHeightRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    height: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetBlockHeaderByHeightRequest}
 */
proto.flow.access.GetBlockHeaderByHeightRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetBlockHeaderByHeightRequest;
  return proto.flow.access.GetBlockHeaderByHeightRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetBlockHeaderByHeightRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetBlockHeaderByHeightRequest}
 */
proto.flow.access.GetBlockHeaderByHeightRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setHeight(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetBlockHeaderByHeightRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetBlockHeaderByHeightRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetBlockHeaderByHeightRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetBlockHeaderByHeightRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getHeight();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
};


/**
 * optional uint64 height = 1;
 * @return {number}
 */
proto.flow.access.GetBlockHeaderByHeightRequest.prototype.getHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.flow.access.GetBlockHeaderByHeightRequest} returns this
 */
proto.flow.access.GetBlockHeaderByHeightRequest.prototype.setHeight = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.BlockHeaderResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.BlockHeaderResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.BlockHeaderResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.BlockHeaderResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    block: (f = msg.getBlock()) && flow_entities_block_header_pb.BlockHeader.toObject(includeInstance, f),
    blockStatus: jspb.Message.getFieldWithDefault(msg, 2, 0),
    metadata: (f = msg.getMetadata()) && flow_entities_metadata_pb.Metadata.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.BlockHeaderResponse}
 */
proto.flow.access.BlockHeaderResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.BlockHeaderResponse;
  return proto.flow.access.BlockHeaderResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.BlockHeaderResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.BlockHeaderResponse}
 */
proto.flow.access.BlockHeaderResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new flow_entities_block_header_pb.BlockHeader;
      reader.readMessage(value,flow_entities_block_header_pb.BlockHeader.deserializeBinaryFromReader);
      msg.setBlock(value);
      break;
    case 2:
      var value = /** @type {!proto.flow.entities.BlockStatus} */ (reader.readEnum());
      msg.setBlockStatus(value);
      break;
    case 3:
      var value = new flow_entities_metadata_pb.Metadata;
      reader.readMessage(value,flow_entities_metadata_pb.Metadata.deserializeBinaryFromReader);
      msg.setMetadata(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.BlockHeaderResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.BlockHeaderResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.BlockHeaderResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.BlockHeaderResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBlock();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      flow_entities_block_header_pb.BlockHeader.serializeBinaryToWriter
    );
  }
  f = message.getBlockStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getMetadata();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      flow_entities_metadata_pb.Metadata.serializeBinaryToWriter
    );
  }
};


/**
 * optional flow.entities.BlockHeader block = 1;
 * @return {?proto.flow.entities.BlockHeader}
 */
proto.flow.access.BlockHeaderResponse.prototype.getBlock = function() {
  return /** @type{?proto.flow.entities.BlockHeader} */ (
    jspb.Message.getWrapperField(this, flow_entities_block_header_pb.BlockHeader, 1));
};


/**
 * @param {?proto.flow.entities.BlockHeader|undefined} value
 * @return {!proto.flow.access.BlockHeaderResponse} returns this
*/
proto.flow.access.BlockHeaderResponse.prototype.setBlock = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.BlockHeaderResponse} returns this
 */
proto.flow.access.BlockHeaderResponse.prototype.clearBlock = function() {
  return this.setBlock(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.BlockHeaderResponse.prototype.hasBlock = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional flow.entities.BlockStatus block_status = 2;
 * @return {!proto.flow.entities.BlockStatus}
 */
proto.flow.access.BlockHeaderResponse.prototype.getBlockStatus = function() {
  return /** @type {!proto.flow.entities.BlockStatus} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.flow.entities.BlockStatus} value
 * @return {!proto.flow.access.BlockHeaderResponse} returns this
 */
proto.flow.access.BlockHeaderResponse.prototype.setBlockStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional flow.entities.Metadata metadata = 3;
 * @return {?proto.flow.entities.Metadata}
 */
proto.flow.access.BlockHeaderResponse.prototype.getMetadata = function() {
  return /** @type{?proto.flow.entities.Metadata} */ (
    jspb.Message.getWrapperField(this, flow_entities_metadata_pb.Metadata, 3));
};


/**
 * @param {?proto.flow.entities.Metadata|undefined} value
 * @return {!proto.flow.access.BlockHeaderResponse} returns this
*/
proto.flow.access.BlockHeaderResponse.prototype.setMetadata = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.BlockHeaderResponse} returns this
 */
proto.flow.access.BlockHeaderResponse.prototype.clearMetadata = function() {
  return this.setMetadata(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.BlockHeaderResponse.prototype.hasMetadata = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetLatestBlockRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetLatestBlockRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetLatestBlockRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetLatestBlockRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    isSealed: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
    fullBlockResponse: jspb.Message.getBooleanFieldWithDefault(msg, 2, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetLatestBlockRequest}
 */
proto.flow.access.GetLatestBlockRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetLatestBlockRequest;
  return proto.flow.access.GetLatestBlockRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetLatestBlockRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetLatestBlockRequest}
 */
proto.flow.access.GetLatestBlockRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsSealed(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setFullBlockResponse(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetLatestBlockRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetLatestBlockRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetLatestBlockRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetLatestBlockRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getIsSealed();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getFullBlockResponse();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
};


/**
 * optional bool is_sealed = 1;
 * @return {boolean}
 */
proto.flow.access.GetLatestBlockRequest.prototype.getIsSealed = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.flow.access.GetLatestBlockRequest} returns this
 */
proto.flow.access.GetLatestBlockRequest.prototype.setIsSealed = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional bool full_block_response = 2;
 * @return {boolean}
 */
proto.flow.access.GetLatestBlockRequest.prototype.getFullBlockResponse = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.flow.access.GetLatestBlockRequest} returns this
 */
proto.flow.access.GetLatestBlockRequest.prototype.setFullBlockResponse = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetBlockByIDRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetBlockByIDRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetBlockByIDRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetBlockByIDRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: msg.getId_asB64(),
    fullBlockResponse: jspb.Message.getBooleanFieldWithDefault(msg, 2, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetBlockByIDRequest}
 */
proto.flow.access.GetBlockByIDRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetBlockByIDRequest;
  return proto.flow.access.GetBlockByIDRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetBlockByIDRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetBlockByIDRequest}
 */
proto.flow.access.GetBlockByIDRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setFullBlockResponse(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetBlockByIDRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetBlockByIDRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetBlockByIDRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetBlockByIDRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getFullBlockResponse();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
};


/**
 * optional bytes id = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.GetBlockByIDRequest.prototype.getId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes id = 1;
 * This is a type-conversion wrapper around `getId()`
 * @return {string}
 */
proto.flow.access.GetBlockByIDRequest.prototype.getId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getId()));
};


/**
 * optional bytes id = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getId()`
 * @return {!Uint8Array}
 */
proto.flow.access.GetBlockByIDRequest.prototype.getId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.GetBlockByIDRequest} returns this
 */
proto.flow.access.GetBlockByIDRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional bool full_block_response = 2;
 * @return {boolean}
 */
proto.flow.access.GetBlockByIDRequest.prototype.getFullBlockResponse = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.flow.access.GetBlockByIDRequest} returns this
 */
proto.flow.access.GetBlockByIDRequest.prototype.setFullBlockResponse = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetBlockByHeightRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetBlockByHeightRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetBlockByHeightRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetBlockByHeightRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    height: jspb.Message.getFieldWithDefault(msg, 1, 0),
    fullBlockResponse: jspb.Message.getBooleanFieldWithDefault(msg, 2, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetBlockByHeightRequest}
 */
proto.flow.access.GetBlockByHeightRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetBlockByHeightRequest;
  return proto.flow.access.GetBlockByHeightRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetBlockByHeightRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetBlockByHeightRequest}
 */
proto.flow.access.GetBlockByHeightRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setHeight(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setFullBlockResponse(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetBlockByHeightRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetBlockByHeightRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetBlockByHeightRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetBlockByHeightRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getHeight();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = message.getFullBlockResponse();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
};


/**
 * optional uint64 height = 1;
 * @return {number}
 */
proto.flow.access.GetBlockByHeightRequest.prototype.getHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.flow.access.GetBlockByHeightRequest} returns this
 */
proto.flow.access.GetBlockByHeightRequest.prototype.setHeight = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional bool full_block_response = 2;
 * @return {boolean}
 */
proto.flow.access.GetBlockByHeightRequest.prototype.getFullBlockResponse = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.flow.access.GetBlockByHeightRequest} returns this
 */
proto.flow.access.GetBlockByHeightRequest.prototype.setFullBlockResponse = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.BlockResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.BlockResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.BlockResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.BlockResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    block: (f = msg.getBlock()) && flow_entities_block_pb.Block.toObject(includeInstance, f),
    blockStatus: jspb.Message.getFieldWithDefault(msg, 2, 0),
    metadata: (f = msg.getMetadata()) && flow_entities_metadata_pb.Metadata.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.BlockResponse}
 */
proto.flow.access.BlockResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.BlockResponse;
  return proto.flow.access.BlockResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.BlockResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.BlockResponse}
 */
proto.flow.access.BlockResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new flow_entities_block_pb.Block;
      reader.readMessage(value,flow_entities_block_pb.Block.deserializeBinaryFromReader);
      msg.setBlock(value);
      break;
    case 2:
      var value = /** @type {!proto.flow.entities.BlockStatus} */ (reader.readEnum());
      msg.setBlockStatus(value);
      break;
    case 3:
      var value = new flow_entities_metadata_pb.Metadata;
      reader.readMessage(value,flow_entities_metadata_pb.Metadata.deserializeBinaryFromReader);
      msg.setMetadata(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.BlockResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.BlockResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.BlockResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.BlockResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBlock();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      flow_entities_block_pb.Block.serializeBinaryToWriter
    );
  }
  f = message.getBlockStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getMetadata();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      flow_entities_metadata_pb.Metadata.serializeBinaryToWriter
    );
  }
};


/**
 * optional flow.entities.Block block = 1;
 * @return {?proto.flow.entities.Block}
 */
proto.flow.access.BlockResponse.prototype.getBlock = function() {
  return /** @type{?proto.flow.entities.Block} */ (
    jspb.Message.getWrapperField(this, flow_entities_block_pb.Block, 1));
};


/**
 * @param {?proto.flow.entities.Block|undefined} value
 * @return {!proto.flow.access.BlockResponse} returns this
*/
proto.flow.access.BlockResponse.prototype.setBlock = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.BlockResponse} returns this
 */
proto.flow.access.BlockResponse.prototype.clearBlock = function() {
  return this.setBlock(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.BlockResponse.prototype.hasBlock = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional flow.entities.BlockStatus block_status = 2;
 * @return {!proto.flow.entities.BlockStatus}
 */
proto.flow.access.BlockResponse.prototype.getBlockStatus = function() {
  return /** @type {!proto.flow.entities.BlockStatus} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.flow.entities.BlockStatus} value
 * @return {!proto.flow.access.BlockResponse} returns this
 */
proto.flow.access.BlockResponse.prototype.setBlockStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional flow.entities.Metadata metadata = 3;
 * @return {?proto.flow.entities.Metadata}
 */
proto.flow.access.BlockResponse.prototype.getMetadata = function() {
  return /** @type{?proto.flow.entities.Metadata} */ (
    jspb.Message.getWrapperField(this, flow_entities_metadata_pb.Metadata, 3));
};


/**
 * @param {?proto.flow.entities.Metadata|undefined} value
 * @return {!proto.flow.access.BlockResponse} returns this
*/
proto.flow.access.BlockResponse.prototype.setMetadata = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.BlockResponse} returns this
 */
proto.flow.access.BlockResponse.prototype.clearMetadata = function() {
  return this.setMetadata(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.BlockResponse.prototype.hasMetadata = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetCollectionByIDRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetCollectionByIDRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetCollectionByIDRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetCollectionByIDRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: msg.getId_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetCollectionByIDRequest}
 */
proto.flow.access.GetCollectionByIDRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetCollectionByIDRequest;
  return proto.flow.access.GetCollectionByIDRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetCollectionByIDRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetCollectionByIDRequest}
 */
proto.flow.access.GetCollectionByIDRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetCollectionByIDRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetCollectionByIDRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetCollectionByIDRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetCollectionByIDRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
};


/**
 * optional bytes id = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.GetCollectionByIDRequest.prototype.getId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes id = 1;
 * This is a type-conversion wrapper around `getId()`
 * @return {string}
 */
proto.flow.access.GetCollectionByIDRequest.prototype.getId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getId()));
};


/**
 * optional bytes id = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getId()`
 * @return {!Uint8Array}
 */
proto.flow.access.GetCollectionByIDRequest.prototype.getId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.GetCollectionByIDRequest} returns this
 */
proto.flow.access.GetCollectionByIDRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.CollectionResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.CollectionResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.CollectionResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.CollectionResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    collection: (f = msg.getCollection()) && flow_entities_collection_pb.Collection.toObject(includeInstance, f),
    metadata: (f = msg.getMetadata()) && flow_entities_metadata_pb.Metadata.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.CollectionResponse}
 */
proto.flow.access.CollectionResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.CollectionResponse;
  return proto.flow.access.CollectionResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.CollectionResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.CollectionResponse}
 */
proto.flow.access.CollectionResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new flow_entities_collection_pb.Collection;
      reader.readMessage(value,flow_entities_collection_pb.Collection.deserializeBinaryFromReader);
      msg.setCollection(value);
      break;
    case 2:
      var value = new flow_entities_metadata_pb.Metadata;
      reader.readMessage(value,flow_entities_metadata_pb.Metadata.deserializeBinaryFromReader);
      msg.setMetadata(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.CollectionResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.CollectionResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.CollectionResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.CollectionResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCollection();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      flow_entities_collection_pb.Collection.serializeBinaryToWriter
    );
  }
  f = message.getMetadata();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      flow_entities_metadata_pb.Metadata.serializeBinaryToWriter
    );
  }
};


/**
 * optional flow.entities.Collection collection = 1;
 * @return {?proto.flow.entities.Collection}
 */
proto.flow.access.CollectionResponse.prototype.getCollection = function() {
  return /** @type{?proto.flow.entities.Collection} */ (
    jspb.Message.getWrapperField(this, flow_entities_collection_pb.Collection, 1));
};


/**
 * @param {?proto.flow.entities.Collection|undefined} value
 * @return {!proto.flow.access.CollectionResponse} returns this
*/
proto.flow.access.CollectionResponse.prototype.setCollection = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.CollectionResponse} returns this
 */
proto.flow.access.CollectionResponse.prototype.clearCollection = function() {
  return this.setCollection(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.CollectionResponse.prototype.hasCollection = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional flow.entities.Metadata metadata = 2;
 * @return {?proto.flow.entities.Metadata}
 */
proto.flow.access.CollectionResponse.prototype.getMetadata = function() {
  return /** @type{?proto.flow.entities.Metadata} */ (
    jspb.Message.getWrapperField(this, flow_entities_metadata_pb.Metadata, 2));
};


/**
 * @param {?proto.flow.entities.Metadata|undefined} value
 * @return {!proto.flow.access.CollectionResponse} returns this
*/
proto.flow.access.CollectionResponse.prototype.setMetadata = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.CollectionResponse} returns this
 */
proto.flow.access.CollectionResponse.prototype.clearMetadata = function() {
  return this.setMetadata(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.CollectionResponse.prototype.hasMetadata = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.SendTransactionRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.SendTransactionRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.SendTransactionRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SendTransactionRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    transaction: (f = msg.getTransaction()) && flow_entities_transaction_pb.Transaction.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.SendTransactionRequest}
 */
proto.flow.access.SendTransactionRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.SendTransactionRequest;
  return proto.flow.access.SendTransactionRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.SendTransactionRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.SendTransactionRequest}
 */
proto.flow.access.SendTransactionRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new flow_entities_transaction_pb.Transaction;
      reader.readMessage(value,flow_entities_transaction_pb.Transaction.deserializeBinaryFromReader);
      msg.setTransaction(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.SendTransactionRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.SendTransactionRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.SendTransactionRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SendTransactionRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTransaction();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      flow_entities_transaction_pb.Transaction.serializeBinaryToWriter
    );
  }
};


/**
 * optional flow.entities.Transaction transaction = 1;
 * @return {?proto.flow.entities.Transaction}
 */
proto.flow.access.SendTransactionRequest.prototype.getTransaction = function() {
  return /** @type{?proto.flow.entities.Transaction} */ (
    jspb.Message.getWrapperField(this, flow_entities_transaction_pb.Transaction, 1));
};


/**
 * @param {?proto.flow.entities.Transaction|undefined} value
 * @return {!proto.flow.access.SendTransactionRequest} returns this
*/
proto.flow.access.SendTransactionRequest.prototype.setTransaction = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.SendTransactionRequest} returns this
 */
proto.flow.access.SendTransactionRequest.prototype.clearTransaction = function() {
  return this.setTransaction(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.SendTransactionRequest.prototype.hasTransaction = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.SendTransactionResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.SendTransactionResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.SendTransactionResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SendTransactionResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: msg.getId_asB64(),
    metadata: (f = msg.getMetadata()) && flow_entities_metadata_pb.Metadata.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.SendTransactionResponse}
 */
proto.flow.access.SendTransactionResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.SendTransactionResponse;
  return proto.flow.access.SendTransactionResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.SendTransactionResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.SendTransactionResponse}
 */
proto.flow.access.SendTransactionResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setId(value);
      break;
    case 2:
      var value = new flow_entities_metadata_pb.Metadata;
      reader.readMessage(value,flow_entities_metadata_pb.Metadata.deserializeBinaryFromReader);
      msg.setMetadata(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.SendTransactionResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.SendTransactionResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.SendTransactionResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SendTransactionResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getMetadata();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      flow_entities_metadata_pb.Metadata.serializeBinaryToWriter
    );
  }
};


/**
 * optional bytes id = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.SendTransactionResponse.prototype.getId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes id = 1;
 * This is a type-conversion wrapper around `getId()`
 * @return {string}
 */
proto.flow.access.SendTransactionResponse.prototype.getId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getId()));
};


/**
 * optional bytes id = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getId()`
 * @return {!Uint8Array}
 */
proto.flow.access.SendTransactionResponse.prototype.getId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.SendTransactionResponse} returns this
 */
proto.flow.access.SendTransactionResponse.prototype.setId = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional flow.entities.Metadata metadata = 2;
 * @return {?proto.flow.entities.Metadata}
 */
proto.flow.access.SendTransactionResponse.prototype.getMetadata = function() {
  return /** @type{?proto.flow.entities.Metadata} */ (
    jspb.Message.getWrapperField(this, flow_entities_metadata_pb.Metadata, 2));
};


/**
 * @param {?proto.flow.entities.Metadata|undefined} value
 * @return {!proto.flow.access.SendTransactionResponse} returns this
*/
proto.flow.access.SendTransactionResponse.prototype.setMetadata = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.SendTransactionResponse} returns this
 */
proto.flow.access.SendTransactionResponse.prototype.clearMetadata = function() {
  return this.setMetadata(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.SendTransactionResponse.prototype.hasMetadata = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetTransactionRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetTransactionRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetTransactionRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetTransactionRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: msg.getId_asB64(),
    blockId: msg.getBlockId_asB64(),
    collectionId: msg.getCollectionId_asB64(),
    eventEncodingVersion: jspb.Message.getFieldWithDefault(msg, 4, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetTransactionRequest}
 */
proto.flow.access.GetTransactionRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetTransactionRequest;
  return proto.flow.access.GetTransactionRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetTransactionRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetTransactionRequest}
 */
proto.flow.access.GetTransactionRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setBlockId(value);
      break;
    case 3:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setCollectionId(value);
      break;
    case 4:
      var value = /** @type {!proto.flow.entities.EventEncodingVersion} */ (reader.readEnum());
      msg.setEventEncodingVersion(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetTransactionRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetTransactionRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetTransactionRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetTransactionRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getBlockId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = message.getCollectionId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      3,
      f
    );
  }
  f = message.getEventEncodingVersion();
  if (f !== 0.0) {
    writer.writeEnum(
      4,
      f
    );
  }
};


/**
 * optional bytes id = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.GetTransactionRequest.prototype.getId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes id = 1;
 * This is a type-conversion wrapper around `getId()`
 * @return {string}
 */
proto.flow.access.GetTransactionRequest.prototype.getId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getId()));
};


/**
 * optional bytes id = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getId()`
 * @return {!Uint8Array}
 */
proto.flow.access.GetTransactionRequest.prototype.getId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.GetTransactionRequest} returns this
 */
proto.flow.access.GetTransactionRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional bytes block_id = 2;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.GetTransactionRequest.prototype.getBlockId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes block_id = 2;
 * This is a type-conversion wrapper around `getBlockId()`
 * @return {string}
 */
proto.flow.access.GetTransactionRequest.prototype.getBlockId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getBlockId()));
};


/**
 * optional bytes block_id = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getBlockId()`
 * @return {!Uint8Array}
 */
proto.flow.access.GetTransactionRequest.prototype.getBlockId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getBlockId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.GetTransactionRequest} returns this
 */
proto.flow.access.GetTransactionRequest.prototype.setBlockId = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};


/**
 * optional bytes collection_id = 3;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.GetTransactionRequest.prototype.getCollectionId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * optional bytes collection_id = 3;
 * This is a type-conversion wrapper around `getCollectionId()`
 * @return {string}
 */
proto.flow.access.GetTransactionRequest.prototype.getCollectionId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getCollectionId()));
};


/**
 * optional bytes collection_id = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getCollectionId()`
 * @return {!Uint8Array}
 */
proto.flow.access.GetTransactionRequest.prototype.getCollectionId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getCollectionId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.GetTransactionRequest} returns this
 */
proto.flow.access.GetTransactionRequest.prototype.setCollectionId = function(value) {
  return jspb.Message.setProto3BytesField(this, 3, value);
};


/**
 * optional flow.entities.EventEncodingVersion event_encoding_version = 4;
 * @return {!proto.flow.entities.EventEncodingVersion}
 */
proto.flow.access.GetTransactionRequest.prototype.getEventEncodingVersion = function() {
  return /** @type {!proto.flow.entities.EventEncodingVersion} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {!proto.flow.entities.EventEncodingVersion} value
 * @return {!proto.flow.access.GetTransactionRequest} returns this
 */
proto.flow.access.GetTransactionRequest.prototype.setEventEncodingVersion = function(value) {
  return jspb.Message.setProto3EnumField(this, 4, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetSystemTransactionRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetSystemTransactionRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetSystemTransactionRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetSystemTransactionRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    blockId: msg.getBlockId_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetSystemTransactionRequest}
 */
proto.flow.access.GetSystemTransactionRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetSystemTransactionRequest;
  return proto.flow.access.GetSystemTransactionRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetSystemTransactionRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetSystemTransactionRequest}
 */
proto.flow.access.GetSystemTransactionRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setBlockId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetSystemTransactionRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetSystemTransactionRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetSystemTransactionRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetSystemTransactionRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBlockId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
};


/**
 * optional bytes block_id = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.GetSystemTransactionRequest.prototype.getBlockId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes block_id = 1;
 * This is a type-conversion wrapper around `getBlockId()`
 * @return {string}
 */
proto.flow.access.GetSystemTransactionRequest.prototype.getBlockId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getBlockId()));
};


/**
 * optional bytes block_id = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getBlockId()`
 * @return {!Uint8Array}
 */
proto.flow.access.GetSystemTransactionRequest.prototype.getBlockId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getBlockId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.GetSystemTransactionRequest} returns this
 */
proto.flow.access.GetSystemTransactionRequest.prototype.setBlockId = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetSystemTransactionResultRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetSystemTransactionResultRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetSystemTransactionResultRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetSystemTransactionResultRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    blockId: msg.getBlockId_asB64(),
    eventEncodingVersion: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetSystemTransactionResultRequest}
 */
proto.flow.access.GetSystemTransactionResultRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetSystemTransactionResultRequest;
  return proto.flow.access.GetSystemTransactionResultRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetSystemTransactionResultRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetSystemTransactionResultRequest}
 */
proto.flow.access.GetSystemTransactionResultRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setBlockId(value);
      break;
    case 2:
      var value = /** @type {!proto.flow.entities.EventEncodingVersion} */ (reader.readEnum());
      msg.setEventEncodingVersion(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetSystemTransactionResultRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetSystemTransactionResultRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetSystemTransactionResultRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetSystemTransactionResultRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBlockId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getEventEncodingVersion();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
};


/**
 * optional bytes block_id = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.GetSystemTransactionResultRequest.prototype.getBlockId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes block_id = 1;
 * This is a type-conversion wrapper around `getBlockId()`
 * @return {string}
 */
proto.flow.access.GetSystemTransactionResultRequest.prototype.getBlockId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getBlockId()));
};


/**
 * optional bytes block_id = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getBlockId()`
 * @return {!Uint8Array}
 */
proto.flow.access.GetSystemTransactionResultRequest.prototype.getBlockId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getBlockId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.GetSystemTransactionResultRequest} returns this
 */
proto.flow.access.GetSystemTransactionResultRequest.prototype.setBlockId = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional flow.entities.EventEncodingVersion event_encoding_version = 2;
 * @return {!proto.flow.entities.EventEncodingVersion}
 */
proto.flow.access.GetSystemTransactionResultRequest.prototype.getEventEncodingVersion = function() {
  return /** @type {!proto.flow.entities.EventEncodingVersion} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.flow.entities.EventEncodingVersion} value
 * @return {!proto.flow.access.GetSystemTransactionResultRequest} returns this
 */
proto.flow.access.GetSystemTransactionResultRequest.prototype.setEventEncodingVersion = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetTransactionByIndexRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetTransactionByIndexRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetTransactionByIndexRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetTransactionByIndexRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    blockId: msg.getBlockId_asB64(),
    index: jspb.Message.getFieldWithDefault(msg, 2, 0),
    eventEncodingVersion: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetTransactionByIndexRequest}
 */
proto.flow.access.GetTransactionByIndexRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetTransactionByIndexRequest;
  return proto.flow.access.GetTransactionByIndexRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetTransactionByIndexRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetTransactionByIndexRequest}
 */
proto.flow.access.GetTransactionByIndexRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setBlockId(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setIndex(value);
      break;
    case 3:
      var value = /** @type {!proto.flow.entities.EventEncodingVersion} */ (reader.readEnum());
      msg.setEventEncodingVersion(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetTransactionByIndexRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetTransactionByIndexRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetTransactionByIndexRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetTransactionByIndexRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBlockId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getIndex();
  if (f !== 0) {
    writer.writeUint32(
      2,
      f
    );
  }
  f = message.getEventEncodingVersion();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
};


/**
 * optional bytes block_id = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.GetTransactionByIndexRequest.prototype.getBlockId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes block_id = 1;
 * This is a type-conversion wrapper around `getBlockId()`
 * @return {string}
 */
proto.flow.access.GetTransactionByIndexRequest.prototype.getBlockId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getBlockId()));
};


/**
 * optional bytes block_id = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getBlockId()`
 * @return {!Uint8Array}
 */
proto.flow.access.GetTransactionByIndexRequest.prototype.getBlockId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getBlockId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.GetTransactionByIndexRequest} returns this
 */
proto.flow.access.GetTransactionByIndexRequest.prototype.setBlockId = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional uint32 index = 2;
 * @return {number}
 */
proto.flow.access.GetTransactionByIndexRequest.prototype.getIndex = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.flow.access.GetTransactionByIndexRequest} returns this
 */
proto.flow.access.GetTransactionByIndexRequest.prototype.setIndex = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional flow.entities.EventEncodingVersion event_encoding_version = 3;
 * @return {!proto.flow.entities.EventEncodingVersion}
 */
proto.flow.access.GetTransactionByIndexRequest.prototype.getEventEncodingVersion = function() {
  return /** @type {!proto.flow.entities.EventEncodingVersion} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.flow.entities.EventEncodingVersion} value
 * @return {!proto.flow.access.GetTransactionByIndexRequest} returns this
 */
proto.flow.access.GetTransactionByIndexRequest.prototype.setEventEncodingVersion = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetTransactionsByBlockIDRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetTransactionsByBlockIDRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetTransactionsByBlockIDRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetTransactionsByBlockIDRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    blockId: msg.getBlockId_asB64(),
    eventEncodingVersion: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetTransactionsByBlockIDRequest}
 */
proto.flow.access.GetTransactionsByBlockIDRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetTransactionsByBlockIDRequest;
  return proto.flow.access.GetTransactionsByBlockIDRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetTransactionsByBlockIDRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetTransactionsByBlockIDRequest}
 */
proto.flow.access.GetTransactionsByBlockIDRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setBlockId(value);
      break;
    case 2:
      var value = /** @type {!proto.flow.entities.EventEncodingVersion} */ (reader.readEnum());
      msg.setEventEncodingVersion(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetTransactionsByBlockIDRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetTransactionsByBlockIDRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetTransactionsByBlockIDRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetTransactionsByBlockIDRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBlockId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getEventEncodingVersion();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
};


/**
 * optional bytes block_id = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.GetTransactionsByBlockIDRequest.prototype.getBlockId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes block_id = 1;
 * This is a type-conversion wrapper around `getBlockId()`
 * @return {string}
 */
proto.flow.access.GetTransactionsByBlockIDRequest.prototype.getBlockId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getBlockId()));
};


/**
 * optional bytes block_id = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getBlockId()`
 * @return {!Uint8Array}
 */
proto.flow.access.GetTransactionsByBlockIDRequest.prototype.getBlockId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getBlockId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.GetTransactionsByBlockIDRequest} returns this
 */
proto.flow.access.GetTransactionsByBlockIDRequest.prototype.setBlockId = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional flow.entities.EventEncodingVersion event_encoding_version = 2;
 * @return {!proto.flow.entities.EventEncodingVersion}
 */
proto.flow.access.GetTransactionsByBlockIDRequest.prototype.getEventEncodingVersion = function() {
  return /** @type {!proto.flow.entities.EventEncodingVersion} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.flow.entities.EventEncodingVersion} value
 * @return {!proto.flow.access.GetTransactionsByBlockIDRequest} returns this
 */
proto.flow.access.GetTransactionsByBlockIDRequest.prototype.setEventEncodingVersion = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.flow.access.TransactionResultsResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.TransactionResultsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.TransactionResultsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.TransactionResultsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.TransactionResultsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    transactionResultsList: jspb.Message.toObjectList(msg.getTransactionResultsList(),
    proto.flow.access.TransactionResultResponse.toObject, includeInstance),
    metadata: (f = msg.getMetadata()) && flow_entities_metadata_pb.Metadata.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.TransactionResultsResponse}
 */
proto.flow.access.TransactionResultsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.TransactionResultsResponse;
  return proto.flow.access.TransactionResultsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.TransactionResultsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.TransactionResultsResponse}
 */
proto.flow.access.TransactionResultsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.flow.access.TransactionResultResponse;
      reader.readMessage(value,proto.flow.access.TransactionResultResponse.deserializeBinaryFromReader);
      msg.addTransactionResults(value);
      break;
    case 2:
      var value = new flow_entities_metadata_pb.Metadata;
      reader.readMessage(value,flow_entities_metadata_pb.Metadata.deserializeBinaryFromReader);
      msg.setMetadata(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.TransactionResultsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.TransactionResultsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.TransactionResultsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.TransactionResultsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTransactionResultsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.flow.access.TransactionResultResponse.serializeBinaryToWriter
    );
  }
  f = message.getMetadata();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      flow_entities_metadata_pb.Metadata.serializeBinaryToWriter
    );
  }
};


/**
 * repeated TransactionResultResponse transaction_results = 1;
 * @return {!Array<!proto.flow.access.TransactionResultResponse>}
 */
proto.flow.access.TransactionResultsResponse.prototype.getTransactionResultsList = function() {
  return /** @type{!Array<!proto.flow.access.TransactionResultResponse>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.flow.access.TransactionResultResponse, 1));
};


/**
 * @param {!Array<!proto.flow.access.TransactionResultResponse>} value
 * @return {!proto.flow.access.TransactionResultsResponse} returns this
*/
proto.flow.access.TransactionResultsResponse.prototype.setTransactionResultsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.flow.access.TransactionResultResponse=} opt_value
 * @param {number=} opt_index
 * @return {!proto.flow.access.TransactionResultResponse}
 */
proto.flow.access.TransactionResultsResponse.prototype.addTransactionResults = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.flow.access.TransactionResultResponse, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.flow.access.TransactionResultsResponse} returns this
 */
proto.flow.access.TransactionResultsResponse.prototype.clearTransactionResultsList = function() {
  return this.setTransactionResultsList([]);
};


/**
 * optional flow.entities.Metadata metadata = 2;
 * @return {?proto.flow.entities.Metadata}
 */
proto.flow.access.TransactionResultsResponse.prototype.getMetadata = function() {
  return /** @type{?proto.flow.entities.Metadata} */ (
    jspb.Message.getWrapperField(this, flow_entities_metadata_pb.Metadata, 2));
};


/**
 * @param {?proto.flow.entities.Metadata|undefined} value
 * @return {!proto.flow.access.TransactionResultsResponse} returns this
*/
proto.flow.access.TransactionResultsResponse.prototype.setMetadata = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.TransactionResultsResponse} returns this
 */
proto.flow.access.TransactionResultsResponse.prototype.clearMetadata = function() {
  return this.setMetadata(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.TransactionResultsResponse.prototype.hasMetadata = function() {
  return jspb.Message.getField(this, 2) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.flow.access.TransactionsResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.TransactionsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.TransactionsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.TransactionsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.TransactionsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    transactionsList: jspb.Message.toObjectList(msg.getTransactionsList(),
    flow_entities_transaction_pb.Transaction.toObject, includeInstance),
    metadata: (f = msg.getMetadata()) && flow_entities_metadata_pb.Metadata.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.TransactionsResponse}
 */
proto.flow.access.TransactionsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.TransactionsResponse;
  return proto.flow.access.TransactionsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.TransactionsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.TransactionsResponse}
 */
proto.flow.access.TransactionsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new flow_entities_transaction_pb.Transaction;
      reader.readMessage(value,flow_entities_transaction_pb.Transaction.deserializeBinaryFromReader);
      msg.addTransactions(value);
      break;
    case 2:
      var value = new flow_entities_metadata_pb.Metadata;
      reader.readMessage(value,flow_entities_metadata_pb.Metadata.deserializeBinaryFromReader);
      msg.setMetadata(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.TransactionsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.TransactionsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.TransactionsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.TransactionsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTransactionsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      flow_entities_transaction_pb.Transaction.serializeBinaryToWriter
    );
  }
  f = message.getMetadata();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      flow_entities_metadata_pb.Metadata.serializeBinaryToWriter
    );
  }
};


/**
 * repeated flow.entities.Transaction transactions = 1;
 * @return {!Array<!proto.flow.entities.Transaction>}
 */
proto.flow.access.TransactionsResponse.prototype.getTransactionsList = function() {
  return /** @type{!Array<!proto.flow.entities.Transaction>} */ (
    jspb.Message.getRepeatedWrapperField(this, flow_entities_transaction_pb.Transaction, 1));
};


/**
 * @param {!Array<!proto.flow.entities.Transaction>} value
 * @return {!proto.flow.access.TransactionsResponse} returns this
*/
proto.flow.access.TransactionsResponse.prototype.setTransactionsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.flow.entities.Transaction=} opt_value
 * @param {number=} opt_index
 * @return {!proto.flow.entities.Transaction}
 */
proto.flow.access.TransactionsResponse.prototype.addTransactions = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.flow.entities.Transaction, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.flow.access.TransactionsResponse} returns this
 */
proto.flow.access.TransactionsResponse.prototype.clearTransactionsList = function() {
  return this.setTransactionsList([]);
};


/**
 * optional flow.entities.Metadata metadata = 2;
 * @return {?proto.flow.entities.Metadata}
 */
proto.flow.access.TransactionsResponse.prototype.getMetadata = function() {
  return /** @type{?proto.flow.entities.Metadata} */ (
    jspb.Message.getWrapperField(this, flow_entities_metadata_pb.Metadata, 2));
};


/**
 * @param {?proto.flow.entities.Metadata|undefined} value
 * @return {!proto.flow.access.TransactionsResponse} returns this
*/
proto.flow.access.TransactionsResponse.prototype.setMetadata = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.TransactionsResponse} returns this
 */
proto.flow.access.TransactionsResponse.prototype.clearMetadata = function() {
  return this.setMetadata(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.TransactionsResponse.prototype.hasMetadata = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.TransactionResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.TransactionResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.TransactionResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.TransactionResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    transaction: (f = msg.getTransaction()) && flow_entities_transaction_pb.Transaction.toObject(includeInstance, f),
    metadata: (f = msg.getMetadata()) && flow_entities_metadata_pb.Metadata.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.TransactionResponse}
 */
proto.flow.access.TransactionResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.TransactionResponse;
  return proto.flow.access.TransactionResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.TransactionResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.TransactionResponse}
 */
proto.flow.access.TransactionResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new flow_entities_transaction_pb.Transaction;
      reader.readMessage(value,flow_entities_transaction_pb.Transaction.deserializeBinaryFromReader);
      msg.setTransaction(value);
      break;
    case 2:
      var value = new flow_entities_metadata_pb.Metadata;
      reader.readMessage(value,flow_entities_metadata_pb.Metadata.deserializeBinaryFromReader);
      msg.setMetadata(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.TransactionResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.TransactionResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.TransactionResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.TransactionResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTransaction();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      flow_entities_transaction_pb.Transaction.serializeBinaryToWriter
    );
  }
  f = message.getMetadata();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      flow_entities_metadata_pb.Metadata.serializeBinaryToWriter
    );
  }
};


/**
 * optional flow.entities.Transaction transaction = 1;
 * @return {?proto.flow.entities.Transaction}
 */
proto.flow.access.TransactionResponse.prototype.getTransaction = function() {
  return /** @type{?proto.flow.entities.Transaction} */ (
    jspb.Message.getWrapperField(this, flow_entities_transaction_pb.Transaction, 1));
};


/**
 * @param {?proto.flow.entities.Transaction|undefined} value
 * @return {!proto.flow.access.TransactionResponse} returns this
*/
proto.flow.access.TransactionResponse.prototype.setTransaction = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.TransactionResponse} returns this
 */
proto.flow.access.TransactionResponse.prototype.clearTransaction = function() {
  return this.setTransaction(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.TransactionResponse.prototype.hasTransaction = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional flow.entities.Metadata metadata = 2;
 * @return {?proto.flow.entities.Metadata}
 */
proto.flow.access.TransactionResponse.prototype.getMetadata = function() {
  return /** @type{?proto.flow.entities.Metadata} */ (
    jspb.Message.getWrapperField(this, flow_entities_metadata_pb.Metadata, 2));
};


/**
 * @param {?proto.flow.entities.Metadata|undefined} value
 * @return {!proto.flow.access.TransactionResponse} returns this
*/
proto.flow.access.TransactionResponse.prototype.setMetadata = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.TransactionResponse} returns this
 */
proto.flow.access.TransactionResponse.prototype.clearMetadata = function() {
  return this.setMetadata(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.TransactionResponse.prototype.hasMetadata = function() {
  return jspb.Message.getField(this, 2) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.flow.access.TransactionResultResponse.repeatedFields_ = [4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.TransactionResultResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.TransactionResultResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.TransactionResultResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.TransactionResultResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    status: jspb.Message.getFieldWithDefault(msg, 1, 0),
    statusCode: jspb.Message.getFieldWithDefault(msg, 2, 0),
    errorMessage: jspb.Message.getFieldWithDefault(msg, 3, ""),
    eventsList: jspb.Message.toObjectList(msg.getEventsList(),
    flow_entities_event_pb.Event.toObject, includeInstance),
    blockId: msg.getBlockId_asB64(),
    transactionId: msg.getTransactionId_asB64(),
    collectionId: msg.getCollectionId_asB64(),
    blockHeight: jspb.Message.getFieldWithDefault(msg, 8, 0),
    metadata: (f = msg.getMetadata()) && flow_entities_metadata_pb.Metadata.toObject(includeInstance, f),
    computationUsage: jspb.Message.getFieldWithDefault(msg, 10, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.TransactionResultResponse}
 */
proto.flow.access.TransactionResultResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.TransactionResultResponse;
  return proto.flow.access.TransactionResultResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.TransactionResultResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.TransactionResultResponse}
 */
proto.flow.access.TransactionResultResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.flow.entities.TransactionStatus} */ (reader.readEnum());
      msg.setStatus(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setStatusCode(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setErrorMessage(value);
      break;
    case 4:
      var value = new flow_entities_event_pb.Event;
      reader.readMessage(value,flow_entities_event_pb.Event.deserializeBinaryFromReader);
      msg.addEvents(value);
      break;
    case 5:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setBlockId(value);
      break;
    case 6:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setTransactionId(value);
      break;
    case 7:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setCollectionId(value);
      break;
    case 8:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setBlockHeight(value);
      break;
    case 9:
      var value = new flow_entities_metadata_pb.Metadata;
      reader.readMessage(value,flow_entities_metadata_pb.Metadata.deserializeBinaryFromReader);
      msg.setMetadata(value);
      break;
    case 10:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setComputationUsage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.TransactionResultResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.TransactionResultResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.TransactionResultResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.TransactionResultResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getStatusCode();
  if (f !== 0) {
    writer.writeUint32(
      2,
      f
    );
  }
  f = message.getErrorMessage();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getEventsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      4,
      f,
      flow_entities_event_pb.Event.serializeBinaryToWriter
    );
  }
  f = message.getBlockId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      5,
      f
    );
  }
  f = message.getTransactionId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      6,
      f
    );
  }
  f = message.getCollectionId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      7,
      f
    );
  }
  f = message.getBlockHeight();
  if (f !== 0) {
    writer.writeUint64(
      8,
      f
    );
  }
  f = message.getMetadata();
  if (f != null) {
    writer.writeMessage(
      9,
      f,
      flow_entities_metadata_pb.Metadata.serializeBinaryToWriter
    );
  }
  f = message.getComputationUsage();
  if (f !== 0) {
    writer.writeUint64(
      10,
      f
    );
  }
};


/**
 * optional flow.entities.TransactionStatus status = 1;
 * @return {!proto.flow.entities.TransactionStatus}
 */
proto.flow.access.TransactionResultResponse.prototype.getStatus = function() {
  return /** @type {!proto.flow.entities.TransactionStatus} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.flow.entities.TransactionStatus} value
 * @return {!proto.flow.access.TransactionResultResponse} returns this
 */
proto.flow.access.TransactionResultResponse.prototype.setStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional uint32 status_code = 2;
 * @return {number}
 */
proto.flow.access.TransactionResultResponse.prototype.getStatusCode = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.flow.access.TransactionResultResponse} returns this
 */
proto.flow.access.TransactionResultResponse.prototype.setStatusCode = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional string error_message = 3;
 * @return {string}
 */
proto.flow.access.TransactionResultResponse.prototype.getErrorMessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.flow.access.TransactionResultResponse} returns this
 */
proto.flow.access.TransactionResultResponse.prototype.setErrorMessage = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * repeated flow.entities.Event events = 4;
 * @return {!Array<!proto.flow.entities.Event>}
 */
proto.flow.access.TransactionResultResponse.prototype.getEventsList = function() {
  return /** @type{!Array<!proto.flow.entities.Event>} */ (
    jspb.Message.getRepeatedWrapperField(this, flow_entities_event_pb.Event, 4));
};


/**
 * @param {!Array<!proto.flow.entities.Event>} value
 * @return {!proto.flow.access.TransactionResultResponse} returns this
*/
proto.flow.access.TransactionResultResponse.prototype.setEventsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 4, value);
};


/**
 * @param {!proto.flow.entities.Event=} opt_value
 * @param {number=} opt_index
 * @return {!proto.flow.entities.Event}
 */
proto.flow.access.TransactionResultResponse.prototype.addEvents = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 4, opt_value, proto.flow.entities.Event, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.flow.access.TransactionResultResponse} returns this
 */
proto.flow.access.TransactionResultResponse.prototype.clearEventsList = function() {
  return this.setEventsList([]);
};


/**
 * optional bytes block_id = 5;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.TransactionResultResponse.prototype.getBlockId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * optional bytes block_id = 5;
 * This is a type-conversion wrapper around `getBlockId()`
 * @return {string}
 */
proto.flow.access.TransactionResultResponse.prototype.getBlockId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getBlockId()));
};


/**
 * optional bytes block_id = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getBlockId()`
 * @return {!Uint8Array}
 */
proto.flow.access.TransactionResultResponse.prototype.getBlockId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getBlockId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.TransactionResultResponse} returns this
 */
proto.flow.access.TransactionResultResponse.prototype.setBlockId = function(value) {
  return jspb.Message.setProto3BytesField(this, 5, value);
};


/**
 * optional bytes transaction_id = 6;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.TransactionResultResponse.prototype.getTransactionId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * optional bytes transaction_id = 6;
 * This is a type-conversion wrapper around `getTransactionId()`
 * @return {string}
 */
proto.flow.access.TransactionResultResponse.prototype.getTransactionId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getTransactionId()));
};


/**
 * optional bytes transaction_id = 6;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getTransactionId()`
 * @return {!Uint8Array}
 */
proto.flow.access.TransactionResultResponse.prototype.getTransactionId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getTransactionId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.TransactionResultResponse} returns this
 */
proto.flow.access.TransactionResultResponse.prototype.setTransactionId = function(value) {
  return jspb.Message.setProto3BytesField(this, 6, value);
};


/**
 * optional bytes collection_id = 7;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.TransactionResultResponse.prototype.getCollectionId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * optional bytes collection_id = 7;
 * This is a type-conversion wrapper around `getCollectionId()`
 * @return {string}
 */
proto.flow.access.TransactionResultResponse.prototype.getCollectionId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getCollectionId()));
};


/**
 * optional bytes collection_id = 7;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getCollectionId()`
 * @return {!Uint8Array}
 */
proto.flow.access.TransactionResultResponse.prototype.getCollectionId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getCollectionId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.TransactionResultResponse} returns this
 */
proto.flow.access.TransactionResultResponse.prototype.setCollectionId = function(value) {
  return jspb.Message.setProto3BytesField(this, 7, value);
};


/**
 * optional uint64 block_height = 8;
 * @return {number}
 */
proto.flow.access.TransactionResultResponse.prototype.getBlockHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 8, 0));
};


/**
 * @param {number} value
 * @return {!proto.flow.access.TransactionResultResponse} returns this
 */
proto.flow.access.TransactionResultResponse.prototype.setBlockHeight = function(value) {
  return jspb.Message.setProto3IntField(this, 8, value);
};


/**
 * optional flow.entities.Metadata metadata = 9;
 * @return {?proto.flow.entities.Metadata}
 */
proto.flow.access.TransactionResultResponse.prototype.getMetadata = function() {
  return /** @type{?proto.flow.entities.Metadata} */ (
    jspb.Message.getWrapperField(this, flow_entities_metadata_pb.Metadata, 9));
};


/**
 * @param {?proto.flow.entities.Metadata|undefined} value
 * @return {!proto.flow.access.TransactionResultResponse} returns this
*/
proto.flow.access.TransactionResultResponse.prototype.setMetadata = function(value) {
  return jspb.Message.setWrapperField(this, 9, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.TransactionResultResponse} returns this
 */
proto.flow.access.TransactionResultResponse.prototype.clearMetadata = function() {
  return this.setMetadata(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.TransactionResultResponse.prototype.hasMetadata = function() {
  return jspb.Message.getField(this, 9) != null;
};


/**
 * optional uint64 computation_usage = 10;
 * @return {number}
 */
proto.flow.access.TransactionResultResponse.prototype.getComputationUsage = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 10, 0));
};


/**
 * @param {number} value
 * @return {!proto.flow.access.TransactionResultResponse} returns this
 */
proto.flow.access.TransactionResultResponse.prototype.setComputationUsage = function(value) {
  return jspb.Message.setProto3IntField(this, 10, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetAccountRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetAccountRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetAccountRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetAccountRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    address: msg.getAddress_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetAccountRequest}
 */
proto.flow.access.GetAccountRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetAccountRequest;
  return proto.flow.access.GetAccountRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetAccountRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetAccountRequest}
 */
proto.flow.access.GetAccountRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setAddress(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetAccountRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetAccountRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetAccountRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetAccountRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAddress_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
};


/**
 * optional bytes address = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.GetAccountRequest.prototype.getAddress = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes address = 1;
 * This is a type-conversion wrapper around `getAddress()`
 * @return {string}
 */
proto.flow.access.GetAccountRequest.prototype.getAddress_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getAddress()));
};


/**
 * optional bytes address = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAddress()`
 * @return {!Uint8Array}
 */
proto.flow.access.GetAccountRequest.prototype.getAddress_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getAddress()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.GetAccountRequest} returns this
 */
proto.flow.access.GetAccountRequest.prototype.setAddress = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetAccountResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetAccountResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetAccountResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetAccountResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    account: (f = msg.getAccount()) && flow_entities_account_pb.Account.toObject(includeInstance, f),
    metadata: (f = msg.getMetadata()) && flow_entities_metadata_pb.Metadata.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetAccountResponse}
 */
proto.flow.access.GetAccountResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetAccountResponse;
  return proto.flow.access.GetAccountResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetAccountResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetAccountResponse}
 */
proto.flow.access.GetAccountResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new flow_entities_account_pb.Account;
      reader.readMessage(value,flow_entities_account_pb.Account.deserializeBinaryFromReader);
      msg.setAccount(value);
      break;
    case 2:
      var value = new flow_entities_metadata_pb.Metadata;
      reader.readMessage(value,flow_entities_metadata_pb.Metadata.deserializeBinaryFromReader);
      msg.setMetadata(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetAccountResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetAccountResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetAccountResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetAccountResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAccount();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      flow_entities_account_pb.Account.serializeBinaryToWriter
    );
  }
  f = message.getMetadata();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      flow_entities_metadata_pb.Metadata.serializeBinaryToWriter
    );
  }
};


/**
 * optional flow.entities.Account account = 1;
 * @return {?proto.flow.entities.Account}
 */
proto.flow.access.GetAccountResponse.prototype.getAccount = function() {
  return /** @type{?proto.flow.entities.Account} */ (
    jspb.Message.getWrapperField(this, flow_entities_account_pb.Account, 1));
};


/**
 * @param {?proto.flow.entities.Account|undefined} value
 * @return {!proto.flow.access.GetAccountResponse} returns this
*/
proto.flow.access.GetAccountResponse.prototype.setAccount = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.GetAccountResponse} returns this
 */
proto.flow.access.GetAccountResponse.prototype.clearAccount = function() {
  return this.setAccount(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.GetAccountResponse.prototype.hasAccount = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional flow.entities.Metadata metadata = 2;
 * @return {?proto.flow.entities.Metadata}
 */
proto.flow.access.GetAccountResponse.prototype.getMetadata = function() {
  return /** @type{?proto.flow.entities.Metadata} */ (
    jspb.Message.getWrapperField(this, flow_entities_metadata_pb.Metadata, 2));
};


/**
 * @param {?proto.flow.entities.Metadata|undefined} value
 * @return {!proto.flow.access.GetAccountResponse} returns this
*/
proto.flow.access.GetAccountResponse.prototype.setMetadata = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.GetAccountResponse} returns this
 */
proto.flow.access.GetAccountResponse.prototype.clearMetadata = function() {
  return this.setMetadata(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.GetAccountResponse.prototype.hasMetadata = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetAccountAtLatestBlockRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetAccountAtLatestBlockRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetAccountAtLatestBlockRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetAccountAtLatestBlockRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    address: msg.getAddress_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetAccountAtLatestBlockRequest}
 */
proto.flow.access.GetAccountAtLatestBlockRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetAccountAtLatestBlockRequest;
  return proto.flow.access.GetAccountAtLatestBlockRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetAccountAtLatestBlockRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetAccountAtLatestBlockRequest}
 */
proto.flow.access.GetAccountAtLatestBlockRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setAddress(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetAccountAtLatestBlockRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetAccountAtLatestBlockRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetAccountAtLatestBlockRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetAccountAtLatestBlockRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAddress_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
};


/**
 * optional bytes address = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.GetAccountAtLatestBlockRequest.prototype.getAddress = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes address = 1;
 * This is a type-conversion wrapper around `getAddress()`
 * @return {string}
 */
proto.flow.access.GetAccountAtLatestBlockRequest.prototype.getAddress_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getAddress()));
};


/**
 * optional bytes address = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAddress()`
 * @return {!Uint8Array}
 */
proto.flow.access.GetAccountAtLatestBlockRequest.prototype.getAddress_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getAddress()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.GetAccountAtLatestBlockRequest} returns this
 */
proto.flow.access.GetAccountAtLatestBlockRequest.prototype.setAddress = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.AccountResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.AccountResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.AccountResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.AccountResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    account: (f = msg.getAccount()) && flow_entities_account_pb.Account.toObject(includeInstance, f),
    metadata: (f = msg.getMetadata()) && flow_entities_metadata_pb.Metadata.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.AccountResponse}
 */
proto.flow.access.AccountResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.AccountResponse;
  return proto.flow.access.AccountResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.AccountResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.AccountResponse}
 */
proto.flow.access.AccountResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new flow_entities_account_pb.Account;
      reader.readMessage(value,flow_entities_account_pb.Account.deserializeBinaryFromReader);
      msg.setAccount(value);
      break;
    case 2:
      var value = new flow_entities_metadata_pb.Metadata;
      reader.readMessage(value,flow_entities_metadata_pb.Metadata.deserializeBinaryFromReader);
      msg.setMetadata(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.AccountResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.AccountResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.AccountResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.AccountResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAccount();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      flow_entities_account_pb.Account.serializeBinaryToWriter
    );
  }
  f = message.getMetadata();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      flow_entities_metadata_pb.Metadata.serializeBinaryToWriter
    );
  }
};


/**
 * optional flow.entities.Account account = 1;
 * @return {?proto.flow.entities.Account}
 */
proto.flow.access.AccountResponse.prototype.getAccount = function() {
  return /** @type{?proto.flow.entities.Account} */ (
    jspb.Message.getWrapperField(this, flow_entities_account_pb.Account, 1));
};


/**
 * @param {?proto.flow.entities.Account|undefined} value
 * @return {!proto.flow.access.AccountResponse} returns this
*/
proto.flow.access.AccountResponse.prototype.setAccount = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.AccountResponse} returns this
 */
proto.flow.access.AccountResponse.prototype.clearAccount = function() {
  return this.setAccount(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.AccountResponse.prototype.hasAccount = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional flow.entities.Metadata metadata = 2;
 * @return {?proto.flow.entities.Metadata}
 */
proto.flow.access.AccountResponse.prototype.getMetadata = function() {
  return /** @type{?proto.flow.entities.Metadata} */ (
    jspb.Message.getWrapperField(this, flow_entities_metadata_pb.Metadata, 2));
};


/**
 * @param {?proto.flow.entities.Metadata|undefined} value
 * @return {!proto.flow.access.AccountResponse} returns this
*/
proto.flow.access.AccountResponse.prototype.setMetadata = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.AccountResponse} returns this
 */
proto.flow.access.AccountResponse.prototype.clearMetadata = function() {
  return this.setMetadata(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.AccountResponse.prototype.hasMetadata = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetAccountAtBlockHeightRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetAccountAtBlockHeightRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetAccountAtBlockHeightRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetAccountAtBlockHeightRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    address: msg.getAddress_asB64(),
    blockHeight: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetAccountAtBlockHeightRequest}
 */
proto.flow.access.GetAccountAtBlockHeightRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetAccountAtBlockHeightRequest;
  return proto.flow.access.GetAccountAtBlockHeightRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetAccountAtBlockHeightRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetAccountAtBlockHeightRequest}
 */
proto.flow.access.GetAccountAtBlockHeightRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setAddress(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setBlockHeight(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetAccountAtBlockHeightRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetAccountAtBlockHeightRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetAccountAtBlockHeightRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetAccountAtBlockHeightRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAddress_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getBlockHeight();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
};


/**
 * optional bytes address = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.GetAccountAtBlockHeightRequest.prototype.getAddress = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes address = 1;
 * This is a type-conversion wrapper around `getAddress()`
 * @return {string}
 */
proto.flow.access.GetAccountAtBlockHeightRequest.prototype.getAddress_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getAddress()));
};


/**
 * optional bytes address = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getAddress()`
 * @return {!Uint8Array}
 */
proto.flow.access.GetAccountAtBlockHeightRequest.prototype.getAddress_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getAddress()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.GetAccountAtBlockHeightRequest} returns this
 */
proto.flow.access.GetAccountAtBlockHeightRequest.prototype.setAddress = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional uint64 block_height = 2;
 * @return {number}
 */
proto.flow.access.GetAccountAtBlockHeightRequest.prototype.getBlockHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.flow.access.GetAccountAtBlockHeightRequest} returns this
 */
proto.flow.access.GetAccountAtBlockHeightRequest.prototype.setBlockHeight = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.flow.access.ExecuteScriptAtLatestBlockRequest.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.ExecuteScriptAtLatestBlockRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.ExecuteScriptAtLatestBlockRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.ExecuteScriptAtLatestBlockRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.ExecuteScriptAtLatestBlockRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    script: msg.getScript_asB64(),
    argumentsList: msg.getArgumentsList_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.ExecuteScriptAtLatestBlockRequest}
 */
proto.flow.access.ExecuteScriptAtLatestBlockRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.ExecuteScriptAtLatestBlockRequest;
  return proto.flow.access.ExecuteScriptAtLatestBlockRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.ExecuteScriptAtLatestBlockRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.ExecuteScriptAtLatestBlockRequest}
 */
proto.flow.access.ExecuteScriptAtLatestBlockRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setScript(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.addArguments(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.ExecuteScriptAtLatestBlockRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.ExecuteScriptAtLatestBlockRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.ExecuteScriptAtLatestBlockRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.ExecuteScriptAtLatestBlockRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getScript_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getArgumentsList_asU8();
  if (f.length > 0) {
    writer.writeRepeatedBytes(
      2,
      f
    );
  }
};


/**
 * optional bytes script = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.ExecuteScriptAtLatestBlockRequest.prototype.getScript = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes script = 1;
 * This is a type-conversion wrapper around `getScript()`
 * @return {string}
 */
proto.flow.access.ExecuteScriptAtLatestBlockRequest.prototype.getScript_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getScript()));
};


/**
 * optional bytes script = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getScript()`
 * @return {!Uint8Array}
 */
proto.flow.access.ExecuteScriptAtLatestBlockRequest.prototype.getScript_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getScript()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.ExecuteScriptAtLatestBlockRequest} returns this
 */
proto.flow.access.ExecuteScriptAtLatestBlockRequest.prototype.setScript = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * repeated bytes arguments = 2;
 * @return {!(Array<!Uint8Array>|Array<string>)}
 */
proto.flow.access.ExecuteScriptAtLatestBlockRequest.prototype.getArgumentsList = function() {
  return /** @type {!(Array<!Uint8Array>|Array<string>)} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * repeated bytes arguments = 2;
 * This is a type-conversion wrapper around `getArgumentsList()`
 * @return {!Array<string>}
 */
proto.flow.access.ExecuteScriptAtLatestBlockRequest.prototype.getArgumentsList_asB64 = function() {
  return /** @type {!Array<string>} */ (jspb.Message.bytesListAsB64(
      this.getArgumentsList()));
};


/**
 * repeated bytes arguments = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getArgumentsList()`
 * @return {!Array<!Uint8Array>}
 */
proto.flow.access.ExecuteScriptAtLatestBlockRequest.prototype.getArgumentsList_asU8 = function() {
  return /** @type {!Array<!Uint8Array>} */ (jspb.Message.bytesListAsU8(
      this.getArgumentsList()));
};


/**
 * @param {!(Array<!Uint8Array>|Array<string>)} value
 * @return {!proto.flow.access.ExecuteScriptAtLatestBlockRequest} returns this
 */
proto.flow.access.ExecuteScriptAtLatestBlockRequest.prototype.setArgumentsList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {!(string|Uint8Array)} value
 * @param {number=} opt_index
 * @return {!proto.flow.access.ExecuteScriptAtLatestBlockRequest} returns this
 */
proto.flow.access.ExecuteScriptAtLatestBlockRequest.prototype.addArguments = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.flow.access.ExecuteScriptAtLatestBlockRequest} returns this
 */
proto.flow.access.ExecuteScriptAtLatestBlockRequest.prototype.clearArgumentsList = function() {
  return this.setArgumentsList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.flow.access.ExecuteScriptAtBlockIDRequest.repeatedFields_ = [3];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.ExecuteScriptAtBlockIDRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.ExecuteScriptAtBlockIDRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.ExecuteScriptAtBlockIDRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.ExecuteScriptAtBlockIDRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    blockId: msg.getBlockId_asB64(),
    script: msg.getScript_asB64(),
    argumentsList: msg.getArgumentsList_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.ExecuteScriptAtBlockIDRequest}
 */
proto.flow.access.ExecuteScriptAtBlockIDRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.ExecuteScriptAtBlockIDRequest;
  return proto.flow.access.ExecuteScriptAtBlockIDRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.ExecuteScriptAtBlockIDRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.ExecuteScriptAtBlockIDRequest}
 */
proto.flow.access.ExecuteScriptAtBlockIDRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setBlockId(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setScript(value);
      break;
    case 3:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.addArguments(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.ExecuteScriptAtBlockIDRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.ExecuteScriptAtBlockIDRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.ExecuteScriptAtBlockIDRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.ExecuteScriptAtBlockIDRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBlockId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getScript_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = message.getArgumentsList_asU8();
  if (f.length > 0) {
    writer.writeRepeatedBytes(
      3,
      f
    );
  }
};


/**
 * optional bytes block_id = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.ExecuteScriptAtBlockIDRequest.prototype.getBlockId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes block_id = 1;
 * This is a type-conversion wrapper around `getBlockId()`
 * @return {string}
 */
proto.flow.access.ExecuteScriptAtBlockIDRequest.prototype.getBlockId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getBlockId()));
};


/**
 * optional bytes block_id = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getBlockId()`
 * @return {!Uint8Array}
 */
proto.flow.access.ExecuteScriptAtBlockIDRequest.prototype.getBlockId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getBlockId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.ExecuteScriptAtBlockIDRequest} returns this
 */
proto.flow.access.ExecuteScriptAtBlockIDRequest.prototype.setBlockId = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional bytes script = 2;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.ExecuteScriptAtBlockIDRequest.prototype.getScript = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes script = 2;
 * This is a type-conversion wrapper around `getScript()`
 * @return {string}
 */
proto.flow.access.ExecuteScriptAtBlockIDRequest.prototype.getScript_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getScript()));
};


/**
 * optional bytes script = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getScript()`
 * @return {!Uint8Array}
 */
proto.flow.access.ExecuteScriptAtBlockIDRequest.prototype.getScript_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getScript()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.ExecuteScriptAtBlockIDRequest} returns this
 */
proto.flow.access.ExecuteScriptAtBlockIDRequest.prototype.setScript = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};


/**
 * repeated bytes arguments = 3;
 * @return {!(Array<!Uint8Array>|Array<string>)}
 */
proto.flow.access.ExecuteScriptAtBlockIDRequest.prototype.getArgumentsList = function() {
  return /** @type {!(Array<!Uint8Array>|Array<string>)} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * repeated bytes arguments = 3;
 * This is a type-conversion wrapper around `getArgumentsList()`
 * @return {!Array<string>}
 */
proto.flow.access.ExecuteScriptAtBlockIDRequest.prototype.getArgumentsList_asB64 = function() {
  return /** @type {!Array<string>} */ (jspb.Message.bytesListAsB64(
      this.getArgumentsList()));
};


/**
 * repeated bytes arguments = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getArgumentsList()`
 * @return {!Array<!Uint8Array>}
 */
proto.flow.access.ExecuteScriptAtBlockIDRequest.prototype.getArgumentsList_asU8 = function() {
  return /** @type {!Array<!Uint8Array>} */ (jspb.Message.bytesListAsU8(
      this.getArgumentsList()));
};


/**
 * @param {!(Array<!Uint8Array>|Array<string>)} value
 * @return {!proto.flow.access.ExecuteScriptAtBlockIDRequest} returns this
 */
proto.flow.access.ExecuteScriptAtBlockIDRequest.prototype.setArgumentsList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {!(string|Uint8Array)} value
 * @param {number=} opt_index
 * @return {!proto.flow.access.ExecuteScriptAtBlockIDRequest} returns this
 */
proto.flow.access.ExecuteScriptAtBlockIDRequest.prototype.addArguments = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.flow.access.ExecuteScriptAtBlockIDRequest} returns this
 */
proto.flow.access.ExecuteScriptAtBlockIDRequest.prototype.clearArgumentsList = function() {
  return this.setArgumentsList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.flow.access.ExecuteScriptAtBlockHeightRequest.repeatedFields_ = [3];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.ExecuteScriptAtBlockHeightRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.ExecuteScriptAtBlockHeightRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.ExecuteScriptAtBlockHeightRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.ExecuteScriptAtBlockHeightRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    blockHeight: jspb.Message.getFieldWithDefault(msg, 1, 0),
    script: msg.getScript_asB64(),
    argumentsList: msg.getArgumentsList_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.ExecuteScriptAtBlockHeightRequest}
 */
proto.flow.access.ExecuteScriptAtBlockHeightRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.ExecuteScriptAtBlockHeightRequest;
  return proto.flow.access.ExecuteScriptAtBlockHeightRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.ExecuteScriptAtBlockHeightRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.ExecuteScriptAtBlockHeightRequest}
 */
proto.flow.access.ExecuteScriptAtBlockHeightRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setBlockHeight(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setScript(value);
      break;
    case 3:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.addArguments(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.ExecuteScriptAtBlockHeightRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.ExecuteScriptAtBlockHeightRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.ExecuteScriptAtBlockHeightRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.ExecuteScriptAtBlockHeightRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBlockHeight();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = message.getScript_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = message.getArgumentsList_asU8();
  if (f.length > 0) {
    writer.writeRepeatedBytes(
      3,
      f
    );
  }
};


/**
 * optional uint64 block_height = 1;
 * @return {number}
 */
proto.flow.access.ExecuteScriptAtBlockHeightRequest.prototype.getBlockHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.flow.access.ExecuteScriptAtBlockHeightRequest} returns this
 */
proto.flow.access.ExecuteScriptAtBlockHeightRequest.prototype.setBlockHeight = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional bytes script = 2;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.ExecuteScriptAtBlockHeightRequest.prototype.getScript = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes script = 2;
 * This is a type-conversion wrapper around `getScript()`
 * @return {string}
 */
proto.flow.access.ExecuteScriptAtBlockHeightRequest.prototype.getScript_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getScript()));
};


/**
 * optional bytes script = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getScript()`
 * @return {!Uint8Array}
 */
proto.flow.access.ExecuteScriptAtBlockHeightRequest.prototype.getScript_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getScript()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.ExecuteScriptAtBlockHeightRequest} returns this
 */
proto.flow.access.ExecuteScriptAtBlockHeightRequest.prototype.setScript = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
};


/**
 * repeated bytes arguments = 3;
 * @return {!(Array<!Uint8Array>|Array<string>)}
 */
proto.flow.access.ExecuteScriptAtBlockHeightRequest.prototype.getArgumentsList = function() {
  return /** @type {!(Array<!Uint8Array>|Array<string>)} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * repeated bytes arguments = 3;
 * This is a type-conversion wrapper around `getArgumentsList()`
 * @return {!Array<string>}
 */
proto.flow.access.ExecuteScriptAtBlockHeightRequest.prototype.getArgumentsList_asB64 = function() {
  return /** @type {!Array<string>} */ (jspb.Message.bytesListAsB64(
      this.getArgumentsList()));
};


/**
 * repeated bytes arguments = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getArgumentsList()`
 * @return {!Array<!Uint8Array>}
 */
proto.flow.access.ExecuteScriptAtBlockHeightRequest.prototype.getArgumentsList_asU8 = function() {
  return /** @type {!Array<!Uint8Array>} */ (jspb.Message.bytesListAsU8(
      this.getArgumentsList()));
};


/**
 * @param {!(Array<!Uint8Array>|Array<string>)} value
 * @return {!proto.flow.access.ExecuteScriptAtBlockHeightRequest} returns this
 */
proto.flow.access.ExecuteScriptAtBlockHeightRequest.prototype.setArgumentsList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {!(string|Uint8Array)} value
 * @param {number=} opt_index
 * @return {!proto.flow.access.ExecuteScriptAtBlockHeightRequest} returns this
 */
proto.flow.access.ExecuteScriptAtBlockHeightRequest.prototype.addArguments = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.flow.access.ExecuteScriptAtBlockHeightRequest} returns this
 */
proto.flow.access.ExecuteScriptAtBlockHeightRequest.prototype.clearArgumentsList = function() {
  return this.setArgumentsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.ExecuteScriptResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.ExecuteScriptResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.ExecuteScriptResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.ExecuteScriptResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    value: msg.getValue_asB64(),
    metadata: (f = msg.getMetadata()) && flow_entities_metadata_pb.Metadata.toObject(includeInstance, f),
    computationUsage: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.ExecuteScriptResponse}
 */
proto.flow.access.ExecuteScriptResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.ExecuteScriptResponse;
  return proto.flow.access.ExecuteScriptResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.ExecuteScriptResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.ExecuteScriptResponse}
 */
proto.flow.access.ExecuteScriptResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setValue(value);
      break;
    case 2:
      var value = new flow_entities_metadata_pb.Metadata;
      reader.readMessage(value,flow_entities_metadata_pb.Metadata.deserializeBinaryFromReader);
      msg.setMetadata(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setComputationUsage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.ExecuteScriptResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.ExecuteScriptResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.ExecuteScriptResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.ExecuteScriptResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getValue_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getMetadata();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      flow_entities_metadata_pb.Metadata.serializeBinaryToWriter
    );
  }
  f = message.getComputationUsage();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
};


/**
 * optional bytes value = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.ExecuteScriptResponse.prototype.getValue = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes value = 1;
 * This is a type-conversion wrapper around `getValue()`
 * @return {string}
 */
proto.flow.access.ExecuteScriptResponse.prototype.getValue_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getValue()));
};


/**
 * optional bytes value = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getValue()`
 * @return {!Uint8Array}
 */
proto.flow.access.ExecuteScriptResponse.prototype.getValue_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getValue()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.ExecuteScriptResponse} returns this
 */
proto.flow.access.ExecuteScriptResponse.prototype.setValue = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional flow.entities.Metadata metadata = 2;
 * @return {?proto.flow.entities.Metadata}
 */
proto.flow.access.ExecuteScriptResponse.prototype.getMetadata = function() {
  return /** @type{?proto.flow.entities.Metadata} */ (
    jspb.Message.getWrapperField(this, flow_entities_metadata_pb.Metadata, 2));
};


/**
 * @param {?proto.flow.entities.Metadata|undefined} value
 * @return {!proto.flow.access.ExecuteScriptResponse} returns this
*/
proto.flow.access.ExecuteScriptResponse.prototype.setMetadata = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.ExecuteScriptResponse} returns this
 */
proto.flow.access.ExecuteScriptResponse.prototype.clearMetadata = function() {
  return this.setMetadata(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.ExecuteScriptResponse.prototype.hasMetadata = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional uint64 computation_usage = 3;
 * @return {number}
 */
proto.flow.access.ExecuteScriptResponse.prototype.getComputationUsage = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.flow.access.ExecuteScriptResponse} returns this
 */
proto.flow.access.ExecuteScriptResponse.prototype.setComputationUsage = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetEventsForHeightRangeRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetEventsForHeightRangeRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetEventsForHeightRangeRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetEventsForHeightRangeRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    type: jspb.Message.getFieldWithDefault(msg, 1, ""),
    startHeight: jspb.Message.getFieldWithDefault(msg, 2, 0),
    endHeight: jspb.Message.getFieldWithDefault(msg, 3, 0),
    eventEncodingVersion: jspb.Message.getFieldWithDefault(msg, 4, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetEventsForHeightRangeRequest}
 */
proto.flow.access.GetEventsForHeightRangeRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetEventsForHeightRangeRequest;
  return proto.flow.access.GetEventsForHeightRangeRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetEventsForHeightRangeRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetEventsForHeightRangeRequest}
 */
proto.flow.access.GetEventsForHeightRangeRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setType(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setStartHeight(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setEndHeight(value);
      break;
    case 4:
      var value = /** @type {!proto.flow.entities.EventEncodingVersion} */ (reader.readEnum());
      msg.setEventEncodingVersion(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetEventsForHeightRangeRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetEventsForHeightRangeRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetEventsForHeightRangeRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetEventsForHeightRangeRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getType();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getStartHeight();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getEndHeight();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
  f = message.getEventEncodingVersion();
  if (f !== 0.0) {
    writer.writeEnum(
      4,
      f
    );
  }
};


/**
 * optional string type = 1;
 * @return {string}
 */
proto.flow.access.GetEventsForHeightRangeRequest.prototype.getType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.flow.access.GetEventsForHeightRangeRequest} returns this
 */
proto.flow.access.GetEventsForHeightRangeRequest.prototype.setType = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional uint64 start_height = 2;
 * @return {number}
 */
proto.flow.access.GetEventsForHeightRangeRequest.prototype.getStartHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.flow.access.GetEventsForHeightRangeRequest} returns this
 */
proto.flow.access.GetEventsForHeightRangeRequest.prototype.setStartHeight = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional uint64 end_height = 3;
 * @return {number}
 */
proto.flow.access.GetEventsForHeightRangeRequest.prototype.getEndHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.flow.access.GetEventsForHeightRangeRequest} returns this
 */
proto.flow.access.GetEventsForHeightRangeRequest.prototype.setEndHeight = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


/**
 * optional flow.entities.EventEncodingVersion event_encoding_version = 4;
 * @return {!proto.flow.entities.EventEncodingVersion}
 */
proto.flow.access.GetEventsForHeightRangeRequest.prototype.getEventEncodingVersion = function() {
  return /** @type {!proto.flow.entities.EventEncodingVersion} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {!proto.flow.entities.EventEncodingVersion} value
 * @return {!proto.flow.access.GetEventsForHeightRangeRequest} returns this
 */
proto.flow.access.GetEventsForHeightRangeRequest.prototype.setEventEncodingVersion = function(value) {
  return jspb.Message.setProto3EnumField(this, 4, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.flow.access.GetEventsForBlockIDsRequest.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetEventsForBlockIDsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetEventsForBlockIDsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetEventsForBlockIDsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetEventsForBlockIDsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    type: jspb.Message.getFieldWithDefault(msg, 1, ""),
    blockIdsList: msg.getBlockIdsList_asB64(),
    eventEncodingVersion: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetEventsForBlockIDsRequest}
 */
proto.flow.access.GetEventsForBlockIDsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetEventsForBlockIDsRequest;
  return proto.flow.access.GetEventsForBlockIDsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetEventsForBlockIDsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetEventsForBlockIDsRequest}
 */
proto.flow.access.GetEventsForBlockIDsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setType(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.addBlockIds(value);
      break;
    case 3:
      var value = /** @type {!proto.flow.entities.EventEncodingVersion} */ (reader.readEnum());
      msg.setEventEncodingVersion(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetEventsForBlockIDsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetEventsForBlockIDsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetEventsForBlockIDsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetEventsForBlockIDsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getType();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getBlockIdsList_asU8();
  if (f.length > 0) {
    writer.writeRepeatedBytes(
      2,
      f
    );
  }
  f = message.getEventEncodingVersion();
  if (f !== 0.0) {
    writer.writeEnum(
      3,
      f
    );
  }
};


/**
 * optional string type = 1;
 * @return {string}
 */
proto.flow.access.GetEventsForBlockIDsRequest.prototype.getType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.flow.access.GetEventsForBlockIDsRequest} returns this
 */
proto.flow.access.GetEventsForBlockIDsRequest.prototype.setType = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated bytes block_ids = 2;
 * @return {!(Array<!Uint8Array>|Array<string>)}
 */
proto.flow.access.GetEventsForBlockIDsRequest.prototype.getBlockIdsList = function() {
  return /** @type {!(Array<!Uint8Array>|Array<string>)} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * repeated bytes block_ids = 2;
 * This is a type-conversion wrapper around `getBlockIdsList()`
 * @return {!Array<string>}
 */
proto.flow.access.GetEventsForBlockIDsRequest.prototype.getBlockIdsList_asB64 = function() {
  return /** @type {!Array<string>} */ (jspb.Message.bytesListAsB64(
      this.getBlockIdsList()));
};


/**
 * repeated bytes block_ids = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getBlockIdsList()`
 * @return {!Array<!Uint8Array>}
 */
proto.flow.access.GetEventsForBlockIDsRequest.prototype.getBlockIdsList_asU8 = function() {
  return /** @type {!Array<!Uint8Array>} */ (jspb.Message.bytesListAsU8(
      this.getBlockIdsList()));
};


/**
 * @param {!(Array<!Uint8Array>|Array<string>)} value
 * @return {!proto.flow.access.GetEventsForBlockIDsRequest} returns this
 */
proto.flow.access.GetEventsForBlockIDsRequest.prototype.setBlockIdsList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {!(string|Uint8Array)} value
 * @param {number=} opt_index
 * @return {!proto.flow.access.GetEventsForBlockIDsRequest} returns this
 */
proto.flow.access.GetEventsForBlockIDsRequest.prototype.addBlockIds = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.flow.access.GetEventsForBlockIDsRequest} returns this
 */
proto.flow.access.GetEventsForBlockIDsRequest.prototype.clearBlockIdsList = function() {
  return this.setBlockIdsList([]);
};


/**
 * optional flow.entities.EventEncodingVersion event_encoding_version = 3;
 * @return {!proto.flow.entities.EventEncodingVersion}
 */
proto.flow.access.GetEventsForBlockIDsRequest.prototype.getEventEncodingVersion = function() {
  return /** @type {!proto.flow.entities.EventEncodingVersion} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {!proto.flow.entities.EventEncodingVersion} value
 * @return {!proto.flow.access.GetEventsForBlockIDsRequest} returns this
 */
proto.flow.access.GetEventsForBlockIDsRequest.prototype.setEventEncodingVersion = function(value) {
  return jspb.Message.setProto3EnumField(this, 3, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.flow.access.EventsResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.EventsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.EventsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.EventsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.EventsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    resultsList: jspb.Message.toObjectList(msg.getResultsList(),
    proto.flow.access.EventsResponse.Result.toObject, includeInstance),
    metadata: (f = msg.getMetadata()) && flow_entities_metadata_pb.Metadata.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.EventsResponse}
 */
proto.flow.access.EventsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.EventsResponse;
  return proto.flow.access.EventsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.EventsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.EventsResponse}
 */
proto.flow.access.EventsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.flow.access.EventsResponse.Result;
      reader.readMessage(value,proto.flow.access.EventsResponse.Result.deserializeBinaryFromReader);
      msg.addResults(value);
      break;
    case 2:
      var value = new flow_entities_metadata_pb.Metadata;
      reader.readMessage(value,flow_entities_metadata_pb.Metadata.deserializeBinaryFromReader);
      msg.setMetadata(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.EventsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.EventsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.EventsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.EventsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getResultsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.flow.access.EventsResponse.Result.serializeBinaryToWriter
    );
  }
  f = message.getMetadata();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      flow_entities_metadata_pb.Metadata.serializeBinaryToWriter
    );
  }
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.flow.access.EventsResponse.Result.repeatedFields_ = [3];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.EventsResponse.Result.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.EventsResponse.Result.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.EventsResponse.Result} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.EventsResponse.Result.toObject = function(includeInstance, msg) {
  var f, obj = {
    blockId: msg.getBlockId_asB64(),
    blockHeight: jspb.Message.getFieldWithDefault(msg, 2, 0),
    eventsList: jspb.Message.toObjectList(msg.getEventsList(),
    flow_entities_event_pb.Event.toObject, includeInstance),
    blockTimestamp: (f = msg.getBlockTimestamp()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.EventsResponse.Result}
 */
proto.flow.access.EventsResponse.Result.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.EventsResponse.Result;
  return proto.flow.access.EventsResponse.Result.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.EventsResponse.Result} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.EventsResponse.Result}
 */
proto.flow.access.EventsResponse.Result.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setBlockId(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setBlockHeight(value);
      break;
    case 3:
      var value = new flow_entities_event_pb.Event;
      reader.readMessage(value,flow_entities_event_pb.Event.deserializeBinaryFromReader);
      msg.addEvents(value);
      break;
    case 4:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setBlockTimestamp(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.EventsResponse.Result.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.EventsResponse.Result.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.EventsResponse.Result} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.EventsResponse.Result.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBlockId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getBlockHeight();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getEventsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      flow_entities_event_pb.Event.serializeBinaryToWriter
    );
  }
  f = message.getBlockTimestamp();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
};


/**
 * optional bytes block_id = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.EventsResponse.Result.prototype.getBlockId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes block_id = 1;
 * This is a type-conversion wrapper around `getBlockId()`
 * @return {string}
 */
proto.flow.access.EventsResponse.Result.prototype.getBlockId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getBlockId()));
};


/**
 * optional bytes block_id = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getBlockId()`
 * @return {!Uint8Array}
 */
proto.flow.access.EventsResponse.Result.prototype.getBlockId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getBlockId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.EventsResponse.Result} returns this
 */
proto.flow.access.EventsResponse.Result.prototype.setBlockId = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional uint64 block_height = 2;
 * @return {number}
 */
proto.flow.access.EventsResponse.Result.prototype.getBlockHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.flow.access.EventsResponse.Result} returns this
 */
proto.flow.access.EventsResponse.Result.prototype.setBlockHeight = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * repeated flow.entities.Event events = 3;
 * @return {!Array<!proto.flow.entities.Event>}
 */
proto.flow.access.EventsResponse.Result.prototype.getEventsList = function() {
  return /** @type{!Array<!proto.flow.entities.Event>} */ (
    jspb.Message.getRepeatedWrapperField(this, flow_entities_event_pb.Event, 3));
};


/**
 * @param {!Array<!proto.flow.entities.Event>} value
 * @return {!proto.flow.access.EventsResponse.Result} returns this
*/
proto.flow.access.EventsResponse.Result.prototype.setEventsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 3, value);
};


/**
 * @param {!proto.flow.entities.Event=} opt_value
 * @param {number=} opt_index
 * @return {!proto.flow.entities.Event}
 */
proto.flow.access.EventsResponse.Result.prototype.addEvents = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.flow.entities.Event, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.flow.access.EventsResponse.Result} returns this
 */
proto.flow.access.EventsResponse.Result.prototype.clearEventsList = function() {
  return this.setEventsList([]);
};


/**
 * optional google.protobuf.Timestamp block_timestamp = 4;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.flow.access.EventsResponse.Result.prototype.getBlockTimestamp = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 4));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.flow.access.EventsResponse.Result} returns this
*/
proto.flow.access.EventsResponse.Result.prototype.setBlockTimestamp = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.EventsResponse.Result} returns this
 */
proto.flow.access.EventsResponse.Result.prototype.clearBlockTimestamp = function() {
  return this.setBlockTimestamp(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.EventsResponse.Result.prototype.hasBlockTimestamp = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * repeated Result results = 1;
 * @return {!Array<!proto.flow.access.EventsResponse.Result>}
 */
proto.flow.access.EventsResponse.prototype.getResultsList = function() {
  return /** @type{!Array<!proto.flow.access.EventsResponse.Result>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.flow.access.EventsResponse.Result, 1));
};


/**
 * @param {!Array<!proto.flow.access.EventsResponse.Result>} value
 * @return {!proto.flow.access.EventsResponse} returns this
*/
proto.flow.access.EventsResponse.prototype.setResultsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.flow.access.EventsResponse.Result=} opt_value
 * @param {number=} opt_index
 * @return {!proto.flow.access.EventsResponse.Result}
 */
proto.flow.access.EventsResponse.prototype.addResults = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.flow.access.EventsResponse.Result, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.flow.access.EventsResponse} returns this
 */
proto.flow.access.EventsResponse.prototype.clearResultsList = function() {
  return this.setResultsList([]);
};


/**
 * optional flow.entities.Metadata metadata = 2;
 * @return {?proto.flow.entities.Metadata}
 */
proto.flow.access.EventsResponse.prototype.getMetadata = function() {
  return /** @type{?proto.flow.entities.Metadata} */ (
    jspb.Message.getWrapperField(this, flow_entities_metadata_pb.Metadata, 2));
};


/**
 * @param {?proto.flow.entities.Metadata|undefined} value
 * @return {!proto.flow.access.EventsResponse} returns this
*/
proto.flow.access.EventsResponse.prototype.setMetadata = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.EventsResponse} returns this
 */
proto.flow.access.EventsResponse.prototype.clearMetadata = function() {
  return this.setMetadata(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.EventsResponse.prototype.hasMetadata = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetNetworkParametersRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetNetworkParametersRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetNetworkParametersRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetNetworkParametersRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetNetworkParametersRequest}
 */
proto.flow.access.GetNetworkParametersRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetNetworkParametersRequest;
  return proto.flow.access.GetNetworkParametersRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetNetworkParametersRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetNetworkParametersRequest}
 */
proto.flow.access.GetNetworkParametersRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetNetworkParametersRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetNetworkParametersRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetNetworkParametersRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetNetworkParametersRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetNetworkParametersResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetNetworkParametersResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetNetworkParametersResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetNetworkParametersResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    chainId: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetNetworkParametersResponse}
 */
proto.flow.access.GetNetworkParametersResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetNetworkParametersResponse;
  return proto.flow.access.GetNetworkParametersResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetNetworkParametersResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetNetworkParametersResponse}
 */
proto.flow.access.GetNetworkParametersResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setChainId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetNetworkParametersResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetNetworkParametersResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetNetworkParametersResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetNetworkParametersResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getChainId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string chain_id = 1;
 * @return {string}
 */
proto.flow.access.GetNetworkParametersResponse.prototype.getChainId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.flow.access.GetNetworkParametersResponse} returns this
 */
proto.flow.access.GetNetworkParametersResponse.prototype.setChainId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetLatestProtocolStateSnapshotRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetLatestProtocolStateSnapshotRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetLatestProtocolStateSnapshotRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetLatestProtocolStateSnapshotRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetLatestProtocolStateSnapshotRequest}
 */
proto.flow.access.GetLatestProtocolStateSnapshotRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetLatestProtocolStateSnapshotRequest;
  return proto.flow.access.GetLatestProtocolStateSnapshotRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetLatestProtocolStateSnapshotRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetLatestProtocolStateSnapshotRequest}
 */
proto.flow.access.GetLatestProtocolStateSnapshotRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetLatestProtocolStateSnapshotRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetLatestProtocolStateSnapshotRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetLatestProtocolStateSnapshotRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetLatestProtocolStateSnapshotRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    blockId: msg.getBlockId_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest}
 */
proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest;
  return proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest}
 */
proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setBlockId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBlockId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
};


/**
 * optional bytes block_id = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest.prototype.getBlockId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes block_id = 1;
 * This is a type-conversion wrapper around `getBlockId()`
 * @return {string}
 */
proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest.prototype.getBlockId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getBlockId()));
};


/**
 * optional bytes block_id = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getBlockId()`
 * @return {!Uint8Array}
 */
proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest.prototype.getBlockId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getBlockId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest} returns this
 */
proto.flow.access.GetProtocolStateSnapshotByBlockIDRequest.prototype.setBlockId = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetProtocolStateSnapshotByHeightRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetProtocolStateSnapshotByHeightRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetProtocolStateSnapshotByHeightRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetProtocolStateSnapshotByHeightRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    blockHeight: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetProtocolStateSnapshotByHeightRequest}
 */
proto.flow.access.GetProtocolStateSnapshotByHeightRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetProtocolStateSnapshotByHeightRequest;
  return proto.flow.access.GetProtocolStateSnapshotByHeightRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetProtocolStateSnapshotByHeightRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetProtocolStateSnapshotByHeightRequest}
 */
proto.flow.access.GetProtocolStateSnapshotByHeightRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setBlockHeight(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetProtocolStateSnapshotByHeightRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetProtocolStateSnapshotByHeightRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetProtocolStateSnapshotByHeightRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetProtocolStateSnapshotByHeightRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBlockHeight();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
};


/**
 * optional uint64 block_height = 1;
 * @return {number}
 */
proto.flow.access.GetProtocolStateSnapshotByHeightRequest.prototype.getBlockHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.flow.access.GetProtocolStateSnapshotByHeightRequest} returns this
 */
proto.flow.access.GetProtocolStateSnapshotByHeightRequest.prototype.setBlockHeight = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.ProtocolStateSnapshotResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.ProtocolStateSnapshotResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.ProtocolStateSnapshotResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.ProtocolStateSnapshotResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    serializedsnapshot: msg.getSerializedsnapshot_asB64(),
    metadata: (f = msg.getMetadata()) && flow_entities_metadata_pb.Metadata.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.ProtocolStateSnapshotResponse}
 */
proto.flow.access.ProtocolStateSnapshotResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.ProtocolStateSnapshotResponse;
  return proto.flow.access.ProtocolStateSnapshotResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.ProtocolStateSnapshotResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.ProtocolStateSnapshotResponse}
 */
proto.flow.access.ProtocolStateSnapshotResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setSerializedsnapshot(value);
      break;
    case 2:
      var value = new flow_entities_metadata_pb.Metadata;
      reader.readMessage(value,flow_entities_metadata_pb.Metadata.deserializeBinaryFromReader);
      msg.setMetadata(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.ProtocolStateSnapshotResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.ProtocolStateSnapshotResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.ProtocolStateSnapshotResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.ProtocolStateSnapshotResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSerializedsnapshot_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getMetadata();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      flow_entities_metadata_pb.Metadata.serializeBinaryToWriter
    );
  }
};


/**
 * optional bytes serializedSnapshot = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.ProtocolStateSnapshotResponse.prototype.getSerializedsnapshot = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes serializedSnapshot = 1;
 * This is a type-conversion wrapper around `getSerializedsnapshot()`
 * @return {string}
 */
proto.flow.access.ProtocolStateSnapshotResponse.prototype.getSerializedsnapshot_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getSerializedsnapshot()));
};


/**
 * optional bytes serializedSnapshot = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSerializedsnapshot()`
 * @return {!Uint8Array}
 */
proto.flow.access.ProtocolStateSnapshotResponse.prototype.getSerializedsnapshot_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getSerializedsnapshot()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.ProtocolStateSnapshotResponse} returns this
 */
proto.flow.access.ProtocolStateSnapshotResponse.prototype.setSerializedsnapshot = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional flow.entities.Metadata metadata = 2;
 * @return {?proto.flow.entities.Metadata}
 */
proto.flow.access.ProtocolStateSnapshotResponse.prototype.getMetadata = function() {
  return /** @type{?proto.flow.entities.Metadata} */ (
    jspb.Message.getWrapperField(this, flow_entities_metadata_pb.Metadata, 2));
};


/**
 * @param {?proto.flow.entities.Metadata|undefined} value
 * @return {!proto.flow.access.ProtocolStateSnapshotResponse} returns this
*/
proto.flow.access.ProtocolStateSnapshotResponse.prototype.setMetadata = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.ProtocolStateSnapshotResponse} returns this
 */
proto.flow.access.ProtocolStateSnapshotResponse.prototype.clearMetadata = function() {
  return this.setMetadata(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.ProtocolStateSnapshotResponse.prototype.hasMetadata = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetExecutionResultForBlockIDRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetExecutionResultForBlockIDRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetExecutionResultForBlockIDRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetExecutionResultForBlockIDRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    blockId: msg.getBlockId_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetExecutionResultForBlockIDRequest}
 */
proto.flow.access.GetExecutionResultForBlockIDRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetExecutionResultForBlockIDRequest;
  return proto.flow.access.GetExecutionResultForBlockIDRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetExecutionResultForBlockIDRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetExecutionResultForBlockIDRequest}
 */
proto.flow.access.GetExecutionResultForBlockIDRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setBlockId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetExecutionResultForBlockIDRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetExecutionResultForBlockIDRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetExecutionResultForBlockIDRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetExecutionResultForBlockIDRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBlockId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
};


/**
 * optional bytes block_id = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.GetExecutionResultForBlockIDRequest.prototype.getBlockId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes block_id = 1;
 * This is a type-conversion wrapper around `getBlockId()`
 * @return {string}
 */
proto.flow.access.GetExecutionResultForBlockIDRequest.prototype.getBlockId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getBlockId()));
};


/**
 * optional bytes block_id = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getBlockId()`
 * @return {!Uint8Array}
 */
proto.flow.access.GetExecutionResultForBlockIDRequest.prototype.getBlockId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getBlockId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.GetExecutionResultForBlockIDRequest} returns this
 */
proto.flow.access.GetExecutionResultForBlockIDRequest.prototype.setBlockId = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.ExecutionResultForBlockIDResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.ExecutionResultForBlockIDResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.ExecutionResultForBlockIDResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.ExecutionResultForBlockIDResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    executionResult: (f = msg.getExecutionResult()) && flow_entities_execution_result_pb.ExecutionResult.toObject(includeInstance, f),
    metadata: (f = msg.getMetadata()) && flow_entities_metadata_pb.Metadata.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.ExecutionResultForBlockIDResponse}
 */
proto.flow.access.ExecutionResultForBlockIDResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.ExecutionResultForBlockIDResponse;
  return proto.flow.access.ExecutionResultForBlockIDResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.ExecutionResultForBlockIDResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.ExecutionResultForBlockIDResponse}
 */
proto.flow.access.ExecutionResultForBlockIDResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new flow_entities_execution_result_pb.ExecutionResult;
      reader.readMessage(value,flow_entities_execution_result_pb.ExecutionResult.deserializeBinaryFromReader);
      msg.setExecutionResult(value);
      break;
    case 2:
      var value = new flow_entities_metadata_pb.Metadata;
      reader.readMessage(value,flow_entities_metadata_pb.Metadata.deserializeBinaryFromReader);
      msg.setMetadata(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.ExecutionResultForBlockIDResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.ExecutionResultForBlockIDResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.ExecutionResultForBlockIDResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.ExecutionResultForBlockIDResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getExecutionResult();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      flow_entities_execution_result_pb.ExecutionResult.serializeBinaryToWriter
    );
  }
  f = message.getMetadata();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      flow_entities_metadata_pb.Metadata.serializeBinaryToWriter
    );
  }
};


/**
 * optional flow.entities.ExecutionResult execution_result = 1;
 * @return {?proto.flow.entities.ExecutionResult}
 */
proto.flow.access.ExecutionResultForBlockIDResponse.prototype.getExecutionResult = function() {
  return /** @type{?proto.flow.entities.ExecutionResult} */ (
    jspb.Message.getWrapperField(this, flow_entities_execution_result_pb.ExecutionResult, 1));
};


/**
 * @param {?proto.flow.entities.ExecutionResult|undefined} value
 * @return {!proto.flow.access.ExecutionResultForBlockIDResponse} returns this
*/
proto.flow.access.ExecutionResultForBlockIDResponse.prototype.setExecutionResult = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.ExecutionResultForBlockIDResponse} returns this
 */
proto.flow.access.ExecutionResultForBlockIDResponse.prototype.clearExecutionResult = function() {
  return this.setExecutionResult(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.ExecutionResultForBlockIDResponse.prototype.hasExecutionResult = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional flow.entities.Metadata metadata = 2;
 * @return {?proto.flow.entities.Metadata}
 */
proto.flow.access.ExecutionResultForBlockIDResponse.prototype.getMetadata = function() {
  return /** @type{?proto.flow.entities.Metadata} */ (
    jspb.Message.getWrapperField(this, flow_entities_metadata_pb.Metadata, 2));
};


/**
 * @param {?proto.flow.entities.Metadata|undefined} value
 * @return {!proto.flow.access.ExecutionResultForBlockIDResponse} returns this
*/
proto.flow.access.ExecutionResultForBlockIDResponse.prototype.setMetadata = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.ExecutionResultForBlockIDResponse} returns this
 */
proto.flow.access.ExecutionResultForBlockIDResponse.prototype.clearMetadata = function() {
  return this.setMetadata(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.ExecutionResultForBlockIDResponse.prototype.hasMetadata = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.GetExecutionResultByIDRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.GetExecutionResultByIDRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.GetExecutionResultByIDRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetExecutionResultByIDRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: msg.getId_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.GetExecutionResultByIDRequest}
 */
proto.flow.access.GetExecutionResultByIDRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.GetExecutionResultByIDRequest;
  return proto.flow.access.GetExecutionResultByIDRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.GetExecutionResultByIDRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.GetExecutionResultByIDRequest}
 */
proto.flow.access.GetExecutionResultByIDRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.GetExecutionResultByIDRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.GetExecutionResultByIDRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.GetExecutionResultByIDRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.GetExecutionResultByIDRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
};


/**
 * optional bytes id = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.GetExecutionResultByIDRequest.prototype.getId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes id = 1;
 * This is a type-conversion wrapper around `getId()`
 * @return {string}
 */
proto.flow.access.GetExecutionResultByIDRequest.prototype.getId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getId()));
};


/**
 * optional bytes id = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getId()`
 * @return {!Uint8Array}
 */
proto.flow.access.GetExecutionResultByIDRequest.prototype.getId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.GetExecutionResultByIDRequest} returns this
 */
proto.flow.access.GetExecutionResultByIDRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.ExecutionResultByIDResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.ExecutionResultByIDResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.ExecutionResultByIDResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.ExecutionResultByIDResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    executionResult: (f = msg.getExecutionResult()) && flow_entities_execution_result_pb.ExecutionResult.toObject(includeInstance, f),
    metadata: (f = msg.getMetadata()) && flow_entities_metadata_pb.Metadata.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.ExecutionResultByIDResponse}
 */
proto.flow.access.ExecutionResultByIDResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.ExecutionResultByIDResponse;
  return proto.flow.access.ExecutionResultByIDResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.ExecutionResultByIDResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.ExecutionResultByIDResponse}
 */
proto.flow.access.ExecutionResultByIDResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new flow_entities_execution_result_pb.ExecutionResult;
      reader.readMessage(value,flow_entities_execution_result_pb.ExecutionResult.deserializeBinaryFromReader);
      msg.setExecutionResult(value);
      break;
    case 2:
      var value = new flow_entities_metadata_pb.Metadata;
      reader.readMessage(value,flow_entities_metadata_pb.Metadata.deserializeBinaryFromReader);
      msg.setMetadata(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.ExecutionResultByIDResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.ExecutionResultByIDResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.ExecutionResultByIDResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.ExecutionResultByIDResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getExecutionResult();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      flow_entities_execution_result_pb.ExecutionResult.serializeBinaryToWriter
    );
  }
  f = message.getMetadata();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      flow_entities_metadata_pb.Metadata.serializeBinaryToWriter
    );
  }
};


/**
 * optional flow.entities.ExecutionResult execution_result = 1;
 * @return {?proto.flow.entities.ExecutionResult}
 */
proto.flow.access.ExecutionResultByIDResponse.prototype.getExecutionResult = function() {
  return /** @type{?proto.flow.entities.ExecutionResult} */ (
    jspb.Message.getWrapperField(this, flow_entities_execution_result_pb.ExecutionResult, 1));
};


/**
 * @param {?proto.flow.entities.ExecutionResult|undefined} value
 * @return {!proto.flow.access.ExecutionResultByIDResponse} returns this
*/
proto.flow.access.ExecutionResultByIDResponse.prototype.setExecutionResult = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.ExecutionResultByIDResponse} returns this
 */
proto.flow.access.ExecutionResultByIDResponse.prototype.clearExecutionResult = function() {
  return this.setExecutionResult(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.ExecutionResultByIDResponse.prototype.hasExecutionResult = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional flow.entities.Metadata metadata = 2;
 * @return {?proto.flow.entities.Metadata}
 */
proto.flow.access.ExecutionResultByIDResponse.prototype.getMetadata = function() {
  return /** @type{?proto.flow.entities.Metadata} */ (
    jspb.Message.getWrapperField(this, flow_entities_metadata_pb.Metadata, 2));
};


/**
 * @param {?proto.flow.entities.Metadata|undefined} value
 * @return {!proto.flow.access.ExecutionResultByIDResponse} returns this
*/
proto.flow.access.ExecutionResultByIDResponse.prototype.setMetadata = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.ExecutionResultByIDResponse} returns this
 */
proto.flow.access.ExecutionResultByIDResponse.prototype.clearMetadata = function() {
  return this.setMetadata(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.ExecutionResultByIDResponse.prototype.hasMetadata = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.SubscribeBlocksFromStartBlockIDRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.SubscribeBlocksFromStartBlockIDRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.SubscribeBlocksFromStartBlockIDRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlocksFromStartBlockIDRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    startBlockId: msg.getStartBlockId_asB64(),
    blockStatus: jspb.Message.getFieldWithDefault(msg, 2, 0),
    fullBlockResponse: jspb.Message.getBooleanFieldWithDefault(msg, 3, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.SubscribeBlocksFromStartBlockIDRequest}
 */
proto.flow.access.SubscribeBlocksFromStartBlockIDRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.SubscribeBlocksFromStartBlockIDRequest;
  return proto.flow.access.SubscribeBlocksFromStartBlockIDRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.SubscribeBlocksFromStartBlockIDRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.SubscribeBlocksFromStartBlockIDRequest}
 */
proto.flow.access.SubscribeBlocksFromStartBlockIDRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setStartBlockId(value);
      break;
    case 2:
      var value = /** @type {!proto.flow.entities.BlockStatus} */ (reader.readEnum());
      msg.setBlockStatus(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setFullBlockResponse(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.SubscribeBlocksFromStartBlockIDRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.SubscribeBlocksFromStartBlockIDRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.SubscribeBlocksFromStartBlockIDRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlocksFromStartBlockIDRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStartBlockId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getBlockStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getFullBlockResponse();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
};


/**
 * optional bytes start_block_id = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.SubscribeBlocksFromStartBlockIDRequest.prototype.getStartBlockId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes start_block_id = 1;
 * This is a type-conversion wrapper around `getStartBlockId()`
 * @return {string}
 */
proto.flow.access.SubscribeBlocksFromStartBlockIDRequest.prototype.getStartBlockId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getStartBlockId()));
};


/**
 * optional bytes start_block_id = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getStartBlockId()`
 * @return {!Uint8Array}
 */
proto.flow.access.SubscribeBlocksFromStartBlockIDRequest.prototype.getStartBlockId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getStartBlockId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.SubscribeBlocksFromStartBlockIDRequest} returns this
 */
proto.flow.access.SubscribeBlocksFromStartBlockIDRequest.prototype.setStartBlockId = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional flow.entities.BlockStatus block_status = 2;
 * @return {!proto.flow.entities.BlockStatus}
 */
proto.flow.access.SubscribeBlocksFromStartBlockIDRequest.prototype.getBlockStatus = function() {
  return /** @type {!proto.flow.entities.BlockStatus} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.flow.entities.BlockStatus} value
 * @return {!proto.flow.access.SubscribeBlocksFromStartBlockIDRequest} returns this
 */
proto.flow.access.SubscribeBlocksFromStartBlockIDRequest.prototype.setBlockStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional bool full_block_response = 3;
 * @return {boolean}
 */
proto.flow.access.SubscribeBlocksFromStartBlockIDRequest.prototype.getFullBlockResponse = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.flow.access.SubscribeBlocksFromStartBlockIDRequest} returns this
 */
proto.flow.access.SubscribeBlocksFromStartBlockIDRequest.prototype.setFullBlockResponse = function(value) {
  return jspb.Message.setProto3BooleanField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.SubscribeBlocksFromStartHeightRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.SubscribeBlocksFromStartHeightRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.SubscribeBlocksFromStartHeightRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlocksFromStartHeightRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    startBlockHeight: jspb.Message.getFieldWithDefault(msg, 1, 0),
    blockStatus: jspb.Message.getFieldWithDefault(msg, 2, 0),
    fullBlockResponse: jspb.Message.getBooleanFieldWithDefault(msg, 3, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.SubscribeBlocksFromStartHeightRequest}
 */
proto.flow.access.SubscribeBlocksFromStartHeightRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.SubscribeBlocksFromStartHeightRequest;
  return proto.flow.access.SubscribeBlocksFromStartHeightRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.SubscribeBlocksFromStartHeightRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.SubscribeBlocksFromStartHeightRequest}
 */
proto.flow.access.SubscribeBlocksFromStartHeightRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setStartBlockHeight(value);
      break;
    case 2:
      var value = /** @type {!proto.flow.entities.BlockStatus} */ (reader.readEnum());
      msg.setBlockStatus(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setFullBlockResponse(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.SubscribeBlocksFromStartHeightRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.SubscribeBlocksFromStartHeightRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.SubscribeBlocksFromStartHeightRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlocksFromStartHeightRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStartBlockHeight();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = message.getBlockStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getFullBlockResponse();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
};


/**
 * optional uint64 start_block_height = 1;
 * @return {number}
 */
proto.flow.access.SubscribeBlocksFromStartHeightRequest.prototype.getStartBlockHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.flow.access.SubscribeBlocksFromStartHeightRequest} returns this
 */
proto.flow.access.SubscribeBlocksFromStartHeightRequest.prototype.setStartBlockHeight = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional flow.entities.BlockStatus block_status = 2;
 * @return {!proto.flow.entities.BlockStatus}
 */
proto.flow.access.SubscribeBlocksFromStartHeightRequest.prototype.getBlockStatus = function() {
  return /** @type {!proto.flow.entities.BlockStatus} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.flow.entities.BlockStatus} value
 * @return {!proto.flow.access.SubscribeBlocksFromStartHeightRequest} returns this
 */
proto.flow.access.SubscribeBlocksFromStartHeightRequest.prototype.setBlockStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional bool full_block_response = 3;
 * @return {boolean}
 */
proto.flow.access.SubscribeBlocksFromStartHeightRequest.prototype.getFullBlockResponse = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.flow.access.SubscribeBlocksFromStartHeightRequest} returns this
 */
proto.flow.access.SubscribeBlocksFromStartHeightRequest.prototype.setFullBlockResponse = function(value) {
  return jspb.Message.setProto3BooleanField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.SubscribeBlocksFromLatestRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.SubscribeBlocksFromLatestRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.SubscribeBlocksFromLatestRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlocksFromLatestRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    blockStatus: jspb.Message.getFieldWithDefault(msg, 1, 0),
    fullBlockResponse: jspb.Message.getBooleanFieldWithDefault(msg, 2, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.SubscribeBlocksFromLatestRequest}
 */
proto.flow.access.SubscribeBlocksFromLatestRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.SubscribeBlocksFromLatestRequest;
  return proto.flow.access.SubscribeBlocksFromLatestRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.SubscribeBlocksFromLatestRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.SubscribeBlocksFromLatestRequest}
 */
proto.flow.access.SubscribeBlocksFromLatestRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.flow.entities.BlockStatus} */ (reader.readEnum());
      msg.setBlockStatus(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setFullBlockResponse(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.SubscribeBlocksFromLatestRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.SubscribeBlocksFromLatestRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.SubscribeBlocksFromLatestRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlocksFromLatestRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBlockStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getFullBlockResponse();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
};


/**
 * optional flow.entities.BlockStatus block_status = 1;
 * @return {!proto.flow.entities.BlockStatus}
 */
proto.flow.access.SubscribeBlocksFromLatestRequest.prototype.getBlockStatus = function() {
  return /** @type {!proto.flow.entities.BlockStatus} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.flow.entities.BlockStatus} value
 * @return {!proto.flow.access.SubscribeBlocksFromLatestRequest} returns this
 */
proto.flow.access.SubscribeBlocksFromLatestRequest.prototype.setBlockStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional bool full_block_response = 2;
 * @return {boolean}
 */
proto.flow.access.SubscribeBlocksFromLatestRequest.prototype.getFullBlockResponse = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.flow.access.SubscribeBlocksFromLatestRequest} returns this
 */
proto.flow.access.SubscribeBlocksFromLatestRequest.prototype.setFullBlockResponse = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.SubscribeBlocksResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.SubscribeBlocksResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.SubscribeBlocksResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlocksResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    block: (f = msg.getBlock()) && flow_entities_block_pb.Block.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.SubscribeBlocksResponse}
 */
proto.flow.access.SubscribeBlocksResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.SubscribeBlocksResponse;
  return proto.flow.access.SubscribeBlocksResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.SubscribeBlocksResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.SubscribeBlocksResponse}
 */
proto.flow.access.SubscribeBlocksResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new flow_entities_block_pb.Block;
      reader.readMessage(value,flow_entities_block_pb.Block.deserializeBinaryFromReader);
      msg.setBlock(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.SubscribeBlocksResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.SubscribeBlocksResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.SubscribeBlocksResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlocksResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBlock();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      flow_entities_block_pb.Block.serializeBinaryToWriter
    );
  }
};


/**
 * optional flow.entities.Block block = 1;
 * @return {?proto.flow.entities.Block}
 */
proto.flow.access.SubscribeBlocksResponse.prototype.getBlock = function() {
  return /** @type{?proto.flow.entities.Block} */ (
    jspb.Message.getWrapperField(this, flow_entities_block_pb.Block, 1));
};


/**
 * @param {?proto.flow.entities.Block|undefined} value
 * @return {!proto.flow.access.SubscribeBlocksResponse} returns this
*/
proto.flow.access.SubscribeBlocksResponse.prototype.setBlock = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.SubscribeBlocksResponse} returns this
 */
proto.flow.access.SubscribeBlocksResponse.prototype.clearBlock = function() {
  return this.setBlock(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.SubscribeBlocksResponse.prototype.hasBlock = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    startBlockId: msg.getStartBlockId_asB64(),
    blockStatus: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest}
 */
proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest;
  return proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest}
 */
proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setStartBlockId(value);
      break;
    case 2:
      var value = /** @type {!proto.flow.entities.BlockStatus} */ (reader.readEnum());
      msg.setBlockStatus(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStartBlockId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getBlockStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
};


/**
 * optional bytes start_block_id = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest.prototype.getStartBlockId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes start_block_id = 1;
 * This is a type-conversion wrapper around `getStartBlockId()`
 * @return {string}
 */
proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest.prototype.getStartBlockId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getStartBlockId()));
};


/**
 * optional bytes start_block_id = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getStartBlockId()`
 * @return {!Uint8Array}
 */
proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest.prototype.getStartBlockId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getStartBlockId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest} returns this
 */
proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest.prototype.setStartBlockId = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional flow.entities.BlockStatus block_status = 2;
 * @return {!proto.flow.entities.BlockStatus}
 */
proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest.prototype.getBlockStatus = function() {
  return /** @type {!proto.flow.entities.BlockStatus} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.flow.entities.BlockStatus} value
 * @return {!proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest} returns this
 */
proto.flow.access.SubscribeBlockHeadersFromStartBlockIDRequest.prototype.setBlockStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    startBlockHeight: jspb.Message.getFieldWithDefault(msg, 1, 0),
    blockStatus: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest}
 */
proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest;
  return proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest}
 */
proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setStartBlockHeight(value);
      break;
    case 2:
      var value = /** @type {!proto.flow.entities.BlockStatus} */ (reader.readEnum());
      msg.setBlockStatus(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStartBlockHeight();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = message.getBlockStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
};


/**
 * optional uint64 start_block_height = 1;
 * @return {number}
 */
proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest.prototype.getStartBlockHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest} returns this
 */
proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest.prototype.setStartBlockHeight = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional flow.entities.BlockStatus block_status = 2;
 * @return {!proto.flow.entities.BlockStatus}
 */
proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest.prototype.getBlockStatus = function() {
  return /** @type {!proto.flow.entities.BlockStatus} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.flow.entities.BlockStatus} value
 * @return {!proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest} returns this
 */
proto.flow.access.SubscribeBlockHeadersFromStartHeightRequest.prototype.setBlockStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.SubscribeBlockHeadersFromLatestRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.SubscribeBlockHeadersFromLatestRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.SubscribeBlockHeadersFromLatestRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlockHeadersFromLatestRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    blockStatus: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.SubscribeBlockHeadersFromLatestRequest}
 */
proto.flow.access.SubscribeBlockHeadersFromLatestRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.SubscribeBlockHeadersFromLatestRequest;
  return proto.flow.access.SubscribeBlockHeadersFromLatestRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.SubscribeBlockHeadersFromLatestRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.SubscribeBlockHeadersFromLatestRequest}
 */
proto.flow.access.SubscribeBlockHeadersFromLatestRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.flow.entities.BlockStatus} */ (reader.readEnum());
      msg.setBlockStatus(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.SubscribeBlockHeadersFromLatestRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.SubscribeBlockHeadersFromLatestRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.SubscribeBlockHeadersFromLatestRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlockHeadersFromLatestRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBlockStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * optional flow.entities.BlockStatus block_status = 1;
 * @return {!proto.flow.entities.BlockStatus}
 */
proto.flow.access.SubscribeBlockHeadersFromLatestRequest.prototype.getBlockStatus = function() {
  return /** @type {!proto.flow.entities.BlockStatus} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.flow.entities.BlockStatus} value
 * @return {!proto.flow.access.SubscribeBlockHeadersFromLatestRequest} returns this
 */
proto.flow.access.SubscribeBlockHeadersFromLatestRequest.prototype.setBlockStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.SubscribeBlockHeadersResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.SubscribeBlockHeadersResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.SubscribeBlockHeadersResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlockHeadersResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    header: (f = msg.getHeader()) && flow_entities_block_header_pb.BlockHeader.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.SubscribeBlockHeadersResponse}
 */
proto.flow.access.SubscribeBlockHeadersResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.SubscribeBlockHeadersResponse;
  return proto.flow.access.SubscribeBlockHeadersResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.SubscribeBlockHeadersResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.SubscribeBlockHeadersResponse}
 */
proto.flow.access.SubscribeBlockHeadersResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new flow_entities_block_header_pb.BlockHeader;
      reader.readMessage(value,flow_entities_block_header_pb.BlockHeader.deserializeBinaryFromReader);
      msg.setHeader(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.SubscribeBlockHeadersResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.SubscribeBlockHeadersResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.SubscribeBlockHeadersResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlockHeadersResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getHeader();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      flow_entities_block_header_pb.BlockHeader.serializeBinaryToWriter
    );
  }
};


/**
 * optional flow.entities.BlockHeader header = 1;
 * @return {?proto.flow.entities.BlockHeader}
 */
proto.flow.access.SubscribeBlockHeadersResponse.prototype.getHeader = function() {
  return /** @type{?proto.flow.entities.BlockHeader} */ (
    jspb.Message.getWrapperField(this, flow_entities_block_header_pb.BlockHeader, 1));
};


/**
 * @param {?proto.flow.entities.BlockHeader|undefined} value
 * @return {!proto.flow.access.SubscribeBlockHeadersResponse} returns this
*/
proto.flow.access.SubscribeBlockHeadersResponse.prototype.setHeader = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.SubscribeBlockHeadersResponse} returns this
 */
proto.flow.access.SubscribeBlockHeadersResponse.prototype.clearHeader = function() {
  return this.setHeader(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.SubscribeBlockHeadersResponse.prototype.hasHeader = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    startBlockId: msg.getStartBlockId_asB64(),
    blockStatus: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest}
 */
proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest;
  return proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest}
 */
proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setStartBlockId(value);
      break;
    case 2:
      var value = /** @type {!proto.flow.entities.BlockStatus} */ (reader.readEnum());
      msg.setBlockStatus(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStartBlockId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getBlockStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
};


/**
 * optional bytes start_block_id = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest.prototype.getStartBlockId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes start_block_id = 1;
 * This is a type-conversion wrapper around `getStartBlockId()`
 * @return {string}
 */
proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest.prototype.getStartBlockId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getStartBlockId()));
};


/**
 * optional bytes start_block_id = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getStartBlockId()`
 * @return {!Uint8Array}
 */
proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest.prototype.getStartBlockId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getStartBlockId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest} returns this
 */
proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest.prototype.setStartBlockId = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional flow.entities.BlockStatus block_status = 2;
 * @return {!proto.flow.entities.BlockStatus}
 */
proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest.prototype.getBlockStatus = function() {
  return /** @type {!proto.flow.entities.BlockStatus} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.flow.entities.BlockStatus} value
 * @return {!proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest} returns this
 */
proto.flow.access.SubscribeBlockDigestsFromStartBlockIDRequest.prototype.setBlockStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    startBlockHeight: jspb.Message.getFieldWithDefault(msg, 1, 0),
    blockStatus: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest}
 */
proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest;
  return proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest}
 */
proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setStartBlockHeight(value);
      break;
    case 2:
      var value = /** @type {!proto.flow.entities.BlockStatus} */ (reader.readEnum());
      msg.setBlockStatus(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStartBlockHeight();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = message.getBlockStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
};


/**
 * optional uint64 start_block_height = 1;
 * @return {number}
 */
proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest.prototype.getStartBlockHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest} returns this
 */
proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest.prototype.setStartBlockHeight = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional flow.entities.BlockStatus block_status = 2;
 * @return {!proto.flow.entities.BlockStatus}
 */
proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest.prototype.getBlockStatus = function() {
  return /** @type {!proto.flow.entities.BlockStatus} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.flow.entities.BlockStatus} value
 * @return {!proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest} returns this
 */
proto.flow.access.SubscribeBlockDigestsFromStartHeightRequest.prototype.setBlockStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.SubscribeBlockDigestsFromLatestRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.SubscribeBlockDigestsFromLatestRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.SubscribeBlockDigestsFromLatestRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlockDigestsFromLatestRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    blockStatus: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.SubscribeBlockDigestsFromLatestRequest}
 */
proto.flow.access.SubscribeBlockDigestsFromLatestRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.SubscribeBlockDigestsFromLatestRequest;
  return proto.flow.access.SubscribeBlockDigestsFromLatestRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.SubscribeBlockDigestsFromLatestRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.SubscribeBlockDigestsFromLatestRequest}
 */
proto.flow.access.SubscribeBlockDigestsFromLatestRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.flow.entities.BlockStatus} */ (reader.readEnum());
      msg.setBlockStatus(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.SubscribeBlockDigestsFromLatestRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.SubscribeBlockDigestsFromLatestRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.SubscribeBlockDigestsFromLatestRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlockDigestsFromLatestRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBlockStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * optional flow.entities.BlockStatus block_status = 1;
 * @return {!proto.flow.entities.BlockStatus}
 */
proto.flow.access.SubscribeBlockDigestsFromLatestRequest.prototype.getBlockStatus = function() {
  return /** @type {!proto.flow.entities.BlockStatus} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.flow.entities.BlockStatus} value
 * @return {!proto.flow.access.SubscribeBlockDigestsFromLatestRequest} returns this
 */
proto.flow.access.SubscribeBlockDigestsFromLatestRequest.prototype.setBlockStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.SubscribeBlockDigestsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.SubscribeBlockDigestsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.SubscribeBlockDigestsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlockDigestsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    blockId: msg.getBlockId_asB64(),
    blockHeight: jspb.Message.getFieldWithDefault(msg, 2, 0),
    blockTimestamp: (f = msg.getBlockTimestamp()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.SubscribeBlockDigestsResponse}
 */
proto.flow.access.SubscribeBlockDigestsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.SubscribeBlockDigestsResponse;
  return proto.flow.access.SubscribeBlockDigestsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.SubscribeBlockDigestsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.SubscribeBlockDigestsResponse}
 */
proto.flow.access.SubscribeBlockDigestsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setBlockId(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setBlockHeight(value);
      break;
    case 3:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setBlockTimestamp(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.SubscribeBlockDigestsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.SubscribeBlockDigestsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.SubscribeBlockDigestsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SubscribeBlockDigestsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBlockId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getBlockHeight();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getBlockTimestamp();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
};


/**
 * optional bytes block_id = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.SubscribeBlockDigestsResponse.prototype.getBlockId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes block_id = 1;
 * This is a type-conversion wrapper around `getBlockId()`
 * @return {string}
 */
proto.flow.access.SubscribeBlockDigestsResponse.prototype.getBlockId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getBlockId()));
};


/**
 * optional bytes block_id = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getBlockId()`
 * @return {!Uint8Array}
 */
proto.flow.access.SubscribeBlockDigestsResponse.prototype.getBlockId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getBlockId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.SubscribeBlockDigestsResponse} returns this
 */
proto.flow.access.SubscribeBlockDigestsResponse.prototype.setBlockId = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional uint64 block_height = 2;
 * @return {number}
 */
proto.flow.access.SubscribeBlockDigestsResponse.prototype.getBlockHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.flow.access.SubscribeBlockDigestsResponse} returns this
 */
proto.flow.access.SubscribeBlockDigestsResponse.prototype.setBlockHeight = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional google.protobuf.Timestamp block_timestamp = 3;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.flow.access.SubscribeBlockDigestsResponse.prototype.getBlockTimestamp = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 3));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.flow.access.SubscribeBlockDigestsResponse} returns this
*/
proto.flow.access.SubscribeBlockDigestsResponse.prototype.setBlockTimestamp = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.SubscribeBlockDigestsResponse} returns this
 */
proto.flow.access.SubscribeBlockDigestsResponse.prototype.clearBlockTimestamp = function() {
  return this.setBlockTimestamp(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.SubscribeBlockDigestsResponse.prototype.hasBlockTimestamp = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.SendAndSubscribeTransactionStatusesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.SendAndSubscribeTransactionStatusesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.SendAndSubscribeTransactionStatusesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SendAndSubscribeTransactionStatusesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    transaction: (f = msg.getTransaction()) && flow_entities_transaction_pb.Transaction.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.SendAndSubscribeTransactionStatusesRequest}
 */
proto.flow.access.SendAndSubscribeTransactionStatusesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.SendAndSubscribeTransactionStatusesRequest;
  return proto.flow.access.SendAndSubscribeTransactionStatusesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.SendAndSubscribeTransactionStatusesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.SendAndSubscribeTransactionStatusesRequest}
 */
proto.flow.access.SendAndSubscribeTransactionStatusesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new flow_entities_transaction_pb.Transaction;
      reader.readMessage(value,flow_entities_transaction_pb.Transaction.deserializeBinaryFromReader);
      msg.setTransaction(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.SendAndSubscribeTransactionStatusesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.SendAndSubscribeTransactionStatusesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.SendAndSubscribeTransactionStatusesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SendAndSubscribeTransactionStatusesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTransaction();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      flow_entities_transaction_pb.Transaction.serializeBinaryToWriter
    );
  }
};


/**
 * optional flow.entities.Transaction transaction = 1;
 * @return {?proto.flow.entities.Transaction}
 */
proto.flow.access.SendAndSubscribeTransactionStatusesRequest.prototype.getTransaction = function() {
  return /** @type{?proto.flow.entities.Transaction} */ (
    jspb.Message.getWrapperField(this, flow_entities_transaction_pb.Transaction, 1));
};


/**
 * @param {?proto.flow.entities.Transaction|undefined} value
 * @return {!proto.flow.access.SendAndSubscribeTransactionStatusesRequest} returns this
*/
proto.flow.access.SendAndSubscribeTransactionStatusesRequest.prototype.setTransaction = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.flow.access.SendAndSubscribeTransactionStatusesRequest} returns this
 */
proto.flow.access.SendAndSubscribeTransactionStatusesRequest.prototype.clearTransaction = function() {
  return this.setTransaction(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.flow.access.SendAndSubscribeTransactionStatusesRequest.prototype.hasTransaction = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.flow.access.SendAndSubscribeTransactionStatusesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.flow.access.SendAndSubscribeTransactionStatusesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.flow.access.SendAndSubscribeTransactionStatusesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SendAndSubscribeTransactionStatusesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: msg.getId_asB64(),
    status: jspb.Message.getFieldWithDefault(msg, 2, 0),
    messageIndex: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.flow.access.SendAndSubscribeTransactionStatusesResponse}
 */
proto.flow.access.SendAndSubscribeTransactionStatusesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.flow.access.SendAndSubscribeTransactionStatusesResponse;
  return proto.flow.access.SendAndSubscribeTransactionStatusesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.flow.access.SendAndSubscribeTransactionStatusesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.flow.access.SendAndSubscribeTransactionStatusesResponse}
 */
proto.flow.access.SendAndSubscribeTransactionStatusesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {!proto.flow.entities.TransactionStatus} */ (reader.readEnum());
      msg.setStatus(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setMessageIndex(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.flow.access.SendAndSubscribeTransactionStatusesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.flow.access.SendAndSubscribeTransactionStatusesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.flow.access.SendAndSubscribeTransactionStatusesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.flow.access.SendAndSubscribeTransactionStatusesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getMessageIndex();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
};


/**
 * optional bytes id = 1;
 * @return {!(string|Uint8Array)}
 */
proto.flow.access.SendAndSubscribeTransactionStatusesResponse.prototype.getId = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes id = 1;
 * This is a type-conversion wrapper around `getId()`
 * @return {string}
 */
proto.flow.access.SendAndSubscribeTransactionStatusesResponse.prototype.getId_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getId()));
};


/**
 * optional bytes id = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getId()`
 * @return {!Uint8Array}
 */
proto.flow.access.SendAndSubscribeTransactionStatusesResponse.prototype.getId_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getId()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.flow.access.SendAndSubscribeTransactionStatusesResponse} returns this
 */
proto.flow.access.SendAndSubscribeTransactionStatusesResponse.prototype.setId = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional flow.entities.TransactionStatus status = 2;
 * @return {!proto.flow.entities.TransactionStatus}
 */
proto.flow.access.SendAndSubscribeTransactionStatusesResponse.prototype.getStatus = function() {
  return /** @type {!proto.flow.entities.TransactionStatus} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.flow.entities.TransactionStatus} value
 * @return {!proto.flow.access.SendAndSubscribeTransactionStatusesResponse} returns this
 */
proto.flow.access.SendAndSubscribeTransactionStatusesResponse.prototype.setStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional uint64 message_index = 3;
 * @return {number}
 */
proto.flow.access.SendAndSubscribeTransactionStatusesResponse.prototype.getMessageIndex = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.flow.access.SendAndSubscribeTransactionStatusesResponse} returns this
 */
proto.flow.access.SendAndSubscribeTransactionStatusesResponse.prototype.setMessageIndex = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};


goog.object.extend(exports, proto.flow.access);
