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

exports.ExecutionAPIClient = ExecutionAPIClient;

