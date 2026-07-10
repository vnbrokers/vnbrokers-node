import { DNSEBroker, type DNSEBrokerConfig } from '../src';

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

  const broker = new DNSEBroker(config);

  if (!process.env.DNSE_TRADING_TOKEN) {
    await broker.native.auth.sendEmailOTP();
    console.log('Đã gửi OTP email. Điền OTP/passcode vào env DNSE_OTP.');

    const otp = requireEnv('DNSE_OTP');
    const tokenResponse = await broker.native.auth.getTradingToken({
      otpType: 'EMAIL',
      passcode: otp,
    });
    console.log('Trading token:', tokenResponse.tradingToken);
  }

  const instruments = await broker.native.marketData.getInstruments({
    symbol: process.env.DNSE_SYMBOL ?? 'ACB',
    limit: 10,
    page: 1,
  });
  console.log('Instruments:', instruments);

  const accountNo = process.env.DNSE_ACCOUNT_NO;
  if (accountNo) {
    const orders = await broker.native.trading.getOrders({
      accountNo,
      marketType: process.env.DNSE_MARKET_TYPE ?? 'DERIVATIVE',
      orderCategory: process.env.DNSE_ORDER_CATEGORY ?? 'NORMAL',
    });
    console.log('Orders:', orders);
  } else {
    console.log('Bỏ qua getOrders vì chưa có DNSE_ACCOUNT_NO');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
