// package: flow.executiondata
// file: flow/executiondata/executiondata.proto

var flow_executiondata_executiondata_pb = require("../../flow/executiondata/executiondata_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var ExecutionDataAPI = (function () {
  function ExecutionDataAPI() {}
  ExecutionDataAPI.serviceName = "flow.executiondata.ExecutionDataAPI";
  return ExecutionDataAPI;
}());

ExecutionDataAPI.GetExecutionDataByBlockID = {
  methodName: "GetExecutionDataByBlockID",
  service: ExecutionDataAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_executiondata_executiondata_pb.GetExecutionDataByBlockIDRequest,
  responseType: flow_executiondata_executiondata_pb.GetExecutionDataByBlockIDResponse
};

ExecutionDataAPI.SubscribeExecutionData = {
  methodName: "SubscribeExecutionData",
  service: ExecutionDataAPI,
  requestStream: false,
  responseStream: true,
  requestType: flow_executiondata_executiondata_pb.SubscribeExecutionDataRequest,
  responseType: flow_executiondata_executiondata_pb.SubscribeExecutionDataResponse
};

ExecutionDataAPI.SubscribeEvents = {
  methodName: "SubscribeEvents",
  service: ExecutionDataAPI,
  requestStream: false,
  responseStream: true,
  requestType: flow_executiondata_executiondata_pb.SubscribeEventsRequest,
  responseType: flow_executiondata_executiondata_pb.SubscribeEventsResponse
};

ExecutionDataAPI.GetRegisterValues = {
  methodName: "GetRegisterValues",
  service: ExecutionDataAPI,
  requestStream: false,
  responseStream: false,
  requestType: flow_executiondata_executiondata_pb.GetRegisterValuesRequest,
  responseType: flow_executiondata_executiondata_pb.GetRegisterValuesResponse
};

exports.ExecutionDataAPI = ExecutionDataAPI;

function ExecutionDataAPIClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

ExecutionDataAPIClient.prototype.getExecutionDataByBlockID = function getExecutionDataByBlockID(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ExecutionDataAPI.GetExecutionDataByBlockID, {
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

ExecutionDataAPIClient.prototype.subscribeExecutionData = function subscribeExecutionData(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(ExecutionDataAPI.SubscribeExecutionData, {
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

ExecutionDataAPIClient.prototype.subscribeEvents = function subscribeEvents(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(ExecutionDataAPI.SubscribeEvents, {
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

ExecutionDataAPIClient.prototype.getRegisterValues = function getRegisterValues(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(ExecutionDataAPI.GetRegisterValues, {
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

exports.ExecutionDataAPIClient = ExecutionDataAPIClient;

