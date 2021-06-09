export const enum MessageType {
  Request = 0,
  Reply = 1,
  Subscribe = 2,
  Event = 3,
  Unsubscribe = 4,
  Error = 5,
}

export const enum InstrumentType {
  Unknown = 0,
  Standard = 1,
}

export const enum SessionStatus {
  Unknown = 0,
  Running = 1,
  Paused = 2,
  Stopped = 3,
  Starting = 4,
}

export const enum MarketStatus {
  Running = 'Running',
  Paused = 'Paused',
  Stopped = 'Stopped',
  Starting = 'Starting',
}

export const enum MarketStateAction {
  Pause = 'Pause',
  Resume = 'Resume',
  Hat = 'Halt',
  ReOpen = 'ReOpen',
}

export const enum ProductType {
  Unknown = 0,
  NationalCurrency = 1,
  CryptoCurrency = 2,
  Contract = 3,
}

export const enum Side {
  Buy = 0,
  Sell = 1,
  Short = 2,
  Unknown = 3,
}

export const enum TradeSide {
  Buy = 'Buy',
  Sell = 'Sell',
  Short = 'Short',
  Unknown = 'Unknown',
}

export const enum FutureSide {
  Buy = 'Buy',
  Sell = 'Sell',
  Short = 'Short',
}

export const enum SideResponse {
  Buy = 0,
  Sell = 1,
  Short = 2,
  Unknown = 3,
}

export const enum ActionType {
  New = 0,
  Update = 1,
  Delete = 2,
}

export const enum MarketPriceDirection {
  NoChange = 0,
  UpTick = 1,
  DownTick = 2,
}

export const enum MarketPriceDirectionString {
  NoChange = 'NoChange',
  UpTick = 'UpTick',
  DownTick = 'DownTick',
}

export const enum PegPriceType {
  Unknown = 0,
  Last = 1,
  Bid = 2,
  Ask = 3,
  Midpoint = 4,
}

export const enum TimeInForce {
  Unknown = 0,
  GTC = 1,
  IOC = 2,
  FOK = 3,
}

export const enum OrderType {
  Unknown = 0,
  Market = 1,
  Limit = 2,
  StopMarket = 3,
  StopLimit = 4,
  TrailingStopMarket = 5,
  TrailingStopLimit = 6,
  BlockTrade = 7,
}

export const enum MakerTaker {
  Unknown = 'Unknown',
  Maker = 'Maker',
  Taker = 'Taker',
}

export const enum OrderTypeResponse {
  Unknown = 'Unknown',
  Market = 'Market',
  Limit = 'Limit',
  StopMarket = 'StopMarket',
  StopLimit = 'StopLimit',
  TrailingStopMarket = 'TrailingStopMarket',
  TrailingStopLimit = 'TrailingStopLimit',
  BlockTrade = 'BlockTrade',
}

export const enum OrderStateResponse {
  Working = 'Working',
  Rejected = 'Rejected',
  Canceled = 'Canceled',
  Expired = 'Expired',
  FullyExecuted = 'FullyExecuted',
}

export const enum ChangeReasonResponse {
  NewInputAccepted = 'NewInputAccepted',
  NewInputRejected = 'NewInputRejected',
  OtherRejected = 'OtherRejected',
  Expired = 'Expired',
  Trade = 'Trade',
  SystemCanceled_NoMoreMarket = 'SystemCanceled_NoMoreMarket',
  SystemCanceled_BelowMinimum = 'SystemCanceled_BelowMinimum',
  NoChange = 'NoChange',
  UserModified = 'UserModified',
}

export const enum SendOrderStatusResponse {
  Accepted = 'Accepted',
  Rejected = 'Rejected',
}

export const enum DepositStatus {
  New = 0,
  AdminProcessing = 1,
  Accepted = 2,
  Rejected = 3,
  SystemProcessing = 4,
  FullyProcessed = 5,
  Failed = 6,
  Pending = 7,
}

export const enum WithdrawStatus {
  New = 0,
  AdminProcessing = 1,
  Accepted = 2,
  Rejected = 3,
  SystemProcessing = 4,
  FullyProcessed = 5,
  Failed = 6,
  Pending = 7,
  Pending2Fa = 8,
  AutoAccepted = 9,
  Delayed = 10,
}

export const enum DepositStatusResponse {
  New = 'New',
  AdminProcessing = 'AdminProcessing',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  SystemProcessing = 'SystemProcessing',
  FullyProcessed = 'FullyProcessed',
  Failed = 'Failed',
  Pending = 'Pending',
}

export const enum AmountOperator {
  TicketsEqualToAmount = 0,
  TicketsEqualOrGreaterThanAmount = 1,
  TicketsLessThanAmount = 2,
}
