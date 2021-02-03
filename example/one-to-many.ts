import orm from './orm';
import {Customer} from "./src/one-to-many/customer";
import {Order} from "./src/one-to-many/order";
import {prompt} from "./src/prompt";
import {run} from "./src/run";

run(async function() {
  await prompt('waiting... ');

  await orm.initialize();

  const customer = new Customer();
  customer.id = 1;

  const order1 = new Order();
  order1.cost = 10;
  order1.info = 'Info 1';

  const order2 = new Order();
  order2.cost = 7.5;
  order2.info = 'Info 2';

  customer.orders = [order1, order2];

  await orm.persistenceManager.save(customer);

  await prompt('waiting... ');

  order2.cost = 11;

  // customer.orders.pop();

  await orm.persistenceManager.save(customer);

  await orm.close();
});

