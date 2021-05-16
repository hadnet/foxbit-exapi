import {Subject} from 'rxjs';
import type {
  AccountInfoResult,
  AccountPositionResult,
  AccountTradesResult,
  AllDepositTicketsResult,
  AllWithdrawTicketsResult,
  AuthenticateResponse,
  CancelReplaceOrderResult,
  GenericResponse,
  InstrumentResponse,
  OpenOrdersResult,
  OrderFeeResult,
  OrderHistoryResult,
  ProductResponse,
  SendOrderResult,
  SubscriptionLevel1Response,
  UserInfoResponse,
  SubscribeAccountEvents,
  SubscribeLevel2Response,
  SubscribeTickerResponse,
  SubscriptionTradesResponse,
} from 'src';

export enum EndpointMethodReplyType {
  Response,
  Event,
  ResponseAndEvent,
}

export enum EndpointMethodType {
  Public,
  Private,
}

export interface EndpointDescriptorByMethod {
  Authenticate2FA: EndpointMethodDescriptor<AuthenticateResponse>;
  CancelAllOrders: EndpointMethodDescriptor<GenericResponse>;
  CancelQuote: EndpointMethodDescriptor<GenericResponse>;
  CancelReplaceOrder: EndpointMethodDescriptor<CancelReplaceOrderResult>;
  CancelOrder: EndpointMethodDescriptor<GenericResponse>;
  GetAvailablePermissionList: EndpointMethodDescriptor<string[]>;
  GetUserConfig: EndpointMethodDescriptor<Array<{Key: string; Value: string}>>;
  GetUserInfo: EndpointMethodDescriptor<UserInfoResponse>;
  GetUserPermissions: EndpointMethodDescriptor<string[]>;
  GetAccountInfo: EndpointMethodDescriptor<AccountInfoResult>;
  GetAccountPositions: EndpointMethodDescriptor<AccountPositionResult[]>;
  GetAccountTrades: EndpointMethodDescriptor<AccountTradesResult[]>;
  GetAccountTransactions: EndpointMethodDescriptor<AccountTradesResult[]>;
  GetOpenOrders: EndpointMethodDescriptor<OpenOrdersResult[]>;
  GetOrderFee: EndpointMethodDescriptor<OrderFeeResult>;
  GetOrderHistory: EndpointMethodDescriptor<OrderHistoryResult>;
  GetAllDepositTickets: EndpointMethodDescriptor<AllDepositTicketsResult[]>;
  GetAllWithdrawTickets: EndpointMethodDescriptor<AllWithdrawTicketsResult[]>;
  GetDepositTicket: EndpointMethodDescriptor<AllDepositTicketsResult>;
  GetWithdrawTicket: EndpointMethodDescriptor<AllWithdrawTicketsResult>;
  GetInstrument: EndpointMethodDescriptor<InstrumentResponse>;
  GetInstruments: EndpointMethodDescriptor<InstrumentResponse[]>;
  GetProduct: EndpointMethodDescriptor<ProductResponse>;
  GetProducts: EndpointMethodDescriptor<ProductResponse[]>;
  GetL2Snapshot: EndpointMethodDescriptor<number[][]>;
  GetTickerHistory: EndpointMethodDescriptor<number[][]>;
  LogOut: EndpointMethodDescriptor<boolean>;
  RemoveUserConfig: EndpointMethodDescriptor<GenericResponse>;
  ResetPassword: EndpointMethodDescriptor<GenericResponse>;
  SendOrder: EndpointMethodDescriptor<SendOrderResult>;
  SetUserInfo: EndpointMethodDescriptor<UserInfoResponse>;
  SubscribeAccountEvents: EndpointMethodDescriptor<SubscribeAccountEvents>;
  SubscribeLevel1: EndpointMethodDescriptor<SubscriptionLevel1Response>;
  SubscribeLevel2: EndpointMethodDescriptor<SubscribeLevel2Response>;
  SubscribeTicker: EndpointMethodDescriptor<SubscribeTickerResponse>;
  SetUserConfig: EndpointMethodDescriptor<GenericResponse>;
  SubscribeTrades: EndpointMethodDescriptor<SubscriptionTradesResponse[]>;
  UnsubscribeLevel1: EndpointMethodDescriptor<GenericResponse>;
  UnsubscribeLevel2: EndpointMethodDescriptor<GenericResponse>;
  UnsubscribeTicker: EndpointMethodDescriptor<GenericResponse>;
  UnsubscribeTrades: EndpointMethodDescriptor<GenericResponse>;
  WebAuthenticateUser: EndpointMethodDescriptor<AuthenticateResponse>;
}

export type AssociatedEvent<T> = T extends SubscriptionLevel1Response
  ? ['Level1UpdateEvent']
  : T extends SubscribeLevel2Response
  ? ['Level2UpdateEvent']
  : T extends SubscriptionTradesResponse[]
  ? ['TradeDataUpdateEvent']
  : T extends SubscribeTickerResponse
  ? ['TickerDataUpdateEvent']
  : T extends SubscribeAccountEvents
  ? [
      'AccountPositionEvent',
      'OrderTradeEvent',
      'OrderStateEvent',
      'MarketStateUpdate',
      'PendingDepositUpdate',
      'NewOrderRejectEvent',
      'CancelReplaceOrderRejectEvent',
      'CancelOrderRejectEvent',
      'CancelAllOrdersRejectEvent',
    ]
  : never;

export class EndpointMethodDescriptor<T> {
  constructor(
    public methodType: EndpointMethodType = EndpointMethodType.Private,
    public methodReplyType: EndpointMethodReplyType = EndpointMethodReplyType.Response,
    public methodSubject = new Subject<T>(),
    public associatedEvent?: AssociatedEvent<T>,
  ) {}
}
