import {run} from "./src/run";
import orm from "./orm";

import {Equal, Field, Greater} from "dp-orm/dist/database/postgresql/database/condition";
import {ManyToMany} from "./src/prepare/many-to-many";
import {prompt} from "./src/prompt";
import {Order} from "./src/one-to-many/order";

run(async function() {
  await prompt('waiting... ');

  await orm.initialize();

  const result = await orm.persistenceManager.select(Order, new Greater(new Field('cost'), 10));
  console.log(result);

  // const mtm = await orm.persistenceManager.select(ManyToMany, new Equal(new Field('id'), 2));
  //
  // console.log(mtm);
  // console.log(mtm[0].relationship[0]);

  await orm.close();
});

