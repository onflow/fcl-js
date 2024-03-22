// package: flow.execution
// file: flow/execution/execution.proto

var flow_execution_execution_pb = require("../../flow/execution/execution_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var ExecutionAPI = (function () {
  function ExecutionAPI() {}
  ExecutionAPI.serviceName = "flow.execution.ExecutionAPI";
  return ExecutionAPI;
}());

ExecutionAPI.Ping = {
  methodName: "Ping",
  service: ExecutionAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_execution_execution_pb.PingRequest,
  responseType: flow_execution_execution_pb.PingResponse
};

ExecutionAPI.GetAccountAtBlockID = {
  methodName: "GetAccountAtBlockID",
  service: ExecutionAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_execution_execution_pb.GetAccountAtBlockIDRequest,
  responseType: flow_execution_execution_pb.GetAccountAtBlockIDResponse
};

ExecutionAPI.ExecuteScriptAtBlockID = {
  methodName: "ExecuteScriptAtBlockID",
  service: ExecutionAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_execution_execution_pb.ExecuteScriptAtBlockIDRequest,
  responseType: flow_execution_execution_pb.ExecuteScriptAtBlockIDResponse
};

ExecutionAPI.GetEventsForBlockIDs = {
  methodName: "GetEventsForBlockIDs",
  service: ExecutionAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_execution_execution_pb.GetEventsForBlockIDsRequest,
  responseType: flow_execution_execution_pb.GetEventsForBlockIDsResponse
};

ExecutionAPI.GetTransactionResult = {
  methodName: "GetTransactionResult",
  service: ExecutionAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_execution_execution_pb.GetTransactionResultRequest,
  responseType: flow_execution_execution_pb.GetTransactionResultResponse
};

ExecutionAPI.GetTransactionResultByIndex = {
  methodName: "GetTransactionResultByIndex",
  service: ExecutionAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_execution_execution_pb.GetTransactionByIndexRequest,
  responseType: flow_execution_execution_pb.GetTransactionResultResponse
};

ExecutionAPI.GetTransactionResultsByBlockID = {
  methodName: "GetTransactionResultsByBlockID",
  service: ExecutionAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_execution_execution_pb.GetTransactionsByBlockIDRequest,
  responseType: flow_execution_execution_pb.GetTransactionResultsResponse
};

ExecutionAPI.GetTransactionErrorMessage = {
  methodName: "GetTransactionErrorMessage",
  service: ExecutionAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_execution_execution_pb.GetTransactionErrorMessageRequest,
  responseType: flow_execution_execution_pb.GetTransactionErrorMessageResponse
};

ExecutionAPI.GetTransactionErrorMessageByIndex = {
  methodName: "GetTransactionErrorMessageByIndex",
  service: ExecutionAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_execution_execution_pb.GetTransactionErrorMessageByIndexRequest,
  responseType: flow_execution_execution_pb.GetTransactionErrorMessageResponse
};

ExecutionAPI.GetTransactionErrorMessagesByBlockID = {
  methodName: "GetTransactionErrorMessagesByBlockID",
  service: ExecutionAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_execution_execution_pb.GetTransactionErrorMessagesByBlockIDRequest,
  responseType: flow_execution_execution_pb.GetTransactionErrorMessagesResponse
};

ExecutionAPI.GetRegisterAtBlockID = {
  methodName: "GetRegisterAtBlockID",
  service: ExecutionAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_execution_execution_pb.GetRegisterAtBlockIDRequest,
  responseType: flow_execution_execution_pb.GetRegisterAtBlockIDResponse
};

ExecutionAPI.GetLatestBlockHeader = {
  methodName: "GetLatestBlockHeader",
  service: ExecutionAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_execution_execution_pb.GetLatestBlockHeaderRequest,
  responseType: flow_execution_execution_pb.BlockHeaderResponse
};

ExecutionAPI.GetBlockHeaderByID = {
  methodName: "GetBlockHeaderByID",
  service: ExecutionAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_execution_execution_pb.GetBlockHeaderByIDRequest,
  responseType: flow_execution_execution_pb.BlockHeaderResponse
};

exports.ExecutionAPI = ExecutionAPI;

function ExecutionAPIClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

ExecutionAPIClient.prototype.ping = function ping(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ExecutionAPI.Ping, {
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

ExecutionAPIClient.prototype.getAccountAtBlockID = function getAccountAtBlockID(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ExecutionAPI.GetAccountAtBlockID, {
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

ExecutionAPIClient.prototype.executeScriptAtBlockID = function executeScriptAtBlockID(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ExecutionAPI.ExecuteScriptAtBlockID, {
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

ExecutionAPIClient.prototype.getEventsForBlockIDs = function getEventsForBlockIDs(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ExecutionAPI.GetEventsForBlockIDs, {
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

ExecutionAPIClient.prototype.getTransactionResult = function getTransactionResult(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ExecutionAPI.GetTransactionResult, {
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

ExecutionAPIClient.prototype.getTransactionResultByIndex = function getTransactionResultByIndex(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ExecutionAPI.GetTransactionResultByIndex, {
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

ExecutionAPIClient.prototype.getTransactionResultsByBlockID = function getTransactionResultsByBlockID(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ExecutionAPI.GetTransactionResultsByBlockID, {
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

ExecutionAPIClient.prototype.getTransactionErrorMessage = function getTransactionErrorMessage(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ExecutionAPI.GetTransactionErrorMessage, {
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

ExecutionAPIClient.prototype.getTransactionErrorMessageByIndex = function getTransactionErrorMessageByIndex(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ExecutionAPI.GetTransactionErrorMessageByIndex, {
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

ExecutionAPIClient.prototype.getTransactionErrorMessagesByBlockID = function getTransactionErrorMessagesByBlockID(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ExecutionAPI.GetTransactionErrorMessagesByBlockID, {
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

ExecutionAPIClient.prototype.getRegisterAtBlockID = function getRegisterAtBlockID(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ExecutionAPI.GetRegisterAtBlockID, {
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

ExecutionAPIClient.prototype.getLatestBlockHeader = function getLatestBlockHeader(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ExecutionAPI.GetLatestBlockHeader, {
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

ExecutionAPIClient.prototype.getBlockHeaderByID = function getBlockHeaderByID(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ExecutionAPI.GetBlockHeaderByID, {
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

exports.ExecutionAPIClient = ExecutionAPIClient;

