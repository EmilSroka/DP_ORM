import orm from './orm';
import { Client } from "./src/one-to-one/client";
import {Details} from "./src/one-to-one/details";
import {prompt} from "./src/prompt";
import {run} from "./src/run";

run(async function() {
  await prompt('waiting... ');

  await orm.initialize();

  const user1 = new Client();
  user1.isActive = true;
  user1.name = 'Mokebe';
  user1.details = new Details();
  user1.details.info = 'Additional info';
  user1.details.premium = false;

  await orm.persistenceManager.save(user1);

  await prompt('waiting... ');

  user1.details = new Details();
  user1.details.info = 'Additional info 2';
  user1.details.premium = true;

  await orm.persistenceManager.save(user1);

  await orm.close();
});

