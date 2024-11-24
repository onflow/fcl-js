// package: flow.access
// file: flow/access/access.proto

var flow_access_access_pb = require("../../flow/access/access_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var AccessAPI = (function () {
  function AccessAPI() {}
  AccessAPI.serviceName = "flow.access.AccessAPI";
  return AccessAPI;
}());

AccessAPI.Ping = {
  methodName: "Ping",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.PingRequest,
  responseType: flow_access_access_pb.PingResponse
};

AccessAPI.GetNodeVersionInfo = {
  methodName: "GetNodeVersionInfo",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetNodeVersionInfoRequest,
  responseType: flow_access_access_pb.GetNodeVersionInfoResponse
};

AccessAPI.GetLatestBlockHeader = {
  methodName: "GetLatestBlockHeader",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetLatestBlockHeaderRequest,
  responseType: flow_access_access_pb.BlockHeaderResponse
};

AccessAPI.GetBlockHeaderByID = {
  methodName: "GetBlockHeaderByID",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetBlockHeaderByIDRequest,
  responseType: flow_access_access_pb.BlockHeaderResponse
};

AccessAPI.GetBlockHeaderByHeight = {
  methodName: "GetBlockHeaderByHeight",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetBlockHeaderByHeightRequest,
  responseType: flow_access_access_pb.BlockHeaderResponse
};

AccessAPI.GetLatestBlock = {
  methodName: "GetLatestBlock",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetLatestBlockRequest,
  responseType: flow_access_access_pb.BlockResponse
};

AccessAPI.GetBlockByID = {
  methodName: "GetBlockByID",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetBlockByIDRequest,
  responseType: flow_access_access_pb.BlockResponse
};

AccessAPI.GetBlockByHeight = {
  methodName: "GetBlockByHeight",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetBlockByHeightRequest,
  responseType: flow_access_access_pb.BlockResponse
};

AccessAPI.GetCollectionByID = {
  methodName: "GetCollectionByID",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetCollectionByIDRequest,
  responseType: flow_access_access_pb.CollectionResponse
};

AccessAPI.SendTransaction = {
  methodName: "SendTransaction",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.SendTransactionRequest,
  responseType: flow_access_access_pb.SendTransactionResponse
};

AccessAPI.GetTransaction = {
  methodName: "GetTransaction",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetTransactionRequest,
  responseType: flow_access_access_pb.TransactionResponse
};

AccessAPI.GetTransactionResult = {
  methodName: "GetTransactionResult",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetTransactionRequest,
  responseType: flow_access_access_pb.TransactionResultResponse
};

AccessAPI.GetTransactionResultByIndex = {
  methodName: "GetTransactionResultByIndex",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetTransactionByIndexRequest,
  responseType: flow_access_access_pb.TransactionResultResponse
};

AccessAPI.GetTransactionResultsByBlockID = {
  methodName: "GetTransactionResultsByBlockID",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetTransactionsByBlockIDRequest,
  responseType: flow_access_access_pb.TransactionResultsResponse
};

AccessAPI.GetTransactionsByBlockID = {
  methodName: "GetTransactionsByBlockID",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetTransactionsByBlockIDRequest,
  responseType: flow_access_access_pb.TransactionsResponse
};

AccessAPI.GetSystemTransaction = {
  methodName: "GetSystemTransaction",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetSystemTransactionRequest,
  responseType: flow_access_access_pb.TransactionResponse
};

AccessAPI.GetSystemTransactionResult = {
  methodName: "GetSystemTransactionResult",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetSystemTransactionResultRequest,
  responseType: flow_access_access_pb.TransactionResultResponse
};

AccessAPI.GetAccount = {
  methodName: "GetAccount",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetAccountRequest,
  responseType: flow_access_access_pb.GetAccountResponse
};

AccessAPI.GetAccountAtLatestBlock = {
  methodName: "GetAccountAtLatestBlock",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetAccountAtLatestBlockRequest,
  responseType: flow_access_access_pb.AccountResponse
};

AccessAPI.GetAccountAtBlockHeight = {
  methodName: "GetAccountAtBlockHeight",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetAccountAtBlockHeightRequest,
  responseType: flow_access_access_pb.AccountResponse
};

AccessAPI.ExecuteScriptAtLatestBlock = {
  methodName: "ExecuteScriptAtLatestBlock",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.ExecuteScriptAtLatestBlockRequest,
  responseType: flow_access_access_pb.ExecuteScriptResponse
};

AccessAPI.ExecuteScriptAtBlockID = {
  methodName: "ExecuteScriptAtBlockID",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.ExecuteScriptAtBlockIDRequest,
  responseType: flow_access_access_pb.ExecuteScriptResponse
};

AccessAPI.ExecuteScriptAtBlockHeight = {
  methodName: "ExecuteScriptAtBlockHeight",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.ExecuteScriptAtBlockHeightRequest,
  responseType: flow_access_access_pb.ExecuteScriptResponse
};

AccessAPI.GetEventsForHeightRange = {
  methodName: "GetEventsForHeightRange",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetEventsForHeightRangeRequest,
  responseType: flow_access_access_pb.EventsResponse
};

AccessAPI.GetEventsForBlockIDs = {
  methodName: "GetEventsForBlockIDs",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetEventsForBlockIDsRequest,
  responseType: flow_access_access_pb.EventsResponse
};

AccessAPI.GetNetworkParameters = {
  methodName: "GetNetworkParameters",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetNetworkParametersRequest,
  responseType: flow_access_access_pb.GetNetworkParametersResponse
};

AccessAPI.GetLatestProtocolStateSnapshot = {
  methodName: "GetLatestProtocolStateSnapshot",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetLatestProtocolStateSnapshotRequest,
  responseType: flow_access_access_pb.ProtocolStateSnapshotResponse
};

AccessAPI.GetProtocolStateSnapshotByBlockID = {
  methodName: "GetProtocolStateSnapshotByBlockID",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetProtocolStateSnapshotByBlockIDRequest,
  responseType: flow_access_access_pb.ProtocolStateSnapshotResponse
};

AccessAPI.GetProtocolStateSnapshotByHeight = {
  methodName: "GetProtocolStateSnapshotByHeight",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetProtocolStateSnapshotByHeightRequest,
  responseType: flow_access_access_pb.ProtocolStateSnapshotResponse
};

AccessAPI.GetExecutionResultForBlockID = {
  methodName: "GetExecutionResultForBlockID",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetExecutionResultForBlockIDRequest,
  responseType: flow_access_access_pb.ExecutionResultForBlockIDResponse
};

AccessAPI.GetExecutionResultByID = {
  methodName: "GetExecutionResultByID",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetExecutionResultByIDRequest,
  responseType: flow_access_access_pb.ExecutionResultByIDResponse
};

AccessAPI.SubscribeBlocksFromStartBlockID = {
  methodName: "SubscribeBlocksFromStartBlockID",
  service: AccessAPI,
  requestStream: false,
  responseStream: true,
  requestType: flow_access_access_pb.SubscribeBlocksFromStartBlockIDRequest,
  responseType: flow_access_access_pb.SubscribeBlocksResponse
};

AccessAPI.SubscribeBlocksFromStartHeight = {
  methodName: "SubscribeBlocksFromStartHeight",
  service: AccessAPI,
  requestStream: false,
  responseStream: true,
  requestType: flow_access_access_pb.SubscribeBlocksFromStartHeightRequest,
  responseType: flow_access_access_pb.SubscribeBlocksResponse
};

AccessAPI.SubscribeBlocksFromLatest = {
  methodName: "SubscribeBlocksFromLatest",
  service: AccessAPI,
  requestStream: false,
  responseStream: true,
  requestType: flow_access_access_pb.SubscribeBlocksFromLatestRequest,
  responseType: flow_access_access_pb.SubscribeBlocksResponse
};

AccessAPI.SubscribeBlockHeadersFromStartBlockID = {
  methodName: "SubscribeBlockHeadersFromStartBlockID",
  service: AccessAPI,
  requestStream: false,
  responseStream: true,
  requestType: flow_access_access_pb.SubscribeBlockHeadersFromStartBlockIDRequest,
  responseType: flow_access_access_pb.SubscribeBlockHeadersResponse
};

AccessAPI.SubscribeBlockHeadersFromStartHeight = {
  methodName: "SubscribeBlockHeadersFromStartHeight",
  service: AccessAPI,
  requestStream: false,
  responseStream: true,
  requestType: flow_access_access_pb.SubscribeBlockHeadersFromStartHeightRequest,
  responseType: flow_access_access_pb.SubscribeBlockHeadersResponse
};

AccessAPI.SubscribeBlockHeadersFromLatest = {
  methodName: "SubscribeBlockHeadersFromLatest",
  service: AccessAPI,
  requestStream: false,
  responseStream: true,
  requestType: flow_access_access_pb.SubscribeBlockHeadersFromLatestRequest,
  responseType: flow_access_access_pb.SubscribeBlockHeadersResponse
};

AccessAPI.SubscribeBlockDigestsFromStartBlockID = {
  methodName: "SubscribeBlockDigestsFromStartBlockID",
  service: AccessAPI,
  requestStream: false,
  responseStream: true,
  requestType: flow_access_access_pb.SubscribeBlockDigestsFromStartBlockIDRequest,
  responseType: flow_access_access_pb.SubscribeBlockDigestsResponse
};

AccessAPI.SubscribeBlockDigestsFromStartHeight = {
  methodName: "SubscribeBlockDigestsFromStartHeight",
  service: AccessAPI,
  requestStream: false,
  responseStream: true,
  requestType: flow_access_access_pb.SubscribeBlockDigestsFromStartHeightRequest,
  responseType: flow_access_access_pb.SubscribeBlockDigestsResponse
};

AccessAPI.SubscribeBlockDigestsFromLatest = {
  methodName: "SubscribeBlockDigestsFromLatest",
  service: AccessAPI,
  requestStream: false,
  responseStream: true,
  requestType: flow_access_access_pb.SubscribeBlockDigestsFromLatestRequest,
  responseType: flow_access_access_pb.SubscribeBlockDigestsResponse
};

AccessAPI.SendAndSubscribeTransactionStatuses = {
  methodName: "SendAndSubscribeTransactionStatuses",
  service: AccessAPI,
  requestStream: false,
  responseStream: true,
  requestType: flow_access_access_pb.SendAndSubscribeTransactionStatusesRequest,
  responseType: flow_access_access_pb.SendAndSubscribeTransactionStatusesResponse
};

exports.AccessAPI = AccessAPI;

function AccessAPIClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

AccessAPIClient.prototype.ping = function ping(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.Ping, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getNodeVersionInfo = function getNodeVersionInfo(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetNodeVersionInfo, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getLatestBlockHeader = function getLatestBlockHeader(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetLatestBlockHeader, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getBlockHeaderByID = function getBlockHeaderByID(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetBlockHeaderByID, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getBlockHeaderByHeight = function getBlockHeaderByHeight(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetBlockHeaderByHeight, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getLatestBlock = function getLatestBlock(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetLatestBlock, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getBlockByID = function getBlockByID(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetBlockByID, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getBlockByHeight = function getBlockByHeight(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetBlockByHeight, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getCollectionByID = function getCollectionByID(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetCollectionByID, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.sendTransaction = function sendTransaction(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.SendTransaction, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getTransaction = function getTransaction(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetTransaction, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getTransactionResult = function getTransactionResult(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetTransactionResult, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getTransactionResultByIndex = function getTransactionResultByIndex(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetTransactionResultByIndex, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getTransactionResultsByBlockID = function getTransactionResultsByBlockID(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetTransactionResultsByBlockID, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getTransactionsByBlockID = function getTransactionsByBlockID(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetTransactionsByBlockID, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getSystemTransaction = function getSystemTransaction(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetSystemTransaction, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getSystemTransactionResult = function getSystemTransactionResult(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetSystemTransactionResult, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getAccount = function getAccount(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetAccount, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getAccountAtLatestBlock = function getAccountAtLatestBlock(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetAccountAtLatestBlock, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getAccountAtBlockHeight = function getAccountAtBlockHeight(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetAccountAtBlockHeight, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.executeScriptAtLatestBlock = function executeScriptAtLatestBlock(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.ExecuteScriptAtLatestBlock, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.executeScriptAtBlockID = function executeScriptAtBlockID(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.ExecuteScriptAtBlockID, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.executeScriptAtBlockHeight = function executeScriptAtBlockHeight(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.ExecuteScriptAtBlockHeight, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getEventsForHeightRange = function getEventsForHeightRange(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetEventsForHeightRange, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getEventsForBlockIDs = function getEventsForBlockIDs(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetEventsForBlockIDs, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getNetworkParameters = function getNetworkParameters(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetNetworkParameters, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getLatestProtocolStateSnapshot = function getLatestProtocolStateSnapshot(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetLatestProtocolStateSnapshot, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getProtocolStateSnapshotByBlockID = function getProtocolStateSnapshotByBlockID(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetProtocolStateSnapshotByBlockID, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getProtocolStateSnapshotByHeight = function getProtocolStateSnapshotByHeight(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetProtocolStateSnapshotByHeight, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getExecutionResultForBlockID = function getExecutionResultForBlockID(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetExecutionResultForBlockID, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.getExecutionResultByID = function getExecutionResultByID(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AccessAPI.GetExecutionResultByID, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.subscribeBlocksFromStartBlockID = function subscribeBlocksFromStartBlockID(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(AccessAPI.SubscribeBlocksFromStartBlockID, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.subscribeBlocksFromStartHeight = function subscribeBlocksFromStartHeight(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(AccessAPI.SubscribeBlocksFromStartHeight, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.subscribeBlocksFromLatest = function subscribeBlocksFromLatest(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(AccessAPI.SubscribeBlocksFromLatest, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.subscribeBlockHeadersFromStartBlockID = function subscribeBlockHeadersFromStartBlockID(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(AccessAPI.SubscribeBlockHeadersFromStartBlockID, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.subscribeBlockHeadersFromStartHeight = function subscribeBlockHeadersFromStartHeight(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(AccessAPI.SubscribeBlockHeadersFromStartHeight, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.subscribeBlockHeadersFromLatest = function subscribeBlockHeadersFromLatest(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(AccessAPI.SubscribeBlockHeadersFromLatest, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.subscribeBlockDigestsFromStartBlockID = function subscribeBlockDigestsFromStartBlockID(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(AccessAPI.SubscribeBlockDigestsFromStartBlockID, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.subscribeBlockDigestsFromStartHeight = function subscribeBlockDigestsFromStartHeight(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(AccessAPI.SubscribeBlockDigestsFromStartHeight, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.subscribeBlockDigestsFromLatest = function subscribeBlockDigestsFromLatest(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(AccessAPI.SubscribeBlockDigestsFromLatest, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

AccessAPIClient.prototype.sendAndSubscribeTransactionStatuses = function sendAndSubscribeTransactionStatuses(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(AccessAPI.SendAndSubscribeTransactionStatuses, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

exports.AccessAPIClient = AccessAPIClient;

