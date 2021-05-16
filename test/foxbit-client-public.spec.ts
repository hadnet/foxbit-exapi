import {expect} from 'chai';
import {subDays} from 'date-fns';
import {take} from 'rxjs/operators';
import {FoxBitClient} from '../src/foxbit-client';

describe('# FoxBit Client - Public API', function suite() {
  this.timeout('30s');
  const client = new FoxBitClient();
  const omsId = 1;

  before(done => {
    client.connect().subscribe(
      connected => {
        expect(connected, 'Client must be true').to.be.true;
        done();
      },
      err => {
        done(err);
      },
    );
  });

  after(() => {
    client.logOut().subscribe(() => {
      client.disconnect();
      expect(client.isConnected).to.be.false;
    });
  });

  it('client.isConnected() must be true after connect', () => {
    expect(client.isConnected).to.be.true;
  });

  it('instruments must return data', done => {
    client.getInstruments(omsId).subscribe(
      instruments => {
        expect(instruments).to.not.be.empty;
        done();
      },
      err => done(err),
    );
  });

  it('instrument by id=1 must return data', async () => {
    const instrument = await client.getInstrument(omsId, 1).toPromise();
    expect(instrument).to.not.be.null;
    expect(instrument.InstrumentId).to.be.eq(1);
  });

  it('GetProducts must return data', async () => {
    const product = await client.getProducts(omsId).toPromise();
    expect(product).to.not.be.empty;
  });

  //! There is no return from API endpoint below.
  //! The API documentation still references GetProduct
  //! so coud be a problem indeed or they forgot to deprecate.
  // it('GetProduct by id=1 must return data', async () => {
  //   const product = await client.getProduct(omsId, 1).toPromise();
  //   expect(product).to.not.be.empty;
  //   expect(product.ProductId).to.be.eq(1);
  // });

  it('GetL2Snapshot must return data', done => {
    client.getL2Snapshot(omsId, 1).subscribe(
      snapshots => {
        expect(snapshots).to.not.be.empty;
        done();
      },
      err => done(err),
    );
  });

  it('GetTickerHistory must return data', done => {
    const fromDate = subDays(Date.now(), 2);
    client.getTickerHistory(omsId, 1, fromDate).subscribe(
      ticks => {
        expect(ticks).to.not.be.empty;
        done();
      },
      err => done(err),
    );
  });

  describe('# Events Test', function suiteEvents() {
    this.timeout('200s');

    it('SubscribeLevel1 must return data and fire Level1UpdateEvent', function thunk(done) {
      let eventCount = 0;
      client
        .subscribeLevel1(omsId, 1)
        .pipe(take(2))
        .subscribe(
          level1Data => {
            expect(level1Data).to.not.be.empty;
            if (++eventCount === 2) {
              done();
            }
          },
          err => done(err),
        );
      after(() => {
        expect(eventCount).to.be.eq(2);
      });
    });

    it('UnsubscribeLevel1 must be confirmed by server', async () => {
      const resp = await client.unsubscribeLevel1(omsId, 1).toPromise();
      expect(resp.result).to.be.true;
    });

    it('SubscribeLevel2 must return data and fire Level2UpdateEvent', function thunk(done) {
      let eventCount = 0;
      client
        .subscribeLevel2(omsId, 1)
        .pipe(take(2))
        .subscribe(
          level2Data => {
            expect(level2Data).to.not.be.empty;
            if (++eventCount === 2) {
              done();
            }
          },
          err => done(err),
        );
      after(() => {
        expect(eventCount, 'Level2UpdateEvent events must be equal "2"').to.be.eq(2);
      });
    });

    it('UnsubscribeLevel2 must be cofirmed by server', () => {
      const unsubsPromise = client.unsubscribeLevel2(omsId, 1).toPromise();
      unsubsPromise.then(resp => {
        expect(resp.result).to.be.true;
      });
      return unsubsPromise;
    });

    it('SubscribeTicker must return data and fire TickerDataUpdateEvent', function thunk(done) {
      let tickerDataUpdateEventCount = 0;
      client
        .subscribeTicker(omsId, /*intrumentId*/ 1, /*intervalInSecondd*/ 60, /*includeLastCount*/ 1)
        .pipe(take(2))
        .subscribe(
          ticks => {
            expect(ticks).to.not.be.empty;
            if (++tickerDataUpdateEventCount === 2) {
              done();
            }
          },
          err => done(err),
        );
      after(() => {
        expect(tickerDataUpdateEventCount).to.be.eq(2);
      });
    });

    it('UnsubscribeTicker must be cofirmed by server', () => {
      const unsubsPromise = client.unsubscribeTicker(omsId, 1).toPromise();
      unsubsPromise.then(resp => {
        expect(resp.result, 'When UnsubscribeTicker, serve must respond "result=true"').to.be.true;
      });
      return unsubsPromise;
    });

    it('SubscribeTrades must return data and fire TradeDataUpdateEvent', function thunk(done) {
      let tradeDataUpdateEventCount = 0;
      client
        .subscribeTrades(omsId, 1, 100)
        .pipe(take(2))
        .subscribe(
          trades => {
            expect(trades).to.not.be.empty;

            if (++tradeDataUpdateEventCount === 1) {
              expect(trades.length, 'First subscription must return last 100 trades').to.be.eq(100);
            }

            if (tradeDataUpdateEventCount === 2) {
              done();
            }
          },
          err => done(err),
        );
      after(() => {
        expect(tradeDataUpdateEventCount).to.be.eq(2);
      });
    });

    it('UnsubscribeTrades must be cofirmed by server', async () => {
      const unsub = await client.unsubscribeTrades(omsId, 1).toPromise();
      expect(unsub.result).to.be.true;
    });
  });

  // public
  // [OK] LogOut,
  // [OK] GetAccountFees,
  // [OK] GetInstrument,
  // [OK] GetInstruments,
  // [AphaPoint issue] GetProduct,
  // [OK] GetProducts,
  // [OK] GetL2Snapshot,
  // [OK] GetTickerHistory,
  // [OK] SubscribeLevel1,
  // [OK] SubscribeLevel2,
  // [OK] SubscribeTicker,
  // [OK] SubscribeTrades
  // [OK] UnsubscribeLevel1,
  // [OK] UnsubscribeLevel2,
  // [OK] UnsubscribeTicker,
  // [OK] UnsubscribeTrades
});
