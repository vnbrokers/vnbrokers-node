import { DNSEBroker, VNBrokerClient, type DNSEBrokerConfig } from '../src';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

async function main() {
  const config: DNSEBrokerConfig = {
    broker: 'dnse',
    auth: {},
    apiKey: requireEnv('DNSE_API_KEY'),
    apiSecret: requireEnv('DNSE_API_SECRET'),
    tradingToken: process.env.DNSE_TRADING_TOKEN,
    baseUrl: process.env.DNSE_BASE_URL,
  };

  const client = new VNBrokerClient(config);

  const dnse = client.raw as DNSEBroker;

  // DNSE currently exposes its native API; IBroker.login() does not fit the OTP flow.
  const instruments = await dnse.native.marketData.getInstruments({
    symbol: process.env.DNSE_SYMBOL ?? 'VN30F1M',
    limit: 5,
  });
  console.log('Market data:', instruments);

  const accountNo = process.env.DNSE_ACCOUNT_NO;
  if (accountNo) {
    const orders = await dnse.native.trading.getOrders({
      accountNo,
      marketType: process.env.DNSE_MARKET_TYPE ?? 'DERIVATIVE',
      orderCategory: process.env.DNSE_ORDER_CATEGORY ?? 'NORMAL',
    });
    console.log('Trading orders:', orders);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
