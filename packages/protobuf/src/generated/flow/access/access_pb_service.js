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

AccessAPI.GetExecutionResultForBlockID = {
  methodName: "GetExecutionResultForBlockID",
  service: AccessAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_access_access_pb.GetExecutionResultForBlockIDRequest,
  responseType: flow_access_access_pb.ExecutionResultForBlockIDResponse
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

exports.AccessAPIClient = AccessAPIClient;

