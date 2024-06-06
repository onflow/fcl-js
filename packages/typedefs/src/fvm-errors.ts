export enum FvmErrorCode {
  // tx validation errors 1000 - 1049
  // Deprecated: no longer in use
  TxValidationError = 1000,
  // Deprecated: No longer used.
  InvalidTxByteSizeError = 1001,
  // Deprecated: No longer used.
  InvalidReferenceBlockError = 1002,
  // Deprecated: No longer used.
  ExpiredTransactionError = 1003,
  // Deprecated: No longer used.
  InvalidScriptError = 1004,
  // Deprecated: No longer used.
  InvalidGasLimitError = 1005,
  InvalidProposalSignatureError = 1006,
  InvalidProposalSeqNumberError = 1007,
  InvalidPayloadSignatureError = 1008,
  InvalidEnvelopeSignatureError = 1009,

  // base errors 1050 - 1100
  // Deprecated: No longer used.
  FVMInternalError = 1050,
  ValueError = 1051,
  InvalidArgumentError = 1052,
  InvalidAddressError = 1053,
  InvalidLocationError = 1054,
  AccountAuthorizationError = 1055,
  OperationAuthorizationError = 1056,
  OperationNotSupportedError = 1057,
  BlockHeightOutOfRangeError = 1058,

  // execution errors 1100 - 1200
  // Deprecated: No longer used.
  ExecutionError = 1100,
  CadenceRunTimeError = 1101,
  // Deprecated: No longer used.
  EncodingUnsupportedValue = 1102,
  StorageCapacityExceeded = 1103,
  // Deprecated: No longer used.
  GasLimitExceededError = 1104,
  EventLimitExceededError = 1105,
  LedgerInteractionLimitExceededError = 1106,
  StateKeySizeLimitError = 1107,
  StateValueSizeLimitError = 1108,
  TransactionFeeDeductionFailedError = 1109,
  ComputationLimitExceededError = 1110,
  MemoryLimitExceededError = 1111,
  CouldNotDecodeExecutionParameterFromState = 1112,
  ScriptExecutionTimedOutError = 1113,
  ScriptExecutionCancelledError = 1114,
  EventEncodingError = 1115,
  InvalidInternalStateAccessError = 1116,
  // 1117 was never deployed and is free to use
  InsufficientPayerBalance = 1118,

  // accounts errors 1200 - 1250
  // Deprecated: No longer used.
  AccountError = 1200,
  AccountNotFoundError = 1201,
  AccountPublicKeyNotFoundError = 1202,
  AccountAlreadyExistsError = 1203,
  // Deprecated: No longer used.
  FrozenAccountError = 1204,
  // Deprecated: No longer used.
  AccountStorageNotInitializedError = 1205,
  AccountPublicKeyLimitError = 1206,

  // contract errors 1250 - 1300
  // Deprecated: No longer used.
  ContractError = 1250,
  ContractNotFoundError = 1251,
  // Deprecated: No longer used.
  ContractNamesNotFoundError = 1252,

  // fvm std lib errors 1300-1400
  EVMExecutionError = 1300,
}
