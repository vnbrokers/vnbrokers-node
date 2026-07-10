import { VNBrokerClient, OrderSide, OrderType } from '../src';

async function main() {
  const client = new VNBrokerClient({
    broker: 'ssi',
    auth: {
      consumerId: process.env.SSI_CONSUMER_ID,
      consumerSecret: process.env.SSI_CONSUMER_SECRET,
    },
  });

  await client.login();

  const account = await client.getAccountInfo();
  console.log('Account:', account);

  const positions = await client.getPositions(account.accountId);
  console.log('Positions:', positions);

  const quote = await client.getQuote('VNM');
  console.log('VNM quote:', quote);

  // Đặt lệnh mua LIMIT
  const result = await client.placeOrder({
    accountId: account.accountId,
    symbol: 'VNM',
    side: OrderSide.BUY,
    type: OrderType.LIMIT,
    quantity: 100,
    price: 65000,
  });
  console.log('Order result:', result);

  // Theo dõi giá realtime
  const unsubscribe = client.subscribeQuote('VNM', (q) => {
    console.log('Realtime quote:', q);
  });

  setTimeout(unsubscribe, 30_000);
}

main().catch(console.error);
