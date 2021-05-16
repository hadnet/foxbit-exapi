// tslint:disable:no-unused-expression
import 'mocha';
import {expect} from 'chai';
import {concatMap, mergeMap} from 'rxjs/operators';
import {FoxBit} from '../src/foxbit-client';
import {OrderType, PegPriceType, Side, TimeInForce, MakerTaker} from '../src/message-enums';
import {AuthenticateResponse, SubscribeAccountEventsResponse} from '../src/message-result';

describe('# FoxBit Client - Private API', function suite() {
  this.timeout('30s');
  const client = new FoxBit();
  const username = process.env.FOXBIT_LOGIN as string;
  const password = process.env.FOXBIT_PASSWORD as string;
  const code = process.env.FOXBIT_2FA_TOKEN as string;

  let lastOrderId = 0;
  let omsId: number;
  let accountId: number;
  let authSession: AuthenticateResponse;

  expect(username, 'Set FOXBIT_LOGIN env variable').to.not.be.undefined;
  expect(password, 'Set FOXBIT_PASSWORD env variable').to.not.be.undefined;
  before(done => {
    client
      .connect()
      .pipe(
        mergeMap(connected => {
          expect(connected, 'Client must be connected').to.be.true;
          return client.webAuthenticateUser(username, password);
        }),
        mergeMap(({Authenticated}) => {
          expect(Authenticated).to.be.true;
          return client.authenticate2FA(code);
        }),
      )
      .subscribe(
        auth => {
          authSession = auth;
          expect(auth.Authenticated).to.be.true;
          done();
        },
        err => {
          done(err);
        },
      );
  });

  it('after authenticate must have session data', () => {
    expect(authSession, 'authResponse must be not null').to.not.be.null;
    expect(authSession.Authenticated, 'Authenticated must be true').to.be.true;
    expect(authSession.SessionToken, 'SessionToken must be filled').to.be.string;

    expect(authSession.UserId, 'UserId must be filled').to.not.be.null;
    expect(authSession.UserId).above(0, 'Id cannot be ZERO.');
  });

  it('GetAccountPositions must return data', done => {
    client.getAccountPositions(accountId, omsId).subscribe(
      positions => {
        expect(positions, 'Positions cannot be empty').to.not.be.empty;
        done();
      },
      err => done(err),
    );
  });

  it('SubscribeAccountEvents must return data', done => {
    client.subscribeAccountEvents(accountId, omsId).subscribe(response => {
      expect(response).to.not.be.null;
      expect(response.kind).to.be.eq('SubscribeAccountEventsResponse');
      const {Subscribed} = response as SubscribeAccountEventsResponse;
      expect(Subscribed).to.be.true;
      done();
    });
  });

  it('GetUserInfo must return data', done => {
    client.getUserInfo().subscribe(
      userInfoResponse => {
        expect(userInfoResponse.AccountId, 'AccountId must be filled').above(0);
        expect(userInfoResponse.OMSId, 'OMSId must be filled').above(0);
        accountId = userInfoResponse.AccountId;
        omsId = userInfoResponse.OMSId;
        done();
      },
      err => done(err),
    );
  });

  it('GetOrderFee must return data', done => {
    client
      .getOrderFee({
        AccountId: accountId,
        OMSId: omsId,
        InstrumentId: 1, //BTCBRL
        MakerTaker: MakerTaker.Maker,
        Amount: 1,
        OrderType: OrderType.Limit,
        Price: 100000,
        ProductId: 1,
        Side: Side.Buy,
      })
      .subscribe(
        orderFee => {
          expect(orderFee.ProductId, 'ProductId must be >= zero').to.be.gt(0);
          expect(orderFee.OrderFee, 'Order fee cannot be null').to.not.be.null;
          expect(orderFee.OrderFee, 'Order fee must be >= 0').to.be.gte(0);
          done();
        },
        err => done(err),
      );
  });

  it('GetUserConfig must return data', done => {
    client.getUserConfig().subscribe(
      userConfig => {
        expect(userConfig, 'UserConfig cannot be empty').to.not.be.empty;
        for (const config of userConfig) {
          expect(config.Value, `${config.Key} cannot be empty`).to.not.be.null;
        }
        expect(userConfig, 'UserConfig cannot be empty').to.not.be.empty;

        done();
      },
      err => done(err),
    );
  });

  it('GetAccountInfo must return data', done => {
    client.getAccountInfo(omsId, accountId).subscribe(
      accountInfo => {
        expect(accountInfo).to.not.be.null;
        done();
      },
      err => done(err),
    );
  });

  it('GetAccountTrades must return data', done => {
    client.getAccountTrades(accountId, omsId, 0, 10).subscribe(
      trades => {
        expect(trades, 'Trades cannot be empty').to.not.be.empty;
        done();
      },
      err => done(err),
    );
  });

  it('GetAccountTransactions must return data', done => {
    client.getAccountTransactions(accountId, omsId, 100).subscribe(
      accTransactions => {
        expect(accTransactions, 'Account transactions cannot be empty').to.not.be.empty;
        done();
      },
      err => done(err),
    );
  });

  it('SendOrder must be confirmed by server', done => {
    client
      .sendOrder({
        AccountId: accountId,
        Side: Side.Sell,
        ClientOrderId: Date.now(),
        UseDisplayQuantity: false,
        InstrumentId: 1, // BTCBRL
        OMSId: omsId,
        Quantity: 0.0001,
        OrderType: OrderType.Limit,
        TimeInForce: TimeInForce.GTC,
        PegPriceType: PegPriceType.Last,
        LimitOffset: 2.0,
        OrderIdOCO: 0,
        LimitPrice: 300000,
      })
      .subscribe(
        ({OrderId, errormsg}) => {
          lastOrderId = OrderId;
          expect(lastOrderId, 'OrderId cannot be null').not.to.be.null;
          expect(lastOrderId, 'OrderId cannot be "0" (ZERO)').not.to.be.eq(0);
          expect(errormsg, 'ErrorMsg must be empty').to.be.empty;

          done();
        },
        err => done(err),
      );
  });

  it('GetOpenOrders must return data and contains latest sent order', function run(done) {
    if (!lastOrderId) {
      this.skip();
    }

    client.getOpenOrders(accountId, omsId).subscribe(
      orders => {
        expect(orders, 'OpenOrders cannot be empty').to.not.be.null;
        expect(
          orders.some(o => o.OrderId === lastOrderId),
          'One of open order must be sent order',
        ).to.be.true;
        done();
      },
      err => done(err),
    );
  });

  it('CancelOrder must be confirmed by server', done => {
    client
      .sendOrder({
        AccountId: accountId,
        Side: Side.Buy,
        ClientOrderId: Date.now(),
        UseDisplayQuantity: false,
        InstrumentId: 1, // BTCBRL
        OMSId: omsId,
        Quantity: 0.0001,
        OrderType: OrderType.Limit,
        TimeInForce: TimeInForce.GTC,
        PegPriceType: PegPriceType.Last,
        LimitOffset: 2.0,
        OrderIdOCO: 0,
        LimitPrice: 50000,
      })
      .pipe(
        concatMap(orderResult => {
          expect(orderResult.OrderId, '[CancelOrder/SendOrder] OrderId cannot be null').not.to.be
            .null;
          expect(
            orderResult.OrderId,
            '[CancelOrder/SendOrder] OrderId cannot be "0" (ZERO)',
          ).not.to.be.eq(0);
          expect(orderResult.errormsg, '[CancelOrder/SendOrder] ErrorMsg must be empty').to.be
            .empty;
          return client.cancelOrder(omsId, accountId, orderResult.OrderId, null);
        }),
      )
      .subscribe(
        resp => {
          expect(resp.result, 'CancelOrder, serve must respond "result=true"').to.be.true;
          done();
        },
        err => done(err),
      );
  });

  it('CancelAllOrders must be confirmed by server', done => {
    client
      .cancelAllOrders(omsId, accountId, 1)
      .pipe(
        concatMap(resp => {
          expect(resp.result, 'CancelAllOrders, serve must respond "result=true"').to.be.true;
          return client.getOpenOrders(accountId, omsId);
        }),
      )
      .subscribe(
        orders => {
          expect(orders, 'After CancellAllOrders, OpenOrders must be empty').to.be.empty;
          done();
        },
        err => done(err),
      );
  });

  it('GetUserPermissions returns string[]', done => {
    client.getUserPermissions(accountId).subscribe(result => {
      expect(result).to.not.be.null;
      done();
    });
  });

  after(() => {
    client.logOut().subscribe(() => {
      client.disconnect();
      expect(client.isConnected, 'isConnected must be false, after disconnect').to.be.false;
    });
  });

  /**
   * [SetUserConfig](https://alphapoint.github.io/slate/#getuserconfig) is mentioned
   * but the Alphapoint API endpoint name doesnt appear on doc and when using it doesnt return
   * anything.
   */
  // it('SetUserConfig must be confirmed by server', (done) => {
  //   client.setUserConfig(authSession.UserId, login, [{
  //     Key: 'NewConfig',
  //     Value: 'Blah'
  //   }]).subscribe((resp) => {
  //     expect(resp.result, 'When SetUserConfig, serve must respond "result=true"').to.be.true;
  //     done();
  //   }, (err) => done(err));
  // });

  // Private
  // [OK] GetUserConfig,
  // [OK] GetUserInfo,
  // [OK] GetUserPermissions,
  // [OK] SubscribeAccountEvents,
  // [OK] GetUserInfo,
  // [OK] CancelAllOrders,
  // [OK] CancelOrder,
  // [OK] GetAccountPositions,
  // [OK] GetAccountTrades,
  // [OK] GetAccountFees,
  // [OK] GetAccountTransactions,
  // [OK] GetOpenOrders,
  // [OK] SendOrder,
  // [OK] GetOrderFee,
  // [API ISSUE] SetUserConfig,
  // CancelQuote,
  // CancelReplaceOrder,
  // GetAccountInfo,
  // GetOrderHistory,
  // GetDepositTicket,
  //  |_ GetAllDepositTickets,
  // GetWithdrawTicket,
  //  |_ GetAllWithdrawTickets,
});
