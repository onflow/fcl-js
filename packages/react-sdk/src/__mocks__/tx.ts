import {TransactionStatus} from "@onflow/typedefs"

export const defaultTxStatus: TransactionStatus = {
  blockId: "",
  status: 0,
  statusString: "UNKNOWN",
  statusCode: 0,
  errorMessage: "",
  events: [],
}

export const errorTxStatus: TransactionStatus = {
  blockId: "block123",
  status: 2,
  statusString: "ERROR",
  statusCode: 1,
  errorMessage: "Test error occurred",
  events: [],
}
