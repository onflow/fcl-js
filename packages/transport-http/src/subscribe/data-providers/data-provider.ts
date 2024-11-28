export interface DataProvider<
  Topic = any,
  Args = any,
  Data = any,
  RawData = any,
> {
  /**
   * The topic of the data type
   */
  topic: Topic
  /**
   * The function to get the checkpoint to resume the subscription from if a reconnection is needed
   * @param data The data to derive the reconnection checkpoint from
   */
  getReconnectArgs: (data: Data) => Args
  /**
   * The callback to call when a data is received
   */
  parseData: (data: RawData) => Data
}
